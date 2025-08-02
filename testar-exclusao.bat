@echo off
echo ========================================
echo    TESTE DE EXCLUSAO - FAMILIA JAMAR
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
echo 📊 Verificando status do banco de dados...
echo.

REM Verificar status do banco
echo 1. Status do banco de dados:
curl -s "%URL_BASE%/api/db-status" | python -m json.tool
echo.

REM Listar contas
echo 2. Listando contas atuais:
curl -s "%URL_BASE%/api/contas" | python -m json.tool
echo.

REM Perguntar qual conta deletar
echo.
set /p ID_DELETAR=Digite o ID da conta que deseja deletar: 
if not "%ID_DELETAR%"=="" (
    echo 3. Deletando conta com ID %ID_DELETAR%...
    curl -s -X DELETE "%URL_BASE%/api/contas/%ID_DELETAR%" | python -m json.tool
    echo.
    
    echo 4. Verificando status após exclusão:
    curl -s "%URL_BASE%/api/db-status" | python -m json.tool
    echo.
    
    echo 5. Listando contas após exclusão:
    curl -s "%URL_BASE%/api/contas" | python -m json.tool
)

echo.
echo ========================================
echo    TESTE CONCLUIDO
echo ========================================
echo.
pause 