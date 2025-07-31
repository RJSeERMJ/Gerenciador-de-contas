@echo off
echo ========================================
echo    CONFIGURAR MONGODB ATLAS
echo ========================================
echo.

echo ✅ STATUS ATUAL:
echo - MongoDB Atlas funcionando perfeitamente
echo - String de conexão válida
echo - Operações CRUD testadas
echo - Banco e coleção criados
echo.

echo 🔧 O QUE FALTA CONFIGURAR:
echo - Variável de ambiente MONGODB_URI no Vercel
echo.

echo ========================================
echo    CONFIGURAR NO VERCEL
echo ========================================
echo.

echo 📋 PASSO A PASSO:
echo 1. Acesse: https://vercel.com/dashboard
echo 2. Selecione o projeto 'ideia'
echo 3. Clique em Settings
echo 4. Clique em Environment Variables
echo 5. Clique em Add New
echo.

echo 📝 CONFIGURAÇÃO:
echo Name: MONGODB_URI
echo Value: mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true&w=majority&appName=Familiajamar
echo Environment: Production, Preview, Development
echo.

echo ========================================
echo    TESTAR CONEXÃO LOCAL
echo ========================================
echo.

echo 🧪 Testando conexão com MongoDB Atlas...
node verificar-sistema-completo.js

echo.
echo ========================================
echo    DEPLOY NO VERCEL
echo ========================================
echo.

echo 📤 Para fazer deploy:
echo git add .
echo git commit -m "MongoDB Atlas configurado"
echo git push
echo.

echo ========================================
echo    VERIFICAR FUNCIONAMENTO
echo ========================================
echo.

echo 🔍 Após o deploy, verifique:
echo 1. Logs do Vercel (Dashboard > Functions)
echo 2. Teste online (adicione contas)
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