@echo off
title Testar Imagem - Família Jamar
color 0B

echo.
echo ========================================
echo    TESTAR IMAGEM - FAMILIA JAMAR
echo ========================================
echo.

echo 📸 Verificando imagem de background...
echo.

echo 📁 Verificando pasta de imagens...
if exist "public\images\tatoo.png" (
    echo ✅ Imagem encontrada: tatoo.png
    echo 📏 Tamanho: 
    dir "public\images\tatoo.png" | find "tatoo.png"
) else (
    echo ❌ Imagem não encontrada: tatoo.png
)

echo.
echo 📁 Verificando outros formatos...
if exist "public\images\tatoo.jpg" (
    echo ✅ Imagem encontrada: tatoo.jpg
) else (
    echo ❌ Imagem não encontrada: tatoo.jpg
)

if exist "public\images\tatoo.webp" (
    echo ✅ Imagem encontrada: tatoo.webp
) else (
    echo ❌ Imagem não encontrada: tatoo.webp
)

echo.
echo 🔧 Verificando CSS...
findstr "background-image" public\styles.css
echo.

echo 🌐 Abrindo navegador para teste...
start http://localhost:3000

echo.
echo 💡 POSSÍVEIS PROBLEMAS:
echo.
echo 1. ❌ Imagem não carregou:
echo    - Verifique se o nome está correto
echo    - Verifique se o formato está correto
echo    - Verifique se o servidor está rodando
echo.
echo 2. ❌ CSS não atualizou:
echo    - Pressione Ctrl+F5 para limpar cache
echo    - Verifique se o servidor reiniciou
echo.
echo 3. ❌ Caminho incorreto:
echo    - A imagem deve estar em: public\images\
echo    - O CSS deve apontar para: /images/tatoo.png
echo.

echo 🚀 Próximos passos:
echo 1. Verifique se a imagem aparece no navegador
echo 2. Se não aparecer, pressione Ctrl+F5
echo 3. Se ainda não aparecer, reinicie o servidor
echo 4. Execute atualizar-github-simples.bat para deploy
echo.

pause 