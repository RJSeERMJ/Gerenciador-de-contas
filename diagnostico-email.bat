@echo off
echo ========================================
echo    DIAGNOSTICO DO SISTEMA DE EMAIL
echo ========================================
echo.

echo 🔍 1. Verificando configuração de email...
curl -s "https://seu-dominio.vercel.app/api/agendamento/status" | python -m json.tool
echo.

echo 📧 2. Testando envio manual de email...
curl -s -X POST "https://seu-dominio.vercel.app/api/agendamento/enviar-manual" | python -m json.tool
echo.

echo ⏰ 3. Executando cron job manualmente...
curl -s "https://seu-dominio.vercel.app/api/cron/relatorios-5min" | python -m json.tool
echo.

echo 🔧 4. Verificando variáveis de ambiente...
curl -s "https://seu-dominio.vercel.app/api/debug/email-config" | python -m json.tool
echo.

echo 📊 5. Verificando dados do banco...
curl -s "https://seu-dominio.vercel.app/api/db-status" | python -m json.tool
echo.

echo ========================================
echo    POSSIVEIS PROBLEMAS E SOLUCOES
echo ========================================
echo.
echo ❌ PROBLEMA: EMAIL_PASSWORD não configurada
echo ✅ SOLUCAO: Configurar no Vercel Dashboard
echo.
echo ❌ PROBLEMA: Senha do app Gmail incorreta
echo ✅ SOLUCAO: Gerar nova senha de app
echo.
echo ❌ PROBLEMA: Contas vazias no banco
echo ✅ SOLUCAO: Adicionar contas via interface
echo.
echo ❌ PROBLEMA: Timeout na execução
echo ✅ SOLUCAO: Verificar logs no Vercel
echo.

echo ========================================
echo    INSTRUCOES PARA CONFIGURAR EMAIL
echo ========================================
echo.
echo 1. Acesse o Vercel Dashboard
echo 2. Vá em Settings ^> Environment Variables
echo 3. Adicione: EMAIL_PASSWORD=sua_senha_de_app
echo 4. Faça novo deploy
echo.

pause
