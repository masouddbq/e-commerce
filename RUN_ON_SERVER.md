# 🖥️ راهنمای اجرای اسکریپت در سرور

## 📋 مراحل اجرا در سرور

### مرحله 1: کپی فایل به سرور

**روش 1: از طریق Remote Desktop**

1. فایل `fix-iis-rules-server.ps1` را از پروژه local کپی کنید
2. در سرور، آن را در یک پوشه موقت قرار دهید (مثلاً `C:\temp\`)

**روش 2: از طریق PowerShell (از سیستم local)**

```powershell
# در سیستم local
Copy-Item "E:\FrontProjects\Lent-shop-new\lent-shop\fix-iis-rules-server.ps1" -Destination "\\[IP_SERVER]\C$\temp\fix-iis-rules-server.ps1"
```

---

### مرحله 2: اجرای اسکریپت در سرور

**در سرور (Windows Server):**

1. **PowerShell را به عنوان Administrator باز کنید:**
   - Start → PowerShell → Right Click → Run as Administrator

2. **اجرای اسکریپت:**
   ```powershell
   cd C:\temp
   .\fix-iis-rules-server.ps1
   ```

   **یا اگر فایل را در جای دیگری قرار دادید:**
   ```powershell
   .\fix-iis-rules-server.ps1
   ```

3. **اگر خطای Execution Policy گرفتید:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   .\fix-iis-rules-server.ps1
   ```

---

### مرحله 3: بررسی نتایج

اسکریپت این موارد را بررسی می‌کند:

- ✅ مسیر `web.config` درست است
- ✅ Rule‌های مهم در `web.config` موجود هستند
- ✅ Application Pool در حال اجرا است
- ✅ IIS restart می‌شود

---

### مرحله 4: بررسی در IIS Manager

بعد از اجرای اسکریپت:

1. **IIS Manager** را باز کنید
2. **Sites** → **[نام سایت]** → **URL Rewrite**
3. بررسی کنید که rule‌های زیر موجود باشند:
   - ✅ **SSR Product Pages** (اولین rule)
   - ✅ **Ignore Product for SPA**
   - ✅ **React Router**

---

### مرحله 5: بررسی Server Level Rules

**خیلی مهم!**

1. در IIS Manager، **Server Name** را انتخاب کنید (نه Site)
2. **URL Rewrite** را باز کنید
3. اگر rule‌های قدیمی را می‌بینید:
   - آنها را **Delete** کنید
   - یا **Disable** کنید
4. **Apply** کنید

---

### مرحله 6: تست نهایی

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

اگر `product_id` را دیدید → موفق است ✅

---

## ⚠️ مشکلات رایج

### مشکل 1: Execution Policy

**خطا:**
```
cannot be loaded because running scripts is disabled on this system
```

**راه‌حل:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

---

### مشکل 2: Module WebAdministration پیدا نشد

**خطا:**
```
Module 'WebAdministration' not found
```

**راه‌حل:**
این Module معمولاً با IIS نصب می‌شود. اگر نبود:
```powershell
Install-WindowsFeature -Name IIS-ManagementConsole
```

---

### مشکل 3: مسیر web.config اشتباه است

**راه‌حل:**
مسیر صحیح را در اسکریپت تغییر دهید:

```powershell
# در اسکریپت، این خط را پیدا کنید:
$webConfigPath = "C:\inetpub\wwwroot\lent-shop\web.config"

# و مسیر صحیح را وارد کنید
```

---

## 📝 خلاصه دستورات

```powershell
# 1. کپی فایل به سرور (از local)
Copy-Item "E:\FrontProjects\Lent-shop-new\lent-shop\fix-iis-rules-server.ps1" -Destination "\\[IP]\C$\temp\"

# 2. در سرور: اجرای اسکریپت
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
cd C:\temp
.\fix-iis-rules-server.ps1

# 3. تست نهایی
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

---

## ✅ چک‌لیست

- [ ] فایل `fix-iis-rules-server.ps1` به سرور کپی شد
- [ ] PowerShell به عنوان Administrator باز شد
- [ ] Execution Policy تنظیم شد
- [ ] اسکریپت با موفقیت اجرا شد
- [ ] IIS restart شد
- [ ] Rule‌ها در IIS Manager بررسی شدند
- [ ] Server Level Rules بررسی شدند
- [ ] تست نهایی موفق بود

