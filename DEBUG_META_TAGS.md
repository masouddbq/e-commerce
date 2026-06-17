# 🔍 بررسی علت کار نکردن متاتگ‌ها

## 🔍 مشکلات احتمالی

### 1. Cache IIS
IIS ممکن است HTML را cache کرده باشد.

**راه‌حل:**
```powershell
# پاک کردن cache IIS
iisreset /stop
iisreset /start
```

یا در IIS Manager:
- Server level → Output Caching → Clear Cache

---

### 2. فایل web.config در production متفاوت است

**بررسی:**
```powershell
# بررسی web.config در production
Get-Content C:\inetpub\wwwroot\lent-shop\web.config | Select-String "Product Pages"
```

اگر rule موجود نیست → باید کپی شود

---

### 3. Express route تغییر کرده

**بررسی:**
```powershell
# تست مستقیم Express
curl.exe -s http://localhost:4000/api/product/toyota/996 | Select-String "product_id"
```

اگر کار کرد → Express درست است
اگر کار نکرد → route مشکل دارد

---

### 4. ترتیب rules در web.config

Rule "Product Pages for All" باید **قبل از** "React Router" باشد.

---

### 5. Express restart شده و route اجرا نمی‌شود

**بررسی:**
```powershell
# بررسی PM2
pm2 status

# بررسی لاگ‌ها
pm2 logs lent-shop-api --lines 20
```

---

## ✅ مراحل بررسی

### مرحله 1: بررسی web.config در production

```powershell
# بررسی rule
Get-Content C:\inetpub\wwwroot\lent-shop\web.config | Select-String "Product Pages"
```

### مرحله 2: پاک کردن Cache

```powershell
iisreset
```

### مرحله 3: بررسی Express

```powershell
# تست مستقیم
curl.exe -s http://localhost:4000/api/product/toyota/996 | Select-String "product_id"
```

### مرحله 4: بررسی لاگ‌های Express

```powershell
pm2 logs lent-shop-api --lines 50
```

---

## 🎯 راه‌حل احتمالی

احتمالاً مشکل از **Cache IIS** است یا **web.config در production** با local متفاوت است.

