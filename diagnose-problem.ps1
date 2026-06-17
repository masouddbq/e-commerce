# Diagnose the problem
# Run this on Windows Server

Write-Host ""
Write-Host "=== Diagnosing Problem ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check Express Server
Write-Host "[1] Checking Express Server..." -ForegroundColor Yellow
$expressUrl = "http://localhost:4000/api/product/toyota/996"
try {
    $expressResult = curl.exe -s $expressUrl
    if ($expressResult -match 'name="product_id"') {
        Write-Host "[OK] Express server is working!" -ForegroundColor Green
        Write-Host "     Express returns product_id correctly" -ForegroundColor Green
        $expressWorking = $true
    } else {
        Write-Host "[FAIL] Express server is NOT working correctly" -ForegroundColor Red
        Write-Host "     product_id NOT found in Express response" -ForegroundColor Red
        $expressWorking = $false
    }
} catch {
    Write-Host "[FAIL] Cannot connect to Express server" -ForegroundColor Red
    Write-Host "     Express might not be running" -ForegroundColor Red
    $expressWorking = $false
}

Write-Host ""

# 2. Check IIS Rewrite
Write-Host "[2] Checking IIS Rewrite..." -ForegroundColor Yellow
$siteUrl = "https://lent-shop.ir/product/toyota/996"
try {
    $siteResult = curl.exe -s $siteUrl
    if ($siteResult -match 'name="product_id"') {
        Write-Host "[OK] IIS Rewrite is working!" -ForegroundColor Green
        Write-Host "     product_id found in site response" -ForegroundColor Green
        $iisWorking = $true
    } else {
        Write-Host "[FAIL] IIS Rewrite is NOT working" -ForegroundColor Red
        Write-Host "     product_id NOT found in site response" -ForegroundColor Red
        $iisWorking = $false
        
        # Check if it's React SPA
        if ($siteResult -match '<div id="root">') {
            Write-Host "     Response is React SPA (no meta tags)" -ForegroundColor Yellow
            Write-Host "     Rewrite rule is NOT executing" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "[FAIL] Cannot connect to site" -ForegroundColor Red
    $iisWorking = $false
}

Write-Host ""

# 3. Diagnosis
Write-Host "=== Diagnosis ===" -ForegroundColor Cyan
Write-Host ""

if ($expressWorking -and $iisWorking) {
    Write-Host "[SUCCESS] Everything is working!" -ForegroundColor Green
    Write-Host "Both Express and IIS Rewrite are working correctly" -ForegroundColor Green
    
} elseif ($expressWorking -and -not $iisWorking) {
    Write-Host "[PROBLEM] Express works, but IIS Rewrite does NOT" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Solution:" -ForegroundColor Cyan
    Write-Host "  1. Add Rewrite Rules manually in IIS Manager" -ForegroundColor White
    Write-Host "  2. Check rule order (SSR Product Pages must be first)" -ForegroundColor White
    Write-Host "  3. Check ARR Proxy is enabled" -ForegroundColor White
    Write-Host "  4. Restart IIS" -ForegroundColor White
    
} elseif (-not $expressWorking) {
    Write-Host "[PROBLEM] Express server is NOT working" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solution:" -ForegroundColor Cyan
    Write-Host "  1. Start Express server:" -ForegroundColor White
    Write-Host "     cd C:\path\to\server" -ForegroundColor Gray
    Write-Host "     pm2 start index.js --name lent-shop-api" -ForegroundColor Gray
    Write-Host "     pm2 save" -ForegroundColor Gray
    
} else {
    Write-Host "[PROBLEM] Both Express and IIS are NOT working" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solution:" -ForegroundColor Cyan
    Write-Host "  1. First fix Express server" -ForegroundColor White
    Write-Host "  2. Then fix IIS Rewrite Rules" -ForegroundColor White
}

Write-Host ""

