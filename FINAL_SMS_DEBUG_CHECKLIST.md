# ✅ چک‌لیست نهایی برای رفع مشکل پیامک تایید خرید

## 🎯 هدف
بررسی دقیق اینکه چرا پیامک تایید خرید ارسال نمی‌شود.

---

## 📋 مراحل بررسی (به ترتیب)

### ✅ مرحله 1: بررسی اینکه Callback به Backend می‌رود

**بعد از یک خرید تستی، در لاگ‌های سرور دنبال این بگردید:**

```
🚨🚨🚨 CALLBACK HIT - ROUTE EXECUTED 🚨🚨🚨
[Payment Callback] 🚨 CALLBACK HIT
```

**❌ اگر این لاگ را نمی‌بینید:**
→ یعنی callback به backend نمی‌رود
→ مشکل از callback URL است
→ باید `VITE_API_BASE_URL` درست باشد و frontend build شده باشد

**✅ اگر این لاگ را می‌بینید:**
→ به مرحله 2 بروید

---

### ✅ مرحله 2: بررسی اینکه به بخش SMS می‌رسد

**در لاگ‌ها دنبال این بگردید:**

```
[Payment Callback] 🚨🚨🚨 CALLBACK SUCCESS REACHED - SMS SECTION 🚨🚨🚨
[Payment Callback] 📱 بررسی ارسال پیامک تایید خرید
```

**❌ اگر این لاگ را نمی‌بینید:**
→ یعنی verify ناموفق است یا مشکلی در پردازش callback است
→ لاگ‌های قبل از این را بررسی کنید

**✅ اگر این لاگ را می‌بینید:**
→ به مرحله 3 بروید

---

### ✅ مرحله 3: بررسی تنظیمات SMS

**در لاگ‌ها دنبال این بگردید:**

```
[Payment Callback] ENABLE_ORDER_CONFIRMATION_SMS: true/false/undefined
[Payment Callback] ENABLE_ORDER_SMS (computed): true/false
[Payment Callback] FARAZ_SMS_ORDER_PATTERN_CODE: SET/NOT SET
```

**❌ اگر `ENABLE_ORDER_SMS (computed): false` است:**
→ در `server/.env` بررسی کنید: `ENABLE_ORDER_CONFIRMATION_SMS=true`
→ سرور را restart کنید

**❌ اگر `FARAZ_SMS_ORDER_PATTERN_CODE: NOT SET` است:**
→ در `server/.env` بررسی کنید: `FARAZ_SMS_ORDER_PATTERN_CODE=2713awd40oaxwlc`
→ سرور را restart کنید

**✅ اگر همه SET هستند:**
→ به مرحله 4 بروید

---

### ✅ مرحله 4: بررسی Phone Number

**در لاگ‌ها دنبال این بگردید:**

```
[Payment Callback] 📦 اطلاعات سفارش: {
  phoneRaw: "...",
  hasValidPhone: true/false
}
```

**❌ اگر `phoneRaw: null` یا `hasValidPhone: false` است:**
→ یعنی شماره تلفن در دیتابیس موجود نیست
→ باید بررسی کنید که در checkout شماره تلفن ثبت می‌شود
→ بررسی کنید که `phone` در جدول `orders` ذخیره می‌شود

**✅ اگر `hasValidPhone: true` است:**
→ به مرحله 5 بروید

---

### ✅ مرحله 5: بررسی ارسال پیامک

**در لاگ‌ها دنبال این بگردید:**

```
[Payment Callback] 📨 در حال ارسال پیامک...
[Faraz SMS] Starting Order Confirmation SMS send request
```

**❌ اگر این لاگ‌ها را نمی‌بینید:**
→ یعنی phone موجود نیست یا validate نمی‌شود
→ به مرحله 4 برگردید

**✅ اگر این لاگ‌ها را می‌بینید:**
→ به مرحله 6 بروید

---

### ✅ مرحله 6: بررسی خطاهای ارسال

**در لاگ‌ها دنبال خطاها بگردید:**

```
[Payment Callback] ⚠️ خطا در ارسال پیامک تایید خرید: ...
[Faraz SMS] ❌ Order Confirmation SMS failed: ...
```

**❌ اگر خطا می‌بینید:**
→ متن خطا را بخوانید
→ ممکن است Pattern Code یا متغیرها اشتباه باشند
→ ممکن است API Key یا Sender Number مشکل داشته باشد

**✅ اگر خطا نمی‌بینید و `success: true` می‌بینید:**
→ پیامک باید ارسال شده باشد
→ اگر نمی‌آید، مشکل از Faraz SMS است نه کد

---

## 🔍 راه‌حل سریع

**اگر می‌خواهید سریع مشکل را پیدا کنید:**

بعد از یک خرید تستی، این لاگ‌ها را به ترتیب در سرور پیدا کنید:

1. `🚨🚨🚨 CALLBACK HIT` → اگر نیست = callback به backend نمی‌رود
2. `CALLBACK SUCCESS REACHED - SMS SECTION` → اگر نیست = verify ناموفق
3. `ENABLE_ORDER_SMS (computed): true` → اگر false = در `.env` تنظیم نشده
4. `hasValidPhone: true` → اگر false = phone موجود نیست
5. `Starting Order Confirmation SMS` → اگر نیست = phone validate نمی‌شود
6. `success: true` → اگر false = خطا از Faraz SMS

---

## 🚨 نکته مهم

**باید دقیقاً بدانید کدام مرحله fail می‌کند.** بدون لاگ‌های دقیق نمی‌توانم مشکل را پیدا کنم.

لطفاً بعد از یک خرید تستی، **همه لاگ‌های مربوط به callback** را (از `CALLBACK HIT` به بعد) بفرستید.

