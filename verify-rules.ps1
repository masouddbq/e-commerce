# Verify Rules Configuration
# Run this on Windows Server

Write-Host ""
Write-Host "=== Verifying Rules Configuration ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check Express
Write-Host "[1] Checking Express Server..." -ForegroundColor Yellow
$expressResult = curl.exe -s http://localhost:4000/api/product/toyota/996
if ($expressResult -match 'name="product_id"') {
    Write-Host "[OK] Express is working!" -ForegroundColor Green
    $expressOK = $true
} else {
    Write-Host "[FAIL] Express is NOT working" -ForegroundColor Red
    $expressOK = $false
}

Write-Host ""

# 2. Check IIS
Write-Host "[2] Checking IIS Rewrite..." -ForegroundColor Yellow
$siteResult = curl.exe -s https://lent-shop.ir/product/toyota/996
if ($siteResult -match 'name="product_id"') {
    Write-Host "[OK] IIS Rewrite is working!" -ForegroundColor Green
    Write-Host "     product_id found in response" -ForegroundColor Green
    $iisOK = $true
} else {
    Write-Host "[FAIL] IIS Rewrite is NOT working" -ForegroundColor Red
    Write-Host "     product_id NOT found in response" -ForegroundColor Red
    
    if ($siteResult -match '<div id="root">') {
        Write-Host "     [INFO] Response is React SPA (no meta tags)" -ForegroundColor Yellow
        Write-Host "     Rewrite rule is NOT executing!" -ForegroundColor Red
    }
    $iisOK = $false
}

Write-Host ""

# 3. Check web.config
Write-Host "[3] Checking web.config..." -ForegroundColor Yellow
$webConfigPath = "C:\e-commerce\dist\web.config"
if (Test-Path $webConfigPath) {
    $configContent = Get-Content $webConfigPath -Raw -Encoding UTF8
    
    Write-Host "[OK] web.config found" -ForegroundColor Green
    
    # Check rules order
    $rules = @()
    if ($configContent -match 'name="Torob Products') { $rules += "Torob Products" }
    if ($configContent -match 'name="Static Files') { $rules += "Static Files" }
    if ($configContent -match 'name="API and Payment') { $rules += "API and Payment" }
    if ($configContent -match 'name="SSR Product Pages') { $rules += "SSR Product Pages" }
    if ($configContent -match 'name="Block SPA for Product') { $rules += "Block SPA for Product" }
    if ($configContent -match 'name="React Router') { $rules += "React Router" }
    
    Write-Host "     Rules found in web.config:" -ForegroundColor Cyan
    foreach ($rule in $rules) {
        Write-Host "       - $rule" -ForegroundColor White
    }
    
    # Check AbortRequest
    if ($configContent -match 'Block SPA for Product') {
        if ($configContent -match 'AbortRequest') {
            Write-Host "[OK] Block SPA for Product uses AbortRequest" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] Block SPA for Product does NOT use AbortRequest" -ForegroundColor Red
            Write-Host "     It might be using 'None' which won't work" -ForegroundColor Yellow
        }
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
    Write-Host "  1. Server-level rules in IIS Manager" -ForegroundColor White
    Write-Host "  2. Rule 'Block SPA for Product' uses AbortRequest (not None)" -ForegroundColor White
    Write-Host "  3. Pattern test in IIS Manager" -ForegroundColor White
    Write-Host "  4. ARR Proxy is enabled" -ForegroundColor White
} elseif (-not $expressOK) {
    Write-Host "[PROBLEM] Express server is NOT working" -ForegroundColor Red
    Write-Host ""
    Write-Host "Start Express:" -ForegroundColor Cyan
    Write-Host "  cd C:\e-commerce" -ForegroundColor White
    Write-Host "  pm2 start index.js --name lent-shop-api" -ForegroundColor White
    Write-Host "  pm2 save" -ForegroundColor White
}

Write-Host ""

