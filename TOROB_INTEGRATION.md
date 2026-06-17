# راهنمای اتصال سایت به ترب (Torob)

## مشکل
ربات ترب نیاز به متاتگ‌های خاص در HTML صفحات محصول دارد که باید در HTML بدون JavaScript موجود باشند.

## راه‌حل پیاده‌سازی شده

### 1. سرور Express (`server/index.js`)
یک route اضافه شده که برای URL های `/product/:brand/:productId`، HTML را با متاتگ‌های ترب رندر می‌کند.

### 2. Frontend React (`src/Components/ProductDetail/ProductDetail.jsx`)
متاتگ‌های ترب به `Helmet` اضافه شده‌اند تا در HTML رندر شوند.

### 3. تنظیمات IIS (`web.config`)
یک rule اضافه شده که برای ربات‌ها (مثل ترب)، درخواست‌های صفحات محصول را به سرور Express هدایت می‌کند.

## مراحل نصب و راه‌اندازی

### مرحله 1: نصب Application Request Routing (ARR)
برای استفاده از reverse proxy در IIS، باید ARR را نصب کنید:

1. دانلود ARR از: https://www.iis.net/downloads/microsoft/application-request-routing
2. نصب کنید
3. در IIS Manager:
   - Server → Application Request Routing Cache → Server Proxy Settings
   - Enable proxy را فعال کنید

### مرحله 2: راه‌اندازی سرور Express
```powershell
cd C:\inetpub\wwwroot\lent-shop
pm2 start server/index.js --name "lent-shop-api"
pm2 save
```

### مرحله 3: Build کردن Frontend
```powershell
npm run build
```

### مرحله 4: کپی فایل‌های Build شده
```powershell
xcopy dist\* C:\inetpub\wwwroot\lent-shop\dist\ /E /Y
```

### مرحله 5: Restart کردن IIS
```powershell
iisreset
```

## تست کردن

### 1. تست با curl (شبیه‌سازی ربات)
```powershell
curl -A "Mozilla/5.0 (compatible; TorobBot/1.0)" https://lent-shop.ir/product/mg/349
```

باید HTML با متاتگ‌های زیر را ببینید:
```html
<meta name="product_id" content="349">
<meta name="product_name" content="...">
<meta property="og:image" content="...">
<meta name="product_price" content="...">
<meta name="product_old_price" content="...">
<meta name="availability" content="instock">
<meta name="guarantee" content="...">
```

### 2. تست در مرورگر
1. به `https://lent-shop.ir/product/mg/349` بروید
2. View Source کنید (Ctrl+U)
3. متاتگ‌های ترب را بررسی کنید

## متاتگ‌های مورد نیاز ترب

- `product_id`: شناسه محصول
- `product_name`: نام محصول
- `og:image`: URL تصویر محصول
- `product_price`: قیمت فعلی (بدون کاما)
- `product_old_price`: قیمت قبل از تخفیف (بدون کاما)
- `availability`: وضعیت موجودی (`instock` یا `outofstock`)
- `guarantee`: گارانتی (اختیاری)

## عیب‌یابی

### مشکل: متاتگ‌ها در view-source دیده نمی‌شوند
**راه‌حل:**
1. بررسی کنید که سرور Express در حال اجرا است: `pm2 status`
2. بررسی کنید که ARR نصب و فعال است
3. بررسی کنید که rule در `web.config` درست است
4. لاگ‌های IIS را بررسی کنید

### مشکل: خطای 502 Bad Gateway
**راه‌حل:**
1. بررسی کنید که سرور Express در پورت 4000 در حال اجرا است
2. بررسی کنید که firewall پورت 4000 را باز کرده است
3. بررسی کنید که ARR proxy را فعال کرده است

### مشکل: متاتگ‌ها برای کاربران عادی نمایش داده نمی‌شوند
**نکته:** این طبیعی است! متاتگ‌ها فقط برای ربات‌ها (مثل ترب) در HTML بدون JavaScript نمایش داده می‌شوند. برای کاربران عادی، React متاتگ‌ها را به صورت پویا اضافه می‌کند.

## نکات مهم

1. **ARR ضروری است:** بدون ARR، rule در `web.config` کار نمی‌کند
2. **سرور Express باید در حال اجرا باشد:** route در سرور Express باید فعال باشد
3. **Build باید انجام شود:** بعد از هر تغییر در frontend، باید build کنید
4. **Cache:** ممکن است نیاز به پاک کردن cache IIS باشد

## لینک‌های مفید

- [Application Request Routing (ARR)](https://www.iis.net/downloads/microsoft/application-request-routing)
- [URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite)
- [مستندات ترب](https://torob.com/help/seller)

