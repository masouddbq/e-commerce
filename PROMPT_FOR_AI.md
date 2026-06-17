# پرامپت برای AI (فارسی)

## توضیح مشکل

من یک وب‌سایت فروشگاهی دارم با مشخصات زیر:

**Frontend:**
- React SPA ساخته شده با Vite
- دیپلوی شده روی IIS (Windows Server 2012 R2)
- دامنه: `https://lent-shop.ir`
- مسیر فیزیکی: `C:\e-commerce\dist`

**Backend:**
- سرور Express.js روی Node.js
- پورت: 4000 (localhost)
- مدیریت با PM2
- Route: `/api/product/:brand/:productId` که HTML با متاتگ‌ها برای SEO و ترب برمی‌گرداند

**Web Server:**
- IIS با URL Rewrite Module
- Application Request Routing (ARR) نصب شده
- SSL/HTTPS فعال است

## وضعیت فعلی

### ✅ چیزهایی که کار می‌کنند:

1. **سرور Express کار می‌کند:**
   - دسترسی مستقیم به `http://localhost:4000/api/product/toyota/996` HTML با تمام متاتگ‌ها را برمی‌گرداند
   - متاتگ‌ها شامل: `product_id`, `product_name`, `product_price`, `availability`, `og:title`, `og:description` و غیره هستند
   - سرور Express با PM2 در حال اجرا است

2. **فایل web.config:**
   - در مسیر: `C:\e-commerce\dist\web.config`
   - شامل rewrite rule‌ها برای صفحات محصول است
   - Rule‌ها در فایل به درستی تعریف شده‌اند

### ❌ چیزهایی که کار نمی‌کنند:

1. **IIS Rewrite Rules اجرا نمی‌شوند:**
   - وقتی به `https://lent-shop.ir/product/toyota/996` دسترسی پیدا می‌کنم، درخواست به Express نمی‌رسد
   - به جای آن، HTML React SPA برگردانده می‌شود (با `<div id="root">` اما بدون متاتگ‌ها)
   - متاتگ‌ها در پاسخ موجود نیستند

2. **IIS Manager Rule‌ها را نشان می‌دهد:**
   - Rule‌ها در IIS Manager تحت URL Rewrite → Inbound Rules قابل مشاهده هستند
   - ترتیب Rule‌ها (از بالا به پایین):
     1. SSR Product Pages
     2. Ignore Product for SPA
     3. React Router
   - تست Pattern در IIS Manager نشان می‌دهد که pattern به درستی match می‌شود

3. **نتایج تست:**
   ```powershell
   # این کار می‌کند (Express):
   curl.exe http://localhost:4000/api/product/toyota/996
   # برمی‌گرداند: HTML با متاتگ‌ها ✅
   
   # این کار نمی‌کند (IIS):
   curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
   # برمی‌گرداند: خالی (product_id پیدا نشد) ❌
   ```

## جزئیات پیکربندی

### ساختار web.config:
```xml
<rule name="SSR Product Pages" stopProcessing="true">
  <match url="^product/([^/]+)/([^/]+)$" />
  <conditions logicalGrouping="MatchAll">
    <add input="{HTTPS}" pattern="on" />
  </conditions>
  <action type="Rewrite" url="http://localhost:4000/api/product/{R:1}/{R:2}" />
</rule>

<rule name="Ignore Product for SPA" stopProcessing="true">
  <match url="^product/.*" />
  <action type="None" />
</rule>

<rule name="React Router" stopProcessing="true">
  <match url=".*" />
  <conditions>
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
    <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
    <add input="{REQUEST_URI}" pattern="^/product/" negate="true" />
  </conditions>
  <action type="Rewrite" url="/index.html" />
</rule>
```

### تنظیمات ARR:
- Enable Proxy: ✅ فعال
- Preserve client IP in X-Forwarded-For: ✅ فعال
- Reverse rewrite host in response headers: ✅ فعال

## تحلیل مشکل

مشکل به نظر می‌رسد که:
1. سرور Express وقتی مستقیماً دسترسی پیدا می‌کند، به درستی کار می‌کند
2. IIS Rewrite rules پیکربندی شده‌اند و در IIS Manager قابل مشاهده هستند
3. Pattern matching در ابزار تست IIS Manager کار می‌کند
4. اما: وقتی از طریق IIS به سایت دسترسی پیدا می‌کنم، rewrite rule اجرا نمی‌شود
5. به جای آن، React Router rule درخواست را catch می‌کند و `/index.html` را serve می‌کند

## آنچه نیاز دارم

لطفاً راه‌حلی به **فارسی** ارائه دهید که:

1. **تشخیص دهد چرا IIS Rewrite rule اجرا نمی‌شود** با وجود اینکه:
   - Pattern به درستی match می‌شود
   - Rule در ترتیب درست است (قبل از React Router)
   - ARR Proxy فعال است

2. **دستورالعمل‌های گام‌به‌گام برای رفع مشکل** شامل:
   - چگونه بررسی کنیم که rule واقعاً اجرا می‌شود
   - چگونه بررسی کنیم که آیا rule‌های متضاد در سطح Server وجود دارند
   - چگونه اطمینان حاصل کنیم که rewrite قبل از اینکه React Router آن را catch کند، اتفاق می‌افتد
   - هر پیکربندی IIS که ممکن است rewrite را مسدود کند

3. **شامل مراحل تأیید** برای اطمینان از کار کردن fix:
   - چگونه تست کنیم که درخواست‌ها به Express می‌رسند
   - چگونه تأیید کنیم که متاتگ‌ها در پاسخ هستند
   - چگونه log‌ها را بررسی کنیم در صورت نیاز

4. **مسائل رایج را در نظر بگیرد** مانند:
   - Rule‌های سطح Server که rule‌های سطح Site را override می‌کنند
   - مشکلات cache
   - مشکلات پیکربندی ARR
   - مشکلات ترتیب اجرای Rule
   - مشکلات HTTPS/SSL که روی rewrite تأثیر می‌گذارند

## زمینه اضافی

- Windows Server 2012 R2
- IIS 8.5
- URL Rewrite Module 2.1
- Application Request Routing 3.0
- سایت از HTTPS استفاده می‌کند (گواهی SSL معتبر است)
- سرور Express در حال اجرا است و در localhost:4000 قابل دسترسی است
- PM2 فرآیند Express را مدیریت می‌کند

## نتیجه مورد انتظار

بعد از fix:
- دسترسی به `https://lent-shop.ir/product/toyota/996` باید HTML با متاتگ‌ها را برگرداند
- درخواست باید به `http://localhost:4000/api/product/toyota/996` rewrite شود
- Express باید درخواست را پردازش کند و HTML با متاتگ‌ها را برگرداند
- متاتگ‌ها باید در View Source (بدون JavaScript) قابل مشاهده باشند

لطفاً راه‌حل را به **فارسی** ارائه دهید.
