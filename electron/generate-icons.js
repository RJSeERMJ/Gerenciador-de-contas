const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Função para criar ícone PNG
function createIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Gradiente de fundo
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    // Fundo circular
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Borda branca
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Carteira
    const walletWidth = size * 0.4;
    const walletHeight = size * 0.25;
    const walletX = (size - walletWidth) / 2;
    const walletY = size * 0.4;
    
    // Fundo da carteira
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(walletX, walletY, walletWidth, walletHeight);
    
    // Interior da carteira
    ctx.fillStyle = '#667eea';
    ctx.fillRect(walletX + 2, walletY + 4, walletWidth - 4, walletHeight - 8);
    
    // Moedas
    const coinSize = size * 0.08;
    const coins = [
        { x: walletX + walletWidth * 0.2, y: walletY + walletHeight * 0.5, color: '#f6ad55' },
        { x: walletX + walletWidth * 0.5, y: walletY + walletHeight * 0.5, color: '#68d391' },
        { x: walletX + walletWidth * 0.8, y: walletY + walletHeight * 0.5, color: '#9f7aea' }
    ];
    
    coins.forEach(coin => {
        ctx.fillStyle = coin.color;
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coinSize, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Símbolo $
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.15}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', size/2, walletY + walletHeight * 0.5);
    
    // Salvar arquivo
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, filename), buffer);
    console.log(`✅ Ícone criado: ${filename}`);
}

// Criar ícones
try {
    // Verificar se canvas está disponível
    try {
        require('canvas');
    } catch (e) {
        console.log('⚠️ Módulo canvas não encontrado. Criando ícones SVG...');
        
        // Criar ícones SVG simples
        const iconSVG = `<svg width="256" height="256" viewBox="0 0 256 256">
            <circle cx="128" cy="128" r="120" fill="url(#grad)"/>
            <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea"/>
                <stop offset="100%" style="stop-color:#764ba2"/>
            </linearGradient></defs>
            <text x="128" y="140" font-family="Arial" font-size="60" text-anchor="middle" fill="white">$</text>
        </svg>`;
        
        fs.writeFileSync(path.join(__dirname, 'icon.svg'), iconSVG);
        fs.writeFileSync(path.join(__dirname, 'tray-icon.svg'), iconSVG);
        
        console.log('✅ Ícones SVG criados!');
        console.log('💡 Para PNG: instale "npm install canvas" ou use conversor online');
        return;
    }
    
    // Criar ícones PNG
    createIcon(256, 'icon.png');
    createIcon(32, 'tray-icon.png');
    createIcon(16, 'tray-icon-16.png');
    
    console.log('🎉 Todos os ícones criados com sucesso!');
    
} catch (error) {
    console.error('❌ Erro ao criar ícones:', error);
} 