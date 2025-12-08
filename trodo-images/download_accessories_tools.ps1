# Create directories for Biltillbehör images
$accessoriesDir = "E:\Fiverr Works\Autobutik\Autobutik-frontend\trodo-images\biltillbehor"
if (-not (Test-Path $accessoriesDir)) {
    New-Item -Path $accessoriesDir -ItemType Directory | Out-Null
}

# Create directories for Verktyg images
$toolsDir = "E:\Fiverr Works\Autobutik\Autobutik-frontend\trodo-images\verktyg"
if (-not (Test-Path $toolsDir)) {
    New-Item -Path $toolsDir -ItemType Directory | Out-Null
}

Write-Host "Starting download of Biltillbehor and Verktyg category images..."

# Biltillbehör images
$accessoriesImages = @(
    # Banner
    "https://picdn.trodo.com/media/catalog/category/banner/967_accessories_and_equipment.jpg",
    
    # Subcategory images
    "https://picdn.trodo.com/media/catalog/category_m2/135/evwc2t7g_1_1_.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/additional_lightning.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/71Qe9M9QfGL.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/601_towbar_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1019_snow_chains_and_socks.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/968_floor_mats.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/975_battery_chargers.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/976_winter_products.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/jump_start_cables.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1014_universal_parking_sensors.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1015_reversing_cameras.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/987_jump_starters.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/979_bike_carriers.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/car_cover.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1079_roof_bars_and_accessories.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/123batt.jpeg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1103_dash_cameras.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1054_trunk_mats.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1105_inverters.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/983_wheel_trims.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/985_other_equipment.jpg"
)

# Verktyg images
$toolsImages = @(
    # Banner
    "https://picdn.trodo.com/media/catalog/category/banner/1023_tools.jpg",
    
    # Subcategory images
    "https://picdn.trodo.com/media/catalog/category_m2/135/1035_electric_tools.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1055_pneumatic_tools.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/2606-22ct.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1033_vehicle_service_tools.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1041_hand_tools.jpg"
)

Write-Host "`nDownloading Biltillbehor images..."
$accessoriesCount = 0
foreach ($url in $accessoriesImages) {
    $fileName = Split-Path $url -Leaf
    $outputPath = Join-Path $accessoriesDir $fileName
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -ErrorAction Stop
        Write-Host "Downloaded: $fileName"
        $accessoriesCount++
    } catch {
        Write-Warning "Failed to download $url : $($_.Exception.Message)"
    }
}

Write-Host "`nDownloading Verktyg images..."
$toolsCount = 0
foreach ($url in $toolsImages) {
    $fileName = Split-Path $url -Leaf
    $outputPath = Join-Path $toolsDir $fileName
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -ErrorAction Stop
        Write-Host "Downloaded: $fileName"
        $toolsCount++
    } catch {
        Write-Warning "Failed to download $url : $($_.Exception.Message)"
    }
}

Write-Host "`n========================================"
Write-Host "Download complete!"
Write-Host "Biltillbehor images: $accessoriesCount"
Write-Host "Verktyg images: $toolsCount"
Write-Host "Total: $($accessoriesCount + $toolsCount)"

