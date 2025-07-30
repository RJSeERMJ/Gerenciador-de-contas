@echo off
title Adicionar Imagem - Família Jamar
color 0A

echo.
echo ========================================
echo    ADICIONAR IMAGEM - FAMILIA JAMAR
echo ========================================
echo.

echo 📸 Adicionando imagem de background...
echo.

echo 📁 Criando pasta de imagens...
if not exist "public\images" mkdir "public\images"
echo ✅ Pasta de imagens criada

echo.
echo 📋 INSTRUÇÕES PARA ADICIONAR A IMAGEM:
echo.
echo 1. 📁 Copie a imagem "tatoo" para a pasta:
echo    public\images\
echo.
echo 2. 📝 Formatos aceitos:
echo    - tatoo.jpg
echo    - tatoo.png
echo    - tatoo.webp
echo.
echo 3. 🎨 A imagem será usada como background
echo.
echo 4. 🔧 CSS já configurado para:
echo    - Background cover
echo    - Posição centralizada
echo    - Overlay para legibilidade
echo.

echo 💡 DICAS:
echo - Use JPG para melhor compatibilidade
echo - Resolução recomendada: 1920x1080 ou maior
echo - Tamanho máximo: 2MB
echo - Teste em diferentes dispositivos
echo.

echo ✅ CSS atualizado com:
echo - Background image configurado
echo - Overlay para melhor legibilidade
echo - Elementos com backdrop-filter
echo - Sombras e bordas melhoradas
echo.

echo 🚀 Próximos passos:
echo 1. Adicione a imagem na pasta public\images\
echo 2. Execute atualizar-github-simples.bat
echo 3. Teste o site online
echo.

pause 