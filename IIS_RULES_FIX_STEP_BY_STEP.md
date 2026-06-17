# 🔧 راهنمای کامل: رفع مشکل Rule‌ها در IIS Manager

## 🔍 مشکل

Rule‌ها در `web.config` ذخیره شده‌اند، اما IIS Manager rule‌های دیگری نشان می‌دهد.

---

## ✅ راه‌حل مرحله‌به‌مرحله

### مرحله 1: اجرای اسکریپت بررسی

در PowerShell (به عنوان Administrator):

```powershell
cd E:\FrontProjects\Lent-shop-new\lent-shop
.\fix-iis-rules.ps1
```

این اسکریپت:
- ✅ مسیر `web.config` را بررسی می‌کند
- ✅ Rule‌های مهم را چک می‌کند
- ✅ IIS را restart می‌کند

---

### مرحله 2: بررسی Site Level Rules

1. **IIS Manager** را باز کنید
2. **Sites** → **lent-shop** (یا نام سایت شما)
3. **URL Rewrite** را دوبار کلیک کنید
4. **باید این Rule‌ها را ببینید** (به ترتیب از بالا به پایین):

   ```
   1. Torob Products and Sitemap
   2. Static Files
   3. API and Payment Callback
   4. SSR Product Pages ⭐ (باید اینجا باشد)
   5. Ignore Product for SPA ⭐
   6. React Router
   ```

**اگر rule‌های قدیمی یا متفاوت را می‌بینید:**

---

### مرحله 3: حذف Rule‌های قدیمی

**روش 1: از IIS Manager (توصیه می‌شود)**

1. در **URL Rewrite**، rule‌های قدیمی یا اضافی را انتخاب کنید
2. در پنل سمت راست، **Delete** را کلیک کنید
3. برای هر rule قدیمی تکرار کنید
4. **Apply** را کلیک کنید (در پنل سمت راست)

**روش 2: بررسی ترتیب Rule‌ها**

- Rule **"SSR Product Pages"** باید **قبل از** "React Router" باشد
- اگر ترتیب اشتباه است:
  1. Rule را انتخاب کنید
  2. در پنل سمت راست، **Move Up** یا **Move Down** را کلیک کنید
  3. **Apply** کنید

---

### مرحله 4: بررسی Server Level Rules (خیلی مهم!)

**مهم:** ممکن است rule‌های قدیمی در **Server Level** تعریف شده باشند که rule‌های Site Level را override می‌کنند.

1. در IIS Manager، **Server Name** را انتخاب کنید (نه Site)
2. **URL Rewrite** را دوبار کلیک کنید
3. **اگر rule‌های قدیمی را می‌بینید:**
   - آنها را **Delete** کنید
   - یا **Disable** کنید (اگر نمی‌خواهید حذف شوند)
4. **Apply** کنید

---

### مرحله 5: Refresh IIS Manager

1. **IIS Manager** را کاملاً ببندید
2. دوباره باز کنید
3. **Sites** → **lent-shop** → **URL Rewrite**
4. باید rule‌های جدید را ببینید

---

### مرحله 6: تست Pattern

1. Rule **"SSR Product Pages"** را انتخاب کنید
2. در پنل سمت راست، **Edit Rule** را کلیک کنید
3. در پنجره باز شده، **Test pattern** را کلیک کنید
4. در فیلد **Input data to test**، این را وارد کنید:
   ```
   product/toyota/996
   ```
5. **Test** را کلیک کنید
6. باید **Match** شود و گروه‌ها را نشان دهد:
   - `{R:1}` = `toyota`
   - `{R:2}` = `996`

---

### مرحله 7: Restart IIS (اگر هنوز مشکل دارید)

```powershell
iisreset
```

---

## 🧪 تست نهایی

### تست 1: بررسی Rule‌ها

در IIS Manager باید این Rule‌ها را ببینید:

- [ ] ✅ **SSR Product Pages** (با شرط HTTPS)
- [ ] ✅ **Ignore Product for SPA**
- [ ] ✅ **React Router** (با شرط مستثنی کردن product)

### تست 2: Pattern Test

- [ ] ✅ Pattern `product/toyota/996` Match می‌شود
- [ ] ✅ گروه‌ها درست استخراج می‌شوند

### تست 3: تست واقعی

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

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

### مشکل 3: IIS Manager Cache شده

**علت:** IIS Manager rule‌های قدیمی را cache کرده.

**راه‌حل:**
1. IIS Manager را ببندید
2. `iisreset` اجرا کنید
3. IIS Manager را دوباره باز کنید

---

### مشکل 4: web.config در جای اشتباه است

**بررسی:**

```powershell
Test-Path "C:\inetpub\wwwroot\lent-shop\web.config"
```

اگر `False` بود → فایل را به این مسیر کپی کنید.

---

## 📋 چک‌لیست نهایی

- [ ] `web.config` در `C:\inetpub\wwwroot\lent-shop\` است
- [ ] Rule‌های قدیمی از Site Level حذف شدند
- [ ] Rule‌های Server Level بررسی و حذف شدند
- [ ] ترتیب Rule‌ها درست است (SSR Product Pages اول)
- [ ] IIS restart شد (`iisreset`)
- [ ] IIS Manager refresh شد
- [ ] Pattern Test موفق است
- [ ] تست واقعی با curl موفق است

---

## 🎯 نتیجه

بعد از انجام این مراحل:
- ✅ Rule‌ها در IIS Manager با `web.config` هماهنگ هستند
- ✅ Rule "SSR Product Pages" به درستی اجرا می‌شود
- ✅ درخواست‌های `/product/*` به Express می‌رسند
- ✅ متاتگ‌ها در View Source قابل مشاهده هستند

---

## 💡 نکته مهم

اگر بعد از همه این مراحل هنوز مشکل دارید:

1. **Failed Request Tracing** را فعال کنید:
   - Site → Failed Request Tracing Rules → Add
   - Pattern: `product/*`
   - Status codes: `200-999`
   - Trace areas: همه را انتخاب کنید
   - Generate rule

2. یک درخواست بزنید: `https://lent-shop.ir/product/toyota/996`

3. Log را بررسی کنید:
   ```
   C:\inetpub\logs\FailedReqLogFiles\W3SVC1\
   ```

4. در Log، دنبال **REWRITE** بگردید و ببینید آیا rule اجرا شده است یا نه.

