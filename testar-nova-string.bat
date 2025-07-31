@echo off
echo ========================================
echo TESTE DA NOVA STRING MONGODB ATLAS
echo ========================================
echo.
echo 🆕 Testando a nova string de conexão...
echo.

echo ========================================
echo NOVA STRING DE CONEXÃO
echo ========================================
echo.
echo 📋 String atualizada:
echo mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true^&w=majority^&appName=Familiajamar
echo.

echo ========================================
echo EXECUTANDO TESTE
echo ========================================
echo.
echo 🧪 O teste vai verificar:
echo.
echo 1. Conexão com a nova string
echo 2. Acesso ao banco de dados
echo 3. Operações de CRUD
echo 4. Simulação do botão pagar
echo 5. Limpeza dos dados de teste
echo.

echo 🚀 Iniciando teste...
echo.

:: Executar teste
node testar-nova-string.js

echo.
echo ========================================
echo RESULTADO DO TESTE
echo ========================================
echo.

echo 📋 Se o teste foi bem-sucedido:
echo ✅ Nova string de conexão está funcionando
echo ✅ MongoDB Atlas configurado corretamente
echo ✅ Botão pagar funcionando
echo ✅ Sistema pronto para usar
echo.

echo 📋 Se o teste falhou:
echo ❌ Verifique os logs acima
echo ❌ Confirme a senha no MongoDB Atlas
echo ❌ Verifique Network Access (0.0.0.0/0)
echo.

echo ========================================
echo CONFIGURAR NO VERCEL
echo ========================================
echo.
echo 🔧 Para configurar no Vercel:
echo.
echo 1. Acesse: https://vercel.com
echo 2. Vá em Settings → Environment Variables
echo 3. Atualize MONGODB_URI com a nova string:
echo    mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true^&w=majority^&appName=Familiajamar
echo 4. Clique em Save
echo 5. Faça deploy: git push
echo.

echo ========================================
echo ARQUIVOS ATUALIZADOS
echo ========================================
echo.
echo 📁 Arquivos com nova string:
echo - testar-botao-pagar.js
echo - mostrar-conexao-mongodb.js
echo - testar-string-completa.js
echo - testar-nova-string.js (novo)
echo - testar-string-final.bat
echo.

pause 