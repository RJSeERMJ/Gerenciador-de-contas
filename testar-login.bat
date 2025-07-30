@echo off
title Testar Sistema de Login - Família Jamar
color 0A

echo.
echo ========================================
echo    TESTE SISTEMA DE LOGIN - FAMILIA JAMAR
echo ========================================
echo.

echo 🚀 Iniciando servidor...
echo.

echo 📋 INSTRUÇÕES DE TESTE:
echo.
echo 1. O navegador abrirá automaticamente
echo 2. Preencha o formulário:
echo    - E-mail: seu@email.com
echo    - CPF: 151.192.367-90
echo 3. Clique em "Solicitar Acesso"
echo 4. Verifique seu e-mail
echo 5. Clique no link de confirmação
echo 6. Acesso será liberado automaticamente
echo.

echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo 🌐 Abrindo navegador...
start http://localhost:3000

echo.
echo ✅ Sistema iniciado!
echo 💡 Para parar: Ctrl+C
echo.

node server-simples.js

pause 