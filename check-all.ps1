# Check All - Complete Diagnosis
# Run this on Windows Server

Write-Host ""
Write-Host "=== Complete Diagnosis ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check Express
Write-Host "[1] Checking Express Server..." -ForegroundColor Yellow
$expressResult = curl.exe -s http://localhost:4000/api/product/toyota/996
if ($expressResult -match 'name="product_id"') {
    Write-Host "[OK] Express is working!" -ForegroundColor Green
    $expressOK = $true
} else {
    Write-Host "[FAIL] Express is NOT working" -ForegroundColor Red
    Write-Host "Response: $($expressResult.Substring(0, [Math]::Min(200, $expressResult.Length)))" -ForegroundColor Gray
    $expressOK = $false
}

Write-Host ""

# 2. Check IIS Rewrite
Write-Host "[2] Checking IIS Rewrite..." -ForegroundColor Yellow
$siteResult = curl.exe -s https://lent-shop.ir/product/toyota/996
if ($siteResult -match 'name="product_id"') {
    Write-Host "[OK] IIS Rewrite is working!" -ForegroundColor Green
    $iisOK = $true
} else {
    Write-Host "[FAIL] IIS Rewrite is NOT working" -ForegroundColor Red
    if ($siteResult -match '<div id="root">') {
        Write-Host "[INFO] Response is React SPA (no meta tags)" -ForegroundColor Yellow
    }
    Write-Host "Response length: $($siteResult.Length) characters" -ForegroundColor Gray
    $iisOK = $false
}

Write-Host ""

# 3. Check web.config
Write-Host "[3] Checking web.config..." -ForegroundColor Yellow
$webConfigPath = "C:\e-commerce\dist\web.config"
if (Test-Path $webConfigPath) {
    $configContent = Get-Content $webConfigPath -Raw -Encoding UTF8
    if ($configContent -match 'SSR Product Pages') {
        Write-Host "[OK] SSR Product Pages rule exists in web.config" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] SSR Product Pages rule NOT in web.config" -ForegroundColor Red
    }
} else {
    Write-Host "[FAIL] web.config NOT found at: $webConfigPath" -ForegroundColor Red
}

Write-Host ""

# 4. Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""

if ($expressOK -and $iisOK) {
    Write-Host "[SUCCESS] Everything is working!" -ForegroundColor Green
} elseif ($expressOK -and -not $iisOK) {
    Write-Host "[PROBLEM] Express works, but IIS Rewrite does NOT" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Check:" -ForegroundColor Cyan
    Write-Host "  1. Rule order in IIS Manager" -ForegroundColor White
    Write-Host "  2. ARR Proxy is enabled" -ForegroundColor White
    Write-Host "  3. Pattern test in IIS Manager" -ForegroundColor White
} elseif (-not $expressOK) {
    Write-Host "[PROBLEM] Express server is NOT working" -ForegroundColor Red
    Write-Host ""
    Write-Host "Start Express:" -ForegroundColor Cyan
    Write-Host "  cd C:\e-commerce" -ForegroundColor White
    Write-Host "  pm2 start index.js --name lent-shop-api" -ForegroundColor White
    Write-Host "  pm2 save" -ForegroundColor White
} else {
    Write-Host "[PROBLEM] Both Express and IIS are NOT working" -ForegroundColor Red
}

Write-Host ""

