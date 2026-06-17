# 📋 راهنمای اعمال راه‌حل نهایی

## ⚡ تغییرات کلیدی

### تغییر اصلی:

Rule "Ignore Product for SPA" با `action="None"` به Rule "Block SPA for Product" با `action="AbortRequest"` تغییر کرد.

**چرا؟**
- `None` کافی نیست - IIS هنوز می‌تواند به Rule بعدی برسد
- `AbortRequest` به IIS می‌گوید: «دیگر هیچ Rule دیگری اجرا نشود»

---

## 📝 مراحل اعمال

### مرحله 1: کپی web.config

1. فایل `web.config` از پروژه local را باز کنید
2. همه محتوا را کپی کنید (`Ctrl + A`, `Ctrl + C`)
3. در سرور، فایل `C:\e-commerce\dist\web.config` را باز کنید
4. همه محتوا را جایگزین کنید (`Ctrl + A`, `Ctrl + V`)
5. ذخیره کنید (`Ctrl + S`)

---

### مرحله 2: بررسی Server Level Rules

**این مرحله خیلی مهم است!**

1. IIS Manager را باز کنید
2. **Server Name** را انتخاب کنید (نه Site)
3. **URL Rewrite** → **Inbound Rules**
4. **اگر rule‌های قدیمی یا SPA fallback را می‌بینید:**
   - آنها را **Delete** کنید
   - یا **Disable** کنید
5. **Apply** کنید

---

### مرحله 3: بررسی ARR

1. **Server Name** → **Application Request Routing**
2. **Server Proxy Settings**
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP** فعال باشد
   - ✅ **Reverse rewrite host** فعال باشد
4. **Apply** کنید

---

### مرحله 4: Restart IIS

```powershell
iisreset
```

---

### مرحله 5: تست

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

**اگر `product_id` را دیدید → موفق است ✅**

---

## 🔍 اگر هنوز کار نمی‌کند

### بررسی 1: Express Server

```powershell
curl.exe http://localhost:4000/api/product/toyota/996
```

**اگر کار نمی‌کند:**
```powershell
cd C:\e-commerce
pm2 start index.js --name lent-shop-api
pm2 save
```

---

### بررسی 2: ترتیب Rule‌ها

در IIS Manager:
- **Sites** → **lent-shop.ir** → **URL Rewrite**
- ترتیب باید این باشد:
  1. SSR Product Pages
  2. Block SPA for Product
  3. React Router

---

### بررسی 3: Pattern Test

1. Rule "SSR Product Pages" را انتخاب کنید
2. **Edit Rule** → **Test pattern**
3. **Input:** `product/toyota/996`
4. باید Match شود

---

### بررسی 4: Failed Request Tracing

1. **Sites** → **lent-shop.ir** → **Failed Request Tracing Rules**
2. **Add...** → **Status code(s):** `200-999`
3. **Trace areas:** همه را انتخاب کنید
4. **Finish**

**بعد:**
```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996
```

**بررسی Log:**
```
C:\inetpub\logs\FailedReqLogFiles\W3SVC1\
```

**دنبال `REWRITE` بگردید.**

---

## ✅ چک‌لیست

- [ ] `web.config` به سرور کپی شد
- [ ] Rule "Block SPA for Product" با `AbortRequest` است
- [ ] Server Level Rules بررسی شدند
- [ ] ARR Proxy فعال است
- [ ] IIS restart شد
- [ ] تست موفق است

---

## 🎯 نتیجه

بعد از اعمال این تغییرات، باید:
- ✅ درخواست‌ها به Express برسند
- ✅ متاتگ‌ها در View Source موجود باشند
- ✅ ربات‌ها بتوانند متاتگ‌ها را بخوانند

