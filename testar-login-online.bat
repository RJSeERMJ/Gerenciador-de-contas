@echo off
title Testar Sistema de Login Online - Família Jamar
color 0A

echo.
echo ========================================
echo    TESTE SISTEMA DE LOGIN ONLINE
echo    FAMILIA JAMAR
echo ========================================
echo.

echo 🚀 Verificando sistema de login online...
echo.

echo 📋 INSTRUÇÕES DE TESTE ONLINE:
echo.
echo 1. Acesse: https://gerenciador-de-contas-1.onrender.com
echo 2. Preencha o formulário:
echo    - E-mail: seu@email.com
echo    - CPF: 151.192.367-90
echo 3. Clique em "Solicitar Acesso"
echo 4. Verifique e-mail: jamarestudo@gmail.com
echo 5. Clique no link de confirmação
echo 6. Acesso será liberado automaticamente
echo.

echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo 🌐 Abrindo navegador para teste online...
start https://gerenciador-de-contas-1.onrender.com

echo.
echo ✅ Sistema de login online pronto para teste!
echo 💡 Verifique se o deploy foi feito corretamente
echo.

echo 📧 E-MAIL DE TESTE:
echo - Destinatário: jamarestudo@gmail.com
echo - Assunto: "🔐 Confirmação de Acesso - Família Jamar"
echo - Link: Dinâmico baseado na URL do servidor
echo.

echo 🔒 SEGURANÇA:
echo - CPF autorizado: 151.192.367-90
echo - Token único por solicitação
echo - Confirmação obrigatória por e-mail
echo - Acesso liberado após confirmação
echo.

pause 