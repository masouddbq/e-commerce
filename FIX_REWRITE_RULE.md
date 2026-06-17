# 🔧 رفع مشکل Rewrite Rule

## ✅ وضعیت فعلی

- ✅ Express کار می‌کند (localhost:4000 متاتگ‌ها را برمی‌گرداند)
- ✅ ARR Proxy فعال است
- ✅ Rule "Product Pages for All" موجود است
- ❌ اما rewrite rule کار نمی‌کند (درخواست به Express نمی‌رسد)

---

## 🔍 مشکلات احتمالی

### 1. ترتیب Rules

Rule "Product Pages for All" باید **قبل از** rule "React Router" باشد.

**بررسی:**
```powershell
Get-Content C:\inetpub\wwwroot\lent-shop\web.config | Select-String -Pattern "Product Pages|React Router" -Context 2
```

---

### 2. Pattern Matching

Pattern در rule ممکن است درست نباشد.

**بررسی rule:**
```xml
<rule name="Product Pages for All" stopProcessing="true">
  <match url="^product/([^/]+)/([^/]+)$" />
  <action type="Rewrite" url="http://localhost:4000/api/product/{R:1}/{R:2}" />
</rule>
```

این pattern باید با `/product/toyota/996` match کند.

---

### 3. Cache IIS

IIS ممکن است HTML را cache کرده باشد.

**راه‌حل:**
```powershell
# پاک کردن cache
iisreset /stop
iisreset /start
```

---

### 4. URL Rewrite Module

بررسی کنید که URL Rewrite Module نصب شده است.

---

## ✅ راه‌حل: تست Pattern

```powershell
# تست pattern
$url = "/product/toyota/996"
if ($url -match "^product/([^/]+)/([^/]+)$") {
    Write-Host "Pattern match: brand=$($matches[1]), productId=$($matches[2])"
} else {
    Write-Host "Pattern match failed!"
}
```

---

## 🎯 راه‌حل احتمالی

احتمالاً مشکل از **ترتیب rules** یا **pattern matching** است.

