# 🧪 راهنمای سریع تست متاتگ‌ها

## 🚀 شروع سریع

### روش 1: استفاده از اسکریپت PowerShell (پیشنهادی)

```powershell
# اجرای تست با مقادیر پیش‌فرض (toyota/996)
.\test-meta-tags.ps1

# اجرای تست با محصول خاص
.\test-meta-tags.ps1 -Brand "bmw" -ProductId "123"

# اجرای تست با URL سفارشی
.\test-meta-tags.ps1 -Brand "toyota" -ProductId "996" -BaseUrl "http://localhost:4000"
```

### روش 2: تست دستی با PowerShell

```powershell
# تست ساده
$response = Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -UseBasicParsing
$response.Content | Select-String "product_id"
```

### روش 3: تست با مرورگر

1. باز کردن Developer Tools (F12)
2. رفتن به Settings → فعال کردن "Disable JavaScript"
3. رفرش صفحه (F5)
4. View Page Source (Ctrl+U)
5. جستجوی `product_id` در source

---

## 📋 چک‌لیست سریع

قبل از ارسال به ترب، این موارد را بررسی کنید:

- [ ] `product_id` موجود است
- [ ] `product_name` موجود است
- [ ] `product_price` موجود است
- [ ] `availability` موجود است
- [ ] `og:title` موجود است
- [ ] `og:image` موجود است
- [ ] `canonical` موجود است

---

## 📚 مستندات کامل

برای راهنمای کامل و روش‌های پیشرفته تست، به فایل **`TOROB_TESTING_GUIDE.md`** مراجعه کنید.

---

## 🐛 مشکلات رایج

### متاتگ‌ها در View Source نیستند
- Cache مرورگر را پاک کنید
- با User-Agent ترب تست کنید
- بررسی کنید سرور Express در حال اجرا است

### Route API JSON برمی‌گرداند
- بررسی کنید route درست است
- بررسی کنید Content-Type = `text/html` است

---

## ✅ نمونه خروجی موفق

```
🧪 تست متاتگ‌های محصول: toyota/996
======================================================================

1️⃣ تست Route اصلی: /product/toyota/996
  ✓ Status Code: 200
  ✓ Content-Type: text/html; charset=utf-8
  ✓ Content Length: 45231 bytes

  📋 متاتگ‌های ترب:
  ✓ product_id : 996
  ✓ product_name : لنت ترمز جلو تویوتا کمری
  ✓ product_price : 1580000
  ✓ product_old_price : 1800000
  ✓ availability : instock

  📋 متاتگ‌های Open Graph:
  ✓ og:title : لنت ترمز جلو تویوتا کمری | تویوتا | لنت شاپ
  ✓ og:description : لنت ترمز جلو تویوتا کمری - خرید لنت ترمز...
  ✓ og:type : product
  ✓ og:url : https://lent-shop.ir/product/toyota/996
  ✓ og:image : https://lent-shop.ir/images/product.jpg
  ✓ og:locale : fa_IR

  📋 متاتگ‌های SEO:
  ✓ title : لنت ترمز جلو تویوتا کمری | تویوتا | لنت شاپ
  ✓ description : لنت ترمز جلو تویوتا کمری - خرید لنت ترمز...
  ✓ canonical : https://lent-shop.ir/product/toyota/996

  📊 خلاصه:
    موفق: 14 / 14

2️⃣ تست Route API: /api/product/toyota/996
  ✓ Status Code: 200
  ✓ Content-Type: text/html; charset=utf-8
  ✓ نوع پاسخ: HTML (درست)
  ✓ متاتگ product_id موجود است

3️⃣ تست با User-Agent ترب
  ✓ متاتگ product_id برای ترب موجود است

======================================================================
✅ تست کامل شد!
```

