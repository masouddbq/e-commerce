# Fix IIS Rules - Server Version
# This script should be run on Windows Server

Write-Host "`n=== Checking IIS Rules (Server) ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check web.config path
$webConfigPath = "C:\inetpub\wwwroot\lent-shop\web.config"
Write-Host "[1] Checking web.config path..." -ForegroundColor Yellow

if (Test-Path $webConfigPath) {
    Write-Host "[OK] web.config found: $webConfigPath" -ForegroundColor Green
    
    # Check important rules
    $content = Get-Content $webConfigPath -Raw -Encoding UTF8
    
    if ($content -match 'SSR Product Pages') {
        Write-Host "[OK] Rule 'SSR Product Pages' exists in web.config" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Rule 'SSR Product Pages' NOT found in web.config!" -ForegroundColor Red
    }
    
    if ($content -match 'Ignore Product for SPA') {
        Write-Host "[OK] Rule 'Ignore Product for SPA' exists in web.config" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Rule 'Ignore Product for SPA' NOT found in web.config!" -ForegroundColor Red
    }
    
    # Show existing rules
    Write-Host "`nRules found in web.config:" -ForegroundColor Cyan
    $rules = [regex]::Matches($content, 'name="([^"]+)"')
    foreach ($rule in $rules) {
        Write-Host "   - $($rule.Groups[1].Value)" -ForegroundColor White
    }
    
} else {
    Write-Host "[FAIL] web.config NOT found: $webConfigPath" -ForegroundColor Red
    Write-Host "Please check the path." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Possible paths:" -ForegroundColor Yellow
    Write-Host "  - C:\inetpub\wwwroot\lent-shop\web.config" -ForegroundColor Cyan
    Write-Host "  - C:\inetpub\wwwroot\wwwroot\lent-shop\web.config" -ForegroundColor Cyan
    Write-Host "  - Or another path where the site is located" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# 2. Check Application Pool
Write-Host "[2] Checking Application Pool..." -ForegroundColor Yellow

try {
    Import-Module WebAdministration -ErrorAction Stop
    $appPools = Get-WebApplicationPool | Where-Object { $_.Name -like "*lent*" -or $_.Name -like "*shop*" -or $_.Name -like "*default*" }
    
    if ($appPools) {
        Write-Host "[OK] Application Pool found:" -ForegroundColor Green
        foreach ($pool in $appPools) {
            Write-Host "   - $($pool.Name) (Status: $($pool.State))" -ForegroundColor Cyan
        }
    } else {
        Write-Host "[WARN] Application Pool with name 'lent' or 'shop' not found" -ForegroundColor Yellow
        Write-Host "   Available Application Pools:" -ForegroundColor Yellow
        Get-WebApplicationPool | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Cyan }
    }
} catch {
    Write-Host "[WARN] WebAdministration Module not available" -ForegroundColor Yellow
    Write-Host "   Trying to import..." -ForegroundColor Cyan
    try {
        Import-Module WebAdministration
        Write-Host "[OK] Module imported" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Error importing Module" -ForegroundColor Red
    }
}

Write-Host ""

# 3. Check Sites
Write-Host "[3] Checking Sites..." -ForegroundColor Yellow

try {
    Import-Module WebAdministration -ErrorAction SilentlyContinue
    $sites = Get-Website | Where-Object { $_.Name -like "*lent*" -or $_.Name -like "*shop*" }
    
    if ($sites) {
        Write-Host "[OK] Site found:" -ForegroundColor Green
        foreach ($site in $sites) {
            Write-Host "   - $($site.Name) (State: $($site.State), Path: $($site.PhysicalPath))" -ForegroundColor Cyan
        }
    } else {
        Write-Host "[WARN] Site with name 'lent' or 'shop' not found" -ForegroundColor Yellow
        Write-Host "   Available Sites:" -ForegroundColor Yellow
        Get-Website | ForEach-Object { Write-Host "   - $($_.Name) (Path: $($_.PhysicalPath))" -ForegroundColor Cyan }
    }
} catch {
    Write-Host "[WARN] Error checking Sites" -ForegroundColor Yellow
}

Write-Host ""

# 4. Restart IIS
Write-Host "[4] Restarting IIS..." -ForegroundColor Yellow
Write-Host "Restarting IIS..." -ForegroundColor Cyan

try {
    iisreset
    Write-Host "[OK] IIS restarted successfully" -ForegroundColor Green
    Start-Sleep -Seconds 3
} catch {
    Write-Host "[FAIL] Error restarting IIS" -ForegroundColor Red
    Write-Host "Please run manually: iisreset" -ForegroundColor Yellow
}

Write-Host ""

# 5. Next Steps
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open IIS Manager" -ForegroundColor Yellow
Write-Host "2. Sites -> [Your Site Name] -> URL Rewrite" -ForegroundColor Yellow
Write-Host "3. Check that these rules exist (in order):" -ForegroundColor Yellow
Write-Host "   [OK] SSR Product Pages (first rule)" -ForegroundColor Green
Write-Host "   [OK] Ignore Product for SPA" -ForegroundColor Green
Write-Host "   [OK] React Router (last rule)" -ForegroundColor Green
Write-Host ""
Write-Host "4. If you see old rules:" -ForegroundColor Yellow
Write-Host "   - Delete them" -ForegroundColor Cyan
Write-Host "   - Click Apply" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Check Server Level Rules (VERY IMPORTANT!):" -ForegroundColor Yellow
Write-Host "   - Server Name (not Site) -> URL Rewrite" -ForegroundColor Cyan
Write-Host "   - If you see old rules, Delete or Disable them" -ForegroundColor Cyan
Write-Host ""
Write-Host "6. Close and reopen IIS Manager" -ForegroundColor Yellow
Write-Host ""

# 6. Simple Test
Write-Host "=== Simple Test ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "After completing the steps above, run this command:" -ForegroundColor Yellow
Write-Host ""
Write-Host 'curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"' -ForegroundColor Cyan
Write-Host ""
Write-Host "If you see 'product_id' -> SUCCESS [OK]" -ForegroundColor Green
Write-Host ""

Write-Host "=== Done ===" -ForegroundColor Cyan
Write-Host ""
