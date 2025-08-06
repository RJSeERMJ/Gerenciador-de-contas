@echo off
echo ========================================
echo    TESTE DO SISTEMA DE EMAIL AUTOMATICO
echo ========================================
echo.

echo 🔍 Verificando status do agendamento...
curl -s "https://seu-dominio.vercel.app/api/agendamento/status" | python -m json.tool
echo.

echo 📧 Testando envio manual de email...
curl -s -X POST "https://seu-dominio.vercel.app/api/agendamento/enviar-manual" | python -m json.tool
echo.

echo ⏰ Verificando cron job de 5 minutos...
curl -s "https://seu-dominio.vercel.app/api/cron/relatorios-5min" | python -m json.tool
echo.

echo ========================================
echo    INSTRUCOES PARA VERIFICAR LOGS
echo ========================================
echo.
echo 1. Acesse o dashboard do Vercel
echo 2. Vá em Functions ^> server-web.js
echo 3. Clique em "View Function Logs"
echo 4. Procure por: "Cron Job: Relatórios a cada 5 minutos"
echo.
echo O sistema deve executar automaticamente a cada 5 minutos!
echo.

pause
