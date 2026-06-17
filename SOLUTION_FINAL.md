# ✅ راه‌حل نهایی: رفع مشکل Rewrite Rule

## 🔍 مشکل

- ✅ Express کار می‌کند
- ✅ ARR Proxy فعال است
- ✅ Rule موجود است
- ❌ اما rewrite rule کار نمی‌کند

---

## ✅ راه‌حل: اصلاح Pattern

مشکل احتمالاً از **pattern matching** است. Pattern فعلی ممکن است با URL match نکند.

### روش 1: اصلاح Pattern در web.config

در فایل `C:\inetpub\wwwroot\lent-shop\web.config`، rule "Product Pages for All" را پیدا کنید و pattern را تغییر دهید:

**قبل:**
```xml
<match url="^product/([^/]+)/([^/]+)$" />
```

**بعد:**
```xml
<match url="^product/(.+)/(.+)$" />
```

یا:

```xml
<match url="product/([^/]+)/([^/]+)" />
```

---

### روش 2: استفاده از REQUEST_URI به جای url

```xml
<rule name="Product Pages for All" stopProcessing="true">
  <match url=".*" />
  <conditions>
    <add input="{REQUEST_URI}" pattern="^/product/([^/]+)/([^/]+)$" />
  </conditions>
  <action type="Rewrite" url="http://localhost:4000/api/product/{C:1}/{C:2}" />
  <serverVariables>
    <set name="HTTP_ACCEPT_ENCODING" value="" />
  </serverVariables>
</rule>
```

---

### روش 3: تست با URL Rewrite Test

در IIS Manager:
1. به سایت `lent-shop.ir` بروید
2. "URL Rewrite" را باز کنید
3. rule "Product Pages for All" را باز کنید
4. روی "Test pattern" کلیک کنید
5. URL را وارد کنید: `product/toyota/996`
6. ببینید که آیا match می‌کند یا نه

---

## 🧪 تست بعد از اصلاح

```powershell
# Restart IIS
iisreset

# تست Route اصلی
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

---

## 📋 مراحل

1. فایل `C:\inetpub\wwwroot\lent-shop\web.config` را باز کنید
2. Pattern را اصلاح کنید (روش 1 یا 2)
3. فایل را ذخیره کنید
4. `iisreset` اجرا کنید
5. تست کنید

