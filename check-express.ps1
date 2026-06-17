# Check Express server
# Run this on Windows Server

Write-Host ""
Write-Host "=== Checking Express Server ===" -ForegroundColor Cyan
Write-Host ""

$expressUrl = "http://localhost:4000/api/product/toyota/996"
Write-Host "Testing: $expressUrl" -ForegroundColor Yellow
Write-Host ""

try {
    $result = curl.exe -s $expressUrl
    
    if ($result) {
        Write-Host "[OK] Express server is responding" -ForegroundColor Green
        Write-Host ""
        
        # Check for product_id
        if ($result -match 'name="product_id"') {
            Write-Host "[SUCCESS] product_id found in Express response!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Express server is working correctly!" -ForegroundColor Green
            Write-Host ""
            Write-Host "The problem is with IIS Rewrite Rules" -ForegroundColor Yellow
            Write-Host "You need to add rules manually in IIS Manager" -ForegroundColor Yellow
            
        } else {
            Write-Host "[FAIL] product_id NOT found in Express response" -ForegroundColor Red
            Write-Host ""
            Write-Host "First 500 characters:" -ForegroundColor Yellow
            Write-Host $result.Substring(0, [Math]::Min(500, $result.Length))
        }
        
    } else {
        Write-Host "[FAIL] Express server is NOT responding" -ForegroundColor Red
        Write-Host ""
        Write-Host "Express server might not be running!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To start Express:" -ForegroundColor Cyan
        Write-Host "  cd C:\path\to\server" -ForegroundColor White
        Write-Host "  pm2 start index.js --name lent-shop-api" -ForegroundColor White
        Write-Host "  pm2 save" -ForegroundColor White
    }
    
} catch {
    Write-Host "[FAIL] Error connecting to Express: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Express server is NOT running!" -ForegroundColor Red
}

Write-Host ""

