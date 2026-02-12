# Create directories for oils and car care images
$oilsDir = "E:\Fiverr Works\Autobutik\Autobutik-frontend\trodo-images\oils-bilvard"
if (-not (Test-Path $oilsDir)) {
    New-Item -Path $oilsDir -ItemType Directory | Out-Null
}

Write-Host "Starting download of Oljor och bilvard category images..."

# Actual category images from Trodo's Oljor och bilvard section
$categoryImages = @(
    # Banner image
    "https://picdn.trodo.com/media/catalog/category/banner/956_oils_and_fluids.jpg",
    
    # Subcategory images
    "https://picdn.trodo.com/media/catalog/category_m2/135/957_engine_oil.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1114_car_detailing.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/958_transmission_oil.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/873_oil.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/959_lubricants.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/960_brake_fluid.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1110_power_steering_oil.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/961_coolant.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/Fuel_additives.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/AdBlue_1.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1075_oil_additives.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/963_adhesives_and_sealants.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/964_windshield_fluid.jpg"
)

Write-Host "Downloading category images..."
$downloadedCount = 0
foreach ($url in $categoryImages) {
    $fileName = Split-Path $url -Leaf
    $outputPath = Join-Path $oilsDir $fileName
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -ErrorAction Stop
        Write-Host "Downloaded: $fileName"
        $downloadedCount++
    } catch {
        Write-Warning "Failed to download $url : $($_.Exception.Message)"
    }
}

Write-Host "`n========================================"
Write-Host "Download complete!"
Write-Host "Total images downloaded: $downloadedCount"
Write-Host "Images saved to: $oilsDir"
