# تست ساده متاتگ‌ها

Write-Host "`n=== تست 1: بررسی متاتگ‌ها از Route API ===" -ForegroundColor Cyan

# دریافت HTML
$html = curl.exe -s https://lent-shop.ir/api/product/toyota/996

Write-Host "`nبررسی متاتگ‌های ترب:" -ForegroundColor Yellow

# بررسی هر متاتگ
if ($html -match 'name="product_id"') {
    Write-Host "[OK] product_id" -ForegroundColor Green
} else {
    Write-Host "[FAIL] product_id" -ForegroundColor Red
}

if ($html -match 'name="product_name"') {
    Write-Host "[OK] product_name" -ForegroundColor Green
} else {
    Write-Host "[FAIL] product_name" -ForegroundColor Red
}

if ($html -match 'name="product_price"') {
    Write-Host "[OK] product_price" -ForegroundColor Green
} else {
    Write-Host "[FAIL] product_price" -ForegroundColor Red
}

if ($html -match 'name="product_old_price"') {
    Write-Host "[OK] product_old_price" -ForegroundColor Green
} else {
    Write-Host "[FAIL] product_old_price" -ForegroundColor Red
}

if ($html -match 'name="availability"') {
    Write-Host "[OK] availability" -ForegroundColor Green
} else {
    Write-Host "[FAIL] availability" -ForegroundColor Red
}

if ($html -match 'property="og:title"') {
    Write-Host "[OK] og:title" -ForegroundColor Green
} else {
    Write-Host "[FAIL] og:title" -ForegroundColor Red
}

if ($html -match 'property="og:image"') {
    Write-Host "[OK] og:image" -ForegroundColor Green
} else {
    Write-Host "[FAIL] og:image" -ForegroundColor Red
}

if ($html -match 'rel="canonical"') {
    Write-Host "[OK] canonical" -ForegroundColor Green
} else {
    Write-Host "[FAIL] canonical" -ForegroundColor Red
}

Write-Host "`n=== تست 2: بررسی Route اصلی ===" -ForegroundColor Cyan

$mainHtml = curl.exe -s https://lent-shop.ir/product/toyota/996

if ($mainHtml -match 'name="product_id"') {
    Write-Host "[OK] متاتگ product_id در Route اصلی موجود است" -ForegroundColor Green
} else {
    Write-Host "[FAIL] متاتگ product_id در Route اصلی موجود نیست" -ForegroundColor Red
}

Write-Host "`n✅ تست کامل شد!" -ForegroundColor Green

