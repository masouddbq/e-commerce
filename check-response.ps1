# Check Response Details
# Run this on Windows Server

Write-Host ""
Write-Host "=== Checking Response Details ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Get full response
Write-Host "[1] Getting full response from IIS..." -ForegroundColor Yellow
$result = curl.exe -s https://lent-shop.ir/product/toyota/996

Write-Host "Response length: $($result.Length)" -ForegroundColor Cyan
Write-Host ""

# Show first 200 characters
Write-Host "First 200 characters:" -ForegroundColor Yellow
if ($result.Length -gt 0) {
    Write-Host $result.Substring(0, [Math]::Min(200, $result.Length)) -ForegroundColor White
} else {
    Write-Host "(Empty response)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Check for specific patterns
Write-Host "[2] Checking for specific patterns..." -ForegroundColor Yellow

if ($result -match 'product_id') {
    Write-Host "[OK] product_id found" -ForegroundColor Green
} else {
    Write-Host "[FAIL] product_id NOT found" -ForegroundColor Red
}

if ($result -match '<div id="root">') {
    Write-Host "[INFO] React SPA HTML found" -ForegroundColor Yellow
}

if ($result -match '<html') {
    Write-Host "[INFO] HTML tag found" -ForegroundColor Cyan
} else {
    Write-Host "[WARN] No HTML tag found" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Compare with Express
Write-Host "[3] Comparing with Express direct..." -ForegroundColor Yellow
$expressResult = curl.exe -s http://localhost:4000/api/product/toyota/996

Write-Host "Express response length: $($expressResult.Length)" -ForegroundColor Cyan
Write-Host "IIS response length: $($result.Length)" -ForegroundColor Cyan

if ($expressResult.Length -eq $result.Length) {
    Write-Host "[OK] Response lengths match!" -ForegroundColor Green
} else {
    Write-Host "[WARN] Response lengths differ!" -ForegroundColor Yellow
    Write-Host "     Difference: $($expressResult.Length - $result.Length) characters" -ForegroundColor Cyan
}

Write-Host ""

# Test 4: Check headers
Write-Host "[4] Checking headers..." -ForegroundColor Yellow
$headers = curl.exe -I https://lent-shop.ir/product/toyota/996 2>&1 | Out-String

if ($headers -match 'X-SSR') {
    Write-Host "[OK] X-SSR header found" -ForegroundColor Green
    $headers | Select-String "X-SSR"
} else {
    Write-Host "[FAIL] X-SSR header NOT found" -ForegroundColor Red
    Write-Host "     IIS is NOT forwarding to Express!" -ForegroundColor Yellow
}

Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""

if ($result.Length -lt 100) {
    Write-Host "[PROBLEM] Response is too short ($($result.Length) characters)" -ForegroundColor Red
    Write-Host "     IIS is NOT forwarding to Express" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Check:" -ForegroundColor Cyan
    Write-Host "  1. Rule order in IIS Manager" -ForegroundColor White
    Write-Host "  2. Application Pool status" -ForegroundColor White
    Write-Host "  3. web.config syntax" -ForegroundColor White
} elseif ($result -match 'product_id') {
    Write-Host "[SUCCESS] Meta tags found in response!" -ForegroundColor Green
} else {
    Write-Host "[PROBLEM] Response exists but no meta tags" -ForegroundColor Yellow
    Write-Host "     Check if React SPA is being served instead" -ForegroundColor Yellow
}

Write-Host ""

