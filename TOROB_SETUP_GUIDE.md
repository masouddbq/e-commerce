# 📋 راهنمای مرحله به مرحله اتصال به ترب

این راهنما دقیقاً به شما می‌گوید که چه کارهایی باید انجام دهید تا فروشگاه شما به ترب متصل شود.

---

## ✅ مرحله 1: بررسی سرور Express

### 1.1 بررسی اینکه سرور در حال اجرا است

در PowerShell یا CMD اجرا کنید:

```powershell
# بررسی پورت 4000
netstat -ano | findstr :4000
```

**اگر خروجی داشت:** سرور در حال اجرا است ✅  
**اگر خروجی نداشت:** باید سرور را راه‌اندازی کنید (مرحله 1.2)

---

### 1.2 راه‌اندازی سرور Express (اگر در حال اجرا نیست)

#### روش 1: با PM2 (توصیه می‌شود برای production)

```powershell
# اگر PM2 نصب نیست، اول نصب کنید
npm install -g pm2

# راه‌اندازی سرور
cd E:\FrontProjects\Lent-shop-new\lent-shop
pm2 start ecosystem.config.cjs
pm2 save

# بررسی وضعیت
pm2 status
```

#### روش 2: دستی (برای تست)

```powershell
cd E:\FrontProjects\Lent-shop-new\lent-shop
npm run server
```

**نکته:** این روش را در یک پنجره جداگانه باز کنید و بگذارید باز بماند.

---

## ✅ مرحله 2: تست کردن Route های جدید

### 2.1 تست صفحه لیست محصولات

در مرورگر باز کنید:

```
http://localhost:4000/torob-products
```

**یا اگر روی سرور هستید:**

```
https://lent-shop.ir/torob-products
```

**چک کنید:**
- ✅ صفحه باید لیست محصولات را نشان دهد
- ✅ باید HTML خام باشد (بدون نیاز به جاوااسکریپت)
- ✅ هر محصول باید لینک به صفحه خودش داشته باشد

---

### 2.2 تست Sitemap

در مرورگر باز کنید:

```
http://localhost:4000/sitemap.xml
```

**یا اگر روی سرور هستید:**

```
https://lent-shop.ir/sitemap.xml
```

**چک کنید:**
- ✅ باید یک فایل XML نمایش داده شود
- ✅ باید شامل صفحات محصول باشد
- ✅ URL های محصول باید به این شکل باشند: `https://lent-shop.ir/product/brand-name/product-id`

---

### 2.3 تست متاتگ‌های صفحات محصول

یک صفحه محصول را در مرورگر باز کنید و View Source کنید (Ctrl+U):

```
https://lent-shop.ir/product/toyota/123
```

**در کد HTML باید این متاتگ‌ها را ببینید:**

```html
<meta name="product_id" content="123">
<meta name="product_name" content="نام محصول">
<meta property="og:image" content="https://lent-shop.ir/image.jpg">
<meta name="product_price" content="1280000">
<meta name="product_old_price" content="1500000">
<meta name="availability" content="instock">
```

**⚠️ نکته مهم:** برای تست متاتگ‌ها، باید User-Agent را به ربات تغییر دهید یا از ابزارهای تست استفاده کنید.

---

## ✅ مرحله 3: بررسی IIS و web.config

### 3.1 بررسی اینکه IIS در حال اجرا است

```powershell
# بررسی سرویس IIS
Get-Service -Name W3SVC
```

باید `Running` باشد.

---

### 3.2 بررسی web.config

فایل `web.config` در ریشه پروژه باید شامل rule های زیر باشد:

```xml
<!-- Proxy صفحه لیست محصولات ترب و sitemap به سرور Express -->
<rule name="Torob Products and Sitemap" stopProcessing="true">
  <match url="^(torob-products|sitemap\.xml)$" />
  <action type="Rewrite" url="http://localhost:4000/{R:0}" />
  <serverVariables>
    <set name="HTTP_ACCEPT_ENCODING" value="" />
  </serverVariables>
</rule>
```

**✅ این rule قبلاً اضافه شده است.**

---

### 3.3 Restart کردن IIS (در صورت نیاز)

```powershell
# Restart IIS
iisreset
```

---

## ✅ مرحله 4: تست نهایی از طریق IIS

### 4.1 تست از طریق دامنه اصلی

در مرورگر باز کنید:

```
https://lent-shop.ir/torob-products
https://lent-shop.ir/sitemap.xml
```

**اگر کار نکرد:**
- بررسی کنید که سرور Express در حال اجرا است
- بررسی کنید که IIS به درستی route ها را به Express هدایت می‌کند
- لاگ‌های IIS را چک کنید

---

## ✅ مرحله 5: ارسال لینک‌ها به ترب

### 5.1 لینک‌های مورد نیاز

دو لینک زیر را به ترب ارسال کنید:

1. **صفحه لیست محصولات:**
   ```
   https://lent-shop.ir/torob-products
   ```

2. **Sitemap:**
   ```
   https://lent-shop.ir/sitemap.xml
   ```

---

### 5.2 پیام نمونه برای ترب

می‌توانید این پیام را برای ترب ارسال کنید:

```
سلام

با توجه به درخواست قبلی، موارد زیر را پیاده‌سازی کردیم:

1. متاتگ‌های مورد نیاز در صفحات محصول اضافه شده است:
   - product_id
   - product_name
   - og:image
   - product_price
   - product_old_price
   - availability
   - guarantee (در صورت وجود)

2. صفحه لیست محصولات بدون جاوااسکریپت:
   https://lent-shop.ir/torob-products
   
   این صفحه همه محصولات را به ترتیب جدیدترین نمایش می‌دهد.

3. Sitemap داینامیک:
   https://lent-shop.ir/sitemap.xml
   
   این sitemap به صورت خودکار به‌روز می‌شود.

لطفاً بررسی کنید و در صورت نیاز اطلاع دهید.

با تشکر
```

---

## ✅ مرحله 6: بررسی نهایی

### 6.1 چک‌لیست نهایی

قبل از ارسال به ترب، این موارد را بررسی کنید:

- [ ] سرور Express در حال اجرا است (پورت 4000)
- [ ] `/torob-products` کار می‌کند و محصولات را نمایش می‌دهد
- [ ] `/sitemap.xml` کار می‌کند و شامل محصولات است
- [ ] صفحات محصول متاتگ‌های لازم را دارند
- [ ] IIS به درستی route ها را به Express هدایت می‌کند
- [ ] همه چیز از طریق دامنه اصلی (`https://lent-shop.ir`) کار می‌کند

---

## 🔧 عیب‌یابی

### مشکل: `/torob-products` کار نمی‌کند

**راه‌حل:**
1. بررسی کنید سرور Express در حال اجرا است
2. بررسی کنید `web.config` rule درست است
3. IIS را restart کنید: `iisreset`
4. لاگ‌های Express را چک کنید

---

### مشکل: `/sitemap.xml` کار نمی‌کند

**راه‌حل:**
1. بررسی کنید سرور Express در حال اجرا است
2. بررسی کنید دیتابیس محصولات خالی نیست
3. لاگ‌های Express را چک کنید

---

### مشکل: متاتگ‌ها در صفحات محصول نیستند

**راه‌حل:**
1. بررسی کنید route `/product/:brand/:productId` در `server/index.js` وجود دارد
2. بررسی کنید `web.config` rule برای ربات‌ها درست است
3. با User-Agent ربات تست کنید

---

## 📞 در صورت نیاز به کمک

اگر مشکلی پیش آمد:
1. لاگ‌های Express را چک کنید: `pm2 logs lent-shop-api`
2. لاگ‌های IIS را چک کنید
3. بررسی کنید که همه فایل‌های `.env` درست تنظیم شده‌اند

---

## ✅ تمام!

بعد از انجام این مراحل، لینک‌ها را به ترب ارسال کنید و منتظر تایید آن‌ها بمانید.

