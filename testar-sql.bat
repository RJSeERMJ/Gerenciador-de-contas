@echo off
echo ========================================
echo TESTE DO SISTEMA MONGODB - FAMILIA JAMAR
echo ========================================
echo.
echo 🔍 Verificando arquivos do sistema MongoDB...
echo.
:: Verificar se existe o diretório database
if exist "database" (
    echo ✅ Diretório database encontrado
) else (
    echo ❌ Diretório database não encontrado
    echo 📁 Criando diretório...
    mkdir database
)

:: Verificar arquivos de backup local
if exist "database\contas.json" (
    echo ✅ Arquivo contas.json encontrado (backup local)
    echo 📊 Tamanho: 
    for %%A in ("database\contas.json") do echo    %%~zA bytes
) else (
    echo ❌ Arquivo contas.json não encontrado (será criado automaticamente)
)

if exist "database\config.json" (
    echo ✅ Arquivo config.json encontrado (backup local)
    echo 📊 Tamanho: 
    for %%A in ("database\config.json") do echo    %%~zA bytes
) else (
    echo ❌ Arquivo config.json não encontrado (será criado automaticamente)
)

echo.
echo ========================================
echo CONFIGURACAO MONGODB ATLAS
echo ========================================
echo.
echo 📋 Para usar MongoDB Atlas:
echo 1. Crie uma conta em: https://cloud.mongodb.com
echo 2. Crie um cluster gratuito
echo 3. Configure Network Access (0.0.0.0/0)
echo 4. Crie um usuário e senha
echo 5. Obtenha a string de conexão
echo 6. Configure a variável MONGODB_URI no Vercel
echo.
echo 💡 Exemplo de MONGODB_URI:
echo mongodb+srv://usuario:senha@cluster.mongodb.net/familia-jamar
echo.

echo ========================================
echo INSTALANDO DEPENDENCIAS
echo ========================================
echo.
:: Instalar dependências
echo 📦 Instalando mongodb...
npm install mongodb
echo.
echo ========================================
echo TESTANDO O SISTEMA
echo ========================================
echo.
echo 🚀 Iniciando servidor MongoDB...
echo 💡 O servidor será iniciado em: http://localhost:3000
echo.
echo 📋 Para testar:
echo 1. Acesse http://localhost:3000 no navegador
echo 2. Adicione algumas contas
echo 3. Verifique se elas persistem após reiniciar
echo 4. Teste as funcionalidades (editar, deletar, marcar como paga)
echo 5. Configure e-mail para receber notificações
echo.
echo ⚠️ Se MONGODB_URI não estiver configurado, usará JSON local
echo.
echo ⏹️ Para parar o servidor: Ctrl+C
echo.
:: Iniciar servidor
npm start
pause 