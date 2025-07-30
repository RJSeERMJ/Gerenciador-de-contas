@echo off
title Atualizar Site Online - Família Jamar
color 0E

echo.
echo ========================================
echo    ATUALIZAR SITE ONLINE
echo    FAMILIA JAMAR
echo ========================================
echo.

echo 🔄 Vamos atualizar seu site online!
echo.

echo 📋 VERIFICANDO STATUS:
echo.

git status

echo.
echo 💬 Digite uma descrição da atualização:
set /p commit_message="📝 Descrição da mudança: "

if "%commit_message%"=="" (
    echo ❌ Descrição é obrigatória!
    pause
    exit /b 1
)

echo.
echo 🚀 INICIANDO ATUALIZAÇÃO:
echo.

echo 1️⃣ Adicionando mudanças...
git add .

echo 2️⃣ Fazendo commit...
git commit -m "%commit_message%"

echo 3️⃣ Enviando para GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ ATUALIZAÇÃO ENVIADA COM SUCESSO!
    echo.
    echo 📊 PRÓXIMOS PASSOS:
    echo    1. Acesse: https://render.com
    echo    2. Veja o status do serviço
    echo    3. Aguarde deploy automático (5-10 min)
    echo    4. Teste o site atualizado
    echo.
    echo 🌐 URL: https://familia-jamar.onrender.com
    echo.
    echo 💡 DICAS:
    echo    - Deploy é automático
    echo    - Status muda para "Building"
    echo    - Aguarde ficar "Live" (verde)
    echo    - Teste todas as funcionalidades
    echo.
) else (
    echo.
    echo ❌ ERRO AO ENVIAR ATUALIZAÇÃO!
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