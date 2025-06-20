@echo off
echo Starting MedScript Application...
echo.
echo This will start the MedScript server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
npx tsx server/index.ts
pause