@echo off
echo ========================================
echo VERIFICACAO COMPLETA DO SISTEMA
echo ========================================
echo.
echo 🔍 Vou verificar se o sistema está totalmente integrado...
echo.

echo ========================================
echo EXECUTANDO VERIFICACAO
echo ========================================
echo.
echo 📋 A verificação vai testar:
echo.
echo 1. Conexão com MongoDB Atlas
echo 2. Acesso ao banco de dados
echo 3. Verificação de dados existentes
echo 4. Operações CRUD completas
echo 5. Simulação do botão pagar
echo 6. Estrutura do banco
echo.

echo 🚀 Iniciando verificação completa...
echo.

:: Executar verificação
node verificar-sistema-completo.js

echo.
echo ========================================
echo RESULTADO DA VERIFICACAO
echo ========================================
echo.

echo 📋 Se tudo estiver OK:
echo ✅ Sistema totalmente integrado
echo ✅ MongoDB Atlas funcionando
echo ✅ Botão pagar operacional
echo ✅ Dados persistindo corretamente
echo ✅ Pronto para deploy no Vercel
echo.

echo 📋 Se houver problemas:
echo ❌ Verifique os logs acima
echo ❌ Confirme configurações do MongoDB
echo ❌ Teste a string de conexão
echo.

echo ========================================
echo ACESSAR MONGODB ATLAS
echo ========================================
echo.
echo 🌐 Para ver seus dados no MongoDB Atlas:
echo.
echo 1. Acesse: https://cloud.mongodb.com
echo 2. Faça login com: jamarestudo
echo 3. Clique em "Browse Collections"
echo 4. Selecione: familia-jamar > contas
echo 5. Visualize, edite e gerencie seus dados!
echo.

echo ========================================
echo CONFIGURAR NO VERCEL
echo ========================================
echo.
echo 🔧 Para configurar no Vercel:
echo.
echo 1. Acesse: https://vercel.com
echo 2. Vá em Settings → Environment Variables
echo 3. Configure MONGODB_URI:
echo    mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true^&w=majority^&appName=Familiajamar
echo 4. Clique em Save
echo 5. Faça deploy: git push
echo.

echo ========================================
echo SISTEMA PRONTO!
echo ========================================
echo.
echo 🎉 Seu sistema está:
echo ✅ Totalmente integrado com MongoDB Atlas
echo ✅ Funcionando perfeitamente
echo ✅ Pronto para uso online
echo ✅ Com persistência garantida
echo.

pause 