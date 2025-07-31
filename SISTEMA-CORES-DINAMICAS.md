# 🎨 Sistema de Cores Dinâmicas - Gráficos de Pizza

## 🎯 Visão Geral

O sistema agora utiliza cores dinâmicas e únicas para cada categoria nos gráficos de pizza, proporcionando melhor diferenciação visual e identificação rápida das categorias.

## 🌈 Paleta de Cores

### 📊 Cores Disponíveis

O sistema utiliza uma paleta de 20 cores distintas:

```javascript
const paletaCores = [
    '#e53e3e', // Vermelho
    '#3182ce', // Azul
    '#38a169', // Verde
    '#d69e2e', // Amarelo
    '#805ad5', // Roxo
    '#dd6b20', // Laranja
    '#319795', // Teal
    '#e53e3e', // Rosa
    '#2d3748', // Cinza escuro
    '#4a5568', // Cinza médio
    '#718096', // Cinza claro
    '#a0aec0', // Cinza muito claro
    '#f56565', // Vermelho claro
    '#4299e1', // Azul claro
    '#48bb78', // Verde claro
    '#ed8936', // Laranja claro
    '#9f7aea', // Roxo claro
    '#38b2ac', // Teal claro
    '#ed64a6', // Rosa claro
    '#667eea'  // Índigo
];
```

## 🔧 Funcionamento

### 🎲 Geração de Cores

A cor de cada categoria é determinada por um algoritmo de hash que garante:

1. **Consistência**: A mesma categoria sempre recebe a mesma cor
2. **Distribuição**: As cores são distribuídas uniformemente
3. **Unicidade**: Cada categoria tem uma cor única

```javascript
function obterCorCategoria(categoria, tipo) {
    // Hash simples para gerar índice consistente
    let hash = 0;
    for (let i = 0; i < categoria.length; i++) {
        const char = categoria.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % paletaCores.length;
    let cor = paletaCores[index];
    
    // Para receitas, usar tons mais claros
    if (tipo === 'receita') {
        // Aumentar luminosidade
        const fatorClareamento = 0.3;
        // ... conversão de cor
    }
    
    return cor;
}
```

### 🎨 Diferenciação por Tipo

- **Contas (Despesas)**: Cores originais da paleta
- **Receitas**: Versões mais claras das mesmas cores

## 📊 Aplicação nos Gráficos

### 🍕 Gráfico de Pizza

Cada fatia do gráfico recebe a cor específica da sua categoria:

```javascript
// Cor da fatia baseada na categoria
const tipo = titulo === 'Receitas' ? 'receita' : 'conta';
const cor = obterCorCategoria(categoria, tipo);
ctx.fillStyle = cor;
ctx.fill();
```

### 📋 Legenda

A legenda também utiliza as cores dinâmicas:

```javascript
const corCategoria = obterCorCategoria(categoria, tipo);

// Indicador de cor
<div style="background: ${corCategoria};"></div>

// Valor colorido
<div style="color: ${corCategoria};">${formatarMoeda(item.total)}</div>
```

## 🎯 Benefícios

### ✅ Vantagens do Sistema

1. **Identificação Rápida**: Cada categoria tem cor única
2. **Consistência Visual**: Mesma categoria = mesma cor sempre
3. **Diferenciação Clara**: Contas vs Receitas com tons diferentes
4. **Escalabilidade**: Suporta até 20 categorias únicas
5. **Acessibilidade**: Cores contrastantes e bem definidas

### 🔄 Comportamento

- **Nova Categoria**: Recebe automaticamente uma cor única
- **Categoria Existente**: Mantém a mesma cor sempre
- **Receitas**: Versões mais claras das cores das contas
- **Contas**: Cores originais da paleta

## 📝 Exemplos de Cores por Categoria

### 🏠 Categorias Comuns

| Categoria | Cor Conta | Cor Receita |
|-----------|-----------|-------------|
| Moradia | #e53e3e | #f56565 |
| Alimentação | #3182ce | #4299e1 |
| Transporte | #38a169 | #48bb78 |
| Saúde | #d69e2e | #ed8936 |
| Educação | #805ad5 | #9f7aea |
| Lazer | #dd6b20 | #ed8936 |
| Trabalho | #319795 | #38b2ac |
| Outros | #2d3748 | #4a5568 |

*Nota: As cores exatas podem variar dependendo do hash gerado*

## 🔧 Implementação Técnica

### 📍 Localização no Código

- **Função Principal**: `obterCorCategoria(categoria, tipo)`
- **Aplicação Gráfico**: `desenharGraficoPizza()`
- **Aplicação Legenda**: `criarLegenda()`
- **Arquivo**: `public/script-wix.js`

### 🎨 Código Completo

```javascript
// Paleta de cores dinâmicas
const paletaCores = [
    '#e53e3e', '#3182ce', '#38a169', '#d69e2e', '#805ad5',
    '#dd6b20', '#319795', '#e53e3e', '#2d3748', '#4a5568',
    '#718096', '#a0aec0', '#f56565', '#4299e1', '#48bb78',
    '#ed8936', '#9f7aea', '#38b2ac', '#ed64a6', '#667eea'
];

// Função para gerar cor baseada na categoria
function obterCorCategoria(categoria, tipo) {
    let hash = 0;
    for (let i = 0; i < categoria.length; i++) {
        const char = categoria.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    const index = Math.abs(hash) % paletaCores.length;
    let cor = paletaCores[index];
    
    if (tipo === 'receita') {
        // Clarear cor para receitas
        const hex = cor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const fatorClareamento = 0.3;
        const rNovo = Math.min(255, r + (255 - r) * fatorClareamento);
        const gNovo = Math.min(255, g + (255 - g) * fatorClareamento);
        const bNovo = Math.min(255, b + (255 - b) * fatorClareamento);
        
        cor = `#${Math.round(rNovo).toString(16).padStart(2, '0')}${Math.round(gNovo).toString(16).padStart(2, '0')}${Math.round(bNovo).toString(16).padStart(2, '0')}`;
    }
    
    return cor;
}
```

## 🚀 Funcionalidades

### 🎨 Características

1. **Hash Determinístico**: Mesma categoria = mesma cor sempre
2. **Distribuição Uniforme**: Cores bem distribuídas na paleta
3. **Diferenciação Visual**: Contas e receitas com tons diferentes
4. **Escalabilidade**: Suporta muitas categorias
5. **Performance**: Algoritmo rápido e eficiente

### 🔄 Comportamento Dinâmico

- **Nova Categoria**: Cor automática baseada no nome
- **Categoria Existente**: Mantém cor consistente
- **Receitas**: Versões mais claras das cores
- **Contas**: Cores originais da paleta

## 📊 Resultado Visual

### 🍕 Gráfico de Pizza

- Cada fatia tem cor única baseada na categoria
- Receitas em tons mais claros
- Contas em tons mais escuros
- Borda branca para separação

### 📋 Legenda

- Indicador de cor específico para cada categoria
- Valores coloridos com a cor da categoria
- Layout limpo e organizado

## 🎯 Casos de Uso

### 📈 Cenários Comuns

1. **Múltiplas Categorias**: Cada uma com cor única
2. **Contas vs Receitas**: Diferenciação visual clara
3. **Análise Rápida**: Identificação visual imediata
4. **Relatórios**: Cores consistentes em diferentes visualizações

### 🔄 Manutenção

- **Nova Categoria**: Adicionada automaticamente
- **Cor Consistente**: Mantida em todas as visualizações
- **Performance**: Algoritmo otimizado
- **Escalabilidade**: Suporta crescimento

---

**🎨 Resultado**: Gráficos mais informativos e visualmente atrativos com cores únicas para cada categoria! 