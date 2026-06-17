# Check curl result for product_id
# Run this on Windows Server

Write-Host ""
Write-Host "=== Checking curl result ===" -ForegroundColor Cyan
Write-Host ""

$url = "https://lent-shop.ir/product/toyota/996"
Write-Host "Testing: $url" -ForegroundColor Yellow
Write-Host ""

try {
    $result = curl.exe -s $url
    
    if ($result) {
        Write-Host "[OK] Response received" -ForegroundColor Green
        Write-Host ""
        
        # Check for product_id
        if ($result -match 'name="product_id"') {
            Write-Host "[SUCCESS] product_id found in response!" -ForegroundColor Green
            Write-Host ""
            
            # Extract product_id value
            if ($result -match 'name="product_id" content="([^"]+)"') {
                $productId = $matches[1]
                Write-Host "Product ID: $productId" -ForegroundColor Cyan
            }
            
            # Show first 500 characters
            Write-Host ""
            Write-Host "First 500 characters of response:" -ForegroundColor Yellow
            Write-Host $result.Substring(0, [Math]::Min(500, $result.Length))
            
        } else {
            Write-Host "[FAIL] product_id NOT found in response" -ForegroundColor Red
            Write-Host ""
            Write-Host "This means:" -ForegroundColor Yellow
            Write-Host "  - Request is NOT reaching Express server" -ForegroundColor Red
            Write-Host "  - OR Express server is not running" -ForegroundColor Red
            Write-Host "  - OR Rewrite rule is not working" -ForegroundColor Red
            Write-Host ""
            
            # Show first 500 characters to see what we got
            Write-Host "First 500 characters of response:" -ForegroundColor Yellow
            Write-Host $result.Substring(0, [Math]::Min(500, $result.Length))
            Write-Host ""
            
            # Check if it's React SPA
            if ($result -match '<div id="root">') {
                Write-Host "[INFO] This is React SPA HTML (no meta tags)" -ForegroundColor Yellow
                Write-Host "The rewrite rule is NOT working!" -ForegroundColor Red
            }
        }
        
    } else {
        Write-Host "[FAIL] No response received" -ForegroundColor Red
    }
    
} catch {
    Write-Host "[FAIL] Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "If product_id NOT found:" -ForegroundColor Yellow
Write-Host "1. Check Express server is running:" -ForegroundColor Cyan
Write-Host '   curl.exe http://localhost:4000/api/product/toyota/996' -ForegroundColor White
Write-Host ""
Write-Host "2. Check IIS Rewrite Rules are correct" -ForegroundColor Cyan
Write-Host "3. Add rules manually in IIS Manager if needed" -ForegroundColor Cyan
Write-Host ""

