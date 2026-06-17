# رفع مشکل: Callback URL باید به Backend برود نه Frontend

## 🐛 مشکل اصلی

Callback از زرین‌پال به **frontend** می‌رود (`https://lent-shop.ir/payment/callback`) نه به **backend**.

**نتیجه:**
- Callback از زرین‌پال به frontend می‌رود
- Frontend به backend درخواست می‌دهد تا verify کند
- اما کد SMS در backend اجرا نمی‌شود چون callback به backend نرسیده
- لاگ `🚨🚨🚨 CALLBACK HIT` را نمی‌بینیم

## ✅ راه‌حل

Callback URL باید به **backend** برود، نه frontend.

### تغییرات لازم:

1. **در Frontend (PaymentForm.jsx):**
   ```javascript
   // قبل (اشتباه):
   callbackUrl: `${window.location.origin}/payment/callback`
   
   // بعد (درست):
   callbackUrl: `${API_BASE_URL}/payment/callback`
   ```

2. **یا بهتر است از Environment Variable استفاده کنیم:**
   ```javascript
   callbackUrl: import.meta.env.VITE_ZARINPAL_CALLBACK_URL || `${API_BASE_URL}/payment/callback`
   ```

## 📋 فایل‌های تغییر یافته

✅ `src/Components/Payment/PaymentForm.jsx` - تغییر callbackUrl به backend

## 🔍 بررسی تنظیمات

مطمئن شوید که:
1. `VITE_API_BASE_URL` در `.env` (root) تنظیم شده و به backend اشاره می‌کند:
   ```env
   VITE_API_BASE_URL=https://api.lent-shop.ir
   # یا
   VITE_API_BASE_URL=http://87.107.152.3:4000
   ```

2. `CLIENT_ORIGIN` در `server/.env` تنظیم شده:
   ```env
   CLIENT_ORIGIN=https://lent-shop.ir
   ```

## 🚀 مراحل Deploy

### 1. اصلاح کد در Frontend

فایل `src/Components/Payment/PaymentForm.jsx` را اصلاح کنید.

### 2. Build کردن Frontend

```powershell
npm run build
```

### 3. انتقال فایل‌های Build شده

محتوای پوشه `dist/` را به سرور منتقل کنید.

### 4. Restart سرور

```powershell
pm2 restart lent-shop-api
```

## 🔍 بررسی لاگ‌ها

بعد از تغییرات، در لاگ‌ها باید این را ببینید:

```
🚨🚨🚨 CALLBACK HIT - ROUTE EXECUTED 🚨🚨🚨
[Payment Callback] 🚨 CALLBACK HIT
[Payment Callback] 🚨🚨🚨 CALLBACK SUCCESS REACHED - SMS SECTION 🚨🚨🚨
```

**اگر هنوز این لاگ‌ها را نمی‌بینید:**
- بررسی کنید که callback URL به backend است
- بررسی کنید که backend در دسترس است
- بررسی کنید که callback از زرین‌پال به backend می‌رود

