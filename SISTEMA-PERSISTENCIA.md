# Sistema de Persistência de Dados - Família Jamar

## 📋 Visão Geral

O sistema agora utiliza **persistência de dados no servidor**, permitindo que as contas sejam acessadas de qualquer computador através da internet.

## 🔄 Como Funciona

### Antes (localStorage)
- Dados salvos apenas no navegador local
- Acessível apenas no mesmo computador
- Perdidos ao limpar cache do navegador

### Agora (Servidor)
- Dados salvos no servidor (arquivo JSON)
- Acessível de qualquer computador
- Persistente mesmo após limpar cache

## 🛠️ Implementação Técnica

### Backend (server-web.js)
```javascript
// Sistema de persistência
const DATA_FILE = path.join(__dirname, 'database', 'contas.json');

// Funções de persistência
async function carregarDados() {
    // Carrega dados do arquivo JSON
}

async function salvarDados() {
    // Salva dados no arquivo JSON
}
```

### Frontend (script-wix.js)
```javascript
// Carregar dados do servidor
async function carregarDados() {
    const response = await fetch('/api/contas');
    contas = await response.json();
}

// Salvar conta no servidor
async function salvarConta(event) {
    const response = await fetch('/api/contas', {
        method: 'POST',
        body: JSON.stringify(novaConta)
    });
}
```

## 📁 Estrutura de Arquivos

```
ideia/
├── database/
│   └── contas.json          # Arquivo de dados
├── server-web.js            # Servidor com APIs
├── public/
│   ├── script-wix.js        # Frontend atualizado
│   └── index-wix.html       # Interface
└── package.json             # Dependências
```

## 🔌 APIs Disponíveis

### GET /api/contas
- **Função**: Listar todas as contas
- **Resposta**: Array de contas

### POST /api/contas
- **Função**: Criar nova conta
- **Body**: Dados da conta
- **Resposta**: Conta criada

### PUT /api/contas/:id
- **Função**: Atualizar conta
- **Body**: Dados atualizados
- **Resposta**: Conta atualizada

### DELETE /api/contas/:id
- **Função**: Deletar conta
- **Resposta**: Confirmação

### PATCH /api/contas/:id/pagar
- **Função**: Marcar como paga
- **Resposta**: Conta atualizada

## 💾 Armazenamento de Dados

### Arquivo: database/contas.json
```json
{
  "contas": [
    {
      "id": 1,
      "descricao": "Conta de Luz",
      "valor": 150.00,
      "dataVencimento": "2024-01-15",
      "categoria": "Moradia",
      "tipo": "conta",
      "paga": false,
      "recorrente": true,
      "dataCriacao": "2024-01-01T10:00:00.000Z"
    }
  ],
  "nextId": 2,
  "ultimaAtualizacao": "2024-01-01T10:00:00.000Z"
}
```

## 🚀 Benefícios

### ✅ Vantagens
- **Acesso Multiplataforma**: Use de qualquer computador
- **Sincronização**: Dados sempre atualizados
- **Backup Automático**: Dados salvos no servidor
- **Sem Perda**: Dados não se perdem ao limpar cache

### ⚠️ Considerações
- **Internet**: Requer conexão com internet
- **Servidor**: Depende do servidor estar online
- **Latência**: Pequeno delay nas operações

## 🔧 Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Servidor
```bash
npm start
```

### 3. Acessar Sistema
- Local: http://localhost:3000
- Online: https://familiajamar.vercel.app

## 📊 Monitoramento

### Logs do Servidor
```
✅ Dados carregados com sucesso: 5 contas
💾 Dados salvos com sucesso
📧 E-mail enviado com sucesso
```

### Tratamento de Erros
- Conexão perdida: Mensagem de erro amigável
- Servidor offline: Fallback para localStorage
- Dados corrompidos: Recuperação automática

## 🔒 Segurança

### Dados Sensíveis
- E-mail configurado: Mantido no localStorage (local)
- Contas e valores: Salvos no servidor
- Senhas: Não armazenadas

### Backup
- Arquivo JSON: Backup automático
- Versionamento: Git para controle de versão
- Recuperação: Sistema de fallback

## 📱 Compatibilidade

### Navegadores Suportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Dispositivos
- Desktop: ✅ Totalmente compatível
- Tablet: ✅ Interface responsiva
- Mobile: ✅ Otimizado para touch

## 🆘 Suporte

### Problemas Comuns
1. **Erro de conexão**: Verificar internet
2. **Dados não carregam**: Recarregar página
3. **Erro ao salvar**: Tentar novamente

### Contato
- Sistema: Automático via logs
- Usuário: Interface amigável
- Desenvolvedor: Logs detalhados

---

**Sistema Família Jamar** - Versão com Persistência de Dados
*Atualizado em: Janeiro 2024* 