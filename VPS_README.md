# 🚀 راه‌اندازی سریع روی VPS ویندوز

## ⚡ شروع سریع (3 دقیقه)

### 1. نصب Node.js
از [nodejs.org](https://nodejs.org) دانلود و نصب کن

### 2. آپلود پروژه
پروژه رو به `C:\inetpub\wwwroot\lent-shop` آپلود کن

### 3. اجرای اسکریپت خودکار
```powershell
cd C:\inetpub\wwwroot\lent-shop
.\setup-vps.ps1
```

### 4. تنظیم فایل‌های .env
- `.env` در ریشه پروژه
- `server/.env` در پوشه server

از `env.example` به عنوان الگو استفاده کن.

### 5. تنظیم IIS
- Website جدید بساز
- Physical path: `C:\inetpub\wwwroot\lent-shop\dist`
- Port: 80

---

## 📚 مستندات کامل

- **راهنمای کامل:** `VPS_WINDOWS_SETUP.md`
- **چک‌لیست:** `VPS_QUICK_CHECKLIST.md`

---

## 🔧 دستورات مفید

```powershell
# Build فرانت
npm run build

# راه‌اندازی بک‌اند
pm2 start ecosystem.config.js

# مشاهده وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs lent-shop-api

# ریستارت
pm2 restart lent-shop-api
```

---

## ⚠️ نکات مهم

1. **فایل‌های .env رو حتماً تنظیم کن**
2. **CLIENT_ORIGIN باید دقیقاً آدرس فرانت باشه**
3. **پورت 4000 رو در Firewall باز کن**
4. **از HTTPS استفاده کن (برای production)**

---

## 🆘 مشکل داری؟

1. لاگ‌های PM2 رو چک کن: `pm2 logs`
2. فایل `VPS_WINDOWS_SETUP.md` رو بخون
3. چک‌لیست `VPS_QUICK_CHECKLIST.md` رو بررسی کن


