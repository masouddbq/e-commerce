# بررسی و تست pattern rewrite rule

Write-Host "`n=== بررسی Pattern Rewrite Rule ===" -ForegroundColor Cyan

# بررسی web.config
$webConfigPath = "C:\inetpub\wwwroot\lent-shop\web.config"
$content = Get-Content $webConfigPath -Raw

Write-Host "`n1. بررسی Pattern در rule:" -ForegroundColor Yellow
$ruleMatch = [regex]::Match($content, '(?s)<rule name="Product Pages for All".*?<match url="([^"]+)".*?</rule>')
if ($ruleMatch.Success) {
    $pattern = $ruleMatch.Groups[1].Value
    Write-Host "   Pattern: $pattern" -ForegroundColor Cyan
    
    # تست pattern
    $testUrl = "product/toyota/996"
    if ($testUrl -match $pattern) {
        Write-Host "   [OK] Pattern با URL match می‌کند" -ForegroundColor Green
        Write-Host "   Brand: $($matches[1]), ProductId: $($matches[2])" -ForegroundColor Gray
    } else {
        Write-Host "   [FAIL] Pattern با URL match نمی‌کند!" -ForegroundColor Red
    }
} else {
    Write-Host "   [FAIL] Rule پیدا نشد!" -ForegroundColor Red
}

Write-Host "`n2. بررسی Action URL:" -ForegroundColor Yellow
$actionMatch = [regex]::Match($content, '(?s)<rule name="Product Pages for All".*?<action type="([^"]+)" url="([^"]+)".*?</rule>')
if ($actionMatch.Success) {
    $actionType = $actionMatch.Groups[1].Value
    $actionUrl = $actionMatch.Groups[2].Value
    Write-Host "   Action Type: $actionType" -ForegroundColor Cyan
    Write-Host "   Action URL: $actionUrl" -ForegroundColor Cyan
    
    if ($actionType -eq "Rewrite") {
        Write-Host "   [INFO] Action type: Rewrite (درست است)" -ForegroundColor Green
    } else {
        Write-Host "   [WARNING] Action type: $actionType (باید Rewrite باشد)" -ForegroundColor Yellow
    }
}

Write-Host "`n3. بررسی ترتیب Rules:" -ForegroundColor Yellow
$productRuleIndex = $content.IndexOf('Product Pages for All')
$reactRuleIndex = $content.IndexOf('React Router')

if ($productRuleIndex -lt $reactRuleIndex -and $productRuleIndex -gt 0) {
    Write-Host "   [OK] ترتیب درست است (Product Pages قبل از React Router)" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] ترتیب درست نیست!" -ForegroundColor Red
}

Write-Host "`n4. پیشنهاد اصلاح:" -ForegroundColor Yellow
Write-Host "   اگر pattern کار نمی‌کند، این را امتحان کنید:" -ForegroundColor Cyan
Write-Host '   <match url="^product/(.+)/(.+)$" />' -ForegroundColor Gray

Write-Host "`n✅ بررسی کامل شد!" -ForegroundColor Green

