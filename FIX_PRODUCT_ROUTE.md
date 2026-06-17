# راهنمای رفع مشکل Route محصول

## مشکل
Route `/product/:brand/:productId` در سرور Express کار نمی‌کند.

## مراحل رفع مشکل

### مرحله 1: بررسی فایل dist/index.html

در PowerShell سرور، این دستور را اجرا کنید:

```powershell
Test-Path C:\inetpub\wwwroot\lent-shop\dist\index.html
```

**نتیجه:**
- اگر `True` بود → فایل وجود دارد ✅
- اگر `False` بود → باید frontend را build کنید

**اگر فایل وجود ندارد:**
```powershell
cd C:\inetpub\wwwroot\lent-shop
npm run build
```

---

### مرحله 2: بررسی مسیر فایل در کد

Route به دنبال فایل در مسیر `dist/index.html` می‌گردد. بررسی کنید که مسیر درست است:

```powershell
# بررسی مسیر فعلی
Get-Location

# بررسی وجود فایل
Test-Path C:\inetpub\wwwroot\lent-shop\dist\index.html
Test-Path C:\e-commerce\dist\index.html
```

**نکته:** اگر فایل در مسیر دیگری است، باید مسیر را در `server/index.js` تغییر دهید.

---

### مرحله 3: Restart کردن سرور Express

بعد از تغییرات، باید سرور را restart کنید:

```powershell
pm2 restart lent-shop-api
```

**یا اگر از PM2 استفاده نمی‌کنید:**
```powershell
# توقف سرور
# سپس دوباره شروع کنید
node server/index.js
```

---

### مرحله 4: بررسی لاگ‌های سرور

```powershell
pm2 logs lent-shop-api --lines 50
```

**دنبال این خطاها بگردید:**
- `Cannot GET /product/...`
- `HTML file not found`
- `Error fetching product`

---

### مرحله 5: تست مستقیم route

```powershell
# تست health (باید کار کند)
Invoke-WebRequest -Uri "http://localhost:4000/health" | Select-Object -ExpandProperty Content

# تست route محصول (باید کار کند)
Invoke-WebRequest -Uri "http://localhost:4000/product/mg/349" | Select-Object -ExpandProperty Content
```

---

### مرحله 6: بررسی محصول در دیتابیس

اگر محصول در دیتابیس پیدا نشود، route به frontend redirect می‌کند.

برای بررسی:
1. به Supabase بروید
2. جدول `products` را باز کنید
3. بررسی کنید که محصول با `id=349` وجود دارد

---

## راه‌حل سریع

اگر همه چیز درست است اما هنوز کار نمی‌کند:

### 1. Build کردن frontend
```powershell
cd C:\inetpub\wwwroot\lent-shop
npm run build
```

### 2. Restart کردن سرور Express
```powershell
pm2 restart lent-shop-api
```

### 3. بررسی لاگ‌ها
```powershell
pm2 logs lent-shop-api --lines 100
```

### 4. تست دوباره
```powershell
Invoke-WebRequest -Uri "http://localhost:4000/product/mg/349" | Select-Object -ExpandProperty Content
```

---

## اگر هنوز کار نمی‌کند

1. **خروجی این دستورات را بفرستید:**
   ```powershell
   pm2 status
   Test-Path C:\inetpub\wwwroot\lent-shop\dist\index.html
   pm2 logs lent-shop-api --lines 50
   ```

2. **بررسی کنید که:**
   - فایل `server/index.js` در سرور به‌روز است
   - فایل `dist/index.html` وجود دارد
   - سرور Express restart شده است

