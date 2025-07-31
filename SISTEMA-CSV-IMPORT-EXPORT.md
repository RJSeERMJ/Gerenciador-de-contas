# 📊 Sistema de Importação/Exportação CSV - Família Jamar

## 🎯 Visão Geral

O sistema agora suporta importação e exportação de dados em formato CSV (Comma-Separated Values), permitindo maior compatibilidade com planilhas e outros sistemas.

## 📁 Arquivos CSV

### 📋 Formato do Arquivo

O arquivo CSV deve conter as seguintes colunas na ordem especificada:

| Coluna | Descrição | Tipo | Exemplo |
|--------|-----------|------|---------|
| ID | Identificador único | Número | 1 |
| Descrição | Nome da conta/receita | Texto | "Conta de Luz" |
| Valor | Valor em reais | Decimal | 150.00 |
| Data de Vencimento | Data de vencimento | Data (YYYY-MM-DD) | 2024-01-15 |
| Categoria | Categoria da conta | Texto | "Energia" |
| Tipo | Tipo (conta/receita) | Texto | "conta" |
| Recorrente | Se é recorrente | Sim/Não | "Sim" |
| Paga | Se foi paga | Sim/Não | "Não" |
| Data de Criação | Data de criação | Data (YYYY-MM-DD) | 2024-01-01 |
| Data de Pagamento | Data do pagamento | Data (YYYY-MM-DD) | 2024-01-05 |

### 📄 Arquivo Modelo

Um arquivo modelo está disponível: `modelo-contas-familia-jamar.csv`

**Conteúdo do modelo:**
```csv
ID,Descrição,Valor,Data de Vencimento,Categoria,Tipo,Recorrente,Paga,Data de Criação,Data de Pagamento
1,Conta de Luz,150.00,2024-01-15,Energia,conta,Sim,Não,2024-01-01,
2,Salário,3000.00,2024-01-05,Trabalho,receita,Sim,Sim,2024-01-01,2024-01-05
3,Internet,89.90,2024-01-20,Serviços,conta,Sim,Não,2024-01-01,
4,Freelance,500.00,2024-01-10,Trabalho,receita,Não,Sim,2024-01-01,2024-01-10
```

## 🔧 Funcionalidades

### 📤 Exportar CSV

**Como usar:**
1. Acesse a aba "Contas"
2. Clique no botão "Exportar CSV"
3. O arquivo será baixado automaticamente

**Nome do arquivo:** `familia-jamar-contas-YYYY-MM-DD.csv`

**Características:**
- Exporta todas as contas e receitas
- Mantém formatação correta com aspas
- Inclui todos os campos do sistema

### 📥 Importar CSV

**Como usar:**
1. Acesse a aba "Contas"
2. Clique no botão "Importar CSV"
3. Selecione o arquivo CSV
4. Aguarde o processamento

**Validações:**
- Verifica se o arquivo tem o cabeçalho correto
- Valida formato das datas
- Converte valores para números
- Trata campos vazios

### 📋 Baixar Modelo

**Como usar:**
1. Acesse a aba "Contas"
2. Clique no botão "Modelo"
3. O arquivo modelo será baixado

**Uso do modelo:**
- Abra em Excel, Google Sheets ou editor de texto
- Preencha com seus dados
- Salve como CSV
- Importe no sistema

## ⚙️ Implementação Técnica

### 🔧 Funções JavaScript

#### `exportarContas()`
```javascript
// Converte contas para CSV
const csvContent = [
    headers.join(','),
    ...contas.map(conta => [
        conta.id,
        `"${conta.descricao.replace(/"/g, '""')}"`,
        conta.valor || 0,
        conta.dataVencimento || '',
        // ... outros campos
    ].join(','))
].join('\n');
```

#### `baixarModeloCSV()`
```javascript
// Cria arquivo modelo com exemplos
const exemplos = [
    ['1', 'Conta de Luz', '150.00', '2024-01-15', 'Energia', 'conta', 'Sim', 'Não'],
    ['2', 'Salário', '3000.00', '2024-01-05', 'Trabalho', 'receita', 'Sim', 'Sim']
];
```

#### `processarImportacao()`
```javascript
// Processa arquivo CSV importado
const linhas = csvContent.split('\n');
const headers = linhas[0].split(',').map(h => h.trim());

// Valida cabeçalho
if (!expectedHeaders.every(header => headers.includes(header))) {
    throw new Error('Formato inválido');
}
```

#### `parseCSVLine()`
```javascript
// Parseia linha CSV considerando aspas
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}
```

#### `importarContasParaServidor()`
```javascript
// Envia contas para o servidor
for (const conta of novasContas) {
    const response = await fetch('/api/contas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            descricao: conta.descricao,
            valor: conta.valor,
            // ... outros campos
        })
    });
}
```

### 🎨 Interface HTML

```html
<div class="export-import">
    <button class="btn btn-outline" onclick="exportarContas()">
        <i class="fas fa-download"></i> Exportar CSV
    </button>
    <button class="btn btn-outline" onclick="baixarModeloCSV()">
        <i class="fas fa-file-download"></i> Modelo
    </button>
    <button class="btn btn-outline" onclick="importarContas()">
        <i class="fas fa-upload"></i> Importar CSV
    </button>
    <input type="file" id="importFile" accept=".csv" style="display: none;" onchange="processarImportacao(event)">
</div>
```

## 📋 Regras de Validação

### ✅ Campos Obrigatórios
- **Descrição**: Não pode estar vazio
- **Valor**: Deve ser um número válido
- **Tipo**: Deve ser "conta" ou "receita"

### ⚠️ Campos Opcionais
- **Data de Vencimento**: Se vazio, não terá data
- **Categoria**: Se vazio, será "Outros"
- **Recorrente**: Se vazio, será "Não"
- **Paga**: Se vazio, será "Não"

### 🔄 Conversões Automáticas
- **Valores**: Convertidos para números
- **Datas**: Validadas no formato YYYY-MM-DD
- **Booleanos**: "Sim"/"Não" convertidos para true/false
- **Aspas**: Removidas automaticamente dos textos

## 🚨 Tratamento de Erros

### ❌ Erros Comuns
1. **Arquivo inválido**: Formato não reconhecido
2. **Cabeçalho incorreto**: Colunas não correspondem ao esperado
3. **Dados inválidos**: Valores não podem ser convertidos
4. **Erro de rede**: Falha na comunicação com servidor

### ✅ Mensagens de Sucesso
- "Dados exportados em CSV com sucesso!"
- "Arquivo modelo baixado com sucesso!"
- "Importação concluída! X contas importadas com sucesso"

## 🔄 Fluxo de Importação

1. **Seleção do arquivo** → Usuário escolhe arquivo CSV
2. **Validação do cabeçalho** → Verifica se colunas estão corretas
3. **Parse das linhas** → Converte CSV para objetos JavaScript
4. **Validação dos dados** → Verifica tipos e formatos
5. **Envio para servidor** → Cada conta é enviada via API
6. **Atualização da interface** → Dashboard e lista são atualizados
7. **Feedback ao usuário** → Mostra resultado da operação

## 📊 Compatibilidade

### ✅ Editores Suportados
- **Microsoft Excel**
- **Google Sheets**
- **LibreOffice Calc**
- **Editores de texto** (Notepad++, VS Code)

### 📱 Formatos Aceitos
- **CSV UTF-8**
- **CSV com BOM**
- **CSV com separador vírgula**

## 🎯 Benefícios

### ✅ Vantagens do CSV
- **Compatibilidade universal** com planilhas
- **Fácil edição** em qualquer editor
- **Tamanho reduzido** comparado a JSON
- **Padrão da indústria** para dados tabulares

### 🔄 Migração de Dados
- **Backup simples** em formato legível
- **Transferência entre sistemas** facilitada
- **Análise externa** em planilhas
- **Integração** com outros softwares

## 📝 Exemplo de Uso

### 1️⃣ Exportar Dados Atuais
```
Clique em "Exportar CSV" → familia-jamar-contas-2024-01-15.csv
```

### 2️⃣ Editar em Planilha
```
Abra o arquivo CSV no Excel
Adicione novas contas
Salve como CSV
```

### 3️⃣ Importar Dados Editados
```
Clique em "Importar CSV"
Selecione o arquivo editado
Aguarde processamento
```

### 4️⃣ Verificar Resultado
```
Dashboard atualizado
Lista de contas atualizada
Mensagem de sucesso exibida
```

## 🔧 Configuração

### ⚙️ Variáveis de Ambiente
Nenhuma configuração adicional necessária para CSV.

### 📁 Arquivos do Sistema
- `public/script-wix.js` - Funções de importação/exportação
- `public/index-wix.html` - Interface dos botões
- `modelo-contas-familia-jamar.csv` - Arquivo modelo

## 🚀 Próximos Passos

### 🔮 Melhorias Futuras
- **Validação avançada** de dados
- **Importação em lote** com progresso
- **Exportação filtrada** por período
- **Sincronização** com Google Sheets
- **Backup automático** em CSV

---

**📞 Suporte**: Em caso de problemas, verifique o formato do arquivo CSV e use o arquivo modelo como referência. 