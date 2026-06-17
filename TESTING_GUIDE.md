# 🧪 راهنمای تست محلی پرداخت

## ✅ تغییرات اعمال شده:

1. **CORS کامل** - تنظیمات کامل CORS برای حل مشکل NetworkError
2. **حذف verify از فرانت‌اند** - فرانت‌اند دیگر verify نمی‌کند
3. **Verify فقط در Backend** - فقط callback در backend verify می‌کند

## 🧪 روش‌های تست محلی:

### روش 1: استفاده از Sandbox زرین‌پال (توصیه می‌شود)

1. **تنظیم Sandbox در `.env`**:
```env
# server/.env
ZARINPAL_SANDBOX=true
ZARINPAL_MERCHANT_ID=your_sandbox_merchant_id
```

2. **تست واقعی با Sandbox**:
   - یک سفارش ایجاد کنید
   - به درگاه پرداخت بروید
   - در Sandbox می‌توانید با کارت تست پرداخت کنید
   - بعد از پرداخت، callback برمی‌گردد

### روش 2: تست مستقیم Callback (بدون رفتن به زرین‌پال)

1. **ایجاد یک سفارش تست**:
   - یک سفارش در سایت ایجاد کنید
   - `orderId` را یادداشت کنید

2. **شبیه‌سازی Callback**:
   ```bash
   # در مرورگر یا Postman
   http://localhost:4000/payment/callback?Authority=TEST123456789&Status=OK&orderId=YOUR_ORDER_ID
   ```

3. **یا با curl**:
   ```bash
   curl "http://localhost:4000/payment/callback?Authority=TEST123456789&Status=OK&orderId=YOUR_ORDER_ID"
   ```

### روش 3: استفاده از دکمه تست در PaymentForm

در حالت development، یک دکمه تست در `PaymentForm` وجود دارد که مستقیماً به callback می‌رود.

## 🔍 Debug و بررسی مشکل:

### 1. بررسی لاگ‌های Backend:

```powershell
# در PowerShell
cd C:\e-commerce
pm2 logs server --lines 100
```

**لاگ‌های مهم:**
- `[Payment Callback] دریافت callback:` - باید Authority و Status را نشان دهد
- `[Payment Callback] در حال تایید پرداخت:` - باید amountInRials را نشان دهد
- `[Payment Callback] ✅ Verify موفق بود` - باید این لاگ را ببینید
- `[Payment Callback] ✅ وضعیت سفارش به paid تغییر یافت` - باید این لاگ را ببینید

### 2. بررسی Console مرورگر:

**لاگ‌های مهم:**
- `[Payment Verification] ⭐ Status=OK است` - باید این لاگ را ببینید
- `[Payment Verification] خطا:` - اگر این لاگ را دیدید، مشکل از کجاست

### 3. بررسی Network Tab:

**درخواست‌های مهم:**
- `/payment/callback?Authority=...&Status=OK` - باید 302 redirect باشد
- `/api/payment/order-by-authority?authority=...` - باید 200 باشد
- **نباید** درخواستی به `/api/payment/verify` ببینید (چون فرانت‌اند دیگر verify نمی‌کند)

### 4. بررسی دیتابیس:

```sql
-- بررسی وضعیت سفارش
SELECT id, total_amount, payment_status, payment_authority, payment_ref_id 
FROM orders 
WHERE id = YOUR_ORDER_ID;

-- باید payment_status = 'paid' باشد
```

## ❌ مشکلات رایج و راه‌حل:

### مشکل 1: "پرداخت ناموفق" نمایش داده می‌شود

**علت:** 
- Verify در backend ناموفق است
- یا سفارش یافت نشد

**راه‌حل:**
1. لاگ‌های backend را بررسی کنید
2. مطمئن شوید که `Authority` در دیتابیس ذخیره شده است
3. مطمئن شوید که `total_amount` درست است

### مشکل 2: CORS Error

**علت:**
- CORS تنظیم نشده
- Origin در لیست مجاز نیست

**راه‌حل:**
1. مطمئن شوید که `CLIENT_ORIGIN` در `server/.env` درست است
2. PM2 را restart کنید
3. لاگ‌های CORS را بررسی کنید

### مشکل 3: وضعیت سفارش "در انتظار پرداخت" باقی می‌ماند

**علت:**
- Verify در backend خطا می‌دهد
- یا callback اصلاً اجرا نمی‌شود

**راه‌حل:**
1. لاگ‌های backend را بررسی کنید
2. مطمئن شوید که callback route درست کار می‌کند
3. تست مستقیم callback را انجام دهید

## 📝 چک‌لیست نهایی:

- [ ] CORS درست تنظیم شده
- [ ] فرانت‌اند دیگر verify نمی‌کند
- [ ] Backend callback verify می‌کند
- [ ] لاگ‌های backend درست کار می‌کنند
- [ ] وضعیت سفارش در دیتابیس به `paid` تغییر می‌کند
- [ ] صفحه "پرداخت موفق" نمایش داده می‌شود

## 🎯 تست نهایی:

1. یک سفارش ایجاد کنید
2. به درگاه پرداخت بروید (یا از دکمه تست استفاده کنید)
3. بعد از callback:
   - ✅ باید صفحه "پرداخت موفق" ببینید
   - ✅ وضعیت سفارش در دیتابیس باید `paid` باشد
   - ✅ در Network tab نباید درخواستی به `/api/payment/verify` ببینید

