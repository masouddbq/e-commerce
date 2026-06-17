# راهنمای نهایی عیب‌یابی - رفع مشکل Rule و متاتگ‌های ترب

## 🔍 بررسی مرحله به مرحله

### مرحله 1: بررسی ARR Proxy (مهم!)

1. در IIS Manager، روی **نام سرور** کلیک کنید (نه سایت)
2. **Application Request Routing Cache** → **Server Proxy Settings**
3. بررسی کنید که **Enable proxy** فعال است ✓
4. اگر فعال نیست، فعال کنید و **Apply** کنید

---

### مرحله 2: بررسی Frontend Build

```powershell
# بررسی وجود فایل dist/index.html
Test-Path C:\e-commerce\dist\index.html

# اگر False بود، build کنید:
cd C:\e-commerce
npm run build
```

---

### مرحله 3: بررسی Rule در web.config

فایل `C:\e-commerce\dist\web.config` را باز کنید و بررسی کنید:

```xml
<rule name="Product Pages for Bots" stopProcessing="true">
    <match url="^product/([^/]+)/([^/]+)$" />
    <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
    </conditions>
    <action type="Rewrite" url="http://127.0.0.1:4000/product/{R:1}/{R:2}" />
    <serverVariables>
        <set name="HTTP_ACCEPT_ENCODING" value="" />
    </serverVariables>
</rule>
```

**نکات مهم:**
- `stopProcessing="true"` باید باشد
- Rule باید قبل از React Router rule باشد
- Action URL باید `http://127.0.0.1:4000/product/{R:1}/{R:2}` باشد

---

### مرحله 4: بررسی سرور Express

```powershell
# بررسی وضعیت
pm2 status

# تست مستقیم (باید کار کند)
Invoke-WebRequest -Uri "http://localhost:4000/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

اگر این کار کرد، یعنی سرور Express درست است.

---

### مرحله 5: بررسی ترتیب Rule ها در IIS Manager

1. در IIS Manager، روی **سایت lent-shop** کلیک کنید
2. **URL Rewrite** را باز کنید
3. بررسی کنید که rule **"Product Pages for Bots"** قبل از **"React Router"** است
4. اگر نیست، از دکمه **↑ Move Up** استفاده کنید

---

### مرحله 6: Restart همه چیز

```powershell
# Restart سرور Express
pm2 restart lent-shop-api

# Restart IIS
iisreset
```

---

### مرحله 7: تست نهایی

```powershell
# تست از طریق IIS
Invoke-WebRequest -Uri "http://localhost/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

---

## 🔧 راه‌حل‌های احتمالی

### راه‌حل 1: حذف و ایجاد دوباره Rule

1. در IIS Manager، rule **"Product Pages for Bots"** را حذف کنید
2. Rule جدید ایجاد کنید:
   - **Name:** `Product Pages for Bots`
   - **Pattern:** `^product/([^/]+)/([^/]+)$`
   - **Action type:** `Rewrite`
   - **Action URL:** `http://127.0.0.1:4000/product/{R:1}/{R:2}`
   - **stopProcessing:** `true` (در تب General)
3. Rule را قبل از React Router rule قرار دهید
4. IIS را restart کنید

---

### راه‌حل 2: تغییر Action URL

اگر `127.0.0.1` کار نکرد، امتحان کنید:

```
http://localhost:4000/product/{R:1}/{R:2}
```

یا IP واقعی سرور:

```
http://[IP-سرور]:4000/product/{R:1}/{R:2}
```

---

### راه‌حل 3: بررسی لاگ‌ها

```powershell
# لاگ‌های سرور Express
pm2 logs lent-shop-api --lines 50

# بررسی لاگ‌های IIS
Get-Content C:\inetpub\logs\LogFiles\W3SVC*\*.log -Tail 50
```

---

## 📋 چک‌لیست کامل

- [ ] ARR proxy فعال است (Server Proxy Settings → Enable proxy)
- [ ] Frontend build شده است (`npm run build`)
- [ ] فایل `dist/index.html` وجود دارد
- [ ] Rule در `web.config` درست است (با `stopProcessing="true"`)
- [ ] Rule قبل از React Router rule است
- [ ] Action URL درست است (`http://127.0.0.1:4000/product/{R:1}/{R:2}`)
- [ ] سرور Express در حال اجرا است (`pm2 status`)
- [ ] تست مستقیم سرور Express کار می‌کند
- [ ] IIS restart شده است (`iisreset`)

---

## 🎯 تست نهایی

بعد از انجام تمام مراحل:

```powershell
# تست 1: تست مستقیم سرور Express (باید کار کند)
Invoke-WebRequest -Uri "http://localhost:4000/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"

# تست 2: تست از طریق IIS (باید کار کند)
Invoke-WebRequest -Uri "http://localhost/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

هر دو تست باید `product_id` را پیدا کنند.

---

## ❓ اگر هنوز کار نمی‌کند

لطفاً این اطلاعات را بفرستید:

1. **نتیجه تست مستقیم سرور Express:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:4000/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"
   ```

2. **نتیجه تست از طریق IIS:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"
   ```

3. **وضعیت ARR proxy:** آیا فعال است؟

4. **محتوای rule در IIS Manager:** Pattern و Action URL چیست؟

5. **ترتیب rule ها:** کدام rule بالاتر است؟

این اطلاعات را بفرستید تا مشکل را پیدا کنیم.

