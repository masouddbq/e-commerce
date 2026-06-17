# تست مستقیم سرور Express
Write-Host "`n=== تست سرور Express (localhost:4000) ===" -ForegroundColor Cyan

try {
    $express = Invoke-WebRequest -Uri "http://localhost:4000/api/product/toyota/996" -UseBasicParsing -TimeoutSec 5
    Write-Host "[OK] سرور Express در حال اجرا است" -ForegroundColor Green
    Write-Host "Status: $($express.StatusCode)" -ForegroundColor Green
    Write-Host "Content-Type: $($express.Headers['Content-Type'])" -ForegroundColor Yellow
    
    if ($express.Content -match 'name="product_id"') {
        Write-Host "[OK] متاتگ product_id در Express موجود است" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] متاتگ product_id در Express موجود نیست" -ForegroundColor Red
        Write-Host "`nاولین 300 کاراکتر HTML:" -ForegroundColor Yellow
        Write-Host $express.Content.Substring(0, [Math]::Min(300, $express.Content.Length))
    }
} catch {
    Write-Host "[FAIL] سرور Express در دسترس نیست" -ForegroundColor Red
    Write-Host "خطا: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nلطفا مطمئن شوید که سرور Express در حال اجرا است:" -ForegroundColor Yellow
    Write-Host "  cd server" -ForegroundColor Gray
    Write-Host "  npm start" -ForegroundColor Gray
}

Write-Host "`n=== تست Production (lent-shop.ir) ===" -ForegroundColor Cyan

try {
    $prod = Invoke-WebRequest -Uri "https://lent-shop.ir/api/product/toyota/996" -UseBasicParsing -TimeoutSec 10
    Write-Host "[OK] Production در دسترس است" -ForegroundColor Green
    Write-Host "Status: $($prod.StatusCode)" -ForegroundColor Green
    Write-Host "Content-Type: $($prod.Headers['Content-Type'])" -ForegroundColor Yellow
    
    if ($prod.Content -match 'name="product_id"') {
        Write-Host "[OK] متاتگ product_id در Production موجود است" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] متاتگ product_id در Production موجود نیست" -ForegroundColor Red
        Write-Host "`nاحتمالا IIS rewrite rule کار نمی کند" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[FAIL] Production در دسترس نیست" -ForegroundColor Red
    Write-Host "خطا: $($_.Exception.Message)" -ForegroundColor Red
}

