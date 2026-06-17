# راهنمای عیب‌یابی مشکلات ARR و Reverse Proxy

## 🔍 خطاهای رایج و راه‌حل‌ها

### خطا 1: "502 Bad Gateway" یا "502.3 - Bad Gateway"

**علت:** سرور Express در حال اجرا نیست یا به آن دسترسی نداریم.

**راه‌حل:**
1. بررسی کنید سرور Express در حال اجرا است:
   ```powershell
   pm2 status
   ```

2. اگر اجرا نیست، آن را شروع کنید:
   ```powershell
   pm2 start server/index.js --name "lent-shop-api"
   pm2 save
   ```

3. بررسی کنید پورت 4000 باز است:
   ```powershell
   netstat -an | findstr :4000
   ```

4. تست مستقیم سرور Express:
   ```powershell
   curl.exe http://localhost:4000/health
   ```
   باید `{"status":"ok",...}` را ببینید.

---

### خطا 2: "404 Not Found" برای صفحات محصول

**علت:** Rule درست کار نمی‌کند یا pattern اشتباه است.

**راه‌حل:**
1. بررسی کنید rule در IIS Manager وجود دارد
2. بررسی کنید pattern درست است: `^product/([^/]+)/([^/]+)$`
3. بررسی کنید rewrite URL درست است: `http://localhost:4000/product/{R:1}/{R:2}`
4. بررسی کنید rule قبل از React Router rule است

---

### خطا 3: "500 Internal Server Error"

**علت:** خطا در سرور Express یا مشکل در route.

**راه‌حل:**
1. بررسی لاگ‌های سرور Express:
   ```powershell
   pm2 logs lent-shop-api --lines 100
   ```

2. بررسی کنید فایل `dist/index.html` وجود دارد:
   ```powershell
   Test-Path C:\inetpub\wwwroot\lent-shop\dist\index.html
   ```

3. بررسی کنید محصول در دیتابیس وجود دارد

---

### خطا 4: متاتگ‌ها نمایش داده نمی‌شوند

**علت:** 
- Condition برای ربات‌ها کار نمی‌کند
- یا سرور Express route را ندارد

**راه‌حل:**
1. بررسی کنید condition درست است:
   - Condition input: `{HTTP_USER_AGENT}`
   - Pattern: `.*(bot|crawler|spider|torob|google|bing|yandex|facebookexternalhit).*`

2. تست با User-Agent ربات:
   ```powershell
   curl.exe -A "TorobBot/1.0" http://localhost/product/mg/349
   ```

3. بررسی کنید سرور Express route را دارد (فایل `server/index.js`)

---

### خطا 5: "The specified host name is not correct"

**علت:** در Reverse Proxy wizard، URL کامل وارد شده است.

**راه‌حل:**
- از Blank Rule استفاده کنید (نه Reverse Proxy wizard)
- در Action URL می‌توانید URL کامل وارد کنید

---

### خطا 6: "ARR is not enabled"

**علت:** ARR proxy فعال نشده است.

**راه‌حل:**
1. در IIS Manager، روی **نام سرور** کلیک کنید
2. **Application Request Routing Cache** → **Server Proxy Settings**
3. تیک **Enable proxy** را بزنید
4. **Apply** را کلیک کنید

---

## 🔧 تست‌های مرحله به مرحله

### تست 1: بررسی سرور Express
```powershell
# تست health endpoint
curl.exe http://localhost:4000/health

# باید ببینید: {"status":"ok","uptime":...}
```

### تست 2: تست مستقیم route محصول
```powershell
# تست بدون IIS
curl.exe http://localhost:4000/product/mg/349

# باید HTML با متاتگ‌ها را ببینید
```

### تست 3: تست از طریق IIS با User-Agent ربات
```powershell
# تست با User-Agent ربات
curl.exe -A "TorobBot/1.0" http://localhost/product/mg/349

# باید HTML با متاتگ‌ها را ببینید
```

### تست 4: تست از طریق IIS با User-Agent عادی
```powershell
# تست با User-Agent عادی
curl.exe http://localhost/product/mg/349

# باید HTML عادی (بدون متاتگ‌های ترب) را ببینید
```

---

## 📋 چک‌لیست عیب‌یابی

اگر مشکلی دارید، این موارد را بررسی کنید:

- [ ] سرور Express در حال اجرا است (`pm2 status`)
- [ ] پورت 4000 باز است (`netstat -an | findstr :4000`)
- [ ] ARR proxy فعال است (Server Proxy Settings)
- [ ] Rule در IIS Manager وجود دارد
- [ ] Rule در `web.config` موجود است
- [ ] Pattern rule درست است
- [ ] Rewrite URL درست است
- [ ] Condition برای ربات‌ها درست است
- [ ] فایل `dist/index.html` وجود دارد
- [ ] محصول در دیتابیس وجود دارد
- [ ] IIS restart شده است (`iisreset`)

---

## 🔍 بررسی لاگ‌ها

### لاگ‌های سرور Express
```powershell
# مشاهده لاگ‌های زنده
pm2 logs lent-shop-api

# مشاهده آخرین 100 خط
pm2 logs lent-shop-api --lines 100

# مشاهده فقط خطاها
pm2 logs lent-shop-api --err
```

### لاگ‌های IIS
1. به مسیر `C:\inetpub\logs\LogFiles\W3SVC[site-id]` بروید
2. فایل‌های log را بررسی کنید

---

## 🛠️ دستورات مفید برای عیب‌یابی

### بررسی وضعیت PM2
```powershell
pm2 status
pm2 list
pm2 info lent-shop-api
```

### Restart کردن سرور Express
```powershell
pm2 restart lent-shop-api
```

### بررسی پورت‌های باز
```powershell
netstat -an | findstr :4000
```

### Restart کردن IIS
```powershell
iisreset
```

### بررسی rule در web.config
```powershell
Get-Content C:\inetpub\wwwroot\lent-shop\dist\web.config | Select-String "Product Pages"
```

### تست اتصال به سرور Express
```powershell
Test-NetConnection -ComputerName localhost -Port 4000
```

---

## 📞 اگر هنوز مشکل دارید

1. **خروجی خطا را کپی کنید** و برای من بفرستید
2. **خروجی این دستورات را بفرستید:**
   ```powershell
   pm2 status
   curl.exe http://localhost:4000/health
   curl.exe -A "TorobBot/1.0" http://localhost/product/mg/349
   ```
3. **محتوای rule در IIS Manager** را بررسی کنید
4. **لاگ‌های سرور Express** را بررسی کنید: `pm2 logs lent-shop-api --lines 50`

---

## 💡 نکات مهم

1. **همیشه از `curl.exe` استفاده کنید** (نه `curl`)
2. **بعد از تغییر rule، IIS را restart کنید**
3. **بعد از تغییر سرور Express، PM2 را restart کنید**
4. **Rule باید قبل از React Router rule باشد**
5. **ARR proxy باید در سطح سرور فعال باشد**

