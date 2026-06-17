# 🔧 راهنمای گام‌به‌گام: رفع مشکل

## 🔍 مرحله 1: تشخیص مشکل

در PowerShell (در سرور):

```powershell
cd C:\temp
# اگر فایل complete-diagnosis.ps1 را دارید:
.\complete-diagnosis.ps1

# یا دستورات زیر را مستقیماً اجرا کنید:
```

### تست 1: بررسی Express

```powershell
curl.exe http://localhost:4000/api/product/toyota/996
```

**اگر `product_id` را دیدید:**
- ✅ Express کار می‌کند
- به مرحله 2 بروید

**اگر خطا داد یا خالی بود:**
- ❌ Express در حال اجرا نیست
- به بخش "شروع Express" بروید

---

## 🔧 مرحله 2: اگر Express کار نمی‌کند

### شروع Express:

```powershell
# پیدا کردن مسیر server
cd C:\e-commerce
# یا مسیر دیگری که server folder در آن است

# بررسی PM2
pm2 list

# اگر Express نیست، شروع کنید
pm2 start index.js --name lent-shop-api
pm2 save

# بررسی دوباره
curl.exe http://localhost:4000/api/product/toyota/996
```

**اگر Express شروع نشد:**
- مسیر server را بررسی کنید
- `package.json` را بررسی کنید
- Log‌های PM2 را ببینید: `pm2 logs`

---

## 🔧 مرحله 3: اگر Express کار می‌کند اما IIS کار نمی‌کند

### بررسی 1: Server Level Rules (خیلی مهم!)

**این مرحله خیلی مهم است!**

1. IIS Manager را باز کنید
2. **Server Name** را انتخاب کنید (نه Site)
3. **URL Rewrite** → **Inbound Rules**
4. **اگر rule‌های قدیمی یا SPA fallback را می‌بینید:**
   - آنها را **Delete** کنید
   - یا **Disable** کنید
5. **Apply** کنید

**چرا مهم است؟**
- Rule‌های Server-level قبل از Site-level اجرا می‌شوند
- اگر rule‌های Server-level SPA fallback داشته باشند، rule‌های Site-level هرگز اجرا نمی‌شوند

---

### بررسی 2: ترتیب Rule‌ها در Site Level

1. IIS Manager → **Sites** → **lent-shop.ir** → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. ترتیب باید این باشد (از بالا به پایین):
   ```
   1. SSR Product Pages
   2. Block SPA for Product
   3. React Router
   ```

**اگر ترتیب اشتباه است:**
- Rule "SSR Product Pages" را انتخاب کنید
- **↑ Move Up** را کلیک کنید تا به اول برسد
- **Apply** کنید

---

### بررسی 3: Pattern Test

1. Rule "SSR Product Pages" را انتخاب کنید
2. **Edit Rule** → **Test pattern**
3. **Input:** `product/toyota/996`
4. باید Match شود

**اگر Match نشد:**
- Pattern را بررسی کنید: `^product/([^/]+)/([^/]+)$`

---

### بررسی 4: Action Type

Rule "SSR Product Pages" را بررسی کنید:
- **Action type:** باید `Rewrite` باشد
- **Action URL:** باید `http://localhost:4000/api/product/{R:1}/{R:2}` باشد

**نه:** `https://localhost:4000/...` (نباید HTTPS باشد)

---

### بررسی 5: Block SPA Rule

Rule "Block SPA for Product" را بررسی کنید:
- **Action type:** باید `AbortRequest` باشد
- **نه:** `None` (این کار نمی‌کند)

**اگر `None` است:**
- Rule را Delete کنید
- دوباره اضافه کنید با `AbortRequest`

---

### بررسی 6: ARR Proxy

1. **Server Name** → **Application Request Routing**
2. **Server Proxy Settings**
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP** فعال باشد
   - ✅ **Reverse rewrite host** فعال باشد
4. **Apply** کنید

---

### بررسی 7: web.config

```powershell
Get-Content "C:\e-commerce\dist\web.config" | Select-String "AbortRequest"
```

**اگر چیزی نبود:**
- `web.config` درست کپی نشده است
- دوباره کپی کنید

---

## 🔧 مرحله 4: حذف و اضافه مجدد Rule‌ها

اگر همه چیز درست است اما هنوز کار نمی‌کند:

1. **Rule "SSR Product Pages"** را **Delete** کنید
2. **Rule "Block SPA for Product"** را **Delete** کنید
3. دوباره اضافه کنید (طبق راهنمای `ADD_RULES_MANUAL.md`)
4. **IIS restart:**
   ```powershell
   iisreset
   ```
5. **تست:**
   ```powershell
   curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
   ```

---

## 🔧 مرحله 5: Failed Request Tracing

اگر هنوز مشکل دارید:

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

## ✅ چک‌لیست نهایی

- [ ] Express server در حال اجرا است
- [ ] `curl http://localhost:4000/api/product/toyota/996` کار می‌کند
- [ ] Server-level rules بررسی و حذف شدند
- [ ] ترتیب Rule‌ها درست است
- [ ] Rule "Block SPA for Product" با `AbortRequest` است
- [ ] Pattern Test موفق است
- [ ] ARR Proxy فعال است
- [ ] `web.config` درست کپی شده است
- [ ] IIS restart شد
- [ ] تست نهایی موفق است

---

## 🎯 اگر هنوز کار نمی‌کند

نتیجه این دستورات را بفرستید:

```powershell
# 1. Express
curl.exe http://localhost:4000/api/product/toyota/996

# 2. IIS
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"

# 3. web.config
Get-Content "C:\e-commerce\dist\web.config" | Select-String "AbortRequest"

# 4. PM2
pm2 list
```

با این اطلاعات می‌توانم مشکل را دقیق‌تر تشخیص دهم.

