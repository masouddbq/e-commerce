# 🧪 راهنمای کامل تست متاتگ‌ها و Routeهای API

این راهنما به شما کمک می‌کند تا مطمئن شوید که:
- ✅ متاتگ‌ها در HTML خام (بدون JavaScript) موجود هستند
- ✅ Routeهای API با GET method کار می‌کنند
- ✅ HTML با متاتگ‌های کامل برمی‌گردانند
- ✅ متاتگ‌ها برای ترب و SEO کامل هستند

---

## 📋 پیش‌نیازها

قبل از شروع تست، مطمئن شوید:
1. سرور Express در حال اجرا است (`http://localhost:4000`)
2. IIS یا سرور production در حال اجرا است
3. یک محصول نمونه در دیتابیس دارید (مثلاً: `product/toyota/996`)

---

## 🔍 روش‌های تست

### 1️⃣ تست با PowerShell (Windows)

#### الف) تست Route اصلی `/product/:brand/:productId`

```powershell
# تست ساده - بررسی وجود متاتگ product_id
$response = Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -UseBasicParsing
$content = $response.Content

# بررسی متاتگ‌های ترب
Write-Host "=== بررسی متاتگ‌های ترب ===" -ForegroundColor Green
$content | Select-String "product_id"
$content | Select-String "product_name"
$content | Select-String "product_price"
$content | Select-String "availability"

# بررسی متاتگ‌های Open Graph
Write-Host "`n=== بررسی متاتگ‌های Open Graph ===" -ForegroundColor Green
$content | Select-String "og:title"
$content | Select-String "og:description"
$content | Select-String "og:type"
$content | Select-String "og:url"
$content | Select-String "og:image"

# بررسی متاتگ‌های SEO
Write-Host "`n=== بررسی متاتگ‌های SEO ===" -ForegroundColor Green
$content | Select-String "<title>"
$content | Select-String 'name="description"'
$content | Select-String "canonical"
```

#### ب) تست Route API `/api/product/:brand/:productId`

```powershell
# تست Route API
$response = Invoke-WebRequest -Uri "https://lent-shop.ir/api/product/toyota/996" -UseBasicParsing
$content = $response.Content

# بررسی Content-Type
Write-Host "Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Cyan

# بررسی متاتگ‌ها
$content | Select-String "product_id"
$content | Select-String "og:title"
```

#### ج) تست با User-Agent ترب

```powershell
# شبیه‌سازی درخواست ترب
$headers = @{
    "User-Agent" = "Mozilla/5.0 (compatible; TorobBot/1.0)"
}
$response = Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -Headers $headers -UseBasicParsing
$content = $response.Content

# بررسی متاتگ‌ها
Write-Host "=== تست با User-Agent ترب ===" -ForegroundColor Yellow
$content | Select-String "product_id"
```

#### د) تست کامل - نمایش همه متاتگ‌ها

```powershell
# تابع تست کامل
function Test-ProductMetaTags {
    param(
        [string]$Brand = "toyota",
        [string]$ProductId = "996"
    )
    
    Write-Host "`n🧪 تست متاتگ‌های محصول: $Brand/$ProductId" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Cyan
    
    # تست Route اصلی
    Write-Host "`n1️⃣ تست Route اصلی: /product/$Brand/$ProductId" -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri "https://lent-shop.ir/product/$Brand/$ProductId" -UseBasicParsing
        $content = $response.Content
        
        # بررسی متاتگ‌های ترب
        $torobTags = @(
            "product_id",
            "product_name",
            "product_price",
            "product_old_price",
            "availability"
        )
        
        Write-Host "`n✅ متاتگ‌های ترب:" -ForegroundColor Green
        foreach ($tag in $torobTags) {
            $found = $content -match "name=`"$tag`""
            if ($found) {
                $match = [regex]::Match($content, "<meta name=`"$tag`" content=`"([^`"]+)`"")
                Write-Host "  ✓ $tag : $($match.Groups[1].Value)" -ForegroundColor Green
            } else {
                Write-Host "  ✗ $tag : یافت نشد!" -ForegroundColor Red
            }
        }
        
        # بررسی Open Graph
        $ogTags = @("og:title", "og:description", "og:type", "og:url", "og:image")
        Write-Host "`n✅ متاتگ‌های Open Graph:" -ForegroundColor Green
        foreach ($tag in $ogTags) {
            $found = $content -match "property=`"$tag`""
            if ($found) {
                $match = [regex]::Match($content, "<meta property=`"$tag`" content=`"([^`"]+)`"")
                Write-Host "  ✓ $tag : $($match.Groups[1].Value.Substring(0, [Math]::Min(50, $match.Groups[1].Value.Length)))..." -ForegroundColor Green
            } else {
                Write-Host "  ✗ $tag : یافت نشد!" -ForegroundColor Red
            }
        }
        
        # بررسی SEO
        Write-Host "`n✅ متاتگ‌های SEO:" -ForegroundColor Green
        $titleMatch = [regex]::Match($content, "<title>([^<]+)</title>")
        if ($titleMatch.Success) {
            Write-Host "  ✓ title : $($titleMatch.Groups[1].Value)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ title : یافت نشد!" -ForegroundColor Red
        }
        
        $descMatch = [regex]::Match($content, '<meta name="description" content="([^"]+)"')
        if ($descMatch.Success) {
            Write-Host "  ✓ description : $($descMatch.Groups[1].Value.Substring(0, [Math]::Min(50, $descMatch.Groups[1].Value.Length)))..." -ForegroundColor Green
        } else {
            Write-Host "  ✗ description : یافت نشد!" -ForegroundColor Red
        }
        
        $canonicalMatch = [regex]::Match($content, '<link rel="canonical" href="([^"]+)"')
        if ($canonicalMatch.Success) {
            Write-Host "  ✓ canonical : $($canonicalMatch.Groups[1].Value)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ canonical : یافت نشد!" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "  ✗ خطا: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # تست Route API
    Write-Host "`n2️⃣ تست Route API: /api/product/$Brand/$ProductId" -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri "https://lent-shop.ir/api/product/$Brand/$ProductId" -UseBasicParsing
        $contentType = $response.Headers['Content-Type']
        Write-Host "  ✓ Content-Type: $contentType" -ForegroundColor Green
        
        if ($contentType -like "*text/html*") {
            Write-Host "  ✓ نوع پاسخ: HTML (درست)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ نوع پاسخ: $contentType (باید text/html باشد)" -ForegroundColor Red
        }
        
        $content = $response.Content
        if ($content -match "product_id") {
            Write-Host "  ✓ متاتگ product_id موجود است" -ForegroundColor Green
        } else {
            Write-Host "  ✗ متاتگ product_id موجود نیست!" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "  ✗ خطا: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# اجرای تست
Test-ProductMetaTags -Brand "toyota" -ProductId "996"
```

---

### 2️⃣ تست با curl (Linux/Mac/Windows)

```bash
# تست Route اصلی
curl -s "https://lent-shop.ir/product/toyota/996" | grep -E "(product_id|og:title|og:description)"

# تست Route API
curl -s "https://lent-shop.ir/api/product/toyota/996" -H "Accept: text/html" | grep "product_id"

# تست با User-Agent ترب
curl -s "https://lent-shop.ir/product/toyota/996" \
  -H "User-Agent: Mozilla/5.0 (compatible; TorobBot/1.0)" \
  | grep "product_id"

# نمایش کامل HTML (برای بررسی دستی)
curl -s "https://lent-shop.ir/product/toyota/996" > product_page.html
```

---

### 3️⃣ تست با مرورگر (بدون JavaScript)

#### الف) Chrome/Edge

1. باز کردن Developer Tools (F12)
2. رفتن به تب **Network**
3. کلیک راست روی صفحه → **Inspect**
4. رفتن به تب **Network** → فعال کردن **Disable cache**
5. رفتن به تب **Settings** (⚙️) → فعال کردن **Disable JavaScript**
6. رفرش صفحه (F5)
7. کلیک راست روی صفحه → **View Page Source** (Ctrl+U)
8. جستجوی `product_id` در source

#### ب) Firefox

1. باز کردن Developer Tools (F12)
2. رفتن به تب **Settings** (⚙️)
3. فعال کردن **Disable JavaScript**
4. رفرش صفحه (F5)
5. کلیک راست → **View Page Source** (Ctrl+U)
6. جستجوی `product_id` در source

---

### 4️⃣ تست با ابزارهای آنلاین

#### الف) Google Rich Results Test
```
https://search.google.com/test/rich-results
```
- URL محصول را وارد کنید
- بررسی کنید که متاتگ‌های Open Graph نمایش داده می‌شوند

#### ب) Facebook Sharing Debugger
```
https://developers.facebook.com/tools/debug/
```
- URL محصول را وارد کنید
- بررسی کنید که `og:title`, `og:description`, `og:image` نمایش داده می‌شوند

#### ج) Twitter Card Validator
```
https://cards-dev.twitter.com/validator
```
- URL محصول را وارد کنید
- بررسی کنید که متاتگ‌ها نمایش داده می‌شوند

---

### 5️⃣ تست مستقیم با Node.js

```javascript
// test-meta-tags.js
const https = require('https');

function testProductMetaTags(brand, productId) {
  const url = `https://lent-shop.ir/product/${brand}/${productId}`;
  
  https.get(url, (res) => {
    let html = '';
    
    res.on('data', (chunk) => {
      html += chunk;
    });
    
    res.on('end', () => {
      console.log('=== تست متاتگ‌های ترب ===');
      console.log('product_id:', html.includes('name="product_id"') ? '✓' : '✗');
      console.log('product_name:', html.includes('name="product_name"') ? '✓' : '✗');
      console.log('product_price:', html.includes('name="product_price"') ? '✓' : '✗');
      console.log('availability:', html.includes('name="availability"') ? '✓' : '✗');
      
      console.log('\n=== تست متاتگ‌های Open Graph ===');
      console.log('og:title:', html.includes('property="og:title"') ? '✓' : '✗');
      console.log('og:description:', html.includes('property="og:description"') ? '✓' : '✗');
      console.log('og:type:', html.includes('property="og:type"') ? '✓' : '✗');
      console.log('og:url:', html.includes('property="og:url"') ? '✓' : '✗');
      console.log('og:image:', html.includes('property="og:image"') ? '✓' : '✗');
      
      console.log('\n=== تست متاتگ‌های SEO ===');
      console.log('title:', html.includes('<title>') ? '✓' : '✗');
      console.log('description:', html.includes('name="description"') ? '✓' : '✗');
      console.log('canonical:', html.includes('rel="canonical"') ? '✓' : '✗');
    });
  }).on('error', (err) => {
    console.error('خطا:', err.message);
  });
}

// اجرای تست
testProductMetaTags('toyota', '996');
```

اجرا:
```bash
node test-meta-tags.js
```

---

## ✅ چک‌لیست تست

قبل از ارسال به ترب، این موارد را بررسی کنید:

### متاتگ‌های ترب (اجباری)
- [ ] `product_id` موجود است
- [ ] `product_name` موجود است
- [ ] `product_price` موجود است (فقط عدد)
- [ ] `product_old_price` موجود است (فقط عدد)
- [ ] `availability` موجود است (`instock` یا `outofstock`)
- [ ] `guarantee` موجود است (در صورت وجود)

### متاتگ‌های Open Graph (برای SEO)
- [ ] `og:title` موجود است
- [ ] `og:description` موجود است
- [ ] `og:type` = `product`
- [ ] `og:url` موجود است
- [ ] `og:image` موجود است
- [ ] `og:locale` = `fa_IR`

### متاتگ‌های SEO
- [ ] `<title>` موجود است
- [ ] `meta name="description"` موجود است
- [ ] `link rel="canonical"` موجود است

### Routeهای API
- [ ] `/api/product/:brand/:productId` با GET کار می‌کند
- [ ] Content-Type = `text/html; charset=utf-8`
- [ ] HTML با متاتگ‌ها برمی‌گرداند (نه JSON)

---

## 🐛 رفع مشکلات

### مشکل: متاتگ‌ها در View Source نیستند

**راه‌حل:**
1. بررسی کنید که IIS rewrite rule فعال است
2. بررسی کنید که سرور Express در حال اجرا است
3. Cache مرورگر را پاک کنید (Ctrl+Shift+Delete)
4. تست با User-Agent ترب انجام دهید

### مشکل: Route API JSON برمی‌گرداند

**راه‌حل:**
1. بررسی کنید که route درست است: `/api/product/:brand/:productId`
2. بررسی کنید که Content-Type = `text/html` است
3. بررسی کنید که در صورت خطا، HTML برمی‌گرداند (نه JSON)

### مشکل: متاتگ‌ها در HTML نیستند

**راه‌حل:**
1. بررسی کنید که فایل `index.html` در `dist/` موجود است
2. بررسی کنید که route متاتگ‌ها را به `</head>` اضافه می‌کند
3. لاگ‌های سرور را بررسی کنید

---

## 📝 نمونه خروجی موفق

```html
<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <!-- ... سایر متاتگ‌ها ... -->
    
    <!-- Torob Meta Tags -->
    <meta name="product_id" content="996">
    <meta name="product_name" content="لنت ترمز جلو تویوتا کمری">
    <meta name="product_price" content="1580000">
    <meta name="product_old_price" content="1800000">
    <meta name="availability" content="instock">
    <meta name="guarantee" content="18 ماه">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="لنت ترمز جلو تویوتا کمری | تویوتا | لنت شاپ">
    <meta property="og:description" content="لنت ترمز جلو تویوتا کمری - خرید لنت ترمز تویوتا با کیفیت عالی">
    <meta property="og:type" content="product">
    <meta property="og:url" content="https://lent-shop.ir/product/toyota/996">
    <meta property="og:image" content="https://lent-shop.ir/images/product.jpg">
    <meta property="og:locale" content="fa_IR">
    <meta property="og:site_name" content="لنت شاپ">
    
    <!-- SEO Meta Tags -->
    <title>لنت ترمز جلو تویوتا کمری | تویوتا | لنت شاپ</title>
    <meta name="description" content="لنت ترمز جلو تویوتا کمری - خرید لنت ترمز تویوتا با کیفیت عالی">
    <meta name="keywords" content="لنت تویوتا, لنت ترمز جلو تویوتا کمری, لنت ترمز تویوتا, دیسکی, لنت شاپ">
    <link rel="canonical" href="https://lent-shop.ir/product/toyota/996">
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

---

## 🎯 تست نهایی برای ترب

پس از اطمینان از همه موارد بالا، این تست نهایی را انجام دهید:

```powershell
# تست کامل با User-Agent ترب
$headers = @{
    "User-Agent" = "Mozilla/5.0 (compatible; TorobBot/1.0)"
    "Accept" = "text/html"
}
$response = Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -Headers $headers -UseBasicParsing
$content = $response.Content

# بررسی همه متاتگ‌ها
$checks = @{
    "product_id" = $content -match 'name="product_id"'
    "product_name" = $content -match 'name="product_name"'
    "product_price" = $content -match 'name="product_price"'
    "availability" = $content -match 'name="availability"'
    "og:title" = $content -match 'property="og:title"'
    "og:description" = $content -match 'property="og:description"'
    "og:image" = $content -match 'property="og:image"'
    "canonical" = $content -match 'rel="canonical"'
}

Write-Host "`n=== نتیجه تست نهایی ===" -ForegroundColor Cyan
foreach ($check in $checks.GetEnumerator()) {
    if ($check.Value) {
        Write-Host "✅ $($check.Key): موجود" -ForegroundColor Green
    } else {
        Write-Host "❌ $($check.Key): موجود نیست!" -ForegroundColor Red
    }
}

# اگر همه چک‌ها موفق بودند
if ($checks.Values -notcontains $false) {
    Write-Host "`n🎉 همه متاتگ‌ها موجود هستند! آماده برای ترب." -ForegroundColor Green
} else {
    Write-Host "`n⚠️ برخی متاتگ‌ها موجود نیستند. لطفاً مشکلات را برطرف کنید." -ForegroundColor Yellow
}
```

---

## 📞 پشتیبانی

اگر مشکلی دارید:
1. لاگ‌های سرور را بررسی کنید: `.cursor/debug.log`
2. بررسی کنید که سرور Express در حال اجرا است
3. بررسی کنید که IIS rewrite rules درست تنظیم شده‌اند

