# 🔄 راه‌حل جایگزین - استفاده از /api/

## 🎯 مشکل:

IIS rewrite rules برای `/torob-products` و `/sitemap.xml` کار نمی‌کنند.

## ✅ راه‌حل:

استفاده از route های `/api/` که قبلاً کار می‌کنند!

---

## 🔧 تغییرات انجام شده:

### 1. تغییر route ها در Express:

- `/torob-products` → `/api/torob-products`
- `/sitemap.xml` → `/api/sitemap.xml`

### 2. تغییر web.config:

rule ها را تغییر دادیم تا به `/api/` redirect کنند.

---

## 📋 مراحل Deploy:

### مرحله 1: انتقال فایل‌ها به سرور

#### الف) فایل Backend:
- فایل `server/index.js` را به سرور منتقل کنید
- مسیر: `C:\e-commerce\server\index.js`

#### ب) فایل Frontend:
- فایل `web.config` را به سرور منتقل کنید
- مسیر: `C:\inetpub\wwwroot\lent-shop\web.config`

### مرحله 2: Restart سرور Express

```powershell
# در سرور
pm2 restart lent-shop-api
```

### مرحله 3: Restart IIS

```powershell
# در سرور
iisreset
```

---

## 🧪 تست:

### از مرورگر:

```
https://lent-shop.ir/torob-products
https://lent-shop.ir/sitemap.xml
```

این URL ها باید به `/api/torob-products` و `/api/sitemap.xml` redirect شوند و کار کنند.

---

## ✅ مزایای این راه:

1. ✅ `/api/` قبلاً کار می‌کند (rule موجود است)
2. ✅ نیاز به تغییرات کمتری دارد
3. ✅ مطمئن‌تر است

---

## 📝 لینک‌های جدید برای ترب:

بعد از تست موفق، این لینک‌ها را به ترب ارسال کنید:

```
https://lent-shop.ir/torob-products
https://lent-shop.ir/sitemap.xml
```

این URL ها به صورت خودکار به route های `/api/` redirect می‌شوند.

---

## ✅ تمام!

این راه‌حل ساده‌تر و مطمئن‌تر است! 🎉

