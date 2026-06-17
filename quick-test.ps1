# تست سریع متاتگ‌ها
Write-Host "`n=== تست Route اصلی ===" -ForegroundColor Cyan
$url = "https://lent-shop.ir/product/toyota/996"
try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Green
    
    $content = $response.Content
    
    Write-Host "`n=== بررسی متاتگ‌ها ===" -ForegroundColor Yellow
    
    # متاتگ‌های ترب
    if ($content -match 'name="product_id"') {
        Write-Host "[OK] product_id موجود است" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] product_id موجود نیست" -ForegroundColor Red
    }
    
    if ($content -match 'name="product_name"') {
        Write-Host "[OK] product_name موجود است" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] product_name موجود نیست" -ForegroundColor Red
    }
    
    if ($content -match 'name="product_price"') {
        Write-Host "[OK] product_price موجود است" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] product_price موجود نیست" -ForegroundColor Red
    }
    
    if ($content -match 'name="availability"') {
        Write-Host "[OK] availability موجود است" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] availability موجود نیست" -ForegroundColor Red
    }
    
    # Open Graph
    if ($content -match 'property="og:title"') {
        Write-Host "[OK] og:title موجود است" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] og:title موجود نیست" -ForegroundColor Red
    }
    
    if ($content -match 'property="og:image"') {
        Write-Host "[OK] og:image موجود است" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] og:image موجود نیست" -ForegroundColor Red
    }
    
    # SEO
    if ($content -match 'rel="canonical"') {
        Write-Host "[OK] canonical موجود است" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] canonical موجود نیست" -ForegroundColor Red
    }
    
} catch {
    Write-Host "[ERROR] خطا: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== تست Route API ===" -ForegroundColor Cyan
$apiUrl = "https://lent-shop.ir/api/product/toyota/996"
try {
    $apiResponse = Invoke-WebRequest -Uri $apiUrl -UseBasicParsing
    Write-Host "Status: $($apiResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Content-Type: $($apiResponse.Headers['Content-Type'])" -ForegroundColor Green
    
    if ($apiResponse.Headers['Content-Type'] -like "*text/html*") {
        Write-Host "[OK] Route API HTML برمی‌گرداند" -ForegroundColor Green
        
        if ($apiResponse.Content -match 'product_id') {
            Write-Host "[OK] متاتگ product_id در API موجود است" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] متاتگ product_id در API موجود نیست" -ForegroundColor Red
        }
    } else {
        Write-Host "[FAIL] Route API HTML برنمی‌گرداند!" -ForegroundColor Red
    }
    
} catch {
    Write-Host "[ERROR] خطا: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== تست با User-Agent ترب ===" -ForegroundColor Cyan
try {
    $headers = @{
        "User-Agent" = "Mozilla/5.0 (compatible; TorobBot/1.0)"
    }
    $torobResponse = Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing
    if ($torobResponse.Content -match 'product_id') {
        Write-Host "[OK] متاتگ‌ها برای ترب موجود هستند" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] متاتگ‌ها برای ترب موجود نیستند" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] خطا: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ تست کامل شد!" -ForegroundColor Green

