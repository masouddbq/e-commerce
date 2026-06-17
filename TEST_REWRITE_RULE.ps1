# تست اینکه آیا rewrite rule کار می‌کند

Write-Host "`n=== تست Rewrite Rule ===" -ForegroundColor Cyan

Write-Host "`n1. بررسی Express (localhost):" -ForegroundColor Yellow
$expressTest = curl.exe -s http://localhost:4000/api/product/toyota/996
if ($expressTest -match 'name="product_id"') {
    Write-Host "   [OK] Express کار می‌کند و متاتگ product_id را برمی‌گرداند" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Express متاتگ product_id را برنمی‌گرداند" -ForegroundColor Red
}

Write-Host "`n2. تست از طریق HTTPS (Route API):" -ForegroundColor Yellow
$apiTest = curl.exe -s https://lent-shop.ir/api/product/toyota/996
if ($apiTest -match 'name="product_id"') {
    Write-Host "   [OK] Route API متاتگ product_id را برمی‌گرداند" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Route API متاتگ product_id را برنمی‌گرداند" -ForegroundColor Red
    if ($apiTest -match 'id="root"') {
        Write-Host "   [WARNING] HTML از frontend آمده (React app)" -ForegroundColor Yellow
    }
}

Write-Host "`n3. تست از طریق HTTPS (Route اصلی):" -ForegroundColor Yellow
$mainTest = curl.exe -s https://lent-shop.ir/product/toyota/996
if ($mainTest -match 'name="product_id"') {
    Write-Host "   [OK] Route اصلی متاتگ product_id را برمی‌گرداند" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Route اصلی متاتگ product_id را برنمی‌گرداند" -ForegroundColor Red
    if ($mainTest -match 'id="root"') {
        Write-Host "   [WARNING] HTML از frontend آمده (React app)" -ForegroundColor Yellow
        Write-Host "   [INFO] این یعنی rewrite rule کار نمی‌کند!" -ForegroundColor Red
    }
}

Write-Host "`n4. بررسی ARR Proxy:" -ForegroundColor Yellow
Write-Host "   لطفاً در IIS Manager بررسی کنید:" -ForegroundColor Cyan
Write-Host "   1. Server level → Application Request Routing" -ForegroundColor Gray
Write-Host "   2. Server Proxy Settings" -ForegroundColor Gray
Write-Host "   3. 'Enable proxy' باید فعال باشد" -ForegroundColor Gray

Write-Host "`n✅ تست کامل شد!" -ForegroundColor Green

