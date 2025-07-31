@echo off
echo ========================================
echo TESTE STRING MONGODB - FAMILIA JAMAR
echo ========================================
echo.
echo 🧪 Testando sua string de conexão MongoDB...
echo.

echo ========================================
echo SUA STRING DE CONEXAO
echo ========================================
echo.
echo 📋 String original:
echo mongodb+srv://jamarestudo:^<db_password^>@familiajamar.wu9knb3.mongodb.net/?retryWrites=true^&w=majority^&appName=Familiajamar
echo.
echo 💡 Para usar, substitua ^<db_password^> pela sua senha real
echo.

echo ========================================
echo CONFIGURACAO NECESSARIA
echo ========================================
echo.
echo 🔧 Para configurar no Vercel:
echo.
echo 1. Acesse: https://vercel.com
echo 2. Vá em Settings → Environment Variables
echo 3. Adicione:
echo    - Name: MONGODB_URI
echo    - Value: mongodb+srv://jamarestudo:SUA_SENHA@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true^&w=majority^&appName=Familiajamar
echo    - Environment: Production, Preview, Development
echo 4. Clique em Save
echo.

echo ========================================
echo TESTE LOCAL
echo ========================================
echo.
echo 🧪 Para testar localmente:
echo.
echo 1. Crie um arquivo .env na raiz do projeto:
echo    MONGODB_URI=mongodb+srv://jamarestudo:SUA_SENHA@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true^&w=majority^&appName=Familiajamar
echo.
echo 2. Execute o teste:
echo    executar-teste-mongodb.bat
echo.

echo ========================================
echo VERIFICACOES IMPORTANTES
echo ========================================
echo.
echo ✅ Verifique no MongoDB Atlas:
echo.
echo 1. Database Access:
echo    - Usuário: jamarestudo
echo    - Senha: (confirme que está correta)
echo    - Role: Read and write to any database
echo.
echo 2. Network Access:
echo    - Deve estar: "Allow Access from Anywhere" (0.0.0.0/0)
echo    - Se não estiver, adicione esta configuração
echo.

echo ========================================
echo DEPLOY NO VERCEL
echo ========================================
echo.
echo 🚀 Após configurar MONGODB_URI no Vercel:
echo.
echo 1. Faça commit:
echo    git add .
echo    git commit -m "MongoDB Atlas configurado"
echo    git push
echo.
echo 2. Vercel fará deploy automático
echo 3. Verifique os logs no Vercel Dashboard
echo 4. Teste o sistema online
echo.

echo ========================================
echo LOGS ESPERADOS
echo ========================================
echo.
echo ✅ Logs de sucesso:
echo 🔄 Conectando ao MongoDB Atlas...
echo ✅ Conectado ao MongoDB Atlas com sucesso
echo 📊 Banco: familia-jamar
echo 📋 Coleção: contas
echo ✅ Dados salvos no MongoDB Atlas
echo ✅ Backup salvo no JSON local
echo.
echo ❌ Logs de erro:
echo ❌ Erro ao conectar ao MongoDB Atlas
echo 💡 Usando fallback para JSON local
echo.

echo ========================================
echo PROXIMOS PASSOS
echo ========================================
echo.
echo 🎯 Agora você pode:
echo.
echo 1. Configurar MONGODB_URI no Vercel
echo 2. Fazer deploy: git push
echo 3. Testar o sistema online
echo 4. Verificar logs no Vercel Dashboard
echo.

echo ========================================
echo ARQUIVOS IMPORTANTES
echo ========================================
echo.
echo 📁 Arquivos criados:
echo - CONFIGURAR-VERCEL-MONGODB.md (guia específico)
echo - testar-mongodb.js (script de teste)
echo - executar-teste-mongodb.bat (executar teste)
echo - configurar-mongodb.bat (configuração geral)
echo.

pause 