# Final Test - IIS vs Express
# Run this on Windows Server

Write-Host ""
Write-Host "=== Final Test: IIS vs Express ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Express Direct
Write-Host "[1] Testing Express directly..." -ForegroundColor Yellow
$expressResult = curl.exe -s http://localhost:4000/api/product/toyota/996
$expressHasMeta = $expressResult -match 'name="product_id"'

if ($expressHasMeta) {
    Write-Host "[OK] Express returns meta tags!" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Express does NOT return meta tags!" -ForegroundColor Red
}

Write-Host ""

# Test 2: Through IIS
Write-Host "[2] Testing through IIS..." -ForegroundColor Yellow
$iisResult = curl.exe -s https://lent-shop.ir/product/toyota/996
$iisHasMeta = $iisResult -match 'name="product_id"'

if ($iisHasMeta) {
    Write-Host "[OK] IIS returns meta tags!" -ForegroundColor Green
} else {
    Write-Host "[FAIL] IIS does NOT return meta tags!" -ForegroundColor Red
    
    # Check what we got
    if ($iisResult -match '<div id="root">') {
        Write-Host "     [INFO] Response is React SPA (no meta tags)" -ForegroundColor Yellow
        Write-Host "     IIS is NOT forwarding to Express!" -ForegroundColor Red
    } else {
        Write-Host "     [INFO] Response is not React SPA, but also no meta tags" -ForegroundColor Yellow
        Write-Host "     First 500 chars:" -ForegroundColor Cyan
        Write-Host $iisResult.Substring(0, [Math]::Min(500, $iisResult.Length))
    }
}

Write-Host ""

# Test 3: Headers
Write-Host "[3] Checking headers..." -ForegroundColor Yellow
$headers = curl.exe -I https://lent-shop.ir/product/toyota/996 2>&1 | Out-String

if ($headers -match 'X-SSR') {
    Write-Host "[OK] X-SSR header found" -ForegroundColor Green
    $headers | Select-String "X-SSR"
} else {
    Write-Host "[FAIL] X-SSR header NOT found" -ForegroundColor Red
    Write-Host "     IIS is NOT forwarding to Express!" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: Compare lengths
Write-Host "[4] Comparing response lengths..." -ForegroundColor Yellow
$expressLength = $expressResult.Length
$iisLength = $iisResult.Length

Write-Host "     Express response length: $expressLength" -ForegroundColor Cyan
Write-Host "     IIS response length: $iisLength" -ForegroundColor Cyan

if ($expressLength -eq $iisLength) {
    Write-Host "[OK] Response lengths match!" -ForegroundColor Green
} else {
    Write-Host "[WARN] Response lengths differ!" -ForegroundColor Yellow
    Write-Host "     Difference: $($iisLength - $expressLength) characters" -ForegroundColor Cyan
}

Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""

if ($expressHasMeta -and $iisHasMeta) {
    Write-Host "[SUCCESS] Both Express and IIS return meta tags!" -ForegroundColor Green
    Write-Host "Everything is working correctly!" -ForegroundColor Green
} elseif ($expressHasMeta -and -not $iisHasMeta) {
    Write-Host "[PROBLEM] Express works, but IIS does NOT" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Cyan
    Write-Host "  1. IIS Rewrite rule is not executing" -ForegroundColor White
    Write-Host "  2. ARR is modifying the response" -ForegroundColor White
    Write-Host "  3. Another rule is catching the request first" -ForegroundColor White
    Write-Host ""
    Write-Host "Check:" -ForegroundColor Cyan
    Write-Host "  1. IIS Rewrite rules order" -ForegroundColor White
    Write-Host "  2. Server-level rules" -ForegroundColor White
    Write-Host "  3. ARR Proxy settings" -ForegroundColor White
} else {
    Write-Host "[PROBLEM] Express does NOT return meta tags" -ForegroundColor Red
    Write-Host "Check Express route /api/product/:brand/:productId" -ForegroundColor Cyan
}

Write-Host ""

