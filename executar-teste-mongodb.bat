@echo off
echo ========================================
echo TESTE MONGODB ATLAS - FAMILIA JAMAR
echo ========================================
echo.
echo 🧪 Executando teste de conexão MongoDB...
echo.

echo ========================================
echo VERIFICANDO CONFIGURACAO
echo ========================================
echo.

:: Verificar se o arquivo de teste existe
if exist "testar-mongodb.js" (
    echo ✅ Arquivo testar-mongodb.js encontrado
) else (
    echo ❌ Arquivo testar-mongodb.js não encontrado
    echo 💡 Execute primeiro: configurar-mongodb.bat
    pause
    exit /b
)

:: Verificar se mongodb está instalado
if exist "node_modules\mongodb" (
    echo ✅ MongoDB instalado
) else (
    echo ❌ MongoDB não instalado
    echo 📦 Instalando...
    npm install mongodb
)

echo.
echo ========================================
echo EXECUTANDO TESTE
echo ========================================
echo.

echo 🚀 Iniciando teste de conexão...
echo 💡 Verifique se MONGODB_URI está configurado
echo.

:: Executar teste
node testar-mongodb.js

echo.
echo ========================================
echo RESULTADO DO TESTE
echo ========================================
echo.

echo 📋 Se o teste foi bem-sucedido:
echo ✅ MongoDB Atlas está configurado corretamente
echo ✅ Você pode fazer deploy no Vercel
echo ✅ O sistema funcionará online
echo.

echo 📋 Se o teste falhou:
echo ❌ Verifique a configuração do MongoDB Atlas
echo ❌ Confirme a string de conexão
echo ❌ Verifique Network Access (0.0.0.0/0)
echo.

echo ========================================
echo PROXIMOS PASSOS
echo ========================================
echo.

echo 🚀 Para continuar:
echo.
echo 1. Se o teste passou:
echo    - Configure MONGODB_URI no Vercel
echo    - Faça deploy: git add . ^&^& git commit -m "MongoDB configurado" ^&^& git push
echo    - Teste o sistema online
echo.
echo 2. Se o teste falhou:
echo    - Execute: configurar-mongodb.bat
echo    - Siga os passos de configuração
echo    - Execute este teste novamente
echo.

pause 