# 📝 راهنمای اضافه کردن Rule‌ها (نسخه اصلاح شده)

## Rule 1: SSR Product Pages

### مرحله 1: باز کردن Add Rule

1. در IIS Manager، **Sites** → **lent-shop.ir** → **URL Rewrite**
2. در پنل سمت راست (Actions)، **Add Rule(s)...** را کلیک کنید
3. **Blank rule** را انتخاب کنید
4. **OK**

### مرحله 2: تنظیمات اصلی

در پنجره **Edit Inbound Rule**:

- **Name:** `SSR Product Pages`
- **Requested URL:**
  - ✅ **Matches the Pattern** (انتخاب کنید)
- **Using:**
  - ✅ **Regular Expressions** (انتخاب کنید)
- **Pattern:** 
  ```
  ^product/([^/]+)/([^/]+)$
  ```
- **Ignore case:** ✅ (checked)

### مرحله 3: Action

- **Action type:**
  - ✅ **Rewrite** (انتخاب کنید)
- **Action URL:**
  ```
  http://localhost:4000/api/product/{R:1}/{R:2}
  ```
- ✅ **Stop processing of subsequent rules** (checked)

### مرحله 4: Conditions

1. روی **Add...** کلیک کنید
2. **Condition input:** `{HTTPS}`
3. **Check if input string:**
   - ✅ **Matches the Pattern** (انتخاب کنید)
4. **Pattern:** `on`
5. **OK**

### مرحله 5: Server Variables (اختیاری - می‌توانید رد کنید)

**نکته:** اگر Server Variables را اضافه نمی‌کنید، مشکلی نیست. این اختیاری است.

**اگر می‌خواهید اضافه کنید:**

1. روی **Add...** کلیک کنید (در بخش Server Variables)
2. **Name:** `HTTP_ACCEPT_ENCODING`
3. **Value:** یک space بزنید (نه خالی، بلکه یک فاصله)
   - یا می‌توانید اصلاً Server Variable را اضافه نکنید
4. **OK**

**یا اصلاً Server Variables را اضافه نکنید** - این مشکلی ایجاد نمی‌کند.

### مرحله 6: Apply

- **Apply** را کلیک کنید

---

## Rule 2: Ignore Product for SPA

### مرحله 1: باز کردن Add Rule

1. **Add Rule(s)...** → **Blank rule**
2. **OK**

### مرحله 2: تنظیمات

- **Name:** `Ignore Product for SPA`
- **Requested URL:**
  - ✅ **Matches the Pattern**
- **Using:**
  - ✅ **Regular Expressions**
- **Pattern:**
  ```
  ^product/.*
  ```
- **Ignore case:** ✅ (checked)

### مرحله 3: Action

- **Action type:**
  - ✅ **None** (انتخاب کنید)
- ✅ **Stop processing of subsequent rules** (checked)

### مرحله 4: Apply

- **Apply** را کلیک کنید

---

## Rule 3: React Router

این rule قبلاً موجود است. فقط ترتیب را بررسی کنید.

---

## بررسی ترتیب Rule‌ها

در IIS Manager، **URL Rewrite** → **Inbound Rules**:

ترتیب باید این باشد (از بالا به پایین):

```
1. SSR Product Pages
2. Ignore Product for SPA
3. React Router
```

**اگر ترتیب اشتباه است:**

1. Rule "SSR Product Pages" را انتخاب کنید
2. در پنل Actions، **↑ Move Up** را کلیک کنید
3. تا به اول برسد
4. **Apply**

---

## بررسی ARR Proxy

1. در IIS Manager، **Server Name** (نه Site) → **Application Request Routing**
2. **Server Proxy Settings** را باز کنید
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP in X-Forwarded-For** فعال باشد
   - ✅ **Reverse rewrite host in response headers** فعال باشد
4. **Apply**

---

## Restart IIS

```powershell
iisreset
```

---

## تست نهایی

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

**اگر `product_id` را دیدید → موفق است ✅**

---

## ⚠️ نکته مهم

**Server Variables اختیاری است.** اگر نمی‌توانید آن را اضافه کنید، مشکلی نیست. Rule بدون Server Variables هم کار می‌کند.

تنها چیزهای ضروری:
- ✅ Pattern درست
- ✅ Action URL درست
- ✅ Conditions (HTTPS)
- ✅ Stop processing

---

## ✅ چک‌لیست

- [ ] Rule "SSR Product Pages" اضافه شد (بدون Server Variables هم OK است)
- [ ] Rule "Ignore Product for SPA" اضافه شد
- [ ] ترتیب Rule‌ها درست است
- [ ] ARR Proxy فعال است
- [ ] IIS restart شد
- [ ] تست نهایی موفق است

