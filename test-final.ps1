# Final Test Script - Check Meta Tags
# Run this on Windows Server

Write-Host ""
Write-Host "=== Final Test - Meta Tags ===" -ForegroundColor Cyan
Write-Host ""

$url = "https://lent-shop.ir/product/toyota/996"
Write-Host "Testing: $url" -ForegroundColor Yellow
Write-Host ""

try {
    $html = curl.exe -s $url
    
    if ($html) {
        Write-Host "[OK] HTML received" -ForegroundColor Green
        Write-Host ""
        
        # Check Torob meta tags
        Write-Host "Checking Torob Meta Tags:" -ForegroundColor Cyan
        if ($html -match 'name="product_id"') { 
            Write-Host "  [OK] product_id" -ForegroundColor Green 
        } else { 
            Write-Host "  [FAIL] product_id" -ForegroundColor Red 
        }
        
        if ($html -match 'name="product_name"') { 
            Write-Host "  [OK] product_name" -ForegroundColor Green 
        } else { 
            Write-Host "  [FAIL] product_name" -ForegroundColor Red 
        }
        
        if ($html -match 'name="product_price"') { 
            Write-Host "  [OK] product_price" -ForegroundColor Green 
        } else { 
            Write-Host "  [FAIL] product_price" -ForegroundColor Red 
        }
        
        if ($html -match 'name="availability"') { 
            Write-Host "  [OK] availability" -ForegroundColor Green 
        } else { 
            Write-Host "  [FAIL] availability" -ForegroundColor Red 
        }
        
        Write-Host ""
        
        # Check Open Graph meta tags
        Write-Host "Checking Open Graph Meta Tags:" -ForegroundColor Cyan
        if ($html -match 'property="og:title"') { 
            Write-Host "  [OK] og:title" -ForegroundColor Green 
        } else { 
            Write-Host "  [FAIL] og:title" -ForegroundColor Red 
        }
        
        if ($html -match 'property="og:description"') { 
            Write-Host "  [OK] og:description" -ForegroundColor Green 
        } else { 
            Write-Host "  [FAIL] og:description" -ForegroundColor Red 
        }
        
        if ($html -match 'property="og:image"') { 
            Write-Host "  [OK] og:image" -ForegroundColor Green 
        } else { 
            Write-Host "  [FAIL] og:image" -ForegroundColor Red 
        }
        
        Write-Host ""
        
        # Check SEO meta tags
        Write-Host "Checking SEO Meta Tags:" -ForegroundColor Cyan
        if ($html -match '<title>') { 
            Write-Host "  [OK] title tag" -ForegroundColor Green 
        } else { 
            Write-Host "  [FAIL] title tag" -ForegroundColor Red 
        }
        
        if ($html -match 'name="description"') { 
            Write-Host "  [OK] description" -ForegroundColor Green 
        } else { 
            Write-Host "  [FAIL] description" -ForegroundColor Red 
        }
        
        if ($html -match 'rel="canonical"') { 
            Write-Host "  [OK] canonical" -ForegroundColor Green 
        } else { 
            Write-Host "  [FAIL] canonical" -ForegroundColor Red 
        }
        
        Write-Host ""
        
        # Show sample of product_id
        if ($html -match 'name="product_id" content="([^"]+)"') {
            $productId = $matches[1]
            Write-Host "Product ID found: $productId" -ForegroundColor Green
        }
        
    } else {
        Write-Host "[FAIL] No HTML received" -ForegroundColor Red
    }
    
} catch {
    Write-Host "[FAIL] Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""

