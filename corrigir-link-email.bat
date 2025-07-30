@echo off
title Corrigir Link do E-mail - Família Jamar
color 0C

echo.
echo ========================================
echo    CORRIGINDO LINK DO E-MAIL
echo    FAMILIA JAMAR
echo ========================================
echo.

echo 🔧 Problema identificado:
echo    ❌ E-mail redireciona para localhost:3000
echo    ✅ Corrigindo para site online
echo.

echo 📋 VERIFICANDO MUDANÇAS:
echo.

git status

echo.
echo 💬 Descrição da correção:
set /p commit_message="📝 Descrição (ou pressione Enter para usar padrão): "

if "%commit_message%"=="" (
    set commit_message="Corrigido link do e-mail para apontar para site online"
)

echo.
echo 🚀 ENVIANDO CORREÇÃO:
echo.

echo 1️⃣ Adicionando mudanças...
git add .

echo 2️⃣ Fazendo commit...
git commit -m %commit_message%

echo 3️⃣ Enviando para GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ CORREÇÃO ENVIADA COM SUCESSO!
    echo.
    echo 📊 PRÓXIMOS PASSOS:
    echo    1. Acesse: https://render.com
    echo    2. Veja o status do serviço
    echo    3. Aguarde deploy automático (5-10 min)
    echo    4. Teste o e-mail novamente
    echo.
    echo 🌐 URL: https://gerenciador-de-contas-1.onrender.com
    echo.
    echo 💡 TESTE:
    echo    - Configure e-mail no site
    echo    - Verifique se link aponta para site online
    echo    - Teste todas as funcionalidades
    echo.
) else (
    echo.
    echo ❌ ERRO AO ENVIAR CORREÇÃO!
    echo.
    echo 🔧 VERIFIQUE:
    echo    - Conexão com internet
    echo    - Repositório GitHub configurado
    echo    - Mudanças foram feitas
    echo.
)

echo ✅ Processo concluído!
echo.

pause 