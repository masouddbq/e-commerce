# 🔧 رفع مشکل: Rule‌ها در IIS Manager متفاوت هستند

## 🔍 مشکل

Rule‌ها در `web.config` ذخیره شده‌اند، اما IIS Manager rule‌های دیگری نشان می‌دهد.

---

## ✅ راه‌حل مرحله‌به‌مرحله

### مرحله 1: بررسی محل web.config

**مهم:** `web.config` باید در root سایت باشد:

```
C:\inetpub\wwwroot\lent-shop\web.config
```

**بررسی:**
```powershell
Test-Path "C:\inetpub\wwwroot\lent-shop\web.config"
```

اگر `False` بود → فایل در جای اشتباه است.

---

### مرحله 2: بررسی Site در IIS Manager

1. IIS Manager را باز کنید
2. Sites → `lent-shop` (یا نام سایت شما)
3. URL Rewrite را باز کنید
4. **مهم:** باید rule‌های `web.config` را ببینید

**اگر rule‌های قدیمی را می‌بینید:**

---

### مرحله 3: حذف Rule‌های قدیمی

**روش 1: از IIS Manager**

1. در URL Rewrite، rule‌های قدیمی را انتخاب کنید
2. Delete کنید
3. **Apply** کنید

**روش 2: از PowerShell (سریع‌تر)**

```powershell
# بکاپ بگیرید
Copy-Item "C:\inetpub\wwwroot\lent-shop\web.config" "C:\inetpub\wwwroot\lent-shop\web.config.backup"

# IIS را restart کنید
iisreset
```

---

### مرحله 4: بررسی Rule‌های Server Level

**مهم:** ممکن است rule‌ها در Server Level تعریف شده باشند:

1. IIS Manager → **Server Name** (نه Site)
2. URL Rewrite را باز کنید
3. اگر rule‌های قدیمی را می‌بینید:
   - آنها را Delete کنید
   - یا Disable کنید

---

### مرحله 5: Refresh IIS Manager

1. IIS Manager را ببندید
2. دوباره باز کنید
3. Sites → `lent-shop` → URL Rewrite
4. باید rule‌های جدید را ببینید

---

### مرحله 6: بررسی محتوای web.config

```powershell
# محتوای web.config را ببینید
Get-Content "C:\inetpub\wwwroot\lent-shop\web.config" | Select-String "SSR Product Pages"
```

اگر چیزی نبود → فایل درست کپی نشده است.

---

## 🧪 تست نهایی

### تست 1: بررسی Rule‌ها در IIS Manager

باید این Rule‌ها را ببینید (به ترتیب):

1. ✅ **SSR Product Pages** (اولین rule)
2. ✅ **Ignore Product for SPA**
3. ✅ **React Router** (آخرین rule)

### تست 2: Pattern Test

1. Rule "SSR Product Pages" را انتخاب کنید
2. Edit → Test Pattern
3. URL: `product/toyota/996`
4. باید Match شود ✅

### تست 3: Restart IIS

```powershell
iisreset
```

---

## ⚠️ نکات مهم

1. **Rule‌ها باید در Site Level باشند** (نه Server Level)
2. **ترتیب Rule‌ها مهم است** - "SSR Product Pages" باید اول باشد
3. **بعد از تغییر web.config، IIS را restart کنید**
4. **اگر rule‌های قدیمی در Server Level هستند، آنها را حذف کنید**

---

## 🔍 تشخیص مشکل

اگر هنوز مشکل دارید:

```powershell
# 1. بررسی web.config
Get-Content "C:\inetpub\wwwroot\lent-shop\web.config" | Select-String "rule name"

# 2. بررسی rule‌های Server Level
# در IIS Manager: Server Name → URL Rewrite

# 3. بررسی Application Pool
# در IIS Manager: Application Pools → lent-shop → Recycle
```

---

## ✅ چک‌لیست

- [ ] `web.config` در `C:\inetpub\wwwroot\lent-shop\` است
- [ ] Rule‌های قدیمی از IIS Manager حذف شدند
- [ ] Rule‌های Server Level بررسی شدند
- [ ] IIS restart شد (`iisreset`)
- [ ] IIS Manager refresh شد
- [ ] Rule "SSR Product Pages" اولین rule است
- [ ] Pattern Test موفق است

