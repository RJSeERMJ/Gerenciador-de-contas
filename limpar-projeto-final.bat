@echo off
echo ========================================
echo LIMPEZA DO PROJETO - SISTEMA FAMILIA JAMAR
echo ========================================
echo.
echo Este script ira remover arquivos desnecessarios
echo mantendo apenas os essenciais para o funcionamento.
echo.
pause

echo.
echo Removendo arquivos de documentacao desnecessarios...
del "SISTEMA-CORES-DINAMICAS.md" 2>nul
del "SISTEMA-CSV-IMPORT-EXPORT.md" 2>nul
del "CORRECAO-ABA-CONTAS.md" 2>nul
del "SISTEMA-PERSISTENCIA.md" 2>nul
del "SOLUCAO-EMAIL-FINAL.md" 2>nul
del "SOLUCAO-EMAIL-SIMPLES.md" 2>nul
del "TESTE-LOGIN.md" 2>nul
del "SISTEMA-LOGIN.md" 2>nul
del "GUIA-IMAGEM-BACKGROUND.md" 2>nul
del "GUIA-GITHUB-SIMPLES.md" 2>nul
del "LOGIN-INSTRUCOES.md" 2>nul
del "SISTEMA-NOTIFICACOES.md" 2>nul

echo.
echo Removendo arquivos de teste e backup...
del "testar-login.html" 2>nul
del "testar-imagem.bat" 2>nul
del "adicionar-imagem.bat" 2>nul
del "package.json.backup" 2>nul
del "modelo-contas-familia-jamar.csv" 2>nul

echo.
echo Removendo pasta do sistema offline completo...
rmdir /s /q "Família Jamar - Sistema Completo" 2>nul

echo.
echo Removendo arquivos desnecessarios da pasta public...
del "public\index.html" 2>nul
del "public\confirmar.html" 2>nul
del "public\confirmar.js" 2>nul

echo.
echo Removendo node_modules (sera reinstalado se necessario)...
rmdir /s /q "node_modules" 2>nul

echo.
echo ========================================
echo LIMPEZA CONCLUIDA!
echo ========================================
echo.
echo Arquivos mantidos:
echo - package.json
echo - package-lock.json
echo - server-web.js
echo - vercel.json
echo - public\index-wix.html
echo - public\script-wix.js
echo - public\styles.css
echo - public\login.html
echo - public\login.js
echo - public\favicon.svg
echo - database\
echo - atualizar-github-programa.bat
echo - .gitignore
echo.
echo O sistema esta pronto para funcionamento online!
echo.
pause 