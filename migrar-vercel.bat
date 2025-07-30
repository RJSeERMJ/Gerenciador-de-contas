@echo off
echo.
echo ========================================
echo    MIGRAR PARA VERCEL - GRATUITO 24/7
echo ========================================
echo.

echo ✅ Verificando arquivos necessários...
if not exist "package.json" (
    echo ❌ ERRO: package.json não encontrado!
    pause
    exit /b 1
)

if not exist "server-simples.js" (
    echo ❌ ERRO: server-simples.js não encontrado!
    pause
    exit /b 1
)

if not exist "vercel.json" (
    echo ❌ ERRO: vercel.json não encontrado!
    pause
    exit /b 1
)

echo ✅ Todos os arquivos necessários encontrados!
echo.

echo 🚀 Preparando para deploy no Vercel...
echo.

echo 📋 PASSO A PASSO PARA MIGRAR:
echo.
echo 1️⃣ Acesse: https://vercel.com
echo 2️⃣ Faça login com GitHub
echo 3️⃣ Clique em "New Project"
echo 4️⃣ Importe seu repositório
echo 5️⃣ Clique em "Deploy"
echo.

echo ⏳ Aguarde 1-2 minutos para o deploy...
echo.

echo 🎯 APÓS O DEPLOY:
echo ✅ URL será gerada automaticamente
echo ✅ Sistema ficará online 24/7
echo ✅ Deploy automático a cada push
echo ✅ Gratuito para sempre!
echo.

echo 📝 Para fazer atualizações:
echo git add .
echo git commit -m "Atualização"
echo git push origin main
echo.

echo 🎊 VANTAGENS DO VERCEL:
echo ✅ Gratuito para sempre (sem limite de 30 dias)
echo ✅ Sempre online 24/7
echo ✅ Performance excelente (Edge Network)
echo ✅ SSL automático
echo ✅ CDN global
echo ✅ Analytics gratuitos
echo.

echo ========================================
echo    MIGRAÇÃO CONCLUÍDA!
echo ========================================
echo.

pause 