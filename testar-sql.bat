@echo off
echo ========================================
echo TESTE DO SISTEMA SQL - FAMILIA JAMAR
echo ========================================
echo.

echo 🔍 Verificando arquivos do sistema SQL...
echo.

:: Verificar se existe o diretório database
if exist "database" (
    echo ✅ Diretório database encontrado
) else (
    echo ❌ Diretório database não encontrado
    echo 📁 Criando diretório...
    mkdir database
)

:: Verificar arquivo do banco SQLite
if exist "database\contas.db" (
    echo ✅ Arquivo contas.db encontrado
    echo 📊 Tamanho: 
    for %%A in ("database\contas.db") do echo    %%~zA bytes
) else (
    echo ❌ Arquivo contas.db não encontrado (será criado automaticamente)
)

echo.
echo ========================================
echo INSTALANDO DEPENDENCIAS
echo ========================================
echo.

:: Instalar dependências
echo 📦 Instalando sqlite3...
npm install sqlite3

echo.
echo ========================================
echo TESTANDO O SISTEMA
echo ========================================
echo.

echo 🚀 Iniciando servidor SQL...
echo 💡 O servidor será iniciado em: http://localhost:3000
echo.
echo 📋 Para testar:
echo 1. Acesse http://localhost:3000 no navegador
echo 2. Adicione algumas contas
echo 3. Verifique se elas persistem após reiniciar
echo 4. Teste as funcionalidades (editar, deletar, marcar como paga)
echo.
echo ⏹️ Para parar o servidor: Ctrl+C
echo.

:: Iniciar servidor
npm start

pause 