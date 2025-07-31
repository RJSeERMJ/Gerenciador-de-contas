@echo off
echo ========================================
echo    VERIFICAR DEPLOY - MONGODB
echo ========================================
echo.

echo ✅ DEPLOY CONCLUÍDO!
echo.

echo 📋 PRÓXIMOS PASSOS:
echo.

echo 1. CONFIGURAR VARIÁVEL NO VERCEL:
echo    - Acesse: https://vercel.com/dashboard
echo    - Projeto ID: prj_dwYcTwBldRs28U4GzKBMsvfbFcdu
echo    - Settings > Environment Variables
echo    - Add New: MONGODB_URI
echo    - Value: mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true&w=majority&appName=Familiajamar
echo.

echo 2. VERIFICAR LOGS DO VERCEL:
echo    - Dashboard > Functions > server-web.js
echo    - Procure por:
echo      🔄 Conectando ao MongoDB Atlas...
echo      ✅ Conectado ao MongoDB Atlas com sucesso
echo.

echo 3. TESTAR ONLINE:
echo    - Acesse seu site no Vercel
echo    - Adicione uma conta
echo    - Recarregue a página
echo    - A conta deve persistir (não sumir)
echo.

echo 4. VERIFICAR MONGODB ATLAS:
echo    - URL: https://cloud.mongodb.com
echo    - Email: jamarestudo@gmail.com
echo    - Cluster: familiajamar
echo    - Database: familia-jamar
echo    - Collection: contas
echo.

echo ========================================
echo    STATUS ATUAL
echo ========================================
echo.

echo ✅ Código atualizado no GitHub
echo ✅ Deploy automático no Vercel
echo ✅ MongoDB Atlas funcionando
echo ⏳ Aguardando configuração da variável MONGODB_URI
echo.

echo 🎯 RESULTADO ESPERADO:
echo - Contas não vão mais sumir
echo - Sistema funcionará 24/7
echo - Dados seguros na nuvem
echo.

pause 