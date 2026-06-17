# Simple IIS Rules Checker - No special characters
# Run this on Windows Server

Write-Host ""
Write-Host "=== IIS Rules Checker ===" -ForegroundColor Cyan
Write-Host ""

$webConfigPath = "C:\inetpub\wwwroot\lent-shop\web.config"
Write-Host "[1] Checking web.config..." -ForegroundColor Yellow

if (Test-Path $webConfigPath) {
    Write-Host "[OK] web.config found" -ForegroundColor Green
    $content = Get-Content $webConfigPath -Raw -Encoding UTF8
    
    if ($content -match 'SSR Product Pages') {
        Write-Host "[OK] SSR Product Pages rule exists" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] SSR Product Pages rule NOT found" -ForegroundColor Red
    }
    
    if ($content -match 'Ignore Product for SPA') {
        Write-Host "[OK] Ignore Product for SPA rule exists" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Ignore Product for SPA rule NOT found" -ForegroundColor Red
    }
} else {
    Write-Host "[FAIL] web.config NOT found at: $webConfigPath" -ForegroundColor Red
    Write-Host "Please check the path" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[2] Restarting IIS..." -ForegroundColor Yellow
iisreset
Write-Host "[OK] IIS restarted" -ForegroundColor Green

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Open IIS Manager" -ForegroundColor Yellow
Write-Host "2. Sites -> Your Site -> URL Rewrite" -ForegroundColor Yellow
Write-Host "3. Check rules are in this order:" -ForegroundColor Yellow
Write-Host "   - SSR Product Pages (first)" -ForegroundColor Green
Write-Host "   - Ignore Product for SPA" -ForegroundColor Green
Write-Host "   - React Router (last)" -ForegroundColor Green
Write-Host ""
Write-Host "4. Check Server Level: Server Name -> URL Rewrite" -ForegroundColor Yellow
Write-Host "   Delete any old rules there" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== Test ===" -ForegroundColor Cyan
Write-Host 'curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"' -ForegroundColor Cyan
Write-Host ""

