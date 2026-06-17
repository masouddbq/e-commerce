# بررسی web.config در سرور

Write-Host "`n=== بررسی web.config در سرور ===" -ForegroundColor Cyan

$webConfigPath = "C:\inetpub\wwwroot\lent-shop\web.config"

Write-Host "`n1. بررسی وجود فایل:" -ForegroundColor Yellow
if (Test-Path $webConfigPath) {
    Write-Host "   [OK] فایل web.config موجود است" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] فایل web.config موجود نیست!" -ForegroundColor Red
    Write-Host "   مسیر: $webConfigPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n2. بررسی rule 'Product Pages for All':" -ForegroundColor Yellow
$content = Get-Content $webConfigPath -Raw
if ($content -match 'Product Pages for All') {
    Write-Host "   [OK] Rule 'Product Pages for All' موجود است" -ForegroundColor Green
    
    # نمایش rule
    $ruleMatch = [regex]::Match($content, '(?s)<rule name="Product Pages for All".*?</rule>')
    if ($ruleMatch.Success) {
        Write-Host "`n   محتوای rule:" -ForegroundColor Cyan
        Write-Host $ruleMatch.Value -ForegroundColor Gray
    }
} else {
    Write-Host "   [FAIL] Rule 'Product Pages for All' موجود نیست!" -ForegroundColor Red
    Write-Host "   ⚠️ این مشکل اصلی است!" -ForegroundColor Yellow
}

Write-Host "`n3. بررسی rule 'API and Payment Callback':" -ForegroundColor Yellow
if ($content -match 'API and Payment Callback') {
    Write-Host "   [OK] Rule 'API and Payment Callback' موجود است" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Rule 'API and Payment Callback' موجود نیست!" -ForegroundColor Red
}

Write-Host "`n4. بررسی ترتیب rules:" -ForegroundColor Yellow
$productRuleIndex = $content.IndexOf('Product Pages for All')
$reactRuleIndex = $content.IndexOf('React Router')

if ($productRuleIndex -lt $reactRuleIndex -and $productRuleIndex -gt 0) {
    Write-Host "   [OK] ترتیب rules درست است (Product Pages قبل از React Router)" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] ترتیب rules درست نیست!" -ForegroundColor Red
    Write-Host "   Product Pages باید قبل از React Router باشد" -ForegroundColor Yellow
}

Write-Host "`n✅ بررسی کامل شد!" -ForegroundColor Green

