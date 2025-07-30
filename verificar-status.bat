@echo off
title Verificar Status - Família Jamar
color 0E

echo.
echo ========================================
echo    VERIFICAR STATUS - FAMILIA JAMAR
echo ========================================
echo.

echo 📋 STATUS DO REPOSITÓRIO:
echo.
git status

echo.
echo 📊 HISTÓRICO DE COMMITS:
echo.
git log --oneline -5

echo.
echo 🌿 BRANCH ATUAL:
echo.
git branch

echo.
echo 📤 REMOTE:
echo.
git remote -v

echo.
echo 💡 COMANDOS ÚTEIS:
echo - Para atualizar: atualizar-github-simples.bat
echo - Para ver status: verificar-status.bat
echo.

pause 