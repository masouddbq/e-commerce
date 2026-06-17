# راهنمای Deploy تغییرات زرین‌پال - تغییر از Sandbox به Production

## 📋 خلاصه تغییرات

تغییرات برای اتصال به درگاه اصلی زرین‌پال (غیر sandbox) انجام شده است.

---

## 🔄 روش انتقال (توصیه می‌شود)

### مرحله 1: Build کردن Frontend

```powershell
# در مسیر پروژه (روی سیستم محلی)
cd e:\FrontProjects\Lent-shop-new\lent-shop

# Build کردن
npm run build
```

**نکته:** بعد از build، فایل‌های آماده در پوشه `dist/` قرار می‌گیرند.

---

### مرحله 2: انتقال فایل‌ها به سرور

#### 2.1 فایل‌های Frontend (Build شده)

**روش 1: انتقال دستی**
- محتوای پوشه `dist/` را کپی کنید
- در مسیر هاست (`C:\inetpub\wwwroot\lent-shop\`) جایگزین کنید

**روش 2: استفاده از PowerShell (اگر دسترسی دارید)**
```powershell
# روی سرور (یا از سیستم محلی با دسترسی)
xcopy "E:\FrontProjects\Lent-shop-new\lent-shop\dist\*" "C:\inetpub\wwwroot\lent-shop\" /E /Y
```

#### 2.2 فایل‌های Backend

فایل زیر را به سرور منتقل کنید:

**فایل:**
```
server/services/zarinpalService.js
```

**مسیر در سرور:**
```
C:\inetpub\wwwroot\lent-shop\server\services\zarinpalService.js
```

**یا اگر سرور در مسیر دیگری است:**
```
C:\path\to\server\services\zarinpalService.js
```

#### 2.3 فایل‌های Environment (.env)

**الف) فایل `.env` در root پروژه:**

فایل `.env` در root را باز کنید و این خطوط را اضافه یا ویرایش کنید:

```env
# Zarinpal Payment Gateway (Frontend)
VITE_ZARINPAL_SANDBOX=false
VITE_ZARINPAL_MERCHANT_ID=ab4b14d1-6a52-4e7b-949d-a62d348305ee
```

**مسیر در سرور:**
```
C:\inetpub\wwwroot\lent-shop\.env
```

**ب) فایل `server/.env`:**

فایل `server/.env` را باز کنید و این خط را ویرایش کنید:

```env
ZARINPAL_SANDBOX=false
```

**مسیر در سرور:**
```
C:\inetpub\wwwroot\lent-shop\server\.env
```

**⚠️ مهم:** 
- اگر فایل `.env` در root ندارید، فقط خطوط `VITE_ZARINPAL_*` را اضافه کنید
- سایر تنظیمات موجود در `.env` را تغییر ندهید

---

### مرحله 3: Restart سرور

**اگر از PM2 استفاده می‌کنید:**
```powershell
pm2 restart lent-shop-api
# یا
pm2 restart server
```

**اگر از IIS/Node.js استفاده می‌کنید:**
```powershell
# متوقف کردن
taskkill /F /IM node.exe

# دوباره شروع کردن (با استفاده از استارت‌آپ یا دستی)
```

**یا IIS را restart کنید:**
```powershell
iisreset
```

---

## 📝 چک‌لیست انتقال

### فایل‌های Frontend:
- [ ] `dist/` build شده است
- [ ] محتوای `dist/` به هاست کپی شده است

### فایل‌های Backend:
- [ ] `server/services/zarinpalService.js` به سرور منتقل شده است

### فایل‌های Environment:
- [ ] `.env` (root) شامل `VITE_ZARINPAL_SANDBOX=false` است
- [ ] `server/.env` شامل `ZARINPAL_SANDBOX=false` است

### بعد از انتقال:
- [ ] سرور restart شده است
- [ ] لاگ‌های سرور بررسی شده است (بدون خطا)
- [ ] تست پرداخت انجام شده است (باید به درگاه اصلی برود)

---

## 🧪 تست کردن

1. **تست Frontend:**
   - وارد صفحه checkout شوید
   - یک سفارش ایجاد کنید
   - به صفحه پرداخت بروید
   - **باید به `www.zarinpal.com` برود** (نه `sandbox.zarinpal.com`)

2. **تست Backend:**
   ```powershell
   # بررسی لاگ‌های سرور
   pm2 logs lent-shop-api --lines 50
   ```
   - در لاگ باید `isSandbox: false` دیده شود

3. **بررسی URL درگاه:**
   - در لاگ‌های مرورگر (Console) یا Network tab
   - URL درگاه باید `https://www.zarinpal.com/pg/StartPay/...` باشد

---

## ⚠️ نکات مهم

1. **Cache مرورگر:** بعد از تغییرات، cache مرورگر را پاک کنید (`Ctrl + Shift + R`)

2. **تغییرات در `.env`:**
   - فایل‌های `.env` نباید در Git commit شوند
   - فقط روی سرور ویرایش کنید

3. **اگر هنوز به sandbox می‌رود:**
   - بررسی کنید که `ZARINPAL_SANDBOX=false` (بدون فاصله) باشد
   - سرور را restart کنید
   - Cache مرورگر را پاک کنید

---

## 🔍 فایل‌های تغییر یافته (برای مرجع)

```
✅ server/services/zarinpalService.js
   - تغییر مقدار پیش‌فرض ZARINPAL_SANDBOX از 'true' به 'false'

✅ src/lib/payment.js
   - حذف '|| true' از sandbox configuration
   - تغییر URL از sandbox به production

✅ .env (root)
   - اضافه شدن VITE_ZARINPAL_SANDBOX=false

✅ server/.env
   - تغییر ZARINPAL_SANDBOX=true به false
```

---

## 📞 در صورت مشکل

1. بررسی لاگ‌های سرور برای خطاها
2. بررسی فایل‌های `.env` که مقادیر درست دارند
3. اطمینان حاصل کنید که سرور restart شده است
4. Cache مرورگر را پاک کنید

