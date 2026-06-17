# ✅ بررسی Rule‌ها در IIS Manager

## 📋 مراحل بررسی

### مرحله 1: بررسی Site Level Rules

در IIS Manager که باز است:

1. **Sites** → **[نام سایت شما]** → **URL Rewrite** را باز کنید
2. در پنل سمت راست، **Inbound Rules** را بررسی کنید
3. **باید این Rule‌ها را ببینید (به ترتیب از بالا به پایین):**

   ```
   1. Torob Products and Sitemap
   2. Static Files
   3. API and Payment Callback
   4. SSR Product Pages ⭐ (باید اینجا باشد)
   5. Ignore Product for SPA ⭐
   6. React Router
   ```

**اگر ترتیب اشتباه است:**
- Rule "SSR Product Pages" باید **قبل از** "React Router" باشد
- Rule "Ignore Product for SPA" باید **بعد از** "SSR Product Pages" باشد

**برای تغییر ترتیب:**
- Rule را انتخاب کنید
- در پنل سمت راست، **Move Up** یا **Move Down** را کلیک کنید
- **Apply** کنید

---

### مرحله 2: بررسی Server Level Rules (خیلی مهم!)

**این مرحله خیلی مهم است!**

1. در IIS Manager، **Server Name** را انتخاب کنید (نه Site)
2. **URL Rewrite** را دوبار کلیک کنید
3. **Inbound Rules** را بررسی کنید
4. **اگر rule‌های قدیمی یا اضافی را می‌بینید:**
   - آنها را **Delete** کنید
   - یا **Disable** کنید (اگر نمی‌خواهید حذف شوند)
5. **Apply** کنید

**چرا مهم است؟**
- Rule‌های Server Level قبل از Site Level اجرا می‌شوند
- اگر rule‌های قدیمی در Server Level باشند، rule‌های Site Level را override می‌کنند

---

### مرحله 3: تست Pattern

1. در IIS Manager، **Sites** → **[نام سایت]** → **URL Rewrite**
2. Rule **"SSR Product Pages"** را انتخاب کنید
3. در پنل سمت راست، **Edit Rule** را کلیک کنید
4. در پنجره باز شده، **Test pattern** را کلیک کنید
5. در فیلد **Input data to test**، این را وارد کنید:
   ```
   product/toyota/996
   ```
6. **Test** را کلیک کنید
7. باید **Match** شود و گروه‌ها را نشان دهد:
   - `{R:1}` = `toyota`
   - `{R:2}` = `996`

---

### مرحله 4: تست واقعی

در PowerShell (در سرور):

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

**اگر `product_id` را دیدید → موفق است ✅**

**اگر چیزی ندید:**
- Express server را بررسی کنید (باید روی پورت 4000 در حال اجرا باشد)
- ARR Proxy را بررسی کنید (باید Enable باشد)

---

## 🧪 تست کامل

### تست 1: بررسی همه متاتگ‌ها

```powershell
$html = curl.exe -s https://lent-shop.ir/product/toyota/996

# بررسی متاتگ‌های ترب
if ($html -match 'name="product_id"') { Write-Host "[OK] product_id" -ForegroundColor Green } else { Write-Host "[FAIL] product_id" -ForegroundColor Red }
if ($html -match 'name="product_name"') { Write-Host "[OK] product_name" -ForegroundColor Green } else { Write-Host "[FAIL] product_name" -ForegroundColor Red }
if ($html -match 'name="product_price"') { Write-Host "[OK] product_price" -ForegroundColor Green } else { Write-Host "[FAIL] product_price" -ForegroundColor Red }
if ($html -match 'name="availability"') { Write-Host "[OK] availability" -ForegroundColor Green } else { Write-Host "[FAIL] availability" -ForegroundColor Red }
```

### تست 2: بررسی View Source

1. مرورگر را باز کنید
2. به `https://lent-shop.ir/product/toyota/996` بروید
3. `Ctrl + U` (View Source)
4. جستجو کنید: `product_id`

اگر `product_id` را دیدید → موفق است ✅

---

## ⚠️ مشکلات رایج

### مشکل 1: Rule‌ها در Server Level هستند

**علت:** Rule‌های Server Level قبل از Site Level اجرا می‌شوند.

**راه‌حل:** Rule‌های Server Level را Delete یا Disable کنید.

---

### مشکل 2: ترتیب Rule‌ها اشتباه است

**علت:** "React Router" قبل از "SSR Product Pages" است.

**راه‌حل:** ترتیب را با **Move Up/Down** درست کنید.

---

### مشکل 3: Express Server در حال اجرا نیست

**بررسی:**

```powershell
# بررسی Express روی پورت 4000
curl.exe http://localhost:4000/api/product/toyota/996
```

**اگر خطا داد:**
- Express را با PM2 شروع کنید:
  ```powershell
  cd C:\path\to\server
  pm2 start index.js --name lent-shop-api
  pm2 save
  ```

---

### مشکل 4: ARR Proxy فعال نیست

**بررسی:**
1. IIS Manager → **Server Name** → **Application Request Routing**
2. **Server Proxy Settings** را باز کنید
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP in X-Forwarded-For** فعال باشد
   - ✅ **Reverse rewrite host in response headers** فعال باشد

---

## ✅ چک‌لیست نهایی

- [ ] Rule‌ها در Site Level درست هستند
- [ ] ترتیب Rule‌ها درست است (SSR Product Pages اول)
- [ ] Rule‌های Server Level بررسی و حذف شدند
- [ ] Pattern Test موفق است
- [ ] Express Server در حال اجرا است
- [ ] ARR Proxy فعال است
- [ ] تست واقعی با curl موفق است
- [ ] متاتگ‌ها در View Source موجود هستند

---

## 🎯 نتیجه

بعد از انجام این مراحل:
- ✅ Rule‌ها در IIS Manager درست هستند
- ✅ درخواست‌های `/product/*` به Express می‌رسند
- ✅ متاتگ‌ها در View Source قابل مشاهده هستند
- ✅ ربات‌ها (مثل ترب) می‌توانند متاتگ‌ها را بخوانند

