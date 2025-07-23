# 💰 Gerenciador de Contas com Notificações

Um sistema completo para gerenciar suas contas do mês com notificações automáticas por SMS e WhatsApp.

## ✨ Funcionalidades

- 📱 **Interface Web Moderna**: Design responsivo e intuitivo
- 💳 **Gestão de Contas**: Adicionar, editar, deletar e marcar contas como pagas
- 📊 **Dashboard**: Visão geral com estatísticas em tempo real
- 🔔 **Notificações Automáticas**: SMS e WhatsApp para contas vencendo/vencidas
- ⏰ **Agendamento Inteligente**: Verificações automáticas diárias
- 📈 **Filtros e Busca**: Encontre suas contas facilmente
- 📤 **Exportação**: Exporte suas contas em CSV
- 🏷️ **Categorização**: Organize por categorias (Moradia, Alimentação, etc.)

## 🚀 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no Twilio (para SMS)
- Conta no WhatsApp Business API (para WhatsApp)

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd gerenciador-contas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas credenciais:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Servidor
PORT=3000

# Configurações do Twilio (SMS)
TWILIO_ACCOUNT_SID=seu_account_sid_aqui
TWILIO_AUTH_TOKEN=seu_auth_token_aqui
TWILIO_PHONE_NUMBER=+1234567890

# Configurações do WhatsApp Business API
WHATSAPP_TOKEN=seu_token_whatsapp_aqui
WHATSAPP_PHONE_ID=seu_phone_id_aqui
WHATSAPP_BUSINESS_ACCOUNT_ID=seu_business_account_id_aqui

# Número de telefone para receber notificações
SEU_TELEFONE=+5511999999999

# Configurações do Banco de Dados
DB_PATH=./database/contas.db
```

## 🔧 Configuração dos Serviços

### Twilio (SMS)

1. Crie uma conta em [twilio.com](https://www.twilio.com)
2. Obtenha seu Account SID e Auth Token no painel
3. Compre um número de telefone para enviar SMS
4. Configure as variáveis no `.env`

### WhatsApp Business API

1. Crie uma conta no [Facebook Developers](https://developers.facebook.com)
2. Configure o WhatsApp Business API
3. Obtenha o token de acesso e Phone ID
4. Configure as variáveis no `.env`

## 🏃‍♂️ Como Executar

### Modo Desenvolvimento

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

Acesse: `http://localhost:3000`

## 📱 Como Usar

### 1. Adicionar Contas

- Clique em "Nova Conta"
- Preencha: descrição, valor, data de vencimento, categoria
- Marque como "Recorrente" se for uma conta mensal
- Clique em "Salvar"

### 2. Gerenciar Contas

- **Marcar como Paga**: Clique no botão verde
- **Editar**: Clique no botão azul
- **Deletar**: Clique no botão vermelho

### 3. Filtrar e Buscar

- Use os filtros por status (Pendentes, Vencidas, Pagas)
- Filtre por categoria
- Use a busca por texto

### 4. Testar Notificações

- Clique em "Testar Notificação"
- Escolha entre SMS ou WhatsApp
- Verifique se recebeu a mensagem

## ⏰ Agendamento Automático

O sistema verifica automaticamente:

- **9h e 18h**: Contas vencendo nos próximos 7 dias
- **10h**: Contas vencidas

As notificações são enviadas por SMS e WhatsApp.

## 📁 Estrutura do Projeto

```
gerenciador-contas/
├── server.js                 # Servidor principal
├── package.json             # Dependências
├── env.example              # Exemplo de configuração
├── README.md               # Este arquivo
├── database/
│   └── database.js         # Gerenciamento do banco SQLite
├── services/
│   ├── notificationService.js  # Serviço de notificações
│   └── cronService.js      # Agendamento de tarefas
└── public/
    ├── index.html          # Interface principal
    ├── styles.css          # Estilos CSS
    └── script.js           # JavaScript da interface
```

## 🔒 Segurança

- Nunca compartilhe suas credenciais do Twilio ou WhatsApp
- Mantenha o arquivo `.env` seguro e não o commite no Git
- Use HTTPS em produção

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Banco de Dados**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Notificações**: Twilio (SMS), WhatsApp Business API
- **Agendamento**: node-cron
- **Design**: CSS Grid, Flexbox, Gradientes

## 📊 Banco de Dados

O sistema usa SQLite com a seguinte estrutura:

```sql
CREATE TABLE contas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    valor REAL NOT NULL,
    dataVencimento TEXT NOT NULL,
    categoria TEXT,
    paga BOOLEAN DEFAULT 0,
    recorrente BOOLEAN DEFAULT 0,
    dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP,
    dataPagamento TEXT
);
```

## 🚨 Solução de Problemas

### Erro de Conexão com Twilio
- Verifique se as credenciais estão corretas
- Confirme se o número de telefone está ativo
- Verifique se há créditos na conta

### Erro de Conexão com WhatsApp
- Confirme se o token está válido
- Verifique se o Phone ID está correto
- Teste a conexão com a API

### Banco de Dados não Inicializa
- Verifique as permissões da pasta `database/`
- Confirme se o SQLite está instalado
- Tente deletar o arquivo `contas.db` e reiniciar

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a seção de solução de problemas
2. Abra uma issue no GitHub
3. Entre em contato através do email

---

**Desenvolvido com ❤️ para ajudar você a gerenciar suas finanças!** 