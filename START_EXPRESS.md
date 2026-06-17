# 🚀 راهنمای راه‌اندازی Express

## 🔍 مشکل

Express سرور در حال اجرا نیست، بنابراین:
- درخواست‌ها به Express نمی‌رسند
- متاتگ‌ها اضافه نمی‌شوند
- Routeهای API کار نمی‌کنند

---

## ✅ راه‌حل: راه‌اندازی Express

### روش 1: استفاده از PM2 (پیشنهادی)

#### مرحله 1: رفتن به پوشه پروژه

```powershell
# پیدا کردن مسیر پروژه
cd C:\inetpub\wwwroot\lent-shop
# یا مسیری که پروژه شما در آن است
```

#### مرحله 2: تنظیم Environment Variable

```powershell
$env:NODE_SKIP_PLATFORM_CHECK = "1"
```

#### مرحله 3: راه‌اندازی با PM2

```powershell
# اگر قبلاً PM2 process داشتید
pm2 restart lent-shop-api

# یا اگر برای اولین بار است
cd server
pm2 start index.js --name lent-shop-api
```

یا اگر `ecosystem.config.js` دارید:

```powershell
pm2 start ecosystem.config.js
```

---

### روش 2: راه‌اندازی مستقیم با Node

```powershell
# رفتن به پوشه server
cd server

# راه‌اندازی
node index.js
```

**نکته:** این روش terminal را اشغال می‌کند. برای production از PM2 استفاده کنید.

---

### روش 3: استفاده از npm start

```powershell
# اگر package.json در root پروژه است
npm start

# یا اگر در پوشه server است
cd server
npm start
```

---

## ✅ بررسی راه‌اندازی موفق

بعد از راه‌اندازی:

```powershell
# بررسی PM2
pm2 status

# باید process lent-shop-api را ببینید با status "online"
```

سپس تست کنید:

```powershell
# تست مستقیم Express
curl.exe http://localhost:4000/api/test

# باید JSON پاسخ ببینید
```

---

## 🧪 تست کامل

بعد از راه‌اندازی Express:

```powershell
# 1. تست Route API
curl.exe http://localhost:4000/api/product/toyota/996 | Select-String "product_id"

# 2. تست از طریق HTTPS
curl.exe https://lent-shop.ir/api/product/toyota/996 | Select-String "product_id"
```

---

## 🐛 رفع مشکلات

### مشکل 1: "Cannot find module"

**راه‌حل:**
```powershell
# نصب dependencies
cd server
npm install
```

### مشکل 2: "Port 4000 already in use"

**راه‌حل:**
```powershell
# پیدا کردن process که از port 4000 استفاده می‌کند
netstat -ano | findstr :4000

# kill کردن process (PID را از خروجی بالا بگیرید)
taskkill /PID <PID> /F
```

### مشکل 3: PM2 process نمی‌ماند بعد از restart

**راه‌حل:**
```powershell
# ذخیره PM2 process list
pm2 save

# تنظیم startup script
pm2 startup
```

---

## 📋 چک‌لیست

- [ ] Express سرور راه‌اندازی شد
- [ ] PM2 process "online" است
- [ ] `curl.exe http://localhost:4000/api/test` کار می‌کند
- [ ] `curl.exe http://localhost:4000/api/product/toyota/996` متاتگ‌ها را برمی‌گرداند
- [ ] `curl.exe https://lent-shop.ir/api/product/toyota/996` متاتگ‌ها را برمی‌گرداند

---

## ⚠️ نکته مهم

بعد از راه‌اندازی Express:
1. مطمئن شوید که PM2 process در حال اجرا است
2. تست کنید که Express پاسخ می‌دهد
3. سپس تست کنید که IIS rewrite rule درخواست را به Express می‌فرستد

