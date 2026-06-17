# تست مستقیم Express روی سرور (بدون HTTPS)
Write-Host "`n=== تست سرور Express (localhost) ===" -ForegroundColor Cyan

# تنظیم TLS برای حل مشکل SSL
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "`n1. تست Route Test:" -ForegroundColor Yellow
try {
    $test = Invoke-WebRequest -Uri "http://localhost:4000/api/test" -UseBasicParsing
    Write-Host "   [OK] Status: $($test.StatusCode)" -ForegroundColor Green
    Write-Host "   [OK] Express server کار می‌کند" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] خطا: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. تست Route محصول (toyota/996):" -ForegroundColor Yellow
try {
    $product = Invoke-WebRequest -Uri "http://localhost:4000/api/product/toyota/996" -UseBasicParsing
    Write-Host "   [OK] Status: $($product.StatusCode)" -ForegroundColor Green
    Write-Host "   [OK] Content-Type: $($product.Headers['Content-Type'])" -ForegroundColor Green
    
    $content = $product.Content
    
    Write-Host "`n   بررسی متاتگ‌ها:" -ForegroundColor Cyan
    
    $checks = @{
        "product_id" = $content -match 'name="product_id"'
        "product_name" = $content -match 'name="product_name"'
        "product_price" = $content -match 'name="product_price"'
        "availability" = $content -match 'name="availability"'
        "og:title" = $content -match 'property="og:title"'
        "og:image" = $content -match 'property="og:image"'
        "canonical" = $content -match 'rel="canonical"'
    }
    
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Host "   [OK] $($check.Key)" -ForegroundColor Green
        } else {
            Write-Host "   [FAIL] $($check.Key)" -ForegroundColor Red
        }
    }
    
    # نمایش نمونه متاتگ‌ها
    if ($content -match 'name="product_id"') {
        $match = [regex]::Match($content, 'name="product_id" content="([^"]+)"')
        if ($match.Success) {
            $productId = $match.Groups[1].Value
            Write-Host "`n   نمونه product_id: $productId" -ForegroundColor Cyan
        }
    }
    
    # اگر متاتگ‌ها موجود نیستند، نمایش بخشی از HTML
    if (-not ($content -match 'product_id')) {
        Write-Host "`n   ⚠️ متاتگ‌ها موجود نیستند!" -ForegroundColor Yellow
        Write-Host "   اولین 500 کاراکتر HTML:" -ForegroundColor Yellow
        Write-Host $content.Substring(0, [Math]::Min(500, $content.Length)) -ForegroundColor Gray
    }
    
} catch {
    Write-Host "   [FAIL] خطا: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   جزئیات: $($_.Exception)" -ForegroundColor Red
}

Write-Host "`n3. تست Route محصول با /html:" -ForegroundColor Yellow
try {
    $productHtml = Invoke-WebRequest -Uri "http://localhost:4000/api/product/toyota/996/html" -UseBasicParsing
    Write-Host "   [OK] Status: $($productHtml.StatusCode)" -ForegroundColor Green
    Write-Host "   [OK] Content-Type: $($productHtml.Headers['Content-Type'])" -ForegroundColor Green
    
    $hasProductId = $productHtml.Content -match 'product_id'
    if ($hasProductId) {
        Write-Host "   [OK] متاتگ product_id موجود است" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] متاتگ product_id موجود نیست" -ForegroundColor Red
    }
} catch {
    Write-Host "   [FAIL] خطا: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ تست کامل شد!" -ForegroundColor Green
Write-Host "`nنکته: اگر متاتگ‌ها در localhost موجود هستند اما در production نیستند،" -ForegroundColor Yellow
Write-Host "      مشکل از IIS rewrite rule است." -ForegroundColor Yellow

