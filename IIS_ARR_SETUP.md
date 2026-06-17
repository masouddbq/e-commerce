# راهنمای تنظیم Application Request Routing (ARR) در IIS

## مرحله 1: فعال‌سازی Proxy در ARR

### 1.1 باز کردن IIS Manager
1. Windows Key + R
2. تایپ کنید: `inetmgr`
3. Enter

### 1.2 فعال‌سازی Server Proxy Settings
1. در سمت چپ، روی **نام سرور** کلیک کنید (نه روی سایت)
2. در پنل وسط، **Application Request Routing Cache** را پیدا کنید
3. دوبار کلیک کنید
4. در پنل راست، روی **Server Proxy Settings...** کلیک کنید
5. تیک **Enable proxy** را بزنید
6. **Apply** را کلیک کنید

## مرحله 2: تنظیم Reverse Proxy Rule برای صفحات محصول

### 2.1 باز کردن URL Rewrite
1. در IIS Manager، روی **سایت lent-shop** کلیک کنید
2. در پنل وسط، **URL Rewrite** را پیدا کنید
3. دوبار کلیک کنید

### 2.2 ایجاد Rule جدید
1. در پنل راست، روی **Add Rule(s)...** کلیک کنید
2. **Reverse Proxy** را انتخاب کنید
3. **OK** را کلیک کنید

### 2.3 تنظیمات Rule
در پنجره **Add Reverse Proxy Rule**:

**Inbound rule:**
```
^product/([^/]+)/([^/]+)$
```

**Rewrite URL:**
```
http://localhost:4000/product/{R:1}/{R:2}
```

**شرایط (Conditions):**
- روی **Add...** کلیک کنید
- **Condition input:** `{HTTP_USER_AGENT}`
- **Check if input string:** Matches the Pattern
- **Pattern:** `.*(bot|crawler|spider|torob|google|bing|yandex|facebookexternalhit).*`
- **Ignore case:** ✓ (تیک بزنید)
- **OK**

**نکته:** اگر می‌خواهید برای همه درخواست‌ها (نه فقط ربات‌ها) proxy شود، می‌توانید این condition را حذف کنید.

### 2.4 ذخیره Rule
1. **OK** را کلیک کنید
2. Rule باید در لیست نمایش داده شود

## مرحله 3: بررسی تنظیمات

### 3.1 بررسی Rule
بعد از ایجاد rule، باید چیزی شبیه این در `web.config` اضافه شود:

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

### 3.2 بررسی سرور Express
مطمئن شوید که سرور Express در حال اجرا است:
```powershell
pm2 status
```

اگر اجرا نیست:
```powershell
pm2 start server/index.js --name "lent-shop-api"
pm2 save
```

## مرحله 4: تست کردن

### 4.1 تست با curl (شبیه‌سازی ربات ترب)
```powershell
curl -A "Mozilla/5.0 (compatible; TorobBot/1.0)" http://localhost/product/mg/349
```

یا اگر از دامنه استفاده می‌کنید:
```powershell
curl -A "Mozilla/5.0 (compatible; TorobBot/1.0)" https://lent-shop.ir/product/mg/349
```

**نتیجه مورد انتظار:** باید HTML با متاتگ‌های زیر را ببینید:
```html
<meta name="product_id" content="349">
<meta name="product_name" content="...">
<meta property="og:image" content="...">
<meta name="product_price" content="...">
<meta name="product_old_price" content="...">
<meta name="availability" content="instock">
```

### 4.2 تست در مرورگر
1. به `https://lent-shop.ir/product/mg/349` بروید
2. View Source کنید (Ctrl+U)
3. متاتگ‌های ترب را بررسی کنید

**نکته:** اگر condition برای ربات‌ها تنظیم شده باشد، ممکن است در مرورگر عادی متاتگ‌ها را نبینید. برای تست، می‌توانید User-Agent مرورگر را تغییر دهید یا condition را موقتاً حذف کنید.

## عیب‌یابی

### مشکل: خطای 502 Bad Gateway
**راه‌حل:**
1. بررسی کنید که سرور Express در پورت 4000 در حال اجرا است
2. بررسی کنید که firewall پورت 4000 را باز کرده است
3. بررسی کنید که ARR proxy را فعال کرده است

### مشکل: Rule کار نمی‌کند
**راه‌حل:**
1. بررسی کنید که rule درست ایجاد شده است
2. بررسی کنید که pattern درست است
3. بررسی کنید که rewrite URL درست است
4. لاگ‌های IIS را بررسی کنید

### مشکل: متاتگ‌ها نمایش داده نمی‌شوند
**راه‌حل:**
1. بررسی کنید که سرور Express route را دارد
2. بررسی کنید که محصول در دیتابیس وجود دارد
3. بررسی کنید که فایل `dist/index.html` وجود دارد
4. لاگ‌های سرور Express را بررسی کنید: `pm2 logs lent-shop-api`

## تنظیمات پیشرفته (اختیاری)

### فقط برای ربات‌ها (پیشنهادی)
اگر می‌خواهید فقط برای ربات‌ها proxy شود (نه برای کاربران عادی):

**Condition:**
- Input: `{HTTP_USER_AGENT}`
- Pattern: `.*(bot|crawler|spider|torob|google|bing|yandex|facebookexternalhit).*`
- Ignore case: ✓

### برای همه درخواست‌ها
اگر می‌خواهید برای همه درخواست‌ها proxy شود:

**Condition را حذف کنید** یا از pattern زیر استفاده کنید:
- Pattern: `.*`

### تنظیم Timeout
اگر timeout دارید، می‌توانید timeout را افزایش دهید:

1. در IIS Manager، روی **سایت lent-shop** کلیک کنید
2. **Configuration Editor** را باز کنید
3. Section: `system.webServer/proxy`
4. `timeout` را پیدا کنید و مقدار را افزایش دهید (مثلاً 00:05:00)

## نکات مهم

1. **ARR باید نصب و فعال باشد**
2. **Server Proxy Settings باید Enable باشد**
3. **سرور Express باید در حال اجرا باشد**
4. **Rule باید قبل از React Router rule باشد** (در `web.config`)
5. **پورت 4000 باید باز باشد** در firewall

## دستورات مفید

### بررسی وضعیت PM2
```powershell
pm2 status
pm2 logs lent-shop-api
```

### Restart کردن سرور Express
```powershell
pm2 restart lent-shop-api
```

### Restart کردن IIS
```powershell
iisreset
```

### بررسی لاگ‌های IIS
1. IIS Manager → سایت → Logging
2. یا در Event Viewer → Windows Logs → Application

