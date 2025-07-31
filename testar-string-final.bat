@echo off
echo ========================================
echo TESTE STRING FINAL - MONGODB ATLAS
echo ========================================
echo.
echo 🧪 Testando string de conexão completa...
echo.

echo ========================================
echo SUA STRING DE CONEXAO
echo ========================================
echo.
       echo 📋 String completa (pronta para usar):
       echo mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true^&w=majority^&appName=Familiajamar
echo.

echo ========================================
echo EXECUTANDO TESTE
echo ========================================
echo.
echo 🚀 Testando conexão com MongoDB Atlas...
echo.

:: Executar teste
node testar-string-completa.js

echo.
echo ========================================
echo RESULTADO DO TESTE
echo ========================================
echo.

echo 📋 Se o teste foi bem-sucedido:
echo ✅ String de conexão está funcionando
echo ✅ MongoDB Atlas está configurado corretamente
echo ✅ Você pode configurar no Vercel
echo ✅ Sistema funcionará online
echo.

echo 📋 Se o teste falhou:
echo ❌ Verifique Network Access no MongoDB Atlas
echo ❌ Deve estar: "Allow Access from Anywhere" (0.0.0.0/0)
echo ❌ Verifique se o cluster está ativo
echo.

echo ========================================
echo CONFIGURAR NO VERCEL
echo ========================================
echo.
echo 🔧 Para configurar no Vercel:
echo.
echo 1. Acesse: https://vercel.com
echo 2. Vá em Settings → Environment Variables
echo 3. Adicione:
echo    - Name: MONGODB_URI
       echo    - Value: mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true^&w=majority^&appName=Familiajamar
echo    - Environment: Production, Preview, Development
echo 4. Clique em Save
echo.

echo ========================================
echo DEPLOY FINAL
echo ========================================
echo.
echo 🚀 Após configurar no Vercel:
echo.
echo 1. Faça commit:
echo    git add .
echo    git commit -m "MongoDB Atlas configurado com string completa"
echo    git push
echo.
echo 2. Vercel fará deploy automático
echo 3. Teste o sistema online
echo 4. Verifique logs no Vercel Dashboard
echo.

echo ========================================
echo SISTEMA PRONTO!
echo ========================================
echo.
echo 🎉 Seu sistema agora terá:
echo ✅ MongoDB Atlas como banco principal
echo ✅ JSON local como backup automático
echo ✅ Persistência garantida no Vercel
echo ✅ Sistema 100% funcional online
echo.

pause 