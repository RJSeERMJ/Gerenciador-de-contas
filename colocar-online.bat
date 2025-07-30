@echo off
title Colocar Site Online - Família Jamar
color 0B

echo.
echo ========================================
echo    COLOCAR SITE ONLINE GRATUITO
echo    FAMILIA JAMAR
echo ========================================
echo.

echo 🚀 Vamos colocar seu site online gratuitamente!
echo.

echo 📋 PRÉ-REQUISITOS:
echo ✅ Git instalado
echo ✅ Arquivos preparados
echo ✅ Repositório local configurado
echo.

echo 🎯 PASSO A PASSO:
echo.

echo 1️⃣ CRIAR CONTA NO GITHUB
echo    Acesse: https://github.com
echo    Clique em "Sign up"
echo    Crie sua conta gratuita
echo.

set /p github_ready="✅ Conta do GitHub criada? (s/n): "
if /i "%github_ready%"=="s" (
    echo ✅ Ótimo! Vamos continuar...
) else (
    echo ❌ Crie a conta primeiro e execute novamente.
    pause
    exit /b 1
)

echo.
echo 2️⃣ CRIAR REPOSITÓRIO
echo    No GitHub, clique em "New repository"
echo    Nome: familia-jamar
echo    Descrição: Sistema de gerenciamento de contas da Família Jamar
echo    Público (gratuito)
echo    NÃO marque "Add a README file"
echo    Clique em "Create repository"
echo.

set /p repo_ready="✅ Repositório criado? (s/n): "
if /i "%repo_ready%"=="s" (
    echo ✅ Perfeito! Agora vamos enviar o código...
) else (
    echo ❌ Crie o repositório primeiro.
    pause
    exit /b 1
)

echo.
echo 3️⃣ ENVIAR CÓDIGO PARA GITHUB
echo    Digite seu nome de usuário do GitHub:
set /p github_user="👤 Seu usuário do GitHub: "

echo.
echo 🔧 Conectando com o repositório...
git remote add origin https://github.com/%github_user%/familia-jamar.git

echo.
echo 📤 Enviando código para o GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo ✅ Código enviado com sucesso!
) else (
    echo ❌ Erro ao enviar código. Verifique:
    echo    - Nome de usuário correto
    echo    - Repositório criado
    echo    - Conexão com internet
    pause
    exit /b 1
)

echo.
echo 4️⃣ CRIAR CONTA NO RENDER
echo    Acesse: https://render.com
echo    Clique em "Get Started"
echo    Escolha "Continue with GitHub"
echo    Autorize o Render a acessar seu GitHub
echo.

set /p render_ready="✅ Conta do Render criada? (s/n): "
if /i "%render_ready%"=="s" (
    echo ✅ Excelente! Vamos fazer o deploy...
) else (
    echo ❌ Crie a conta primeiro.
    pause
    exit /b 1
)

echo.
echo 5️⃣ FAZER DEPLOY NO RENDER
echo    No Render, clique em "New +"
echo    Escolha "Web Service"
echo    Selecione o repositório familia-jamar
echo    Configure:
echo      Name: familia-jamar
echo      Environment: Node
echo      Region: Oregon (US West)
echo      Branch: main
echo      Build Command: npm install
echo      Start Command: node server-simples.js
echo      Plan: Free
echo    Clique em "Create Web Service"
echo.

set /p deploy_ready="✅ Deploy iniciado? (s/n): "
if /i "%deploy_ready%"=="s" (
    echo ✅ Deploy em andamento!
) else (
    echo ❌ Inicie o deploy primeiro.
    pause
    exit /b 1
)

echo.
echo 6️⃣ AGUARDAR DEPLOY
echo    ⏳ Aguarde 5-10 minutos
echo    📊 Veja o progresso no dashboard
echo    🟢 Quando ficar verde, está pronto!
echo.

set /p deploy_complete="✅ Deploy concluído (verde)? (s/n): "
if /i "%deploy_complete%"=="s" (
    echo 🎉 PARABÉNS! Seu site está online!
) else (
    echo ⏳ Aguarde mais um pouco...
    pause
    exit /b 1
)

echo.
echo ========================================
echo    🎊 SITE ONLINE COM SUCESSO!
echo ========================================
echo.
echo 🌐 URL: https://familia-jamar.onrender.com
echo.
echo 📱 TESTE AGORA:
echo    1. Acesse a URL
echo    2. Configure seu e-mail
echo    3. Adicione suas contas
echo    4. Teste todas as funcionalidades
echo.
echo 💡 DICAS:
echo    - Site pode demorar 30s para "acordar"
echo    - Use moderadamente para economizar recursos
echo    - Faça backup regular dos dados
echo.
echo 🎯 PRÓXIMOS PASSOS:
echo    1. Teste o site online
echo    2. Configure notificações por e-mail
echo    3. Adicione suas contas
echo    4. Compartilhe com a família
echo.

echo ✅ Processo concluído com sucesso!
echo 🌐 Seu sistema Família Jamar está online!
echo.

pause 