# 🔧 رفع مشکل: IIS Rule اجرا نمی‌شود

## 🔍 مشکل

- ✅ `web.config` درست است
- ✅ Rule "Product SSR Proxy" موجود است
- ❌ Response length فقط 41 کاراکتر است (باید هزاران کاراکتر باشد)
- ❌ X-SSR header موجود نیست
- ❌ product_id موجود نیست

**نتیجه:** IIS Rule اجرا نمی‌شود و درخواست به Express نمی‌رسد.

---

## 🔧 راه‌حل‌های ممکن

### راه‌حل 1: بررسی Server Level Rules (خیلی مهم!)

**این مرحله خیلی مهم است!**

1. IIS Manager → **Server Name** (نه Site) → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. **اگر rule‌های قدیمی یا SPA fallback را می‌بینید:**
   - آنها را **Delete** کنید
   - یا **Disable** کنید
4. **Apply** کنید

**چرا مهم است؟**
- Rule‌های Server-level قبل از Site-level اجرا می‌شوند
- اگر rule‌های Server-level SPA fallback داشته باشند، rule‌های Site-level هرگز اجرا نمی‌شوند

---

### راه‌حل 2: بررسی Rule Order در Site Level

1. IIS Manager → **Sites** → **lent-shop.ir** → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. ترتیب باید این باشد:
   ```
   1. Product SSR Proxy (اول)
   2. React Router (آخر)
   ```

**اگر ترتیب اشتباه است:**
- Rule "Product SSR Proxy" را انتخاب کنید
- **↑ Move Up** را کلیک کنید تا به اول برسد
- **Apply** کنید

---

### راه‌حل 3: Pattern Test

1. Rule "Product SSR Proxy" را انتخاب کنید
2. **Edit Rule** → **Test pattern**
3. **Input:** `product/toyota/996`
4. باید Match شود

**اگر Match نشد:**
- Pattern را بررسی کنید: `^product/.*`

---

### راه‌حل 4: بررسی ARR Proxy

1. IIS Manager → **Server Name** → **Application Request Routing**
2. **Server Proxy Settings**
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP** فعال باشد
   - ✅ **Reverse rewrite host** فعال باشد
4. **Apply** کنید

---

### راه‌حل 5: بررسی Failed Request Tracing

**اگر هنوز مشکل دارید:**

1. IIS Manager → **Sites** → **lent-shop.ir**
2. **Failed Request Tracing Rules** → **Add...**
3. **Status code(s):** `200-999`
4. **Trace areas:** همه را انتخاب کنید
5. **Finish**

**بعد:**
```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996
```

**بررسی Log:**
```
C:\inetpub\logs\FailedReqLogFiles\W3SVC1\
```

**در Log دنبال `REWRITE` بگردید:**
- باید ببینید: `Rewrite to: http://localhost:4000/api/product/toyota/996`

**اگر `REWRITE` را نمی‌بینید:**
- Rule اجرا نشده است
- Server-level rules را بررسی کنید

---

## ✅ مراحل رفع مشکل (به ترتیب)

### مرحله 1: بررسی Server Level Rules (اولین و مهم‌ترین!)

1. IIS Manager → **Server Name** (نه Site) → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. **اگر rule‌های قدیمی یا SPA fallback را می‌بینید:**
   - آنها را **Delete** کنید
4. **Apply** کنید

---

### مرحله 2: بررسی Rule Order در Site Level

1. IIS Manager → **Sites** → **lent-shop.ir** → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. ترتیب باید این باشد:
   ```
   1. Product SSR Proxy (اول)
   2. React Router (آخر)
   ```

---

### مرحله 3: Pattern Test

1. Rule "Product SSR Proxy" را انتخاب کنید
2. **Edit Rule** → **Test pattern**
3. **Input:** `product/toyota/996`
4. باید Match شود

---

### مرحله 4: Restart IIS

```powershell
iisreset
```

---

### مرحله 5: تست مجدد

```powershell
# تست 1: بررسی متاتگ
curl.exe -s https://lent-shop.ir/product/toyota/996 | findstr "product_id"

# تست 2: بررسی هدر
curl.exe -I https://lent-shop.ir/product/toyota/996 2>&1 | findstr "X-SSR"

# تست 3: بررسی طول پاسخ
$result = curl.exe -s https://lent-shop.ir/product/toyota/996
Write-Host "Response length: $($result.Length)"
```

**باید ببینید:**
- `product_id` موجود است
- `X-SSR` موجود است
- Response length بیشتر از 3000 کاراکتر است

---

## 🔍 اگر هنوز مشکل دارید

نتیجه این دستورات را بفرستید:

```powershell
# 1. Express مستقیم
curl.exe -s http://localhost:4000/api/product/toyota/996 | findstr "product_id"

# 2. از طریق IIS
curl.exe -s https://lent-shop.ir/product/toyota/996 | findstr "product_id"

# 3. Headers
curl.exe -I https://lent-shop.ir/product/toyota/996 2>&1 | findstr "X-SSR"

# 4. Response length
$result = curl.exe -s https://lent-shop.ir/product/toyota/996
Write-Host "Response length: $($result.Length)"
```

با این اطلاعات می‌توانم مشکل را دقیق‌تر تشخیص دهم.

