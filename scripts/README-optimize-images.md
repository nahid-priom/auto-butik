# Image optimization script

## What it does

- **Scans** `public/images` recursively for `.png`, `.jpg`, `.jpeg`.
- **Skips** files under 50KB and files that already have both `.webp` and `.avif`.
- **Resizes** by category (max width; aspect ratio preserved, no upscale):
  - **Hero** (Hero1–4, heroSearchCar, slides/): 1920px, WebP/AVIF target ≤150KB.
  - **Category** (categories/, megamenu/, banner*, departments/, card, homepage-categories): 800px.
  - **Icons/logos** (Logo, favicon, brands/, languages/, avatars/): 400px.
  - **Default**: 800px.
- **Outputs** next to each original:
  - `filename.webp` (quality 75; hero 78, with retry at lower quality if >150KB).
  - `filename.avif` (quality 55; hero 58).
- **Keeps** all originals; does not delete or rename. Existing `<img src="/images/...">` paths keep working.

## Run

```bash
npm run optimize:images
```

Or:

```bash
node scripts/optimize-images.js
```

## Before / after (example run)

- **Total source files processed:** 43 (only files >50KB or missing WebP/AVIF).
- **Before (originals only):** ~47.92 MB.
- **After (WebP + AVIF total):** ~2.60 MB.
- **Effective reduction** when using WebP/AVIF instead of originals: ~97%.

Hero assets (e.g. Hero1.webp 9.48 MB → WebP 131.5 KB, AVIF 104.7 KB) stay under 150KB.

## Frontend follow-up (not implemented in this script)

After running the script, you can switch to `<picture>` for better performance:

```html
<picture>
  <source srcSet="/images/file.avif" type="image/avif" />
  <source srcSet="/images/file.webp" type="image/webp" />
  <img src="/images/file.jpg" alt="..." loading="lazy" />
</picture>
```

No refactor of components is done by this script; it only prepares the assets.
