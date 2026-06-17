# Test Express Direct
# Run this on Windows Server

Write-Host ""
Write-Host "=== Testing Express Direct ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Direct Express
Write-Host "[1] Testing Express directly..." -ForegroundColor Yellow
$expressResult = curl.exe -s http://localhost:4000/api/product/toyota/996

if ($expressResult -match 'name="product_id"') {
    Write-Host "[OK] Express returns meta tags!" -ForegroundColor Green
    Write-Host "     product_id found in Express response" -ForegroundColor Green
    
    # Show first 500 chars
    Write-Host ""
    Write-Host "First 500 characters:" -ForegroundColor Cyan
    Write-Host $expressResult.Substring(0, [Math]::Min(500, $expressResult.Length))
} else {
    Write-Host "[FAIL] Express does NOT return meta tags!" -ForegroundColor Red
    Write-Host "     product_id NOT found in Express response" -ForegroundColor Red
    
    # Show first 500 chars
    Write-Host ""
    Write-Host "First 500 characters:" -ForegroundColor Cyan
    Write-Host $expressResult.Substring(0, [Math]::Min(500, $expressResult.Length))
}

Write-Host ""

# Test 2: Through IIS
Write-Host "[2] Testing through IIS..." -ForegroundColor Yellow
$iisResult = curl.exe -s https://lent-shop.ir/product/toyota/996

if ($iisResult -match 'name="product_id"') {
    Write-Host "[OK] IIS returns meta tags!" -ForegroundColor Green
    Write-Host "     product_id found in IIS response" -ForegroundColor Green
} else {
    Write-Host "[FAIL] IIS does NOT return meta tags!" -ForegroundColor Red
    Write-Host "     product_id NOT found in IIS response" -ForegroundColor Red
    
    # Check if it's React SPA
    if ($iisResult -match '<div id="root">') {
        Write-Host "     [INFO] Response is React SPA (no meta tags)" -ForegroundColor Yellow
    }
    
    # Show first 500 chars
    Write-Host ""
    Write-Host "First 500 characters:" -ForegroundColor Cyan
    Write-Host $iisResult.Substring(0, [Math]::Min(500, $iisResult.Length))
}

Write-Host ""

# Test 3: Headers
Write-Host "[3] Checking headers..." -ForegroundColor Yellow
$headers = curl.exe -I https://lent-shop.ir/product/toyota/996

if ($headers -match 'X-SSR') {
    Write-Host "[OK] X-SSR header found" -ForegroundColor Green
    $headers | Select-String "X-SSR"
} else {
    Write-Host "[FAIL] X-SSR header NOT found" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""

if ($expressResult -match 'product_id' -and $iisResult -match 'product_id') {
    Write-Host "[SUCCESS] Both Express and IIS return meta tags!" -ForegroundColor Green
} elseif ($expressResult -match 'product_id' -and -not ($iisResult -match 'product_id')) {
    Write-Host "[PROBLEM] Express returns meta tags, but IIS does NOT" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Cyan
    Write-Host "  1. IIS is caching the response" -ForegroundColor White
    Write-Host "  2. ARR is modifying the response" -ForegroundColor White
    Write-Host "  3. Wrong route is being hit" -ForegroundColor White
    Write-Host ""
    Write-Host "Solution:" -ForegroundColor Cyan
    Write-Host "  1. Clear IIS cache" -ForegroundColor White
    Write-Host "  2. Check ARR settings" -ForegroundColor White
    Write-Host "  3. Check which Express route is being hit" -ForegroundColor White
} elseif (-not ($expressResult -match 'product_id')) {
    Write-Host "[PROBLEM] Express does NOT return meta tags" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check Express route /api/product/:brand/:productId" -ForegroundColor Cyan
} else {
    Write-Host "[PROBLEM] Both Express and IIS do NOT return meta tags" -ForegroundColor Red
}

Write-Host ""

