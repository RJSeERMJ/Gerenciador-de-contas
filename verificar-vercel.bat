@echo off
echo ========================================
echo    VERIFICAR CONFIGURAÇÃO VERCEL
echo ========================================
echo.

echo 🔍 DIAGNÓSTICO ATUAL:
echo - MONGODB_URI configurada: false
echo - Banco MongoDB: vazio (0 contas)
echo - Sistema usando: fallback JSON local
echo.

echo 📋 PROBLEMA IDENTIFICADO:
echo A variável MONGODB_URI não está configurada no Vercel!
echo.

echo ========================================
echo    CONFIGURAR NO VERCEL AGORA
echo ========================================
echo.

echo 1. ABRIR VERCEL DASHBOARD:
echo    - Acesse: https://vercel.com/dashboard
echo    - Projeto ID: prj_dwYcTwBldRs28U4GzKBMsvfbFcdu
echo.

echo 2. NAVEGAR PARA ENVIRONMENT VARIABLES:
echo    - Clique em 'Settings'
echo    - Clique em 'Environment Variables'
echo    - Clique em 'Add New'
echo.

echo 3. CONFIGURAR VARIÁVEL:
echo    Name: MONGODB_URI
echo    Value: mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true&w=majority&appName=Familiajamar
echo    Environment: Production, Preview, Development (todas marcadas)
echo.

echo 4. SALVAR E TESTAR:
echo    - Clique em 'Save'
echo    - Aguarde confirmação
echo    - Acesse seu site e adicione uma conta
echo    - Recarregue a página
echo    - A conta deve persistir!
echo.

echo ========================================
echo    VERIFICAR SE FUNCIONOU
echo ========================================
echo.

echo 🔍 APÓS CONFIGURAR, VERIFIQUE:
echo 1. Logs do Vercel (Dashboard > Functions > server-web.js)
echo    Procure por: '✅ Conectado ao MongoDB Atlas com sucesso'
echo.

echo 2. Teste online:
echo    - Adicione uma conta
echo    - Recarregue a página
echo    - A conta deve permanecer
echo.

echo 3. MongoDB Atlas:
echo    - URL: https://cloud.mongodb.com
echo    - Email: jamarestudo@gmail.com
echo    - Verifique se as contas aparecem
echo.

echo ========================================
echo    STATUS ATUAL
echo ========================================
echo.

echo ❌ PROBLEMA: Variável MONGODB_URI não configurada
echo ✅ SOLUÇÃO: Configurar no Vercel (passos acima)
echo ✅ RESULTADO: Contas persistirão no MongoDB Atlas
echo.

echo 🎯 DEPOIS DE CONFIGURAR:
echo - Contas não vão mais sumir
echo - Sistema funcionará 24/7
echo - Dados seguros na nuvem
echo.

pause 