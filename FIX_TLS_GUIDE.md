# 🔧 راهنمای رفع مشکل TLS/SSL

## 🔍 مشکل واقعی

خطای `Could not create SSL/TLS secure channel` به این معنی است که:
- PowerShell/.NET نمی‌تواند با HTTPS ارتباط برقرار کند
- Windows Server 2012 R2 به صورت پیش‌فرض TLS 1.2 را فعال ندارد
- IIS Rewrite نمی‌تواند به Express وصل شود

## ✅ راه‌حل

### مرحله 1: اجرای اسکریپت فعال‌سازی TLS

**⚠️ مهم:** باید PowerShell را به عنوان **Administrator** باز کنید!

```powershell
# 1. PowerShell را به عنوان Administrator باز کنید
# 2. به پوشه پروژه بروید
cd E:\FrontProjects\Lent-shop-new\lent-shop

# 3. اسکریپت را اجرا کنید
.\fix-tls.ps1
```

این اسکریپت:
- ✅ TLS 1.2 را برای .NET Framework فعال می‌کند
- ✅ TLS 1.2 را در Windows SCHANNEL فعال می‌کند
- ✅ تنظیمات Registry را اعمال می‌کند

### مرحله 2: Restart IIS

```powershell
iisreset
```

یا بهتر است **سرور را restart کنید** تا همه تغییرات اعمال شوند.

### مرحله 3: تست

بعد از restart، تست کنید:

```powershell
# تست TLS
.\test-tls-fix.ps1

# یا تست دستی
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri "https://lent-shop.ir/api/test" -UseBasicParsing
```

## 📋 چک‌لیست

- [ ] اسکریپت `fix-tls.ps1` با Administrator اجرا شد
- [ ] IIS restart شد (یا سرور restart شد)
- [ ] تست TLS موفق بود
- [ ] Route محصول کار می‌کند
- [ ] متاتگ‌ها در HTML موجود هستند

## 🐛 اگر هنوز کار نمی‌کند

### بررسی 1: آیا TLS 1.2 فعال است؟

```powershell
# بررسی Registry
Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319' -Name 'SchUseStrongCrypto'
```

باید `SchUseStrongCrypto = 1` باشد.

### بررسی 2: آیا IIS Rewrite Rule فعال است؟

```powershell
# بررسی web.config
Get-Content C:\inetpub\wwwroot\lent-shop\web.config | Select-String "Product Pages"
```

### بررسی 3: آیا Express در حال اجرا است؟

```powershell
# تست مستقیم Express
Invoke-WebRequest -Uri "http://localhost:4000/api/test" -UseBasicParsing
```

## 📝 توضیحات فنی

### چرا Express کار می‌کند ولی IIS نه؟

- **Express (Node.js)**: از OpenSSL استفاده می‌کند که TLS 1.2+ را پشتیبانی می‌کند
- **IIS / PowerShell**: از .NET استفاده می‌کند که در Windows Server 2012 R2 به صورت پیش‌فرض TLS 1.2 را فعال ندارد

### چرا متاتگ‌ها در View Source نیستند؟

- IIS Rewrite نمی‌تواند به Express وصل شود (مشکل TLS)
- HTML سمت سرور ساخته نمی‌شود
- مرورگر فقط خروجی خام IIS را می‌بیند
- متاتگ‌های JS فقط در DOM هستند، نه در View Source

## ✅ بعد از رفع مشکل

بعد از فعال‌سازی TLS 1.2:
1. IIS Rewrite می‌تواند به Express وصل شود
2. Express HTML با متاتگ‌ها را برمی‌گرداند
3. متاتگ‌ها در View Source دیده می‌شوند
4. ترب می‌تواند متاتگ‌ها را بخواند

