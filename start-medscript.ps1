Write-Host "Starting MedScript Application..." -ForegroundColor Green
Write-Host ""
Write-Host "This will start the MedScript server on http://localhost:5000"
Write-Host "Press Ctrl+C to stop the server"
Write-Host ""

$env:NODE_ENV = "development"
npx tsx server/index.ts