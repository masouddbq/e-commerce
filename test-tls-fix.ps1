# تست TLS 1.2 بعد از اعمال تنظیمات

Write-Host "`n=== تست TLS 1.2 ===" -ForegroundColor Cyan

# تنظیم TLS 1.2 برای جلسه فعلی
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "`n1. تست اتصال HTTPS به lent-shop.ir..." -ForegroundColor Yellow
try {
    $test = Invoke-WebRequest -Uri "https://lent-shop.ir/api/test" -UseBasicParsing -TimeoutSec 10
    Write-Host "   [OK] Status: $($test.StatusCode)" -ForegroundColor Green
    Write-Host "   [OK] اتصال TLS برقرار شد!" -ForegroundColor Green
    Write-Host "   Content: $($test.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   [FAIL] خطا: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Message -match "TLS|SSL") {
        Write-Host "   ⚠️ مشکل TLS/SSL هنوز حل نشده است" -ForegroundColor Yellow
        Write-Host "   لطفاً:" -ForegroundColor Yellow
        Write-Host "   1. سرور را restart کنید" -ForegroundColor Cyan
        Write-Host "   2. یا IIS را restart کنید: iisreset" -ForegroundColor Cyan
    }
}

Write-Host "`n2. تست Route محصول..." -ForegroundColor Yellow
try {
    $product = Invoke-WebRequest -Uri "https://lent-shop.ir/api/product/toyota/996" -UseBasicParsing -TimeoutSec 10
    Write-Host "   [OK] Status: $($product.StatusCode)" -ForegroundColor Green
    Write-Host "   [OK] Content-Type: $($product.Headers['Content-Type'])" -ForegroundColor Green
    
    if ($product.Content -match "product_id") {
        Write-Host "   [OK] متاتگ product_id موجود است!" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] متاتگ product_id موجود نیست" -ForegroundColor Red
    }
} catch {
    Write-Host "   [FAIL] خطا: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. تست Route اصلی محصول..." -ForegroundColor Yellow
try {
    $main = Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -UseBasicParsing -TimeoutSec 10
    Write-Host "   [OK] Status: $($main.StatusCode)" -ForegroundColor Green
    
    if ($main.Content -match "product_id") {
        Write-Host "   [OK] متاتگ product_id در Route اصلی موجود است!" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] متاتگ product_id در Route اصلی موجود نیست" -ForegroundColor Red
    }
} catch {
    Write-Host "   [FAIL] خطا: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ تست کامل شد!" -ForegroundColor Green

