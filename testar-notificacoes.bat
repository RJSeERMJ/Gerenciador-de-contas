@echo off
echo ========================================
echo    TESTE DE NOTIFICACOES - FAMILIA JAMAR
echo ========================================
echo.

REM Verificar se o servidor está rodando localmente
echo 🔍 Verificando se o servidor local está rodando...
curl -s http://localhost:3000/api/contas >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Servidor local está rodando
    set URL_BASE=http://localhost:3000
) else (
    echo ⚠️ Servidor local não está rodando
    echo 📝 Digite a URL do seu sistema no Vercel (ex: https://familia-jamar.vercel.app):
    set /p URL_BASE=
)

echo.
echo 📧 Testando notificações...
echo.

REM Testar status do e-mail
echo 1. Verificando status do e-mail...
curl -s "%URL_BASE%/api/email-status" | python -m json.tool
echo.

REM Testar verificação manual
echo 2. Testando verificação manual de notificações...
curl -s -X POST "%URL_BASE%/api/verificar-notificacoes" | python -m json.tool
echo.

REM Perguntar se quer testar envio de e-mail
echo.
set /p TESTAR_EMAIL=Deseja testar o envio de e-mail? (s/n): 
if /i "%TESTAR_EMAIL%"=="s" (
    set /p EMAIL_TESTE=Digite seu e-mail para teste: 
    echo 3. Testando envio de e-mail...
    curl -s -X POST "%URL_BASE%/api/testar-email" -H "Content-Type: application/json" -d "{\"email\":\"%EMAIL_TESTE%\"}" | python -m json.tool
)

echo.
echo ========================================
echo    TESTE CONCLUIDO
echo ========================================
echo.
echo 📝 Para configurar notificações automáticas:
echo    1. Configure o e-mail no sistema
echo    2. Use UptimeRobot para chamar a API periodicamente
echo    3. URL: %URL_BASE%/api/verificar-notificacoes
echo.
pause 