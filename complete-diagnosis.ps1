# Complete Diagnosis Script
# Run this on Windows Server

Write-Host ""
Write-Host "=== COMPLETE DIAGNOSIS ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check Express Server
Write-Host "[1] Checking Express Server..." -ForegroundColor Yellow
$expressUrl = "http://localhost:4000/api/product/toyota/996"
try {
    $expressResult = curl.exe -s $expressUrl
    if ($expressResult -and $expressResult.Length -gt 0) {
        if ($expressResult -match 'name="product_id"') {
            Write-Host "[OK] Express server is working!" -ForegroundColor Green
            Write-Host "     product_id found in Express response" -ForegroundColor Green
            $expressOK = $true
        } else {
            Write-Host "[WARN] Express responds but no product_id" -ForegroundColor Yellow
            Write-Host "     Response length: $($expressResult.Length)" -ForegroundColor Gray
            Write-Host "     First 200 chars: $($expressResult.Substring(0, [Math]::Min(200, $expressResult.Length)))" -ForegroundColor Gray
            $expressOK = $false
        }
    } else {
        Write-Host "[FAIL] Express server returned empty response" -ForegroundColor Red
        $expressOK = $false
    }
} catch {
    Write-Host "[FAIL] Cannot connect to Express server" -ForegroundColor Red
    Write-Host "     Error: $_" -ForegroundColor Red
    $expressOK = $false
}

Write-Host ""

# 2. Check IIS Rewrite
Write-Host "[2] Checking IIS Rewrite..." -ForegroundColor Yellow
$siteUrl = "https://lent-shop.ir/product/toyota/996"
try {
    $siteResult = curl.exe -s $siteUrl
    if ($siteResult -and $siteResult.Length -gt 0) {
        if ($siteResult -match 'name="product_id"') {
            Write-Host "[OK] IIS Rewrite is working!" -ForegroundColor Green
            Write-Host "     product_id found in site response" -ForegroundColor Green
            $iisOK = $true
        } else {
            Write-Host "[FAIL] IIS Rewrite is NOT working" -ForegroundColor Red
            Write-Host "     product_id NOT found in site response" -ForegroundColor Red
            Write-Host "     Response length: $($siteResult.Length)" -ForegroundColor Gray
            
            if ($siteResult -match '<div id="root">') {
                Write-Host "     [INFO] Response is React SPA (no meta tags)" -ForegroundColor Yellow
                Write-Host "     Rewrite rule is NOT executing!" -ForegroundColor Red
            }
            
            Write-Host ""
            Write-Host "     First 300 chars of response:" -ForegroundColor Gray
            Write-Host "     $($siteResult.Substring(0, [Math]::Min(300, $siteResult.Length)))" -ForegroundColor Gray
            $iisOK = $false
        }
    } else {
        Write-Host "[FAIL] Site returned empty response" -ForegroundColor Red
        $iisOK = $false
    }
} catch {
    Write-Host "[FAIL] Cannot connect to site" -ForegroundColor Red
    Write-Host "     Error: $_" -ForegroundColor Red
    $iisOK = $false
}

Write-Host ""

# 3. Check web.config
Write-Host "[3] Checking web.config..." -ForegroundColor Yellow
$webConfigPath = "C:\e-commerce\dist\web.config"
if (Test-Path $webConfigPath) {
    Write-Host "[OK] web.config found at: $webConfigPath" -ForegroundColor Green
    $configContent = Get-Content $webConfigPath -Raw -Encoding UTF8
    
    if ($configContent -match 'SSR Product Pages') {
        Write-Host "[OK] SSR Product Pages rule exists" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] SSR Product Pages rule NOT found" -ForegroundColor Red
    }
    
    if ($configContent -match 'Block SPA for Product') {
        Write-Host "[OK] Block SPA for Product rule exists" -ForegroundColor Green
        if ($configContent -match 'AbortRequest') {
            Write-Host "[OK] AbortRequest action is set" -ForegroundColor Green
        } else {
            Write-Host "[WARN] AbortRequest action NOT found" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[FAIL] Block SPA for Product rule NOT found" -ForegroundColor Red
    }
    
    if ($configContent -match '<proxy enabled="true"') {
        Write-Host "[OK] ARR Proxy is enabled in web.config" -ForegroundColor Green
    } else {
        Write-Host "[WARN] ARR Proxy NOT enabled in web.config" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "[FAIL] web.config NOT found at: $webConfigPath" -ForegroundColor Red
    Write-Host "     Please check the path" -ForegroundColor Yellow
}

Write-Host ""

# 4. Check PM2
Write-Host "[4] Checking PM2..." -ForegroundColor Yellow
try {
    $pm2List = pm2 list 2>&1
    if ($pm2List -match 'lent-shop') {
        Write-Host "[OK] PM2 process found" -ForegroundColor Green
        Write-Host "     $pm2List" -ForegroundColor Gray
    } else {
        Write-Host "[WARN] PM2 process NOT found" -ForegroundColor Yellow
        Write-Host "     Express might not be running" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARN] Cannot check PM2" -ForegroundColor Yellow
}

Write-Host ""

# 5. Summary
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host ""

if ($expressOK -and $iisOK) {
    Write-Host "[SUCCESS] Everything is working!" -ForegroundColor Green
    Write-Host "Both Express and IIS Rewrite are working correctly" -ForegroundColor Green
    
} elseif ($expressOK -and -not $iisOK) {
    Write-Host "[PROBLEM] Express works, but IIS Rewrite does NOT" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Cyan
    Write-Host "  1. Server-level rules are overriding site-level rules" -ForegroundColor White
    Write-Host "  2. Rule order is wrong in IIS Manager" -ForegroundColor White
    Write-Host "  3. ARR Proxy is not enabled" -ForegroundColor White
    Write-Host "  4. web.config is not being read correctly" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Check Server-level rules in IIS Manager" -ForegroundColor White
    Write-Host "  2. Verify rule order (SSR Product Pages must be first)" -ForegroundColor White
    Write-Host "  3. Check ARR Proxy settings" -ForegroundColor White
    Write-Host "  4. Restart IIS: iisreset" -ForegroundColor White
    
} elseif (-not $expressOK) {
    Write-Host "[PROBLEM] Express server is NOT working" -ForegroundColor Red
    Write-Host ""
    Write-Host "Start Express:" -ForegroundColor Cyan
    Write-Host "  cd C:\e-commerce" -ForegroundColor White
    Write-Host "  pm2 start index.js --name lent-shop-api" -ForegroundColor White
    Write-Host "  pm2 save" -ForegroundColor White
    Write-Host ""
    Write-Host "Then test again:" -ForegroundColor Cyan
    Write-Host "  curl.exe http://localhost:4000/api/product/toyota/996" -ForegroundColor White
    
} else {
    Write-Host "[PROBLEM] Both Express and IIS are NOT working" -ForegroundColor Red
    Write-Host ""
    Write-Host "Fix Express first, then IIS" -ForegroundColor Yellow
}

Write-Host ""

