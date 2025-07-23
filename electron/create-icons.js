// Script para criar ícones da aplicação
const fs = require('fs');
const path = require('path');

// Criar ícone simples em SVG
const iconSVG = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Fundo circular -->
  <circle cx="128" cy="128" r="120" fill="url(#grad1)" stroke="#ffffff" stroke-width="8"/>
  
  <!-- Ícone de carteira -->
  <rect x="80" y="100" width="96" height="56" rx="8" fill="#ffffff" opacity="0.9"/>
  <rect x="80" y="108" width="96" height="40" rx="4" fill="#667eea"/>
  
  <!-- Moedas -->
  <circle cx="100" cy="128" r="8" fill="#f6ad55"/>
  <circle cx="120" cy="128" r="8" fill="#68d391"/>
  <circle cx="140" cy="128" r="8" fill="#9f7aea"/>
  
  <!-- Símbolo de cifrão -->
  <text x="128" y="135" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#ffffff">$</text>
  
  <!-- Indicador de notificação -->
  <circle cx="180" cy="90" r="12" fill="#e53e3e"/>
  <text x="180" y="95" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#ffffff">!</text>
</svg>
`;

// Criar ícone da bandeja (menor)
const trayIconSVG = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Fundo circular -->
  <circle cx="16" cy="16" r="15" fill="url(#grad2)" stroke="#ffffff" stroke-width="1"/>
  
  <!-- Ícone de carteira simplificado -->
  <rect x="10" y="12" width="12" height="8" rx="2" fill="#ffffff" opacity="0.9"/>
  <rect x="10" y="13" width="12" height="6" rx="1" fill="#667eea"/>
  
  <!-- Símbolo de cifrão -->
  <text x="16" y="17" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle" fill="#ffffff">$</text>
</svg>
`;

// Salvar ícones
try {
    // Criar diretório se não existir
    const electronDir = path.join(__dirname);
    if (!fs.existsSync(electronDir)) {
        fs.mkdirSync(electronDir, { recursive: true });
    }
    
    // Salvar ícone principal
    fs.writeFileSync(path.join(electronDir, 'icon.svg'), iconSVG);
    fs.writeFileSync(path.join(electronDir, 'tray-icon.svg'), trayIconSVG);
    
    console.log('✅ Ícones SVG criados com sucesso!');
    console.log('📁 Localização:', electronDir);
    console.log('');
    console.log('💡 Para converter para PNG/ICO:');
    console.log('1. Use um conversor online (ex: convertio.co)');
    console.log('2. Ou instale o Inkscape e converta via linha de comando');
    console.log('3. Salve como icon.png e tray-icon.png');
    
} catch (error) {
    console.error('❌ Erro ao criar ícones:', error);
} 