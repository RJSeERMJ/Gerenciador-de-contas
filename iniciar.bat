@echo off
echo.
echo ========================================
echo    FAMILIA JAMAR - Gerenciador de Contas
echo ========================================
echo.

echo Parando servidores anteriores...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Iniciando servidor...
node server-simples.js

pause 