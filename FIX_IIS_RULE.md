# راهنمای رفع مشکل Rule در IIS

## مشکل
خطای 404 از طریق IIS یعنی rule درست کار نمی‌کند.

## مراحل بررسی و رفع

### مرحله 1: بررسی Rule در IIS Manager

1. IIS Manager را باز کنید
2. روی **سایت lent-shop** کلیک کنید
3. **URL Rewrite** را باز کنید
4. بررسی کنید که rule **"Product Pages for Bots"** وجود دارد

**اگر rule وجود ندارد:**
- باید rule را ایجاد کنید (طبق راهنمای قبلی)

**اگر rule وجود دارد:**
- روی rule دوبار کلیک کنید
- بررسی کنید:
  - **Pattern:** `^product/([^/]+)/([^/]+)$`
  - **Action type:** `Rewrite`
  - **Action URL:** `http://localhost:4000/product/{R:1}/{R:2}`
  - **Conditions:** باید condition برای `{HTTP_USER_AGENT}` وجود داشته باشد

---

### مرحله 2: بررسی ترتیب Rule ها

**مهم:** Rule محصول باید قبل از React Router rule باشد!

1. در URL Rewrite، rule ها را بررسی کنید
2. Rule **"Product Pages for Bots"** باید بالاتر از **"React Router"** باشد
3. اگر نیست، rule را drag & drop کنید تا بالاتر بیاید

---

### مرحله 3: بررسی ARR Proxy

1. در IIS Manager، روی **نام سرور** کلیک کنید (نه سایت)
2. **Application Request Routing Cache** → **Server Proxy Settings**
3. بررسی کنید که **Enable proxy** فعال است ✓

---

### مرحله 4: بررسی web.config

1. به مسیر `C:\inetpub\wwwroot\lent-shop\dist` بروید
2. فایل `web.config` را با Notepad باز کنید
3. بررسی کنید که rule وجود دارد

**باید چیزی شبیه این ببینید:**
```xml
<rule name="Product Pages for Bots" stopProcessing="true">
  <match url="^product/([^/]+)/([^/]+)$" />
  <conditions>
    <add input="{HTTP_USER_AGENT}" pattern=".*(bot|crawler|spider|torob|google|bing|yandex|facebookexternalhit).*" ignoreCase="true" />
  </conditions>
  <action type="Rewrite" url="http://localhost:4000/product/{R:1}/{R:2}" />
</rule>
```

**⚠️ مهم:** این rule باید قبل از React Router rule باشد!

---

### مرحله 5: Restart IIS

```powershell
iisreset
```

---

### مرحله 6: تست دوباره

```powershell
Invoke-WebRequest -Uri "http://localhost/product/mg/349" -Headers @{"User-Agent"="TorobBot/1.0"} | Select-Object -ExpandProperty Content | Select-String "product_id"
```

---

## اگر هنوز کار نمی‌کند

### راه‌حل 1: حذف Condition (موقتاً برای تست)

برای تست، می‌توانید condition را موقتاً حذف کنید:

1. در IIS Manager، روی rule کلیک کنید
2. به تب **Conditions** بروید
3. condition را حذف کنید
4. **Apply** کنید
5. تست کنید

**⚠️ بعد از تست، condition را دوباره اضافه کنید!**

---

### راه‌حل 2: بررسی Pattern

Pattern باید دقیقاً این باشد:
```
^product/([^/]+)/([^/]+)$
```

**نکته:** 
- `^` = شروع رشته
- `product/` = متن ثابت
- `([^/]+)` = یک یا چند کاراکتر غیر از `/` (capture group 1)
- `/` = اسلش
- `([^/]+)` = یک یا چند کاراکتر غیر از `/` (capture group 2)
- `$` = پایان رشته

---

### راه‌حل 3: بررسی Action URL

Action URL باید دقیقاً این باشد:
```
http://localhost:4000/product/{R:1}/{R:2}
```

**نکته:**
- `{R:1}` = مقدار capture group 1 (brand)
- `{R:2}` = مقدار capture group 2 (productId)

---

### راه‌حل 4: تست بدون Condition

برای اطمینان از اینکه rule کار می‌کند، موقتاً condition را حذف کنید:

1. در IIS Manager، rule را باز کنید
2. به تب **Conditions** بروید
3. condition را حذف کنید
4. **Apply** کنید
5. تست کنید:

```powershell
Invoke-WebRequest -Uri "http://localhost/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

اگر کار کرد، یعنی مشکل از condition است. condition را دوباره اضافه کنید و pattern را بررسی کنید.

---

## بررسی لاگ‌های IIS

1. به مسیر `C:\inetpub\logs\LogFiles\W3SVC[site-id]` بروید
2. آخرین فایل log را باز کنید
3. دنبال درخواست `/product/mg/349` بگردید
4. بررسی کنید که چه status code برگشته است

---

## تست نهایی

بعد از رفع مشکل:

```powershell
# تست 1: با User-Agent ربات (باید کار کند)
Invoke-WebRequest -Uri "http://localhost/product/mg/349" -Headers @{"User-Agent"="TorobBot/1.0"} | Select-Object -ExpandProperty Content | Select-String "product_id"

# تست 2: بدون User-Agent (نباید کار کند - باید به React Router برود)
Invoke-WebRequest -Uri "http://localhost/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

**نتیجه:**
- تست 1 باید `product_id` را پیدا کند ✅
- تست 2 نباید `product_id` را پیدا کند ✅

