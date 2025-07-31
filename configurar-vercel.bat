@echo off
echo ========================================
echo    CONFIGURAR VERCEL - MONGODB
echo ========================================
echo.

echo 📋 INSTRUÇÕES DETALHADAS:
echo.

echo 1. ABRIR VERCEL DASHBOARD:
echo    - Acesse: https://vercel.com/dashboard
echo    - Faça login na sua conta
echo    - Clique no projeto 'ideia'
echo.

echo 2. NAVEGAR PARA ENVIRONMENT VARIABLES:
echo    - Clique em 'Settings' (Configurações)
echo    - No menu lateral, clique em 'Environment Variables'
echo    - Clique em 'Add New'
echo.

echo 3. CONFIGURAR VARIÁVEL:
echo    Name: MONGODB_URI
echo    Value: (copie a string abaixo)
echo.
echo mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true^&w=majority^&appName=Familiajamar
echo.
echo    Environment: Production, Preview, Development (todas marcadas)
echo.

echo 4. SALVAR:
echo    - Clique em 'Save'
echo    - Aguarde a confirmação
echo.

echo 5. FAZER DEPLOY:
echo    - Execute os comandos abaixo:
echo.

echo ========================================
echo    COMANDOS PARA DEPLOY
echo ========================================
echo.

echo git add .
echo git commit -m "MongoDB Atlas configurado"
echo git push
echo.

echo ========================================
echo    VERIFICAR FUNCIONAMENTO
echo ========================================
echo.

echo 🔍 APÓS O DEPLOY, VERIFIQUE:
echo 1. Logs do Vercel (Dashboard > Functions > server-web.js)
echo 2. Teste online (adicione contas e recarregue)
echo 3. MongoDB Atlas (https://cloud.mongodb.com)
echo.

echo 📞 CREDENCIAIS MONGODB ATLAS:
echo URL: https://cloud.mongodb.com
echo Email: jamarestudo@gmail.com
echo Cluster: familiajamar
echo Database: familia-jamar
echo Collection: contas
echo.

echo 🎉 SISTEMA PRONTO PARA FUNCIONAR!
echo.

pause 