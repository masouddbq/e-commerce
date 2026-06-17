# 🔧 راهنمای رفع مشکل IIS Rewrite Rule

## 🔍 مشکل

- ✅ Express کار می‌کند (localhost:4000 متاتگ‌ها را برمی‌گرداند)
- ❌ IIS rewrite rule درخواست را به Express نمی‌فرستد
- ❌ درخواست به frontend می‌رود و HTML خام React برمی‌گرداند

---

## ✅ راه‌حل: بررسی و اصلاح web.config

### مرحله 1: بررسی web.config

مسیر فایل:
```
C:\inetpub\wwwroot\lent-shop\web.config
```

یا در پروژه:
```
C:\e-commerce\web.config
```

---

### مرحله 2: بررسی Rule "Product Pages for All"

در `web.config` باید این rule وجود داشته باشد:

```xml
<rule name="Product Pages for All" stopProcessing="true">
  <match url="^product/([^/]+)/([^/]+)$" />
  <action type="Rewrite" url="http://localhost:4000/api/product/{R:1}/{R:2}" />
  <serverVariables>
    <set name="HTTP_ACCEPT_ENCODING" value="" />
  </serverVariables>
</rule>
```

---

### مرحله 3: بررسی ARR (Application Request Routing)

IIS rewrite rule نیاز به ARR دارد.

**بررسی نصب ARR:**
1. IIS Manager را باز کنید
2. به Server level بروید
3. بررسی کنید که "Application Request Routing Cache" وجود دارد

**اگر نصب نیست:**
- دانلود: https://www.iis.net/downloads/microsoft/application-request-routing
- نصب کنید
- IIS را restart کنید

---

### مرحله 4: بررسی Proxy Settings

در IIS Manager:
1. Server level → Application Request Routing → Server Proxy Settings
2. "Enable proxy" باید فعال باشد
3. Apply کنید

---

### مرحله 5: بررسی ترتیب Rules

در `web.config`، rule "Product Pages for All" باید **قبل از** rule "React Router" باشد.

---

### مرحله 6: Restart IIS

بعد از تغییرات:

```powershell
iisreset
```

---

## 🧪 تست بعد از رفع مشکل

```powershell
# تست Route اصلی
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"

# باید product_id را ببینید
```

---

## 📋 چک‌لیست

- [ ] Rule "Product Pages for All" در web.config موجود است
- [ ] Rule قبل از "React Router" است
- [ ] ARR نصب شده است
- [ ] Proxy در ARR فعال است
- [ ] IIS restart شده است
- [ ] تست Route اصلی موفق بود

