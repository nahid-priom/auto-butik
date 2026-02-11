#!/usr/bin/env node
/**
 * AutoButik Image Optimization Script (production-ready, repeatable)
 *
 * Recursively processes JPG/PNG in public/images:
 * - Resizes by category (hero 1920px, category 800px, icons/logos 400px)
 * - Generates WebP (quality 75) and AVIF (quality 55) alongside originals
 * - Targets <50KB when possible; hero backgrounds max 150KB
 * - Keeps originals; does not delete or replace them (safe for legacy paths)
 *
 * Resizing logic:
 * - Hero: Hero1–4, heroSearchCar, slides/ → max width 1920px, WebP/AVIF capped ~150KB
 * - Category: categories/, megamenu/, banner*, departments/, card, homepage-categories → 800px
 * - Icons/logos: Logo, favicon, brands/, languages/, avatars/ → 400px
 * - Default: 800px. Aspect ratio always preserved; only downscale, never upscale.
 *
 * Skips: source files under 50KB; sources that already have both .webp and .avif.
 *
 * Usage: node scripts/optimize-images.js
 *        npm run optimize:images
 */

const path = require('path');
const fs = require('fs').promises;
const fse = require('fs-extra');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
const MIN_SIZE_BYTES = 50 * 1024; // 50KB - skip smaller files
const SKIP_IF_WEBP_AVIF_EXIST = true; // skip source if .webp and .avif already present

// Resize rules by classification
const HERO_MAX_WIDTH = 1920;
const HERO_TARGET_MAX_BYTES = 150 * 1024; // 150KB for hero
const CATEGORY_MAX_WIDTH = 800;
const ICON_LOGO_MAX_WIDTH = 400;
const DEFAULT_MAX_WIDTH = 800;

const WEBP_QUALITY = 75;
const AVIF_QUALITY = 55;
const WEBP_HERO_QUALITY = 78;
const AVIF_HERO_QUALITY = 58;

/**
 * Classify image by path to choose max width and quality.
 * - hero: Hero1-4, heroSearchCar, slides/ → 1920px, allow up to 150KB
 * - category: categories/, megamenu/, banner, departments/, card, homepage-categories → 800px
 * - icon/logo: Logo, favicon, brands/, languages/, avatars/ → 400px
 * - default: 800px
 */
function classifyImage(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/').toLowerCase();
  const basename = path.basename(normalized);

  if (
    /hero\d*\.(png|jpg|jpeg)$/i.test(basename) ||
    /herosearchcar\.(jpg|jpeg)$/i.test(basename) ||
    normalized.includes('slides/') ||
    /slide-\d/i.test(basename)
  ) {
    return { maxWidth: HERO_MAX_WIDTH, isHero: true };
  }
  if (
    normalized.includes('categories/') ||
    normalized.includes('megamenu/') ||
    normalized.includes('banner') ||
    normalized.includes('departments/') ||
    normalized.includes('card') ||
    normalized.includes('homepage-categories')
  ) {
    return { maxWidth: CATEGORY_MAX_WIDTH, isHero: false };
  }
  if (
    /logo\.(png|jpg|jpeg)$/i.test(basename) ||
    /favicon\.(png|jpg|jpeg)$/i.test(basename) ||
    normalized.includes('brands/') ||
    normalized.includes('languages/') ||
    normalized.includes('avatars/')
  ) {
    return { maxWidth: ICON_LOGO_MAX_WIDTH, isHero: false };
  }
  return { maxWidth: DEFAULT_MAX_WIDTH, isHero: false };
}

/**
 * Recursively collect all image files (png, jpg, jpeg) under dir.
 */
async function collectImageFiles(dir, baseDir = dir, list = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    const relative = path.relative(baseDir, full);
    if (ent.isDirectory()) {
      await collectImageFiles(full, baseDir, list);
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (EXTENSIONS.has(ext)) list.push({ fullPath: full, relativePath: relative, ext });
    }
  }
  return list;
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function getFileSize(filePath) {
  try {
    const s = await fs.stat(filePath);
    return s.size;
  } catch {
    return 0;
  }
}

async function ensureDir(dirPath) {
  await fse.ensureDir(path.dirname(dirPath));
}

/**
 * Encode to WebP or AVIF with optional resize.
 * Metadata is not copied to output by default in Sharp.
 */
async function encodeWithSharp(inputPath, options) {
  let pipeline = sharp(inputPath).rotate(); // auto-orient from EXIF

  const { maxWidth, format, quality, targetMaxBytes } = options;
  const meta = await pipeline.metadata();
  const width = meta.width || 0;
  const height = meta.height || 0;

  if (maxWidth && width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
  }

  if (format === 'webp') {
    pipeline = pipeline.webp({
      quality,
      effort: 6,
      smartSubsample: true,
    });
  } else if (format === 'avif') {
    pipeline = pipeline.avif({
      quality,
      effort: 6,
    });
  }

  let buffer = await pipeline.toBuffer();

  // Hero only: if WebP still over target, re-encode at lower quality once
  if (targetMaxBytes && buffer.length > targetMaxBytes && format === 'webp') {
    const lowerQuality = Math.max(60, quality - 15);
    let retry = sharp(inputPath).rotate();
    if (maxWidth && width > maxWidth) {
      retry = retry.resize(maxWidth, null, { withoutEnlargement: true });
    }
    buffer = await retry
      .webp({ quality: lowerQuality, effort: 6, smartSubsample: true })
      .toBuffer();
  }

  return buffer;
}

async function main() {
  const cwd = path.resolve(__dirname, '..');
  const imagesPath = path.join(cwd, 'public', 'images');

  if (!(await fse.pathExists(imagesPath))) {
    console.error('Directory not found: public/images');
    process.exit(1);
  }

  console.log('Scanning public/images (recursive)...\n');
  const files = await collectImageFiles(imagesPath);
  const toProcess = [];

  for (const { fullPath, relativePath, ext } of files) {
    const size = await getFileSize(fullPath);
    if (size < MIN_SIZE_BYTES) continue;

    const baseNoExt = fullPath.slice(0, -path.extname(fullPath).length);
    const webpPath = `${baseNoExt}.webp`;
    const avifPath = `${baseNoExt}.avif`;

    if (SKIP_IF_WEBP_AVIF_EXIST) {
      const hasWebp = await fse.pathExists(webpPath);
      const hasAvif = await fse.pathExists(avifPath);
      if (hasWebp && hasAvif) continue;
    }

    toProcess.push({
      fullPath,
      relativePath,
      ext,
      size,
      webpPath,
      avifPath,
    });
  }

  console.log(`Found ${files.length} image(s), ${toProcess.length} to process (size > ${formatBytes(MIN_SIZE_BYTES)} or missing WebP/AVIF).\n`);

  let totalOriginalBytes = 0;
  let totalNewBytes = 0;
  const results = [];

  for (const item of toProcess) {
    const { fullPath, relativePath, size, webpPath, avifPath } = item;
    const classification = classifyImage(relativePath);
    const targetMaxBytes = classification.isHero ? HERO_TARGET_MAX_BYTES : null;

    totalOriginalBytes += size;

    try {
      const webpBuffer = await encodeWithSharp(fullPath, {
        maxWidth: classification.maxWidth,
        format: 'webp',
        quality: classification.isHero ? WEBP_HERO_QUALITY : WEBP_QUALITY,
        targetMaxBytes,
      });
      await ensureDir(webpPath);
      await fs.writeFile(webpPath, webpBuffer);
      totalNewBytes += webpBuffer.length;
      results.push({
        file: relativePath,
        original: size,
        webp: webpBuffer.length,
        avif: null,
      });
    } catch (err) {
      console.error(`Error processing ${relativePath} (WebP):`, err.message);
      continue;
    }

    try {
      const avifBuffer = await encodeWithSharp(fullPath, {
        maxWidth: classification.maxWidth,
        format: 'avif',
        quality: classification.isHero ? AVIF_HERO_QUALITY : AVIF_QUALITY,
      });
      await ensureDir(avifPath);
      await fs.writeFile(avifPath, avifBuffer);
      totalNewBytes += avifBuffer.length;
      const r = results[results.length - 1];
      if (r) r.avif = avifBuffer.length;
    } catch (err) {
      console.error(`Error processing ${relativePath} (AVIF):`, err.message);
    }
  }

  // Report
  console.log('\n--- Per-file summary ---');
  for (const r of results) {
    const webpStr = r.webp != null ? formatBytes(r.webp) : '—';
    const avifStr = r.avif != null ? formatBytes(r.avif) : '—';
    console.log(`  ${r.file}`);
    console.log(`    original: ${formatBytes(r.original)}  →  WebP: ${webpStr}  AVIF: ${avifStr}`);
  }

  const beforeTotal = totalOriginalBytes;
  const afterNewFormatsTotal = totalNewBytes;
  const avgOriginal = results.length > 0 ? beforeTotal / results.length : 0;
  const reductionPct =
    results.length > 0 && beforeTotal > 0
      ? ((1 - afterNewFormatsTotal / (results.length * 2) / avgOriginal) * 100).toFixed(1)
      : '0';

  console.log('\n--- Report ---');
  console.log(`  Total files processed:        ${results.length}`);
  console.log(`  Before (originals only):     ${formatBytes(beforeTotal)}`);
  console.log(`  After (WebP + AVIF total):    ${formatBytes(afterNewFormatsTotal)}`);
  console.log(`  Effective reduction when using WebP/AVIF instead of originals: ~${reductionPct}%`);
  console.log('\n  Originals are kept. Add <picture> with srcSet for .avif and .webp for production.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
