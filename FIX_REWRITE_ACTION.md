# 🔧 رفع مشکل Rewrite Rule - Pattern درست است

## ✅ وضعیت

- ✅ Pattern match می‌کند
- ✅ Capture groups درست هستند (toyota, 996)
- ❌ اما rewrite rule کار نمی‌کند

---

## 🔍 مشکلات احتمالی

### 1. Action URL

بررسی کنید که Action URL درست است:

```xml
<action type="Rewrite" url="http://localhost:4000/api/product/{R:1}/{R:2}" />
```

باید به این تبدیل شود: `http://localhost:4000/api/product/toyota/996`

---

### 2. ترتیب Rules

Rule "Product Pages for All" باید **قبل از** "React Router" باشد.

---

### 3. Cache IIS

IIS ممکن است HTML را cache کرده باشد.

---

### 4. Server Variables

بررسی کنید که serverVariables درست تنظیم شده است.

---

## ✅ راه‌حل: بررسی Action URL

در IIS Manager:
1. Rule "Product Pages for All" را باز کنید
2. بخش "Action" را بررسی کنید
3. URL باید این باشد: `http://localhost:4000/api/product/{R:1}/{R:2}`
4. Type باید "Rewrite" باشد

---

## 🧪 تست بعد از بررسی

```powershell
# پاک کردن cache و restart
iisreset

# تست
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

