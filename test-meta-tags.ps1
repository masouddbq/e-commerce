# اسکریپت تست متاتگ‌های محصول برای ترب
# استفاده: .\test-meta-tags.ps1 -Brand "toyota" -ProductId "996"

param(
    [string]$Brand = "toyota",
    [string]$ProductId = "996",
    [string]$BaseUrl = "https://lent-shop.ir"
)

Write-Host "`n🧪 تست متاتگ‌های محصول: $Brand/$ProductId" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan

# رنگ‌ها
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Cyan = "Cyan"

# تابع بررسی متاتگ
function Test-MetaTag {
    param(
        [string]$Content,
        [string]$Pattern,
        [string]$TagName
    )
    
    if ($Content -match $Pattern) {
        $match = [regex]::Match($Content, $Pattern)
        $value = if ($match.Groups.Count -gt 1) { $match.Groups[1].Value } else { "موجود" }
        $displayValue = if ($value.Length -gt 60) { $value.Substring(0, 60) + "..." } else { $value }
        Write-Host "  ✓ $TagName : $displayValue" -ForegroundColor $Green
        return $true
    } else {
        Write-Host "  ✗ $TagName : یافت نشد!" -ForegroundColor $Red
        return $false
    }
}

# تست Route اصلی
Write-Host "`n1️⃣ تست Route اصلی: /product/$Brand/$ProductId" -ForegroundColor $Cyan
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/product/$Brand/$ProductId" -UseBasicParsing -ErrorAction Stop
    $content = $response.Content
    $statusCode = $response.StatusCode
    
    Write-Host "  ✓ Status Code: $statusCode" -ForegroundColor $Green
    Write-Host "  ✓ Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor $Green
    Write-Host "  ✓ Content Length: $($content.Length) bytes" -ForegroundColor $Green
    
    # بررسی متاتگ‌های ترب
    Write-Host "`n  📋 متاتگ‌های ترب:" -ForegroundColor $Yellow
    $torobResults = @{
        "product_id" = Test-MetaTag $content 'name="product_id" content="([^"]+)"' "product_id"
        "product_name" = Test-MetaTag $content 'name="product_name" content="([^"]+)"' "product_name"
        "product_price" = Test-MetaTag $content 'name="product_price" content="([^"]+)"' "product_price"
        "product_old_price" = Test-MetaTag $content 'name="product_old_price" content="([^"]+)"' "product_old_price"
        "availability" = Test-MetaTag $content 'name="availability" content="([^"]+)"' "availability"
    }
    
    # بررسی guarantee (اختیاری)
    if ($content -match 'name="guarantee"') {
        Test-MetaTag $content 'name="guarantee" content="([^"]+)"' "guarantee" | Out-Null
    } else {
        Write-Host "  ℹ guarantee : موجود نیست (اختیاری)" -ForegroundColor Gray
    }
    
    # بررسی متاتگ‌های Open Graph
    Write-Host "`n  📋 متاتگ‌های Open Graph:" -ForegroundColor $Yellow
    $ogResults = @{
        "og:title" = Test-MetaTag $content 'property="og:title" content="([^"]+)"' "og:title"
        "og:description" = Test-MetaTag $content 'property="og:description" content="([^"]+)"' "og:description"
        "og:type" = Test-MetaTag $content 'property="og:type" content="([^"]+)"' "og:type"
        "og:url" = Test-MetaTag $content 'property="og:url" content="([^"]+)"' "og:url"
        "og:image" = Test-MetaTag $content 'property="og:image" content="([^"]+)"' "og:image"
        "og:locale" = Test-MetaTag $content 'property="og:locale" content="([^"]+)"' "og:locale"
    }
    
    # بررسی متاتگ‌های SEO
    Write-Host "`n  📋 متاتگ‌های SEO:" -ForegroundColor $Yellow
    $seoResults = @{
        "title" = Test-MetaTag $content '<title>([^<]+)</title>' "title"
        "description" = Test-MetaTag $content 'name="description" content="([^"]+)"' "description"
        "canonical" = Test-MetaTag $content 'rel="canonical" href="([^"]+)"' "canonical"
    }
    
    # خلاصه نتایج
    $allResults = $torobResults.Values + $ogResults.Values + $seoResults.Values
    $successCount = ($allResults | Where-Object { $_ -eq $true }).Count
    $totalCount = $allResults.Count
    
    Write-Host "`n  📊 خلاصه:" -ForegroundColor $Cyan
    Write-Host "    موفق: $successCount / $totalCount" -ForegroundColor $(if ($successCount -eq $totalCount) { $Green } else { $Yellow })
    
} catch {
    Write-Host "  ✗ خطا در دریافت صفحه: $($_.Exception.Message)" -ForegroundColor $Red
    return
}

# تست Route API
Write-Host "`n2️⃣ تست Route API: /api/product/$Brand/$ProductId" -ForegroundColor $Cyan
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/product/$Brand/$ProductId" -UseBasicParsing -ErrorAction Stop
    $contentType = $response.Headers['Content-Type']
    $statusCode = $response.StatusCode
    
    Write-Host "  ✓ Status Code: $statusCode" -ForegroundColor $Green
    Write-Host "  ✓ Content-Type: $contentType" -ForegroundColor $Green
    
    if ($contentType -like "*text/html*") {
        Write-Host "  ✓ نوع پاسخ: HTML (درست)" -ForegroundColor $Green
        
        $content = $response.Content
        if ($content -match 'name="product_id"') {
            Write-Host "  ✓ متاتگ product_id موجود است" -ForegroundColor $Green
        } else {
            Write-Host "  ✗ متاتگ product_id موجود نیست!" -ForegroundColor $Red
        }
    } else {
        Write-Host "  ✗ نوع پاسخ: $contentType (باید text/html باشد)" -ForegroundColor $Red
    }
    
} catch {
    Write-Host "  ✗ خطا: $($_.Exception.Message)" -ForegroundColor $Red
}

# تست با User-Agent ترب
Write-Host "`n3️⃣ تست با User-Agent ترب" -ForegroundColor $Cyan
try {
    $headers = @{
        "User-Agent" = "Mozilla/5.0 (compatible; TorobBot/1.0)"
        "Accept" = "text/html"
    }
    $response = Invoke-WebRequest -Uri "$BaseUrl/product/$Brand/$ProductId" -Headers $headers -UseBasicParsing -ErrorAction Stop
    $content = $response.Content
    
    if ($content -match 'name="product_id"') {
        Write-Host "  ✓ متاتگ product_id برای ترب موجود است" -ForegroundColor $Green
    } else {
        Write-Host "  ✗ متاتگ product_id برای ترب موجود نیست!" -ForegroundColor $Red
    }
    
} catch {
    Write-Host "  ✗ خطا: $($_.Exception.Message)" -ForegroundColor $Red
}

# نتیجه نهایی
Write-Host "`n" + "=" * 70 -ForegroundColor $Cyan
Write-Host "✅ تست کامل شد!" -ForegroundColor $Green
Write-Host "`nبرای راهنمای کامل، به فایل TOROB_TESTING_GUIDE.md مراجعه کنید." -ForegroundColor $Cyan

