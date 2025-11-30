# ✅ چک‌لیست سریع راه‌اندازی VPS

## 📋 قبل از شروع

- [ ] VPS ویندوز با دسترسی Administrator
- [ ] IP آدرس VPS
- [ ] دامنه (اختیاری اما توصیه می‌شه)
- [ ] اطلاعات Supabase (URL و Keys)
- [ ] اطلاعات Faraz SMS
- [ ] اطلاعات درگاه پرداخت (زرین‌پال)

---

## 🔧 مرحله 1: نصب نرم‌افزارها

- [ ] Node.js (v18 یا بالاتر) نصب شده
- [ ] Git نصب شده (اختیاری)
- [ ] IIS فعال شده
- [ ] URL Rewrite Module برای IIS نصب شده

**بررسی:**
```powershell
node --version
npm --version
```

---

## 📦 مرحله 2: آپلود پروژه

- [ ] پروژه به VPS آپلود شده
- [ ] مسیر پروژه: `C:\inetpub\wwwroot\lent-shop`

---

## ⚙️ مرحله 3: تنظیمات

### فایل `.env` (ریشه پروژه)
- [ ] `VITE_SUPABASE_URL` تنظیم شده
- [ ] `VITE_SUPABASE_ANON_KEY` تنظیم شده
- [ ] `VITE_API_BASE_URL` تنظیم شده (آدرس بک‌اند)
- [ ] `VITE_ZARINPAL_MERCHANT_ID` تنظیم شده
- [ ] `VITE_SITE_URL` تنظیم شده

### فایل `server/.env`
- [ ] `SUPABASE_URL` تنظیم شده
- [ ] `SUPABASE_SERVICE_ROLE_KEY` تنظیم شده
- [ ] `CLIENT_ORIGIN` تنظیم شده (آدرس فرانت)
- [ ] `PORT=4000` تنظیم شده
- [ ] `ZARINPAL_MERCHANT_ID` تنظیم شده
- [ ] `FARAZ_SMS_USERNAME` تنظیم شده
- [ ] `FARAZ_SMS_PASSWORD` تنظیم شده
- [ ] `FARAZ_SMS_SENDER_NUMBER` تنظیم شده

---

## 🏗️ مرحله 4: Build و نصب

- [ ] `npm install` اجرا شده
- [ ] `npm run build` اجرا شده
- [ ] پوشه `dist` ایجاد شده
- [ ] فایل `web.config` در پوشه `dist` کپی شده

---

## 🌐 مرحله 5: تنظیم IIS

- [ ] Website در IIS ایجاد شده
- [ ] Physical path به `dist` تنظیم شده
- [ ] Binding تنظیم شده (پورت 80 یا 443)
- [ ] URL Rewrite برای React Router تنظیم شده

**تست:**
- [ ] فرانت در مرورگر باز می‌شه

---

## 🚀 مرحله 6: راه‌اندازی بک‌اند

- [ ] PM2 نصب شده
- [ ] `pm2-startup` نصب شده
- [ ] بک‌اند با PM2 اجرا شده
- [ ] `pm2 save` اجرا شده

**بررسی:**
```powershell
pm2 status
pm2 logs lent-shop-api
```

**تست:**
- [ ] `http://localhost:4000/health` پاسخ می‌ده

---

## 🔥 مرحله 7: Firewall

- [ ] پورت 4000 در Firewall باز شده
- [ ] پورت 80 (یا 443) در Firewall باز شده

**بررسی:**
```powershell
netstat -ano | findstr :4000
```

---

## 🔒 مرحله 8: SSL (اختیاری)

- [ ] SSL Certificate نصب شده
- [ ] HTTPS فعال شده
- [ ] Redirect از HTTP به HTTPS تنظیم شده

---

## ✅ تست نهایی

- [ ] فرانت باز می‌شه
- [ ] بک‌اند پاسخ می‌ده (`/health`)
- [ ] لاگین کار می‌کنه
- [ ] OTP ارسال می‌شه
- [ ] درگاه پرداخت کار می‌کنه
- [ ] CORS Error نداریم

---

## 🐛 اگر مشکلی پیش اومد

1. **فرانت کار نمی‌کنه:**
   - چک کن IIS درست تنظیم شده
   - چک کن فایل‌های `dist` وجود دارن
   - چک کن `web.config` در `dist` هست

2. **بک‌اند کار نمی‌کنه:**
   ```powershell
   pm2 logs lent-shop-api
   ```
   - چک کن فایل `server/.env` درسته
   - چک کن پورت 4000 بازه

3. **CORS Error:**
   - چک کن `CLIENT_ORIGIN` در `server/.env` درسته
   - باید دقیقاً آدرس فرانت باشه

4. **OTP ارسال نمی‌شه:**
   - چک کن اطلاعات Faraz SMS درسته
   - چک کن Supabase Service Role Key درسته
   - لاگ‌های PM2 رو چک کن

---

## 📞 کمک بیشتر

- فایل `VPS_WINDOWS_SETUP.md` رو مطالعه کن
- لاگ‌های PM2 رو چک کن: `pm2 logs`
- لاگ‌های IIS رو چک کن


