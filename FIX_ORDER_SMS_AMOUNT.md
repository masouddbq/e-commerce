# رفع مشکل ارسال پیامک تایید خرید - متغیر amount

## 🐛 مشکل

پیامک تایید خرید ارسال نمی‌شد به دلیل اینکه متغیر `amount` به صورت **رشته فرمت شده** ارسال می‌شد، در حالی که در پترن فراز اس ام اس این متغیر به عنوان **عدد** تعریف شده است.

## ✅ راه‌حل

فایل `server/sms/farazSmsClient.js` اصلاح شد تا `amount` به صورت عدد (integer) ارسال شود.

### تغییرات انجام شده:

**قبل (اشتباه):**
```javascript
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price || 0);
};
params[amountVarName] = formatPrice(orderData.amount || orderData.total_amount || 0);
// نتیجه: "۱,۲۳۴,۵۶۷" (رشته)
```

**بعد (درست):**
```javascript
const amountValue = orderData.amount || orderData.total_amount || 0;
params[amountVarName] = Math.round(Number(amountValue));
// نتیجه: 1234567 (عدد)
```

## 📋 وضعیت متغیرهای پترن

طبق پترن ثبت شده در پنل فراز اس ام اس:

| متغیر | نوع | وضعیت |
|-------|-----|-------|
| `order_number` | رشته (40 کاراکتر) | ✅ درست |
| `tracking_code` | رشته (40 کاراکتر) | ✅ درست |
| `amount` | عدد | ✅ **اصلاح شد** |

## 🚀 مراحل Deploy

### 1. انتقال فایل به سرور

فایل زیر را به سرور منتقل کنید:
```
server/sms/farazSmsClient.js
```

**مسیر در سرور:**
```
C:\...\server\sms\farazSmsClient.js
```

### 2. Restart سرور

```powershell
pm2 restart lent-shop-api
# یا
iisreset
```

### 3. تست

1. یک خرید تستی انجام دهید
2. بررسی کنید که پیامک ارسال می‌شود
3. لاگ‌های سرور را بررسی کنید:

```powershell
pm2 logs lent-shop-api --lines 100
```

## 🔍 بررسی لاگ‌ها

در لاگ‌ها باید این موارد را ببینید:

```
[Faraz SMS] Pattern Variables: {
  "order_number": "12345",
  "tracking_code": "ABC123",
  "amount": 1234567  // ⚠️ باید عدد باشد نه رشته
}
```

**قبل از اصلاح:** `"amount": "۱,۲۳۴,۵۶۷"` (رشته)
**بعد از اصلاح:** `"amount": 1234567` (عدد)

## ⚠️ نکات مهم

1. **مبلغ به تومان است:** `total_amount` در دیتابیس به تومان ذخیره می‌شود، بنابراین `amount` در پیامک نیز به تومان خواهد بود.

2. **اگر نیاز به تبدیل به ریال دارید:** می‌توانید قبل از ارسال، مبلغ را در 10 ضرب کنید:
   ```javascript
   params[amountVarName] = Math.round(Number(amountValue) * 10);
   ```

3. **بررسی تنظیمات .env:**
   ```env
   FARAZ_SMS_ORDER_PATTERN_CODE=2713awd40oaxwlc
   FARAZ_SMS_ORDER_PATTERN_VARIABLE_NAMES=order_number,tracking_code,amount
   ENABLE_ORDER_CONFIRMATION_SMS=true
   ```

## 📞 در صورت مشکل

1. بررسی لاگ‌های سرور برای خطاها
2. بررسی اینکه `amount` به صورت عدد ارسال می‌شود (نه رشته)
3. بررسی تنظیمات `.env` در سرور
4. اطمینان حاصل کنید که سرور restart شده است

