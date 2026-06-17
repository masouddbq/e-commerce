# Import Rules from web.config to IIS
# This script will help import rules from web.config

Write-Host ""
Write-Host "=== Import Rules to IIS ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check web.config path
$webConfigPath = "C:\inetpub\wwwroot\lent-shop\web.config"
Write-Host "[1] Checking web.config path..." -ForegroundColor Yellow

if (Test-Path $webConfigPath) {
    Write-Host "[OK] web.config found: $webConfigPath" -ForegroundColor Green
    
    # Check if rules exist
    $content = Get-Content $webConfigPath -Raw -Encoding UTF8
    
    if ($content -match 'SSR Product Pages') {
        Write-Host "[OK] SSR Product Pages rule exists in web.config" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] SSR Product Pages rule NOT found in web.config" -ForegroundColor Red
    }
    
    if ($content -match 'Ignore Product for SPA') {
        Write-Host "[OK] Ignore Product for SPA rule exists in web.config" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Ignore Product for SPA rule NOT found in web.config" -ForegroundColor Red
    }
    
} else {
    Write-Host "[FAIL] web.config NOT found: $webConfigPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the path. Possible locations:" -ForegroundColor Yellow
    Write-Host "  - C:\inetpub\wwwroot\lent-shop\web.config" -ForegroundColor Cyan
    Write-Host "  - Check the Physical Path of your site in IIS Manager" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "[2] Restarting IIS to reload web.config..." -ForegroundColor Yellow
iisreset
Write-Host "[OK] IIS restarted" -ForegroundColor Green

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open IIS Manager" -ForegroundColor Yellow
Write-Host "2. Sites -> lent-shop.ir -> URL Rewrite" -ForegroundColor Yellow
Write-Host "3. Refresh the page (F5) or close and reopen IIS Manager" -ForegroundColor Yellow
Write-Host "4. You should see all rules from web.config" -ForegroundColor Yellow
Write-Host ""
Write-Host "If rules still don't appear:" -ForegroundColor Yellow
Write-Host "  - Check that web.config is in the correct location" -ForegroundColor Cyan
Write-Host "  - Check the Physical Path of your site in IIS Manager" -ForegroundColor Cyan
Write-Host "  - Use 'Import Rules...' from Actions pane" -ForegroundColor Cyan
Write-Host ""

