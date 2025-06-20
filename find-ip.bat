@echo off
echo Finding your computer's IP address for phone access...
echo.
echo Your IP addresses:
ipconfig | findstr /i "IPv4"
echo.
echo Use one of these IP addresses with :5000 on your phone
echo Example: http://192.168.1.100:5000
echo.
pause