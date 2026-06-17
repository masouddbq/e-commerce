# راهنمای سریع Deploy - انتقال پیگیری سفارش

## 🎯 خلاصه
بخش پیگیری سفارش از صفحه اصلی به پنل کاربری منتقل شد.

---

## ⚡ روش سریع (Build روی سیستم محلی)

### 1️⃣ Build کردن
```powershell
cd e:\FrontProjects\Lent-shop-new\lent-shop
npm run build
```

### 2️⃣ انتقال به سرور
محتوای پوشه `dist/` را به مسیر هاست کپی کنید:
```
C:\inetpub\wwwroot\lent-shop\
```

### 3️⃣ تست
- صفحه اصلی: بخش پیگیری سفارش نباید باشد
- پنل کاربری (`/account`): بخش پیگیری سفارش باید باشد

---

## 🔄 روش Build روی سرور

### 1️⃣ انتقال فایل‌های تغییر یافته
فایل‌های زیر را به سرور منتقل کنید:
- `src/Components/HomePage/HomePage.jsx`
- `src/Components/Pages/UserAccount.jsx`

### 2️⃣ Build روی سرور
```powershell
cd C:\path\to\lent-shop
npm install
npm run build
```

### 3️⃣ کپی به هاست
```powershell
xcopy "dist\*" "C:\inetpub\wwwroot\lent-shop\" /E /Y
```

---

## ✅ چک‌لیست
- [ ] Build موفق بود
- [ ] فایل‌های `dist/` به هاست کپی شدند
- [ ] صفحه اصلی بدون بخش پیگیری باز می‌شود
- [ ] پنل کاربری با بخش پیگیری کار می‌کند

---

## 🆘 مشکل دارید؟
1. Cache مرورگر را پاک کنید (`Ctrl + Shift + R`)
2. IIS را restart کنید (`iisreset`)
3. بررسی کنید فایل‌های `dist/` به درستی کپی شده‌اند

