# 🚀 راهنمای Deploy تغییرات ترب

## 📋 خلاصه تغییرات

### فایل‌های تغییر یافته:

1. **`server/index.js`** ✅
   - اضافه شدن route `/torob-products` (صفحه لیست محصولات)
   - اضافه شدن route `/sitemap.xml` (sitemap داینامیک)

2. **`web.config`** ✅
   - اضافه شدن rule برای هدایت `/torob-products` و `/sitemap.xml` به Express

3. **`TOROB_SETUP_GUIDE.md`** (فقط مستندات - نیاز به انتقال ندارد)

---

## 🔄 مراحل Deploy

### ⚠️ مهم: باید این کارها را انجام دهید

---

### مرحله 1: Build کردن Frontend

```powershell
# در مسیر پروژه (روی سیستم محلی)
cd E:\FrontProjects\Lent-shop-new\lent-shop

# Build کردن (این کار web.config را به dist کپی می‌کند)
npm run build
```

**چرا؟** 
- فایل `web.config` در build script به `dist/web.config` کپی می‌شود
- باید build بگیرید تا `web.config` جدید به `dist/` کپی شود

---

### مرحله 2: انتقال فایل‌ها به سرور

#### 2.1 انتقال فایل‌های Frontend (Build شده)

**روش 1: انتقال دستی**
- محتوای پوشه `dist/` را کپی کنید
- در مسیر هاست (`C:\inetpub\wwwroot\lent-shop\`) جایگزین کنید

**روش 2: استفاده از PowerShell**
```powershell
# روی سرور (یا از سیستم محلی با دسترسی)
xcopy "E:\FrontProjects\Lent-shop-new\lent-shop\dist\*" "C:\inetpub\wwwroot\lent-shop\" /E /Y
```

**فایل‌های مهم:**
- ✅ `dist/web.config` (شامل rule های جدید)
- ✅ `dist/index.html` و سایر فایل‌های build شده

---

#### 2.2 انتقال فایل‌های Backend

**فایل:**
```
server/index.js
```

**مسیر در سرور:**
```
C:\inetpub\wwwroot\lent-shop\server\index.js
```

**یا اگر سرور در مسیر دیگری است:**
```
C:\path\to\server\index.js
```

**نکته:** فقط فایل `server/index.js` را منتقل کنید (شامل route های جدید)

---

### مرحله 3: Restart کردن سرور Express

**روش 1: با PM2 (توصیه می‌شود)**
```powershell
# روی سرور
pm2 restart lent-shop-api

# بررسی وضعیت
pm2 status
pm2 logs lent-shop-api --lines 20
```

**روش 2: دستی**
```powershell
# Stop کردن سرور (اگر در حال اجرا است)
# سپس دوباره start کنید
cd C:\inetpub\wwwroot\lent-shop
npm run server
```

---

### مرحله 4: Restart کردن IIS (اختیاری اما توصیه می‌شود)

```powershell
# روی سرور
iisreset
```

**چرا؟** تا مطمئن شویم rule های جدید `web.config` اعمال شده‌اند.

---

## ✅ چک‌لیست Deploy

### قبل از Deploy:
- [ ] Build بدون خطا انجام شده است
- [ ] فایل `dist/web.config` وجود دارد و شامل rule های جدید است
- [ ] فایل `server/index.js` شامل route های جدید است

### بعد از Deploy:
- [ ] فایل‌های `dist/` به هاست کپی شده‌اند
- [ ] فایل `server/index.js` به سرور منتقل شده است
- [ ] سرور Express restart شده است
- [ ] IIS restart شده است (اختیاری)

### تست:
- [ ] `https://lent-shop.ir/torob-products` کار می‌کند
- [ ] `https://lent-shop.ir/sitemap.xml` کار می‌کند
- [ ] صفحات محصول متاتگ‌های لازم را دارند

---

## 🔍 تست کردن

### 1. تست صفحه لیست محصولات:
```
https://lent-shop.ir/torob-products
```
- باید لیست محصولات را ببینید
- باید HTML خام باشد (بدون نیاز به جاوااسکریپت)

### 2. تست Sitemap:
```
https://lent-shop.ir/sitemap.xml
```
- باید فایل XML را ببینید
- باید شامل صفحات محصول باشد

### 3. تست متاتگ‌های صفحات محصول:
یک صفحه محصول را باز کنید و View Source کنید (Ctrl+U):
```
https://lent-shop.ir/product/toyota/123
```
- باید متاتگ‌های `product_id`, `product_name`, `product_price` و... را ببینید

---

## 📝 خلاصه دستورات

```powershell
# 1. Build
cd E:\FrontProjects\Lent-shop-new\lent-shop
npm run build

# 2. انتقال dist به سرور (روی سرور)
xcopy "E:\FrontProjects\Lent-shop-new\lent-shop\dist\*" "C:\inetpub\wwwroot\lent-shop\" /E /Y

# 3. انتقال server/index.js به سرور (روی سرور)
# (کپی دستی یا با FTP)

# 4. Restart Express (روی سرور)
pm2 restart lent-shop-api

# 5. Restart IIS (روی سرور)
iisreset
```

---

## 🆘 مشکل دارید؟

### مشکل: `/torob-products` کار نمی‌کند

**راه‌حل:**
1. بررسی کنید `web.config` در `dist/` شامل rule جدید است
2. بررسی کنید `server/index.js` شامل route جدید است
3. سرور Express را restart کنید
4. IIS را restart کنید

### مشکل: `/sitemap.xml` کار نمی‌کند

**راه‌حل:**
1. بررسی کنید `server/index.js` شامل route جدید است
2. بررسی کنید دیتابیس محصولات خالی نیست
3. لاگ‌های Express را چک کنید: `pm2 logs lent-shop-api`

---

## ✅ تمام!

بعد از انجام این مراحل، لینک‌های زیر را به ترب ارسال کنید:

```
https://lent-shop.ir/torob-products
https://lent-shop.ir/sitemap.xml
```

