# راهنمای بررسی و تست تنظیمات ARR

## ✅ روش 1: بررسی در IIS Manager

### 1.1 بررسی وجود Rule
1. در IIS Manager، روی **سایت lent-shop** کلیک کنید
2. **URL Rewrite** را باز کنید
3. در لیست **Inbound Rules**، باید rule با نام **"Product Pages for Bots"** را ببینید ✅

### 1.2 بررسی جزئیات Rule
1. روی rule **"Product Pages for Bots"** دوبار کلیک کنید
2. بررسی کنید:
   - **Pattern:** `^product/([^/]+)/([^/]+)$`
   - **Action type:** `Rewrite`
   - **Action URL:** `http://localhost:4000/product/{R:1}/{R:2}`
   - **Conditions:** باید condition برای `{HTTP_USER_AGENT}` وجود داشته باشد

---

## ✅ روش 2: بررسی فایل web.config

### 2.1 باز کردن فایل
1. به مسیر `C:\inetpub\wwwroot\lent-shop\dist` بروید
2. فایل `web.config` را با **Notepad** یا **VS Code** باز کنید

### 2.2 بررسی Rule
باید rule زیر را در فایل ببینید:

```xml
<rule name="Product Pages for Bots" stopProcessing="true">
  <match url="^product/([^/]+)/([^/]+)$" />
  <conditions logicalGrouping="MatchAny">
    <add input="{HTTP_USER_AGENT}" pattern=".*(bot|crawler|spider|torob|google|bing|yandex|facebookexternalhit).*" ignoreCase="true" />
  </conditions>
  <action type="Rewrite" url="http://localhost:4000/product/{R:1}/{R:2}" />
  <serverVariables>
    <set name="HTTP_ACCEPT_ENCODING" value="" />
  </serverVariables>
</rule>
```

**نکته:** اگر rule را در فایل نمی‌بینید، ممکن است نیاز به Apply کردن در IIS Manager باشد.

---

## ✅ روش 3: تست با PowerShell (مهم‌ترین روش)

### 3.1 تست با User-Agent ربات (باید متاتگ‌ها را ببینید)

**⚠️ برای Windows Server 2012 R2: از Invoke-WebRequest استفاده کنید**

```powershell
Invoke-WebRequest -Uri "http://localhost/product/mg/349" -Headers @{"User-Agent"="Mozilla/5.0 (compatible; TorobBot/1.0)"} | Select-Object -ExpandProperty Content
```

**یا اگر از دامنه استفاده می‌کنید:**
```powershell
Invoke-WebRequest -Uri "https://lent-shop.ir/product/mg/349" -Headers @{"User-Agent"="Mozilla/5.0 (compatible; TorobBot/1.0)"} | Select-Object -ExpandProperty Content
```

**یا برای دیدن فقط متاتگ‌ها:**
```powershell
(Invoke-WebRequest -Uri "http://localhost/product/mg/349" -Headers @{"User-Agent"="TorobBot/1.0"}).Content | Select-String "product_id"
```

**نکته:** اگر `curl.exe` در دسترس نیست (مثل Windows Server 2012 R2)، از `Invoke-WebRequest` استفاده کنید.

**نتیجه مورد انتظار:** باید HTML با متاتگ‌های زیر را ببینید:
```html
<meta name="product_id" content="349">
<meta name="product_name" content="...">
<meta property="og:image" content="...">
<meta name="product_price" content="...">
<meta name="product_old_price" content="...">
<meta name="availability" content="instock">
```

### 3.2 تست با User-Agent عادی (نباید متاتگ‌ها را ببینید)
```powershell
Invoke-WebRequest -Uri "http://localhost/product/mg/349" | Select-Object -ExpandProperty Content
```

**یا برای بررسی وجود متاتگ:**
```powershell
(Invoke-WebRequest -Uri "http://localhost/product/mg/349").Content | Select-String "product_id"
```
**نتیجه:** نباید `product_id` را پیدا کند (چون User-Agent عادی است)

**نتیجه مورد انتظار:** باید HTML عادی (بدون متاتگ‌های ترب) را ببینید.

**نکته:** اگر در هر دو حالت متاتگ‌ها را می‌بینید، یعنی condition کار نمی‌کند.

---

## ✅ روش 4: بررسی سرور Express

### 4.1 بررسی وضعیت
```powershell
pm2 status
```

**باید ببینید:**
```
┌─────┬──────────────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ status  │ restart │ uptime   │
├─────┼──────────────────┼─────────┼─────────┼──────────┤
│ 0   │ lent-shop-api    │ online  │ 0       │ 5m       │
└─────┴──────────────────┴─────────┴─────────┴──────────┘
```

### 4.2 بررسی لاگ‌ها
```powershell
pm2 logs lent-shop-api --lines 50
```

**باید ببینید:**
- اگر درخواست به سرور Express می‌رسد، باید لاگ‌هایی شبیه این ببینید:
```
[Product HTML Route] Fetching product: { productId: '349', brand: 'mg' }
```

---

## ✅ روش 5: تست مستقیم سرور Express

### 5.1 تست بدون IIS
```powershell
Invoke-WebRequest -Uri "http://localhost:4000/product/mg/349" | Select-Object -ExpandProperty Content
```

**یا برای بررسی متاتگ‌ها:**
```powershell
(Invoke-WebRequest -Uri "http://localhost:4000/product/mg/349").Content | Select-String "product_id"
```

**نتیجه مورد انتظار:** باید HTML با متاتگ‌های ترب را ببینید.

**نکته:** اگر این کار می‌کند اما از طریق IIS کار نمی‌کند، مشکل از rule یا ARR است.

---

## ✅ روش 6: بررسی لاگ‌های IIS

### 6.1 فعال‌سازی Failed Request Tracing (اختیاری)
1. در IIS Manager، روی **سایت lent-shop** کلیک کنید
2. **Failed Request Tracing Rules...** را دوبار کلیک کنید
3. **Add...** را کلیک کنید
4. **Status codes:** `200-999` را انتخاب کنید
5. **Next** → **Next** → **Finish**

### 6.2 بررسی لاگ‌ها
1. به مسیر `C:\inetpub\logs\FailedReqLogFiles\W3SVC[site-id]` بروید
2. فایل‌های XML را بررسی کنید

---

## ✅ روش 7: تست در مرورگر (با Extension)

### 7.1 نصب Extension برای تغییر User-Agent
1. در Chrome، Extension **User-Agent Switcher** را نصب کنید
2. User-Agent را به `TorobBot/1.0` تغییر دهید
3. به `https://lent-shop.ir/product/mg/349` بروید
4. **View Source** کنید (Ctrl+U)
5. متاتگ‌های ترب را بررسی کنید

---

## 🔍 چک‌لیست بررسی

بعد از انجام تست‌ها، این موارد را بررسی کنید:

- [ ] Rule در IIS Manager وجود دارد
- [ ] Rule در `web.config` موجود است
- [ ] تست با User-Agent ربات موفق است (متاتگ‌ها را می‌بیند)
- [ ] تست با User-Agent عادی موفق است (متاتگ‌ها را نمی‌بیند)
- [ ] سرور Express در حال اجرا است
- [ ] تست مستقیم سرور Express موفق است
- [ ] لاگ‌های سرور Express درخواست‌ها را نشان می‌دهند

---

## ❌ مشکلات رایج و راه‌حل

### مشکل: Rule در web.config نیست
**راه‌حل:**
1. در IIS Manager، روی rule کلیک کنید
2. **Apply** را کلیک کنید
3. دوباره `web.config` را بررسی کنید

### مشکل: تست با curl متاتگ‌ها را نمی‌بیند
**راه‌حل:**
1. بررسی کنید که سرور Express در حال اجرا است
2. بررسی کنید که rule درست است
3. بررسی کنید که condition درست است
4. لاگ‌های سرور Express را بررسی کنید

### مشکل: خطای 502 Bad Gateway
**راه‌حل:**
1. بررسی کنید که سرور Express در حال اجرا است: `pm2 status`
2. بررسی کنید که پورت 4000 باز است
3. بررسی کنید که ARR proxy فعال است

### مشکل: همه درخواست‌ها به سرور Express می‌روند (حتی کاربران عادی)
**راه‌حل:**
1. بررسی کنید که condition برای `{HTTP_USER_AGENT}` درست است
2. بررسی کنید که pattern درست است
3. بررسی کنید که logicalGrouping درست است (MatchAny)

---

## 🎯 تست نهایی

برای اطمینان کامل، این تست را انجام دهید:

**برای Windows Server 2012 R2 (بدون curl):**
```powershell
# تست 1: با User-Agent ربات (باید متاتگ‌ها را ببینید)
(Invoke-WebRequest -Uri "http://localhost/product/mg/349" -Headers @{"User-Agent"="TorobBot/1.0"}).Content | Select-String "product_id"

# تست 2: با User-Agent عادی (نباید متاتگ‌ها را ببینید)
(Invoke-WebRequest -Uri "http://localhost/product/mg/349").Content | Select-String "product_id"
```

**نتیجه:**
- تست 1 باید `product_id` را پیدا کند ✅
- تست 2 نباید `product_id` را پیدا کند ✅

**نتیجه:**
- تست 1 باید `product_id` را پیدا کند ✅
- تست 2 نباید `product_id` را پیدا کند ✅

---

## 📞 اگر هنوز مشکل دارید

1. خروجی `curl` را برای من بفرستید
2. محتوای `web.config` را بررسی کنید
3. لاگ‌های سرور Express را بررسی کنید: `pm2 logs lent-shop-api --lines 100`
4. وضعیت PM2 را بررسی کنید: `pm2 status`

