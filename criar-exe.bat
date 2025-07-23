@echo off
echo.
echo ========================================
echo    GERENCIADOR DE CONTAS - EXECUTAVEL
echo ========================================
echo.
echo 🚀 Criando executável...
echo 📦 Isso pode demorar alguns minutos...
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo 💡 Instale o Node.js primeiro: https://nodejs.org/
    pause
    exit /b 1
)

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo 📥 Instalando dependências...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
)

REM Criar executável
echo 🔨 Criando executável...
node criar-executavel.js

echo.
echo ========================================
echo           PROCESSO CONCLUIDO
echo ========================================
echo.
echo 📁 Verifique a pasta 'dist' para o executável
echo 🎉 Clique no arquivo .exe para usar a aplicação!
echo.
pause 