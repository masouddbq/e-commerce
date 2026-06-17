# Find web.config locations
# Run this on Windows Server

Write-Host ""
Write-Host "=== Finding web.config locations ===" -ForegroundColor Cyan
Write-Host ""

try {
    Import-Module WebAdministration -ErrorAction Stop
    
    # Find site
    $site = Get-Website | Where-Object { $_.Name -like "*lent*" -or $_.Name -like "*shop*" }
    
    if ($site) {
        Write-Host "[OK] Site found: $($site.Name)" -ForegroundColor Green
        Write-Host "     Physical Path: $($site.PhysicalPath)" -ForegroundColor Cyan
        Write-Host ""
        
        # Check web.config in physical path
        $webConfigPath = Join-Path $site.PhysicalPath "web.config"
        if (Test-Path $webConfigPath) {
            Write-Host "[OK] web.config found at:" -ForegroundColor Green
            Write-Host "     $webConfigPath" -ForegroundColor Cyan
            Write-Host ""
            
            # Check if Product SSR Proxy exists
            $content = Get-Content $webConfigPath -Raw -Encoding UTF8
            if ($content -match 'Product SSR Proxy') {
                Write-Host "[OK] Product SSR Proxy rule exists" -ForegroundColor Green
            } else {
                Write-Host "[FAIL] Product SSR Proxy rule NOT found" -ForegroundColor Red
            }
            
            if ($content -match '<handlers>') {
                Write-Host "[OK] Handlers section exists" -ForegroundColor Green
            } else {
                Write-Host "[WARN] Handlers section NOT found" -ForegroundColor Yellow
            }
            
        } else {
            Write-Host "[FAIL] web.config NOT found at:" -ForegroundColor Red
            Write-Host "     $webConfigPath" -ForegroundColor Cyan
        }
        
        Write-Host ""
        
        # Check for applications
        $applications = Get-WebApplication -Site $site.Name
        if ($applications) {
            Write-Host "[INFO] Applications found:" -ForegroundColor Yellow
            foreach ($app in $applications) {
                Write-Host "     - $($app.Path) (Physical Path: $($app.PhysicalPath))" -ForegroundColor Cyan
                
                # Check web.config in application
                $appWebConfig = Join-Path $app.PhysicalPath "web.config"
                if (Test-Path $appWebConfig) {
                    Write-Host "       [WARN] web.config found in application!" -ForegroundColor Yellow
                    Write-Host "       $appWebConfig" -ForegroundColor Gray
                }
            }
        } else {
            Write-Host "[OK] No applications found" -ForegroundColor Green
        }
        
    } else {
        Write-Host "[FAIL] Site not found" -ForegroundColor Red
        Write-Host "Available sites:" -ForegroundColor Yellow
        Get-Website | ForEach-Object { Write-Host "  - $($_.Name) (Path: $($_.PhysicalPath))" -ForegroundColor Cyan }
    }
    
} catch {
    Write-Host "[FAIL] Error: $_" -ForegroundColor Red
    Write-Host "WebAdministration module might not be available" -ForegroundColor Yellow
}

Write-Host ""

