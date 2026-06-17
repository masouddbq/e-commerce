# راهنمای عیب‌یابی پیامک تایید خرید

## 🔍 مراحل بررسی

### 1️⃣ بررسی لاگ‌های سرور

ابتدا لاگ‌های سرور را بررسی کنید:

```powershell
# اگر از PM2 استفاده می‌کنید:
pm2 logs lent-shop-api --lines 200

# یا اگر لاگ فایل دارید:
Get-Content C:\path\to\logs\server.log -Tail 200
```

**دنبال این لاگ‌ها بگردید:**

✅ **اگر این لاگ را دیدید** = callback رسیده:
```
[Payment Callback] 🚨🚨🚨 CALLBACK SUCCESS REACHED - SMS SECTION 🚨🚨🚨
```

✅ **اگر این لاگ را دیدید** = پیامک در حال ارسال:
```
[Payment Callback] 📨 در حال ارسال پیامک...
[Faraz SMS] Starting Order Confirmation SMS send request
```

❌ **اگر این لاگ را دیدید** = پیامک غیرفعال است:
```
[Payment Callback] ℹ️ ارسال پیامک تایید خرید غیرفعال است
```

❌ **اگر این لاگ را دیدید** = شماره تلفن موجود نیست:
```
[Payment Callback] ⚠️ phone: MISSING
```

---

### 2️⃣ بررسی تنظیمات .env

مطمئن شوید که این تنظیمات در `server/.env` وجود دارند:

```env
ENABLE_ORDER_CONFIRMATION_SMS=true
FARAZ_SMS_ORDER_PATTERN_CODE=2713awd40oaxwlc
FARAZ_SMS_ORDER_PATTERN_VARIABLE_NAMES=order_number,tracking_code,amount
FARAZ_SMS_API_KEY=your_api_key
FARAZ_SMS_SENDER_NUMBER=3000505
FARAZ_SMS_API_URL=https://edge.ippanel.com/v1
```

**⚠️ مهم:** بعد از تغییر `.env`، حتماً سرور را restart کنید!

---

### 3️⃣ بررسی اینکه callback به بخش SMS رسیده یا نه

در لاگ‌ها دنبال این موارد بگردید:

```
[Payment Callback] ✅ وضعیت سفارش به paid تغییر یافت
[Payment Callback] 🔍 بررسی نهایی payment_ref_id در دیتابیس: ...
[Payment Callback] 📱 بررسی ارسال پیامک تایید خرید
```

**اگر این لاگ‌ها را نمی‌بینید:**
- یعنی callback به بخش SMS نرسیده
- ممکن است verify ناموفق باشد
- یا order پیدا نشده باشد

---

### 4️⃣ بررسی خطاهای ارسال پیامک

اگر لاگ `[Faraz SMS] Starting Order Confirmation SMS send request` را دیدید، دنبال خطاها بگردید:

```
[Faraz SMS] ❌ Order Confirmation SMS failed: ...
[Payment Callback] ⚠️ خطا در ارسال پیامک تایید خرید: ...
```

**خطاهای رایج:**

1. **Pattern Code تنظیم نشده:**
   ```
   Pattern Code برای تایید خرید تنظیم نشده است
   ```
   → باید `FARAZ_SMS_ORDER_PATTERN_CODE` در `.env` تنظیم شود

2. **API Key یا Sender Number تنظیم نشده:**
   ```
   تنظیمات پنل پیامکی کامل نیست
   ```
   → باید `FARAZ_SMS_API_KEY` و `FARAZ_SMS_SENDER_NUMBER` تنظیم شوند

3. **خطا از API Faraz:**
   ```
   خطا از سرویس پیامکی: [کد خطا]
   ```
   → کد خطا را بررسی کنید

---

### 5️⃣ بررسی اطلاعات سفارش

در لاگ‌ها دنبال این بگردید:

```
[Payment Callback] 📦 اطلاعات سفارش: {
  phone: "09xx***",
  order_number: "...",
  payment_ref_id: "..."
}
```

**اگر `phone: NOT SET` بود:**
- یعنی شماره تلفن در دیتابیس ذخیره نشده
- باید بررسی کنید که در checkout شماره تلفن ثبت می‌شود

---

### 6️⃣ تست دستی ارسال پیامک

می‌توانید یک تابع تست ایجاد کنید:

```javascript
// در server/index.js یا یک فایل جداگانه
import { sendOrderConfirmationSms } from './sms/farazSmsClient.js';

// تست دستی
const testSms = async () => {
  const result = await sendOrderConfirmationSms('09123456789', {
    orderNumber: 'TEST123',
    trackingCode: 'TRACK456',
    amount: 100000
  });
  console.log('Test SMS Result:', result);
};

testSms();
```

---

## 🚨 مشکلات احتمالی و راه‌حل

### مشکل 1: callback اصلاً اجرا نمی‌شود
**علائم:**
- لاگ `CALLBACK SUCCESS REACHED` را نمی‌بینید
- verify ناموفق است

**راه‌حل:**
- بررسی کنید که callback URL درست است
- بررسی کنید که verify موفق است
- لاگ‌های verify را بررسی کنید

---

### مشکل 2: پیامک غیرفعال است
**علائم:**
- لاگ `ارسال پیامک تایید خرید غیرفعال است` را می‌بینید

**راه‌حل:**
- در `.env` بررسی کنید: `ENABLE_ORDER_CONFIRMATION_SMS=true`
- سرور را restart کنید

---

### مشکل 3: شماره تلفن موجود نیست
**علائم:**
- لاگ `phone: MISSING` را می‌بینید

**راه‌حل:**
- بررسی کنید که در checkout شماره تلفن ثبت می‌شود
- بررسی کنید که شماره در جدول `orders` ذخیره می‌شود

---

### مشکل 4: Pattern Code یا API Key تنظیم نشده
**علائم:**
- لاگ خطا: `Pattern Code برای تایید خرید تنظیم نشده است`

**راه‌حل:**
- تنظیمات `.env` را بررسی کنید
- سرور را restart کنید

---

### مشکل 5: خطا از API Faraz
**علائم:**
- لاگ: `❌ Order Confirmation SMS failed: [پیام خطا]`

**راه‌حل:**
- کد خطا را بررسی کنید
- بررسی کنید که Pattern Code با شماره سرشماره همخوانی دارد
- بررسی کنید که متغیرها درست ارسال می‌شوند (amount باید عدد باشد)

---

## 📋 چک‌لیست سریع

- [ ] فایل `farazSmsClient.js` به سرور منتقل شده
- [ ] سرور restart شده
- [ ] `ENABLE_ORDER_CONFIRMATION_SMS=true` در `.env`
- [ ] `FARAZ_SMS_ORDER_PATTERN_CODE` در `.env` تنظیم شده
- [ ] `FARAZ_SMS_API_KEY` در `.env` تنظیم شده
- [ ] `FARAZ_SMS_SENDER_NUMBER` در `.env` تنظیم شده
- [ ] لاگ‌های سرور بررسی شده
- [ ] شماره تلفن در دیتابیس ذخیره می‌شود
- [ ] یک خرید تستی انجام شده

---

## 💬 برای دریافت کمک بیشتر

لطفاً این اطلاعات را ارسال کنید:

1. **لاگ‌های مربوط به callback** (از خط `CALLBACK SUCCESS REACHED` به بعد)
2. **لاگ‌های مربوط به پیامک** (از خط `Starting Order Confirmation SMS` به بعد)
3. **مقدار `ENABLE_ORDER_CONFIRMATION_SMS` در `.env`**
4. **مقدار `FARAZ_SMS_ORDER_PATTERN_CODE` در `.env`** (بدون نمایش کامل، فقط بگویید SET است یا NOT SET)

