# بررسی دقیق متاتگ‌ها در HTML

Write-Host "`n=== بررسی متاتگ‌های ترب ===" -ForegroundColor Cyan

# دریافت HTML
$html = curl.exe -s https://lent-shop.ir/api/product/toyota/996

Write-Host "`n1. بررسی متاتگ‌های ترب:" -ForegroundColor Yellow

# بررسی متاتگ‌های ترب
$checks = @{
    "product_id" = $html -match 'name="product_id"'
    "product_name" = $html -match 'name="product_name"'
    "product_price" = $html -match 'name="product_price"'
    "product_old_price" = $html -match 'name="product_old_price"'
    "availability" = $html -match 'name="availability"'
    "og:title" = $html -match 'property="og:title"'
    "og:image" = $html -match 'property="og:image"'
    "canonical" = $html -match 'rel="canonical"'
}

foreach ($check in $checks.GetEnumerator()) {
    if ($check.Value) {
        Write-Host "   [OK] $($check.Key)" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] $($check.Key)" -ForegroundColor Red
    }
}

Write-Host "`n2. بررسی Route اصلی:" -ForegroundColor Yellow
$mainHtml = curl.exe -s https://lent-shop.ir/product/toyota/996

if ($mainHtml -match 'name="product_id"') {
    Write-Host "   [OK] متاتگ product_id در Route اصلی موجود است" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] متاتگ product_id در Route اصلی موجود نیست" -ForegroundColor Red
}

Write-Host "`n3. بررسی اینکه آیا درخواست به Express می‌رسد:" -ForegroundColor Yellow

# بررسی اینکه آیا HTML از Express آمده یا از frontend
if ($html -match 'id="root"') {
    Write-Host "   [WARNING] HTML از frontend آمده (React app)" -ForegroundColor Yellow
    Write-Host "   این یعنی IIS rewrite rule کار نمی‌کند یا route Express اجرا نمی‌شود" -ForegroundColor Yellow
}

if ($html -match 'product_id') {
    Write-Host "   [OK] متاتگ‌ها موجود هستند" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] متاتگ‌ها موجود نیستند" -ForegroundColor Red
    Write-Host "`n   مشکل: درخواست به Express نمی‌رسد یا route اجرا نمی‌شود" -ForegroundColor Red
}

Write-Host "`n4. نمایش بخشی از HTML (اولین 500 کاراکتر):" -ForegroundColor Yellow
Write-Host $html.Substring(0, [Math]::Min(500, $html.Length)) -ForegroundColor Gray

Write-Host "`n✅ بررسی کامل شد!" -ForegroundColor Green

