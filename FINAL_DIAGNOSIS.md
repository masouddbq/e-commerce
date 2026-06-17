# 🔍 تشخیص نهایی: مشکل متاتگ‌ها

## ✅ وضعیت فعلی

- ✅ curl نصب شده و کار می‌کند
- ✅ Route API پاسخ می‌دهد (HTML برمی‌گرداند)
- ❌ متاتگ‌های ترب (`product_id`, `product_name`, etc.) در HTML موجود نیستند

## 🔍 علت مشکل

از HTML که curl برگردانده مشخص است که:
- HTML از **frontend** آمده (شامل `<div id="root"></div>`)
- متاتگ‌های عمومی موجود هستند (viewport, description, keywords)
- اما متاتگ‌های ترب موجود نیستند

**این یعنی:**
- درخواست به Express نمی‌رسد
- یا IIS rewrite rule کار نمی‌کند
- یا route Express اجرا نمی‌شود

---

## ✅ راه‌حل

### بررسی 1: تست مستقیم Express

```powershell
# تست مستقیم Express (localhost)
curl.exe http://localhost:4000/api/product/toyota/996 | Select-String "product_id"
```

اگر این کار کرد → مشکل از IIS rewrite rule است  
اگر کار نکرد → مشکل از route Express است

---

### بررسی 2: بررسی IIS Rewrite Rule

1. IIS Manager را باز کنید
2. به سایت `lent-shop` بروید
3. `URL Rewrite` را باز کنید
4. بررسی کنید که rule "Product Pages for All" فعال است

---

### بررسی 3: بررسی لاگ‌های Express

```powershell
# بررسی لاگ‌های Express
Get-Content .cursor\debug.log -Tail 50
```

یا اگر PM2 استفاده می‌کنید:

```powershell
pm2 logs lent-shop-api --lines 50
```

---

## 🎯 راه‌حل احتمالی

احتمالاً مشکل از IIS rewrite rule است که درخواست را به Express نمی‌فرستد.

**بررسی:**
1. آیا rule "Product Pages for All" در `web.config` فعال است؟
2. آیا ARR (Application Request Routing) نصب شده است؟
3. آیا Express در حال اجرا است؟

---

## 📋 مراحل بعدی

1. تست مستقیم Express: `curl.exe http://localhost:4000/api/product/toyota/996`
2. بررسی IIS rewrite rule
3. بررسی لاگ‌های Express
4. اگر Express کار می‌کند اما IIS نه → مشکل از rewrite rule است
