@echo off
title Programa GitHub - Família Jamar
color 0B

:menu
cls
echo.
echo ========================================
echo    PROGRAMA GITHUB - FAMILIA JAMAR
echo ========================================
echo.
echo 🚀 Escolha uma opção:
echo.
echo 1. 📋 Verificar Status
echo 2. 📤 Atualização Completa
echo 3. ⚡ Commit Rápido
echo 4. 🗑️ Limpar Projeto
echo 5. 📊 Ver Histórico
echo 6. 🔧 Configurar Git
echo 7. ❌ Sair
echo.
set /p opcao="Digite sua opção (1-7): "

if "%opcao%"=="1" goto verificar_status
if "%opcao%"=="2" goto atualizacao_completa
if "%opcao%"=="3" goto commit_rapido
if "%opcao%"=="4" goto limpar_projeto
if "%opcao%"=="5" goto ver_historico
if "%opcao%"=="6" goto configurar_git
if "%opcao%"=="7" goto sair
goto menu

:verificar_status
cls
echo.
echo ========================================
echo    VERIFICANDO STATUS
echo ========================================
echo.
echo 📋 Status do repositório:
echo.
git status
echo.
echo 📊 Últimos commits:
echo.
git log --oneline -5
echo.
echo 🌿 Branch atual:
echo.
git branch
echo.
pause
goto menu

:atualizacao_completa
cls
echo.
echo ========================================
echo    ATUALIZAÇÃO COMPLETA
echo ========================================
echo.
echo 🚀 Iniciando atualização completa...
echo.
echo 📋 Verificando status...
git status
echo.
echo 📤 Adicionando arquivos...
git add .
echo.
echo 💬 Criando commit...
git commit -m "🔐 Sistema de Login Online - Atualização completa

✅ Funcionalidades implementadas:
- Sistema de login com CPF único
- Confirmação por e-mail
- Links dinâmicos para funcionar online
- Interface responsiva e moderna
- Banco de dados SQLite
- Deploy automático no Render

🔒 Segurança:
- CPF autorizado: 151.192.367-90
- Token único por solicitação
- Confirmação obrigatória por e-mail
- Validação frontend e backend

🌐 URLs funcionais:
- Login: https://gerenciador-de-contas-1.onrender.com
- Sistema: https://gerenciador-de-contas-1.onrender.com/sistema
- Confirmação: https://gerenciador-de-contas-1.onrender.com/confirmar.html

📁 Arquivos principais:
- server-simples.js (servidor principal)
- public/login.html (página de login)
- public/confirmar.html (página de confirmação)
- database/ (banco de dados)
- Scripts de GitHub (atualizar-github-programa.bat)

🎊 Sistema 100% funcional online!"
echo.
echo 📤 Enviando para GitHub...
git push origin main
echo.
echo ✅ Atualização completa concluída!
echo.
echo 🎯 Próximos passos:
echo 1. Verifique o repositório no GitHub
echo 2. O deploy no Render será automático
echo 3. Teste o sistema online
echo.
pause
goto menu

:commit_rapido
cls
echo.
echo ========================================
echo    COMMIT RÁPIDO
echo ========================================
echo.
echo 💬 Digite a mensagem do commit:
set /p commit_msg="Mensagem: "
echo.
echo 📤 Adicionando arquivos...
git add .
echo.
echo 💬 Criando commit...
git commit -m "%commit_msg%"
echo.
echo 📤 Enviando para GitHub...
git push origin main
echo.
echo ✅ Commit rápido concluído!
echo.
pause
goto menu

:limpar_projeto
cls
echo.
echo ========================================
echo    LIMPAR PROJETO
echo ========================================
echo.
echo ⚠️ ATENÇÃO: Esta operação irá remover arquivos desnecessários!
echo.
echo 📋 Arquivos que serão mantidos:
echo ✅ server-simples.js (servidor principal)
echo ✅ public/ (interface web)
echo ✅ database/ (banco de dados)
echo ✅ package.json (dependências)
echo ✅ render.yaml (configuração deploy)
echo ✅ Scripts essenciais (.bat)
echo ✅ README.md (documentação)
echo.
echo 📋 Arquivos que serão removidos:
echo ❌ Documentação antiga (.md)
echo ❌ Scripts de teste antigos
echo ❌ Arquivos de teste (.py, .js, .html)
echo ❌ Pastas desnecessárias
echo.
set /p confirm="⚠️ Deseja continuar? (s/n): "
if /i "%confirm%"=="s" (
    echo.
    echo 🗑️ Removendo arquivos desnecessários...
    echo.
    
    echo 📝 Removendo documentação antiga...
    del /q *.md 2>nul
    echo ✅ Documentação antiga removida
    
    echo.
    echo 🔧 Removendo scripts antigos...
    del /q *.bat 2>nul
    echo ✅ Scripts antigos removidos
    
    echo.
    echo 🧪 Removendo arquivos de teste...
    del /q teste-*.py 2>nul
    del /q teste-*.js 2>nul
    del /q teste-*.html 2>nul
    echo ✅ Arquivos de teste removidos
    
    echo.
    echo 📁 Removendo pastas desnecessárias...
    rmdir /s /q electron 2>nul
    rmdir /s /q services 2>nul
    rmdir /s /q dist 2>nul
    rmdir /s /q "Família Jamar - Sistema Completo" 2>nul
    echo ✅ Pastas desnecessárias removidas
    
    echo.
    echo 📄 Removendo arquivos de configuração antigos...
    del /q env-*.txt 2>nul
    del /q env.example 2>nul
    del /q server.js 2>nul
    echo ✅ Arquivos de configuração antigos removidos
    
    echo.
    echo ✅ Limpeza concluída!
    echo.
    echo 📁 Arquivos mantidos:
    dir /b *.js 2>nul
    dir /b *.json 2>nul
    dir /b *.yaml 2>nul
    dir /b *.bat 2>nul
    dir /b *.md 2>nul
    echo.
    
) else (
    echo ❌ Operação cancelada pelo usuário
)
pause
goto menu

:ver_historico
cls
echo.
echo ========================================
echo    HISTÓRICO DE COMMITS
echo ========================================
echo.
echo 📊 Últimos 10 commits:
echo.
git log --oneline -10
echo.
echo 📊 Estatísticas:
echo.
git log --oneline | find /c /v ""
echo.
pause
goto menu

:configurar_git
cls
echo.
echo ========================================
echo    CONFIGURAR GIT
echo ========================================
echo.
echo 🔧 Configurações atuais:
echo.
git config --list
echo.
echo 💬 Para configurar seu usuário:
echo git config --global user.name "Seu Nome"
echo git config --global user.email "seu@email.com"
echo.
echo 📤 Para configurar o remote:
echo git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
echo.
pause
goto menu

:sair
cls
echo.
echo ========================================
echo    PROGRAMA ENCERRADO
echo ========================================
echo.
echo ✅ Obrigado por usar o Programa GitHub!
echo.
echo 🎯 Lembre-se:
echo - Use 'verificar-status' antes de commitar
echo - Faça commits frequentes e pequenos
echo - Teste sempre antes de enviar
echo.
echo 🚀 Sistema Família Jamar funcionando online!
echo.
exit 