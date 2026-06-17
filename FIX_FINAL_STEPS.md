# 🔧 مراحل نهایی رفع مشکل

## 🔍 تشخیص مشکل

از نتیجه `curl` مشخص شد که `product_id` در پاسخ موجود نیست. این یعنی:

1. ❌ درخواست به Express نمی‌رسد
2. ❌ یا Express در حال اجرا نیست
3. ❌ یا Rewrite Rule کار نمی‌کند

---

## ✅ مرحله 1: بررسی Express Server

در PowerShell (در سرور):

```powershell
cd C:\temp
.\check-express.ps1
```

**اگر Express کار می‌کند:**
- مشکل از Rewrite Rule است
- به مرحله 2 بروید

**اگر Express کار نمی‌کند:**
- Express را شروع کنید:
  ```powershell
  cd C:\path\to\server  # مسیر server folder
  pm2 start index.js --name lent-shop-api
  pm2 save
  ```

---

## ✅ مرحله 2: بررسی نتیجه curl

```powershell
cd C:\temp
.\check-curl-result.ps1
```

این اسکریپت نشان می‌دهد که:
- آیا `product_id` در پاسخ موجود است
- آیا پاسخ React SPA است (بدون meta tags)
- مشکل از کجاست

---

## ✅ مرحله 3: اضافه کردن Rule‌ها دستی در IIS

**مهم:** چون `web.config` در `C:\e-commerce\dist\web.config` است و rule‌ها نمایش داده نمی‌شوند، باید دستی اضافه کنیم:

### Rule 1: SSR Product Pages

1. در IIS Manager، **Sites** → **lent-shop.ir** → **URL Rewrite**
2. در پنل سمت راست (Actions)، **Add Rule(s)...** → **Blank rule**
3. تنظیمات:
   - **Name:** `SSR Product Pages`
   - **Requested URL:** `Matches the Pattern`
   - **Using:** `Regular Expressions`
   - **Pattern:** `^product/([^/]+)/([^/]+)$`
   - **Action type:** `Rewrite`
   - **Action URL:** `http://localhost:4000/api/product/{R:1}/{R:2}`
   - ✅ **Stop processing of subsequent rules** (checked)
4. **Conditions:**
   - روی **Add...** کلیک کنید
   - **Condition input:** `{HTTPS}`
   - **Check if input string:** `Matches the Pattern`
   - **Pattern:** `on`
   - **OK**
5. **Server Variables:**
   - روی **Add...** کلیک کنید
   - **Name:** `HTTP_ACCEPT_ENCODING`
   - **Value:** (خالی بگذارید)
   - **OK**
6. **Apply**

### Rule 2: Ignore Product for SPA

1. **Add Rule(s)...** → **Blank rule**
2. تنظیمات:
   - **Name:** `Ignore Product for SPA`
   - **Requested URL:** `Matches the Pattern`
   - **Using:** `Regular Expressions`
   - **Pattern:** `^product/.*`
   - **Action type:** `None`
   - ✅ **Stop processing of subsequent rules** (checked)
3. **Apply**

### Rule 3: React Router

این rule قبلاً موجود است. فقط ترتیب را بررسی کنید:
- **SSR Product Pages** (اول - با Move Up به اول ببرید)
- **Ignore Product for SPA** (دوم)
- **React Router** (آخر)

---

## ✅ مرحله 4: بررسی ترتیب Rule‌ها

در IIS Manager:

1. **URL Rewrite** → **Inbound Rules**
2. ترتیب باید این باشد (از بالا به پایین):
   ```
   1. SSR Product Pages
   2. Ignore Product for SPA
   3. React Router
   ```

**اگر ترتیب اشتباه است:**
- Rule "SSR Product Pages" را انتخاب کنید
- **Move Up** را کلیک کنید تا به اول برسد
- **Apply**

---

## ✅ مرحله 5: بررسی ARR Proxy

1. در IIS Manager، **Server Name** → **Application Request Routing**
2. **Server Proxy Settings** را باز کنید
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP in X-Forwarded-For** فعال باشد
   - ✅ **Reverse rewrite host in response headers** فعال باشد
4. **Apply**

---

## ✅ مرحله 6: Restart IIS

```powershell
iisreset
```

---

## ✅ مرحله 7: تست نهایی

```powershell
cd C:\temp
.\check-curl-result.ps1
```

یا تست ساده:

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

**اگر `product_id` را دیدید → موفق است ✅**

---

## 🧪 تست کامل

```powershell
$html = curl.exe -s https://lent-shop.ir/product/toyota/996

if ($html -match 'name="product_id"') { 
    Write-Host "[SUCCESS] product_id found!" -ForegroundColor Green 
    Write-Host ""
    Write-Host "All meta tags should be working now!" -ForegroundColor Green
} else { 
    Write-Host "[FAIL] product_id NOT found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check:" -ForegroundColor Yellow
    Write-Host "  1. Express server is running" -ForegroundColor Cyan
    Write-Host "  2. Rules are added correctly in IIS" -ForegroundColor Cyan
    Write-Host "  3. Rules order is correct" -ForegroundColor Cyan
    Write-Host "  4. ARR Proxy is enabled" -ForegroundColor Cyan
}
```

---

## ✅ چک‌لیست نهایی

- [ ] Express server در حال اجرا است
- [ ] Rule "SSR Product Pages" در IIS اضافه شد
- [ ] Rule "Ignore Product for SPA" در IIS اضافه شد
- [ ] ترتیب Rule‌ها درست است
- [ ] ARR Proxy فعال است
- [ ] IIS restart شد
- [ ] تست نهایی موفق است
- [ ] `product_id` در پاسخ موجود است

---

## 🎯 نتیجه

بعد از انجام این مراحل:
- ✅ Rule‌ها در IIS Manager موجود هستند
- ✅ درخواست‌های `/product/*` به Express می‌رسند
- ✅ متاتگ‌ها در View Source قابل مشاهده هستند
- ✅ ربات‌ها (مثل ترب) می‌توانند متاتگ‌ها را بخوانند

