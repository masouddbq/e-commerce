# PowerShell Script برای تست IIS + ARR + HTTPS
# این اسکریپت تمام تست‌های لازم را انجام می‌دهد

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "تست IIS + ARR + HTTPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# تست 1: بررسی تنظیمات
Write-Host "🔍 تست 1: بررسی تنظیمات IIS..." -ForegroundColor Yellow
Write-Host ""

try {
    $doubleEscaping = Get-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/security/requestFiltering" -Name "allowDoubleEscaping"
    if ($doubleEscaping.Value) {
        Write-Host "✅ Allow Double Escaping: True" -ForegroundColor Green
    } else {
        Write-Host "❌ Allow Double Escaping: False (باید True باشد!)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ خطا در بررسی Allow Double Escaping: $_" -ForegroundColor Red
}

try {
    $unescapedChars = Get-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/rewrite" -Name "allowUnescapedCharacters" -ErrorAction SilentlyContinue
    if ($unescapedChars -and $unescapedChars.Value) {
        Write-Host "✅ Allow Unescaped Characters: True" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Allow Unescaped Characters: نیاز به تنظیم دستی در IIS Manager" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Allow Unescaped Characters: نیاز به تنظیم دستی در IIS Manager" -ForegroundColor Yellow
}

Write-Host ""

# تست 2: تست Express مستقیم
Write-Host "🔍 تست 2: تست Express مستقیم (localhost:4000)..." -ForegroundColor Yellow
Write-Host ""

try {
    $expressTest = Invoke-WebRequest -Uri "http://localhost:4000/api/product/toyota/996" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Express پاسخ داد" -ForegroundColor Green
    Write-Host "   Status: $($expressTest.StatusCode)" -ForegroundColor White
    Write-Host "   Content Length: $($expressTest.Content.Length)" -ForegroundColor White
    
    if ($expressTest.Content -match "product_id") {
        Write-Host "✅ product_id در پاسخ Express موجود است" -ForegroundColor Green
    } else {
        Write-Host "❌ product_id در پاسخ Express موجود نیست" -ForegroundColor Red
    }
    
    if ($expressTest.Headers['X-SSR']) {
        Write-Host "✅ X-SSR header موجود است: $($expressTest.Headers['X-SSR'])" -ForegroundColor Green
    } else {
        Write-Host "⚠️  X-SSR header موجود نیست" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Express پاسخ نداد: $_" -ForegroundColor Red
    Write-Host "   مطمئن شوید Express در حال اجرا است: pm2 list" -ForegroundColor Yellow
}

Write-Host ""

# تست 3: تست Proxy مستقیم (/api/)
Write-Host "🔍 تست 3: تست Proxy مستقیم (https://lent-shop.ir/api/product/toyota/996)..." -ForegroundColor Yellow
Write-Host ""

try {
    $apiTest = Invoke-WebRequest -Uri "https://lent-shop.ir/api/product/toyota/996" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ درخواست موفق بود" -ForegroundColor Green
    Write-Host "   Status: $($apiTest.StatusCode)" -ForegroundColor White
    Write-Host "   Content Length: $($apiTest.Content.Length)" -ForegroundColor White
    
    if ($apiTest.Headers['X-SSR']) {
        Write-Host "✅ X-SSR header موجود است: $($apiTest.Headers['X-SSR'])" -ForegroundColor Green
    } else {
        Write-Host "❌ X-SSR header موجود نیست (Proxy کار نکرده!)" -ForegroundColor Red
    }
    
    if ($apiTest.Content -match "product_id") {
        Write-Host "✅ product_id در پاسخ موجود است" -ForegroundColor Green
        $match = [regex]::Match($apiTest.Content, 'product_id["\s]+content=["\'](\d+)["\']')
        if ($match.Success) {
            Write-Host "   product_id value: $($match.Groups[1].Value)" -ForegroundColor White
        }
    } else {
        Write-Host "❌ product_id در پاسخ موجود نیست" -ForegroundColor Red
        Write-Host "   First 200 chars: $($apiTest.Content.Substring(0, [Math]::Min(200, $apiTest.Content.Length)))" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ درخواست ناموفق بود: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    }
}

Write-Host ""

# تست 4: تست Product Route (/product/)
Write-Host "🔍 تست 4: تست Product Route (https://lent-shop.ir/product/toyota/996)..." -ForegroundColor Yellow
Write-Host ""

try {
    $productTest = Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ درخواست موفق بود" -ForegroundColor Green
    Write-Host "   Status: $($productTest.StatusCode)" -ForegroundColor White
    Write-Host "   Content Length: $($productTest.Content.Length)" -ForegroundColor White
    
    if ($productTest.Content.Length -lt 100) {
        Write-Host "⚠️  Content Length خیلی کم است (احتمالاً SPA fallback)" -ForegroundColor Yellow
    }
    
    if ($productTest.Headers['X-SSR']) {
        Write-Host "✅ X-SSR header موجود است: $($productTest.Headers['X-SSR'])" -ForegroundColor Green
    } else {
        Write-Host "❌ X-SSR header موجود نیست (Rewrite کار نکرده!)" -ForegroundColor Red
    }
    
    if ($productTest.Content -match "product_id") {
        Write-Host "✅ product_id در پاسخ موجود است" -ForegroundColor Green
        $match = [regex]::Match($productTest.Content, 'product_id["\s]+content=["\'](\d+)["\']')
        if ($match.Success) {
            Write-Host "   product_id value: $($match.Groups[1].Value)" -ForegroundColor White
        }
    } else {
        Write-Host "❌ product_id در پاسخ موجود نیست" -ForegroundColor Red
        Write-Host "   First 200 chars: $($productTest.Content.Substring(0, [Math]::Min(200, $productTest.Content.Length)))" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ درخواست ناموفق بود: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ تست‌ها تکمیل شد!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# خلاصه
Write-Host "📊 خلاصه نتایج:" -ForegroundColor Cyan
Write-Host ""
Write-Host "اگر تست 2 موفق بود ولی تست 3 و 4 ناموفق بودند:" -ForegroundColor Yellow
Write-Host "→ مشکل از IIS + ARR + HTTPS است" -ForegroundColor Yellow
Write-Host "→ مراحل 1 و 2 را دوباره بررسی کنید" -ForegroundColor Yellow
Write-Host ""
Write-Host "اگر تست 3 موفق بود ولی تست 4 ناموفق بود:" -ForegroundColor Yellow
Write-Host "→ مشکل از Rewrite Pattern است" -ForegroundColor Yellow
Write-Host "→ web.config را بررسی کنید" -ForegroundColor Yellow
Write-Host ""
Write-Host "اگر همه تست‌ها موفق بودند:" -ForegroundColor Green
Write-Host "→ ✅ مشکل حل شد!" -ForegroundColor Green

