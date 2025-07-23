@echo off
title Deploy Online - Família Jamar
color 0A

echo.
echo ========================================
echo    PREPARANDO PARA DEPLOY ONLINE
echo    FAMILIA JAMAR
echo ========================================
echo.

echo 🔧 Verificando arquivos necessários...

if not exist "server-simples.js" (
    echo ❌ ERRO: server-simples.js não encontrado!
    echo 💡 Certifique-se de estar na pasta correta.
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ❌ ERRO: package.json não encontrado!
    pause
    exit /b 1
)

if not exist "public" (
    echo ❌ ERRO: Pasta public não encontrada!
    pause
    exit /b 1
)

echo ✅ Todos os arquivos necessários encontrados!
echo.

echo 📋 Verificando se Git está instalado...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não está instalado!
    echo 💡 Baixe em: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo ✅ Git encontrado!
echo.

echo 🚀 Iniciando processo de deploy...
echo.

echo 1️⃣ Inicializando Git...
git init

echo 2️⃣ Adicionando arquivos...
git add .

echo 3️⃣ Fazendo primeiro commit...
git commit -m "Primeira versão do sistema Família Jamar"

echo 4️⃣ Configurando branch principal...
git branch -M main

echo.
echo ========================================
echo    PRÓXIMOS PASSOS MANUAIS:
echo ========================================
echo.
echo 1️⃣ Crie uma conta no GitHub:
echo    https://github.com
echo.
echo 2️⃣ Crie um repositório chamado "familia-jamar"
echo.
echo 3️⃣ Execute os comandos:
echo    git remote add origin https://github.com/SEU_USUARIO/familia-jamar.git
echo    git push -u origin main
echo.
echo 4️⃣ Crie uma conta no Render:
echo    https://render.com
echo.
echo 5️⃣ Conecte com GitHub e faça deploy
echo.
echo 📖 Veja o guia completo em: COMO-COLOCAR-ONLINE.md
echo.

echo ✅ Preparação concluída!
echo 💡 Agora siga os passos manuais acima.
echo.

pause 