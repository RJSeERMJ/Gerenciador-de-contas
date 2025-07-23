@echo off
title Família Jamar - Gerenciador de Contas
color 0A

echo.
echo ========================================
echo    FAMILIA JAMAR - Gerenciador de Contas
echo ========================================
echo.

echo Parando servidores anteriores...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Iniciando servidor...
echo.

:: Iniciar servidor em background
start /B node server-simples.js

:: Aguardar 3 segundos para o servidor inicializar
echo Aguardando servidor inicializar...
timeout /t 3 /nobreak >nul

:: Abrir navegador
echo Abrindo navegador...
start http://localhost:3000

echo.
echo ✅ Sistema iniciado com sucesso!
echo 📱 Página web aberta no navegador
echo 💡 Para parar: Feche esta janela ou Ctrl+C
echo.

:: Manter janela aberta
pause 