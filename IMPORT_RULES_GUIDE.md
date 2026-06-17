# 🔧 راهنمای Import Rule‌ها به IIS

## 🔍 مشکل

Rule‌ها در `web.config` موجود هستند، اما در IIS Manager نمایش داده نمی‌شوند.

---

## ✅ راه‌حل 1: Restart IIS و Refresh

### مرحله 1: اجرای اسکریپت

```powershell
cd C:\temp
.\import-rules-to-iis.ps1
```

### مرحله 2: Refresh IIS Manager

1. **IIS Manager** را ببندید
2. دوباره باز کنید
3. **Sites** → **lent-shop.ir** → **URL Rewrite**
4. **F5** را بزنید (Refresh)
5. باید rule‌ها را ببینید

---

## ✅ راه‌حل 2: بررسی مسیر web.config

### مرحله 1: پیدا کردن Physical Path سایت

1. در IIS Manager، **Sites** → **lent-shop.ir** را انتخاب کنید
2. در پنل سمت راست، **Basic Settings** را کلیک کنید
3. **Physical Path** را یادداشت کنید (مثلاً `C:\inetpub\wwwroot\lent-shop`)

### مرحله 2: بررسی web.config

```powershell
# مسیر را با Physical Path سایت جایگزین کنید
$sitePath = "C:\inetpub\wwwroot\lent-shop"
Test-Path "$sitePath\web.config"
```

اگر `False` بود → `web.config` در جای اشتباه است.

### مرحله 3: کپی web.config به مسیر صحیح

```powershell
# اگر web.config در جای دیگری است، آن را کپی کنید
Copy-Item "C:\path\to\web.config" -Destination "$sitePath\web.config" -Force
```

---

## ✅ راه‌حل 3: Import Rules از web.config

اگر rule‌ها هنوز نمایش داده نمی‌شوند:

### مرحله 1: Import Rules

1. در IIS Manager، **Sites** → **lent-shop.ir** → **URL Rewrite**
2. در پنل سمت راست (Actions)، **Import Rules...** را کلیک کنید
3. **Browse** را کلیک کنید
4. فایل `web.config` را انتخاب کنید (از مسیر Physical Path سایت)
5. **Import** را کلیک کنید
6. باید rule‌ها import شوند

---

## ✅ راه‌حل 4: بررسی دستی web.config

### مرحله 1: باز کردن web.config

```powershell
notepad "C:\inetpub\wwwroot\lent-shop\web.config"
```

### مرحله 2: بررسی ساختار

باید این ساختار را ببینید:

```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SSR Product Pages" ...>
        <rule name="Ignore Product for SPA" ...>
        <rule name="React Router" ...>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### مرحله 3: بررسی خطاها

اگر خطای XML وجود دارد:
- IIS Manager rule‌ها را نمایش نمی‌دهد
- خطاها را برطرف کنید

---

## ✅ راه‌حل 5: اضافه کردن دستی Rule‌ها

اگر هیچ کدام از روش‌های بالا کار نکرد:

### Rule 1: SSR Product Pages

1. در IIS Manager، **Sites** → **lent-shop.ir** → **URL Rewrite**
2. **Add Rule(s)...** → **Blank rule**
3. تنظیمات:
   - **Name:** `SSR Product Pages`
   - **Requested URL:** `Matches the Pattern`
   - **Using:** `Regular Expressions`
   - **Pattern:** `^product/([^/]+)/([^/]+)$`
   - **Action type:** `Rewrite`
   - **Action URL:** `http://localhost:4000/api/product/{R:1}/{R:2}`
   - **Stop processing of subsequent rules:** ✅ (checked)
4. **Conditions:**
   - **Add...** → **Condition input:** `{HTTPS}`
   - **Check if input string:** `Matches the Pattern`
   - **Pattern:** `on`
5. **Apply**

### Rule 2: Ignore Product for SPA

1. **Add Rule(s)...** → **Blank rule**
2. تنظیمات:
   - **Name:** `Ignore Product for SPA`
   - **Requested URL:** `Matches the Pattern`
   - **Using:** `Regular Expressions`
   - **Pattern:** `^product/.*`
   - **Action type:** `None`
   - **Stop processing of subsequent rules:** ✅ (checked)
3. **Apply**

### Rule 3: React Router (قبلاً موجود است)

این rule قبلاً موجود است، فقط ترتیب را بررسی کنید.

---

## 🧪 تست نهایی

بعد از اضافه کردن rule‌ها:

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

اگر `product_id` را دیدید → موفق است ✅

---

## ⚠️ نکات مهم

1. **ترتیب Rule‌ها مهم است:**
   - SSR Product Pages (اول)
   - Ignore Product for SPA (دوم)
   - React Router (آخر)

2. **web.config باید در Physical Path سایت باشد**

3. **بعد از تغییر web.config، IIS را restart کنید**

4. **اگر rule‌ها را دستی اضافه می‌کنید، آنها در web.config ذخیره می‌شوند**

---

## ✅ چک‌لیست

- [ ] web.config در Physical Path سایت است
- [ ] IIS restart شد
- [ ] IIS Manager refresh شد
- [ ] Rule‌ها در IIS Manager نمایش داده می‌شوند
- [ ] ترتیب Rule‌ها درست است
- [ ] تست نهایی موفق است

