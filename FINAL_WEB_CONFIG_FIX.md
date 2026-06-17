# 🔧 رفع نهایی مشکل web.config

## ✅ وضعیت فعلی:

از لاگ‌ها مشخص است که:
- ✅ سرور Express در حال اجرا است (`OTP server listening on port 4000`)
- ✅ پورت 4000 آزاد است و سرور کار می‌کند
- ❌ مشکل از `web.config` است که rule های جدید را ندارد

---

## 🚨 مشکل:

فایل `web.config` در سرور (`C:\inetpub\wwwroot\lent-shop\web.config`) rule "Torob Products and Sitemap" را ندارد.

---

## ✅ راه‌حل:

### روش 1: کپی فایل آماده (ساده‌ترین)

1. فایل `web.config.CORRECT` را در سیستم محلی باز کنید
2. همه محتوا را کپی کنید (Ctrl+A, Ctrl+C)
3. در سرور، به این مسیر بروید:
   ```
   C:\inetpub\wwwroot\lent-shop\web.config
   ```
4. فایل را باز کنید و همه محتوا را جایگزین کنید (Ctrl+A, Ctrl+V)
5. ذخیره کنید (Ctrl+S)

### روش 2: اضافه کردن rule دستی

در فایل `web.config` سرور، **در ابتدای بخش `<rules>`** (قبل از rule "Static Files") این rule را اضافه کنید:

```xml
<!-- Proxy صفحه لیست محصولات ترب و sitemap به سرور Express -->
<!-- این rule باید قبل از Static Files باشد تا sitemap.xml به Express برود -->
<rule name="Torob Products and Sitemap" stopProcessing="true">
  <match url="^(torob-products|sitemap\.xml)$" />
  <action type="Rewrite" url="http://localhost:4000/{R:0}" />
  <serverVariables>
    <set name="HTTP_ACCEPT_ENCODING" value="" />
  </serverVariables>
</rule>
```

**و همچنین** در rule "Static Files"، `xml` را از pattern حذف کنید:

**قبل:**
```xml
<match url="^(assets|_next|static|favicon|images|fonts|.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|xml|txt|pdf))" />
```

**بعد:**
```xml
<match url="^(assets|_next|static|favicon|images|fonts|.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|txt|pdf))" />
```

(توجه: `xml` را حذف کنید)

**و همچنین** در rule "React Router"، این دو خط را اضافه کنید (در بخش conditions):

```xml
<add input="{REQUEST_URI}" pattern="^/torob-products" negate="true" />
<add input="{REQUEST_URI}" pattern="^/sitemap\.xml" negate="true" />
```

---

## 🔄 بعد از تغییر:

### 1. Restart IIS (ضروری):
```powershell
iisreset
```

### 2. بررسی کنید:
```powershell
# تست torob-products
Invoke-WebRequest -Uri "https://lent-shop.ir/torob-products" | Select-Object -ExpandProperty StatusCode

# تست sitemap
Invoke-WebRequest -Uri "https://lent-shop.ir/sitemap.xml" | Select-Object -ExpandProperty StatusCode
```

---

## 📋 چک‌لیست:

- [ ] فایل `web.config` در سرور به‌روز شده است
- [ ] rule "Torob Products and Sitemap" **قبل از** "Static Files" است
- [ ] XML از pattern "Static Files" حذف شده است
- [ ] rule "React Router" شامل مستثنی‌های torob-products و sitemap.xml است
- [ ] IIS restart شده است (`iisreset`)
- [ ] سرور Express در حال اجرا است (`pm2 status`)

---

## 🧪 تست نهایی:

بعد از انجام تغییرات:

1. **تست از مرورگر:**
   - `https://lent-shop.ir/torob-products` → باید لیست محصولات را ببینید
   - `https://lent-shop.ir/sitemap.xml` → باید sitemap با محصولات را ببینید

2. **تست از PowerShell:**
   ```powershell
   # بررسی اینکه route ها به Express می‌روند
   Invoke-WebRequest -Uri "http://localhost:4000/torob-products" | Select-Object StatusCode
   Invoke-WebRequest -Uri "http://localhost:4000/sitemap.xml" | Select-Object StatusCode
   ```

---

## ✅ تمام!

بعد از این تغییرات و restart IIS، لینک‌ها باید کار کنند! 🎉

**نکته مهم:** حتماً IIS را restart کنید (`iisreset`) تا تغییرات اعمال شوند.

