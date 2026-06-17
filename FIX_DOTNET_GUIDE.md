# 🔧 راه‌حل مشکل TLS: نصب .NET Framework جدیدتر

## 🔍 مشکل

- ✅ TLS 1.2 در Registry فعال است
- ❌ .NET Framework 4.5.2 (Release 378675) TLS 1.2 را به درستی پشتیبانی نمی‌کند
- ❌ همه تست‌ها با خطای "Could not create SSL/TLS secure channel" شکست خورده‌اند

## ✅ راه‌حل: نصب .NET Framework 4.7.2 یا بالاتر

### مرحله 1: دانلود .NET Framework 4.7.2

**لینک دانلود:**
https://dotnet.microsoft.com/download/dotnet-framework/net472

یا مستقیم:
https://go.microsoft.com/fwlink/?linkid=863262

### مرحله 2: نصب

1. فایل دانلود شده را اجرا کنید
2. مراحل نصب را دنبال کنید
3. بعد از نصب، **سرور را restart کنید**

### مرحله 3: بررسی نسخه جدید

بعد از restart:

```powershell
Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full' -Name Release
```

باید Release number بالاتر از 461808 باشد (برای .NET 4.7.2)

---

## 🔄 راه‌حل جایگزین: استفاده از curl

اگر نمی‌توانید .NET را آپدیت کنید، از curl استفاده کنید:

### نصب curl (اگر نصب نیست)

```powershell
# دانلود و نصب curl
# یا از Chocolatey استفاده کنید
choco install curl
```

### استفاده از curl

```powershell
# تست با curl
curl https://lent-shop.ir/api/test

# تست Route محصول
curl https://lent-shop.ir/api/product/toyota/996 | Select-String "product_id"
```

---

## 📋 Release Numbers برای .NET Framework

- 378675 = .NET Framework 4.5.2 ❌ (TLS 1.2 مشکل دارد)
- 461808 = .NET Framework 4.7.2 ✅ (TLS 1.2 کامل پشتیبانی می‌کند)
- 528040 = .NET Framework 4.8 ✅ (بهترین)

---

## ⚠️ نکته مهم

بعد از نصب .NET Framework جدید:
1. **حتماً سرور را restart کنید**
2. بعد از restart، دوباره تست کنید

