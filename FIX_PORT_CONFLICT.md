# راهنمای رفع مشکل EADDRINUSE (پورت 4000 در حال استفاده)

## مشکل
خطای `Error: listen EADDRINUSE: address already in use 0.0.0.0:4000` یعنی پورت 4000 قبلاً توسط process دیگری استفاده می‌شود.

## راه‌حل

### مرحله 1: بررسی process های در حال استفاده از پورت 4000

```powershell
netstat -ano | findstr :4000
```

این دستور لیست process هایی که از پورت 4000 استفاده می‌کنند را نشان می‌دهد.

**مثال خروجی:**
```
TCP    0.0.0.0:4000           0.0.0.0:0              LISTENING       1234
```

عدد آخر (1234) PID process است.

---

### مرحله 2: Stop کردن تمام instance های PM2

```powershell
pm2 stop all
pm2 delete all
```

---

### مرحله 3: Kill کردن process های اضافی (اگر وجود دارند)

اگر در مرحله 1 PID پیدا کردید:

```powershell
# جایگزین کنید PID را با عددی که پیدا کردید
taskkill /PID 1234 /F
```

**یا kill کردن همه node process ها:**
```powershell
taskkill /IM node.exe /F
```

**⚠️ مراقب باشید:** این دستور تمام node process ها را kill می‌کند.

---

### مرحله 4: بررسی دوباره پورت

```powershell
netstat -ano | findstr :4000
```

اگر چیزی نشان نداد، یعنی پورت آزاد است ✅

---

### مرحله 5: Start کردن سرور دوباره

```powershell
cd C:\e-commerce
pm2 start server/index.js --name "lent-shop-api"
pm2 save
```

---

### مرحله 6: بررسی وضعیت

```powershell
pm2 status
pm2 logs lent-shop-api --lines 20
```

باید ببینید:
- Status: `online` ✅
- بدون خطای `EADDRINUSE` ✅

---

## راه‌حل سریع (یک دستور)

اگر می‌خواهید همه چیز را یکجا انجام دهید:

```powershell
# Stop تمام PM2 processes
pm2 stop all
pm2 delete all

# Kill تمام node processes
taskkill /IM node.exe /F

# صبر کنید 2 ثانیه
Start-Sleep -Seconds 2

# Start دوباره
cd C:\e-commerce
pm2 start server/index.js --name "lent-shop-api"
pm2 save

# بررسی وضعیت
pm2 status
```

---

## اگر هنوز مشکل دارید

### بررسی process های node
```powershell
Get-Process node -ErrorAction SilentlyContinue
```

### Kill کردن همه
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### بررسی پورت دوباره
```powershell
netstat -ano | findstr :4000
```

اگر هنوز چیزی نشان داد، PID را پیدا کنید و kill کنید.

---

## تست نهایی

بعد از رفع مشکل:

```powershell
# بررسی health
Invoke-WebRequest -Uri "http://localhost:4000/health" | Select-Object -ExpandProperty Content

# تست route محصول
Invoke-WebRequest -Uri "http://localhost:4000/product/mg/349" | Select-Object -ExpandProperty Content
```

