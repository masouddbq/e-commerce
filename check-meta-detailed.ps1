# بررسی دقیق متاتگ‌ها

Write-Host "`n=== بررسی دقیق متاتگ‌ها ===" -ForegroundColor Cyan

# تست 1: Route API
Write-Host "`n1. تست Route API (/api/product/toyota/996):" -ForegroundColor Yellow
$apiHtml = curl.exe -s https://lent-shop.ir/api/product/toyota/996

Write-Host "   طول HTML: $($apiHtml.Length) کاراکتر" -ForegroundColor Gray

# بررسی product_id
if ($apiHtml -match 'name="product_id"') {
    $match = [regex]::Match($apiHtml, 'name="product_id" content="([^"]+)"')
    if ($match.Success) {
        Write-Host "   [OK] product_id موجود است: $($match.Groups[1].Value)" -ForegroundColor Green
    } else {
        Write-Host "   [OK] product_id موجود است (اما مقدار پیدا نشد)" -ForegroundColor Green
    }
} else {
    Write-Host "   [FAIL] product_id موجود نیست" -ForegroundColor Red
    Write-Host "   `n   بررسی اینکه آیا HTML از Express آمده..." -ForegroundColor Yellow
    if ($apiHtml -match 'id="root"') {
        Write-Host "   [WARNING] HTML از frontend آمده (React app)" -ForegroundColor Yellow
        Write-Host "   این یعنی درخواست به Express نمی‌رسد!" -ForegroundColor Red
    }
}

# تست 2: Route اصلی
Write-Host "`n2. تست Route اصلی (/product/toyota/996):" -ForegroundColor Yellow
$mainHtml = curl.exe -s https://lent-shop.ir/product/toyota/996

Write-Host "   طول HTML: $($mainHtml.Length) کاراکتر" -ForegroundColor Gray

if ($mainHtml -match 'name="product_id"') {
    Write-Host "   [OK] product_id موجود است" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] product_id موجود نیست" -ForegroundColor Red
    if ($mainHtml -match 'id="root"') {
        Write-Host "   [WARNING] HTML از frontend آمده" -ForegroundColor Yellow
    }
}

# تست 3: تست مستقیم Express
Write-Host "`n3. تست مستقیم Express (localhost:4000):" -ForegroundColor Yellow
try {
    $expressHtml = curl.exe -s http://localhost:4000/api/product/toyota/996
    if ($expressHtml -match 'name="product_id"') {
        Write-Host "   [OK] product_id در Express موجود است" -ForegroundColor Green
        Write-Host "   [INFO] Express کار می‌کند اما IIS rewrite rule کار نمی‌کند!" -ForegroundColor Yellow
    } else {
        Write-Host "   [FAIL] product_id در Express هم موجود نیست" -ForegroundColor Red
    }
} catch {
    Write-Host "   [FAIL] Express در دسترس نیست" -ForegroundColor Red
}

Write-Host "`n✅ بررسی کامل شد!" -ForegroundColor Green

