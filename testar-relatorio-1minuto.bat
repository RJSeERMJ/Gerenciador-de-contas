@echo off
echo ========================================
echo ⏰ TESTE: Relatório Completo a Cada 1 Minuto
echo ========================================
echo.

echo 🔍 Verificando status atual...
curl -s "https://seu-dominio.vercel.app/api/agendamento/status" | python -m json.tool
echo.

echo ⏰ Ativando relatório a cada 1 minuto...
curl -s -X POST "https://seu-dominio.vercel.app/api/relatorio-1minuto" ^
  -H "Content-Type: application/json" ^
  -d "{\"ativar\": true, \"email\": \"teste-1minuto@gmail.com\"}" | python -m json.tool
echo.

echo ⏳ Aguardando 70 segundos para verificar execução...
echo 📊 O sistema deve enviar relatório completo a cada 1 minuto
echo.

timeout /t 70 /nobreak >nul

echo 🔍 Verificando status após 1 minuto...
curl -s "https://seu-dominio.vercel.app/api/agendamento/status" | python -m json.tool
echo.

echo 📧 Testando envio manual para verificar...
curl -s -X POST "https://seu-dominio.vercel.app/api/agendamento/enviar-manual" | python -m json.tool
echo.

echo ========================================
echo ✅ Teste concluído!
echo ========================================
echo.
echo 📋 Próximos passos:
echo 1. Verifique se recebeu e-mails a cada 1 minuto
echo 2. Monitore os logs no console do servidor
echo 3. O sistema continuará executando automaticamente
echo.
echo ⚠️  ATENÇÃO: 1 minuto é muito frequente!
echo    Considere desativar após os testes
echo.
pause
