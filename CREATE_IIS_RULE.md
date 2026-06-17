# راهنمای ایجاد Rule در IIS Manager

## مرحله 1: باز کردن URL Rewrite

1. IIS Manager را باز کنید
2. روی **سایت lent-shop** کلیک کنید
3. در پنل وسط، **URL Rewrite** را پیدا کنید
4. **دوبار کلیک** کنید

---

## مرحله 2: ایجاد Rule جدید

1. در پنل راست، روی **Add Rule(s)...** کلیک کنید
2. **Blank Rule** را انتخاب کنید (نه Reverse Proxy)
3. **OK** را کلیک کنید

---

## مرحله 3: تنظیمات Rule

در پنجره **Edit Inbound Rule**:

### تب General:

**Name:**
```
Product Pages for Bots
```

**Pattern:**
```
^product/([^/]+)/([^/]+)$
```

**⚠️ مهم:** Pattern را دقیقاً این‌طور وارد کنید (با `^` و `$`)

---

### تب Action:

**Action type:**
- **Rewrite** را انتخاب کنید (نه Redirect)

**Action URL:**
```
http://localhost:4000/product/{R:1}/{R:2}
```

**⚠️ مهم:** 
- `{R:1}` = brand (مثلاً mg)
- `{R:2}` = productId (مثلاً 349)

---

### تب Conditions:

1. روی **Add...** کلیک کنید
2. تنظیمات:
   - **Condition input:** `{HTTP_USER_AGENT}`
   - **Check if input string:** `Matches the Pattern`
   - **Pattern:** `.*(bot|crawler|spider|torob|google|bing|yandex|facebookexternalhit).*`
   - **Ignore case:** ✓ (تیک بزنید)
3. **OK** را کلیک کنید

---

### تب Server Variables (اختیاری):

اگر می‌خواهید، می‌توانید این را اضافه کنید:

1. روی **Add...** کلیک کنید
2. **Server variable name:** `HTTP_ACCEPT_ENCODING`
3. **Value:** (خالی بگذارید)
4. **OK**

---

## مرحله 4: ذخیره Rule

1. **Apply** را کلیک کنید (در سمت راست بالا)
2. باید پیام "The changes have been saved successfully" را ببینید

---

## مرحله 5: بررسی ترتیب Rule ها

**⚠️ مهم:** Rule **"Product Pages for Bots"** باید قبل از **"React Router"** باشد!

1. در لیست Inbound Rules، rule ها را ببینید
2. Rule **"Product Pages for Bots"** باید بالاتر از **"React Router"** باشد
3. اگر نیست:
   - روی rule کلیک کنید
   - از دکمه‌های بالا/پایین استفاده کنید تا rule را جابجا کنید

---

## مرحله 6: Restart IIS

```powershell
iisreset
```

---

## مرحله 7: تست

```powershell
Invoke-WebRequest -Uri "http://localhost/product/mg/349" -Headers @{"User-Agent"="TorobBot/1.0"} | Select-Object -ExpandProperty Content | Select-String "product_id"
```

باید `product_id` را پیدا کند ✅

---

## اگر خطا دارید

### خطا: Pattern نامعتبر است
- بررسی کنید که Pattern دقیقاً این باشد: `^product/([^/]+)/([^/]+)$`
- `^` در ابتدا و `$` در انتها باید باشد

### خطا: Action URL نامعتبر است
- بررسی کنید که Action URL دقیقاً این باشد: `http://localhost:4000/product/{R:1}/{R:2}`
- `{R:1}` و `{R:2}` باید با حروف بزرگ باشد

### خطا: Condition کار نمی‌کند
- برای تست، موقتاً condition را حذف کنید
- اگر کار کرد، condition را دوباره اضافه کنید و pattern را بررسی کنید

---

## بررسی نهایی

بعد از ایجاد rule، بررسی کنید:

1. Rule در لیست Inbound Rules وجود دارد ✅
2. Rule قبل از React Router rule است ✅
3. Pattern درست است ✅
4. Action URL درست است ✅
5. Condition درست است ✅
6. IIS restart شده است ✅

