@echo off
echo.
echo ========================================
echo    CRIANDO ATALHO - FAMÍLIA JAMAR
echo ========================================
echo.

REM Obter caminho da área de trabalho
for /f "tokens=2*" %%a in ('reg query "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders" /v Desktop 2^>nul') do set "DESKTOP=%%b"

if not defined DESKTOP (
    echo ❌ Não foi possível encontrar a área de trabalho
    pause
    exit /b 1
)

REM Caminho do arquivo VBS
set "VBS_PATH=%~dp0Família Jamar.vbs"

REM Criar atalho
echo 📁 Criando atalho na área de trabalho...
echo 🔗 Origem: %VBS_PATH%
echo 📂 Destino: %DESKTOP%

REM Criar arquivo VBS temporário para criar o atalho
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\criar_atalho.vbs"
echo sLinkFile = "%DESKTOP%\Família Jamar.lnk" >> "%TEMP%\criar_atalho.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\criar_atalho.vbs"
echo oLink.TargetPath = "%VBS_PATH%" >> "%TEMP%\criar_atalho.vbs"
echo oLink.WorkingDirectory = "%~dp0" >> "%TEMP%\criar_atalho.vbs"
echo oLink.Description = "Família Jamar - Gerenciador de Contas" >> "%TEMP%\criar_atalho.vbs"
echo oLink.IconLocation = "%~dp0public\favicon.ico" >> "%TEMP%\criar_atalho.vbs"
echo oLink.Save >> "%TEMP%\criar_atalho.vbs"

REM Executar VBS
cscript //nologo "%TEMP%\criar_atalho.vbs"

REM Limpar arquivo temporário
del "%TEMP%\criar_atalho.vbs"

echo.
echo ✅ Atalho criado com sucesso!
echo 🎯 Localização: %DESKTOP%\Família Jamar.lnk
echo.
echo 💡 Agora você pode:
echo    1. Clicar duas vezes no atalho da área de trabalho
echo    2. O sistema iniciará automaticamente
echo    3. O navegador abrirá com a aplicação
echo.
pause 