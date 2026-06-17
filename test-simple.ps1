# تست ساده Express
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "`n=== تست Express ===" -ForegroundColor Cyan

Write-Host "`n1. تست /api/test:" -ForegroundColor Yellow
try {
    $test = Invoke-WebRequest -Uri "http://localhost:4000/api/test" -UseBasicParsing
    Write-Host "   [OK] Status: $($test.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. تست /api/product/toyota/996:" -ForegroundColor Yellow
try {
    $product = Invoke-WebRequest -Uri "http://localhost:4000/api/product/toyota/996" -UseBasicParsing
    Write-Host "   [OK] Status: $($product.StatusCode)" -ForegroundColor Green
    Write-Host "   [OK] Content-Type: $($product.Headers['Content-Type'])" -ForegroundColor Green
    
    $content = $product.Content
    $hasProductId = $content -match "product_id"
    
    if ($hasProductId) {
        Write-Host "   [OK] product_id موجود است" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] product_id موجود نیست" -ForegroundColor Red
        Write-Host "`n   اولین 400 کاراکتر HTML:" -ForegroundColor Yellow
        Write-Host $content.Substring(0, [Math]::Min(400, $content.Length)) -ForegroundColor Gray
    }
    
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ تست کامل شد!" -ForegroundColor Green

