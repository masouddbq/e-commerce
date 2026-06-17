# 🔧 رفع مشکل ترب - راهنمای سریع

## 🐛 مشکلات شناسایی شده:

1. ✅ **sitemap.xml استاتیک** - فایل `public/sitemap.xml` مانع از اجرای route داینامیک می‌شد
2. ✅ **ترتیب rule ها در web.config** - rule "Static Files" قبل از rule "Torob Products and Sitemap" بود

## ✅ تغییرات انجام شده:

### 1. تغییر ترتیب rule ها در `web.config`
- rule "Torob Products and Sitemap" را به **قبل** از "Static Files" منتقل کردم
- XML را از pattern فایل‌های استاتیک حذف کردم

### 2. فایل `public/sitemap.xml`
- این فایل هنوز وجود دارد اما دیگر استفاده نمی‌شود
- route داینامیک `/sitemap.xml` جایگزین آن شده است

---

## 🚀 مراحل Deploy (باید انجام دهید):

### مرحله 1: Build گرفتن
```powershell
cd E:\FrontProjects\Lent-shop-new\lent-shop
npm run build
```

### مرحله 2: انتقال فایل‌ها به سرور

#### الف) فایل‌های Frontend:
- محتوای پوشه `dist/` را به سرور منتقل کنید
- **مهم:** فایل `dist/web.config` باید rule های جدید را داشته باشد

#### ب) فایل Backend:
- فایل `server/index.js` را به سرور منتقل کنید
- مسیر: `C:\inetpub\wwwroot\lent-shop\server\index.js`

### مرحله 3: Restart کردن سرور Express
```powershell
# روی سرور
pm2 restart lent-shop-api

# بررسی وضعیت
pm2 status
pm2 logs lent-shop-api --lines 20
```

### مرحله 4: Restart کردن IIS
```powershell
# روی سرور
iisreset
```

---

## ✅ تست بعد از Deploy:

### 1. تست sitemap.xml:
```
https://lent-shop.ir/sitemap.xml
```
**باید ببینید:**
- ✅ فایل XML شامل صفحات محصول باشد
- ✅ تاریخ lastmod به‌روز باشد
- ✅ URL های محصول به این شکل باشند: `https://lent-shop.ir/product/brand-name/product-id`

### 2. تست صفحه لیست محصولات:
```
https://lent-shop.ir/torob-products
```
**باید ببینید:**
- ✅ لیست محصولات نمایش داده شود
- ✅ هر محصول لینک داشته باشد
- ✅ HTML خام باشد (بدون نیاز به جاوااسکریپت)

---

## 🔍 عیب‌یابی:

### مشکل: sitemap.xml هنوز استاتیک است

**راه‌حل:**
1. بررسی کنید `web.config` در `dist/` rule جدید را دارد
2. بررسی کنید rule "Torob Products and Sitemap" قبل از "Static Files" است
3. IIS را restart کنید: `iisreset`
4. Cache مرورگر را پاک کنید

### مشکل: torob-products خالی است

**راه‌حل:**
1. بررسی کنید `server/index.js` در سرور به‌روز شده است
2. بررسی کنید سرور Express در حال اجرا است: `pm2 status`
3. لاگ‌های Express را چک کنید: `pm2 logs lent-shop-api`
4. بررسی کنید دیتابیس محصولات خالی نیست

---

## 📝 خلاصه تغییرات:

1. ✅ `web.config` - تغییر ترتیب rule ها
2. ✅ `server/index.js` - route های جدید (قبلاً اضافه شده بود)
3. ✅ `public/sitemap.xml` - فقط کامنت اضافه شد (اختیاری)

---

## ✅ تمام!

بعد از انجام مراحل deploy، لینک‌های زیر را تست کنید:

```
https://lent-shop.ir/torob-products
https://lent-shop.ir/sitemap.xml
```

اگر کار کردند، به ترب ارسال کنید! 🎉

