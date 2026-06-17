# راهنمای مرحله به مرحله تنظیم ARR در سرور

## ✅ مرحله 1: اتصال به سرور

### 1.1 اتصال با Remote Desktop
1. Windows Key + R
2. تایپ کنید: `mstsc`
3. Enter
4. آدرس IP سرور را وارد کنید
5. Username و Password را وارد کنید
6. Connect

### 1.2 یا با PowerShell (اگر SSH دارید)
```powershell
ssh username@server-ip
```

---

## ✅ مرحله 2: بررسی نصب ARR

### 2.1 باز کردن IIS Manager
1. Windows Key + R
2. تایپ کنید: `inetmgr`
3. Enter

### 2.2 بررسی وجود ARR
1. در سمت چپ، روی **نام سرور** کلیک کنید
2. در پنل وسط، دنبال **Application Request Routing Cache** بگردید
3. اگر پیدا کردید → ARR نصب شده ✅
4. اگر پیدا نکردید → باید ARR را نصب کنید (به مرحله 3 بروید)

---

## ✅ مرحله 3: نصب ARR (اگر نصب نشده)

### 3.1 دانلود ARR
1. مرورگر را باز کنید
2. به این آدرس بروید: https://www.iis.net/downloads/microsoft/application-request-routing
3. **Download** را کلیک کنید
4. فایل را دانلود کنید

### 3.2 نصب ARR
1. فایل دانلود شده را اجرا کنید
2. **Next** → **I accept** → **Install**
3. منتظر بمانید تا نصب تمام شود
4. **Finish** را کلیک کنید
5. IIS Manager را ببندید و دوباره باز کنید

---

## ✅ مرحله 4: فعال‌سازی Proxy در ARR

### 4.1 باز کردن Server Proxy Settings
1. در IIS Manager، در سمت چپ روی **نام سرور** کلیک کنید (نه روی سایت)
2. در پنل وسط، **Application Request Routing Cache** را پیدا کنید
3. **دوبار کلیک** کنید

### 4.2 فعال‌سازی Proxy
1. در پنل راست، روی **Server Proxy Settings...** کلیک کنید
2. در پنجره باز شده:
   - تیک **Enable proxy** را بزنید ✓
   - **Apply** را کلیک کنید (در سمت راست بالا)
3. باید پیام "The changes have been saved successfully" را ببینید

---

## ✅ مرحله 5: بررسی سرور Express

### 5.1 باز کردن PowerShell
1. Windows Key + X
2. **Windows PowerShell (Admin)** را انتخاب کنید

### 5.2 بررسی وضعیت PM2
```powershell
pm2 status
```

**نتیجه مورد انتظار:**
- باید `lent-shop-api` را ببینید
- Status باید `online` باشد

### 5.3 اگر سرور Express اجرا نیست:
```powershell
cd C:\inetpub\wwwroot\lent-shop
pm2 start server/index.js --name "lent-shop-api"
pm2 save
```

### 5.4 بررسی لاگ‌ها (اختیاری)
```powershell
pm2 logs lent-shop-api --lines 50
```

---

## ✅ مرحله 6: ایجاد Reverse Proxy Rule

### 6.1 باز کردن URL Rewrite
1. در IIS Manager، روی **سایت lent-shop** کلیک کنید
2. در پنل وسط، **URL Rewrite** را پیدا کنید
3. **دوبار کلیک** کنید

### 6.2 ایجاد Rule جدید (روش صحیح)
**⚠️ مهم:** از Reverse Proxy wizard استفاده نکنید! به جای آن از Blank Rule استفاده کنید:

1. در پنل راست، روی **Add Rule(s)...** کلیک کنید
2. **Blank Rule** را انتخاب کنید
3. **OK** را کلیک کنید

### 6.3 تنظیمات Rule
در پنجره **Edit Inbound Rule**:

**Name:**
```
Product Pages for Bots
```

**Pattern:**
```
^product/([^/]+)/([^/]+)$
```

**Action type:**
```
Rewrite
```

**Action URL:**
```
http://localhost:4000/product/{R:1}/{R:2}
```

**Server Variables (اختیاری):**
1. به تب **Server Variables** بروید
2. روی **Add...** کلیک کنید
3. **Server variable name:** `HTTP_ACCEPT_ENCODING`
4. **Value:** (خالی بگذارید)
5. **OK**

**OK** را کلیک کنید

### 6.4 اضافه کردن Condition برای ربات‌ها
1. روی rule ایجاد شده **دوبار کلیک** کنید
2. به تب **Conditions** بروید
3. روی **Add...** کلیک کنید
4. تنظیمات:
   - **Condition input:** `{HTTP_USER_AGENT}`
   - **Check if input string:** `Matches the Pattern`
   - **Pattern:** `.*(bot|crawler|spider|torob|google|bing|yandex|facebookexternalhit).*`
   - **Ignore case:** ✓ (تیک بزنید)
5. **OK** را کلیک کنید
6. **Apply** را کلیک کنید (در سمت راست بالا)

---

## ✅ مرحله 7: بررسی web.config

### 7.1 بررسی فایل
1. به مسیر `C:\inetpub\wwwroot\lent-shop\dist` بروید
2. فایل `web.config` را با Notepad باز کنید
3. بررسی کنید که rule جدید اضافه شده باشد

**باید چیزی شبیه این ببینید:**
```xml
<rule name="ReverseProxyInboundRule1" stopProcessing="true">
  <match url="^product/([^/]+)/([^/]+)$" />
  <conditions>
    <add input="{HTTP_USER_AGENT}" pattern=".*(bot|crawler|spider|torob|google|bing|yandex|facebookexternalhit).*" ignoreCase="true" />
  </conditions>
  <action type="Rewrite" url="http://localhost:4000/product/{R:1}/{R:2}" />
  <serverVariables>
    <set name="HTTP_ACCEPT_ENCODING" value="" />
  </serverVariables>
</rule>
```

---

## ✅ مرحله 8: Restart کردن IIS

### 8.1 Restart از PowerShell
```powershell
iisreset
```

### 8.2 یا از IIS Manager
1. در IIS Manager، روی **نام سرور** کلیک راست کنید
2. **Restart** را انتخاب کنید

---

## ✅ مرحله 9: تست کردن

### 9.1 تست با PowerShell (شبیه‌سازی ربات ترب)

**⚠️ برای Windows Server 2012 R2: از Invoke-WebRequest استفاده کنید**

```powershell
Invoke-WebRequest -Uri "http://localhost/product/mg/349" -Headers @{"User-Agent"="Mozilla/5.0 (compatible; TorobBot/1.0)"} | Select-Object -ExpandProperty Content
```

**یا اگر از دامنه استفاده می‌کنید:**
```powershell
Invoke-WebRequest -Uri "https://lent-shop.ir/product/mg/349" -Headers @{"User-Agent"="Mozilla/5.0 (compatible; TorobBot/1.0)"} | Select-Object -ExpandProperty Content
```

**یا برای بررسی فقط متاتگ‌ها:**
```powershell
(Invoke-WebRequest -Uri "http://localhost/product/mg/349" -Headers @{"User-Agent"="TorobBot/1.0"}).Content | Select-String "product_id"
```

### 9.2 نتیجه مورد انتظار
باید HTML با متاتگ‌های زیر را ببینید:
```html
<meta name="product_id" content="349">
<meta name="product_name" content="...">
<meta property="og:image" content="...">
<meta name="product_price" content="...">
<meta name="product_old_price" content="...">
<meta name="availability" content="instock">
```

### 9.3 اگر متاتگ‌ها را نمی‌بینید:
1. بررسی کنید که سرور Express در حال اجرا است: `pm2 status`
2. بررسی کنید که rule درست ایجاد شده است
3. لاگ‌های سرور Express را بررسی کنید: `pm2 logs lent-shop-api`
4. لاگ‌های IIS را بررسی کنید

---

## ✅ مرحله 10: تست نهایی با مرورگر

### 10.1 تست در مرورگر
1. مرورگر را باز کنید
2. به `https://lent-shop.ir/product/mg/349` بروید
3. **View Source** کنید (Ctrl+U)
4. متاتگ‌های ترب را بررسی کنید

**نکته:** اگر condition برای ربات‌ها تنظیم شده باشد، ممکن است در مرورگر عادی متاتگ‌ها را نبینید. این طبیعی است! ربات ترب که با User-Agent مخصوص می‌آید، متاتگ‌ها را می‌بیند.

---

## 🔍 عیب‌یابی

### مشکل: خطای 502 Bad Gateway
**راه‌حل:**
1. بررسی کنید که سرور Express در حال اجرا است:
   ```powershell
   pm2 status
   ```
2. بررسی کنید که پورت 4000 باز است:
   ```powershell
   netstat -an | findstr :4000
   ```
3. بررسی کنید که ARR proxy فعال است (مرحله 4)

### مشکل: Rule کار نمی‌کند
**راه‌حل:**
1. بررسی کنید که rule درست ایجاد شده است
2. بررسی کنید که pattern درست است: `^product/([^/]+)/([^/]+)$`
3. بررسی کنید که rewrite URL درست است: `http://localhost:4000/product/{R:1}/{R:2}`
4. لاگ‌های IIS را بررسی کنید

### مشکل: متاتگ‌ها نمایش داده نمی‌شوند
**راه‌حل:**
1. بررسی کنید که سرور Express route را دارد (فایل `server/index.js`)
2. بررسی کنید که محصول در دیتابیس وجود دارد
3. بررسی کنید که فایل `dist/index.html` وجود دارد
4. لاگ‌های سرور Express را بررسی کنید:
   ```powershell
   pm2 logs lent-shop-api --lines 100
   ```

---

## ✅ چک‌لیست نهایی

بعد از انجام تمام مراحل، این موارد را بررسی کنید:

- [ ] ARR نصب شده است
- [ ] Server Proxy Settings فعال است
- [ ] سرور Express در حال اجرا است (`pm2 status`)
- [ ] Reverse Proxy Rule ایجاد شده است
- [ ] Condition برای ربات‌ها اضافه شده است
- [ ] IIS restart شده است
- [ ] تست با curl موفق بوده است
- [ ] متاتگ‌های ترب در HTML موجود هستند

---

## 📞 اگر مشکلی پیش آمد

1. لاگ‌های سرور Express را بررسی کنید: `pm2 logs lent-shop-api`
2. لاگ‌های IIS را بررسی کنید
3. بررسی کنید که همه مراحل را درست انجام داده‌اید
4. اگر هنوز مشکل دارید، خطا را برای من بفرستید

---

## 🎉 موفق باشید!

بعد از انجام این مراحل، سایت شما باید برای ربات ترب آماده باشد.

