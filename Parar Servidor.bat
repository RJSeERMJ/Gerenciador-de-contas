@echo off
title Parar Servidor - Família Jamar
color 0C

echo.
echo ========================================
echo    PARANDO SERVIDOR - FAMILIA JAMAR
echo ========================================
echo.

echo Parando servidor Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ✅ Servidor parado com sucesso!
echo 💡 Para iniciar novamente, use o ícone "Família Jamar"
echo.

pause 