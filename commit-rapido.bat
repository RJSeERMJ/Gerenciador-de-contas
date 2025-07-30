@echo off
title Commit Rápido - Família Jamar
color 0A

echo.
echo ========================================
echo    COMMIT RÁPIDO - FAMILIA JAMAR
echo ========================================
echo.

echo 💬 Digite a mensagem do commit:
set /p commit_msg="Mensagem: "

echo.
echo 📤 ADICIONANDO ARQUIVOS:
git add .

echo.
echo 💬 CRIANDO COMMIT:
git commit -m "%commit_msg%"

echo.
echo 📤 ENVIANDO PARA GITHUB:
git push origin main

echo.
echo ✅ COMMIT CONCLUÍDO!
echo.

pause 