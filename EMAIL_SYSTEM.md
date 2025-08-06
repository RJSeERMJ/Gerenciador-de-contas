# 📧 Sistema de E-mails Automáticos - Família Jamar

## 🚀 Como Funciona

O sistema de e-mails automáticos do Sistema Família Jamar envia notificações sobre suas contas automaticamente. Ele verifica suas contas periodicamente e envia alertas quando necessário.

## ⚙️ Configuração

### 1. Configurar E-mail de Destino
```javascript
// POST /api/configurar-email
{
    "email": "seu-email@gmail.com"
}
```

### 2. Verificar Status
```javascript
// GET /api/email-status
// Retorna informações sobre o e-mail configurado
```

## 📨 Tipos de E-mails Automáticos

### 1. **Contas Vencendo** ⚠️
- **Quando:** Contas que vencem nos próximos 3 dias
- **Frequência:** Uma vez por dia
- **Conteúdo:** Lista das contas, valores e datas de vencimento

### 2. **Contas Vencidas** 🚨
- **Quando:** Contas que já passaram da data de vencimento
- **Frequência:** Uma vez por dia
- **Conteúdo:** Lista das contas em atraso

### 3. **Relatório Completo** 📊
- **Quando:** Após configurar o e-mail pela primeira vez
- **Conteúdo:** Resumo completo de todas as contas

## 🛠️ APIs Disponíveis

### Testar E-mail
```javascript
// POST /api/testar-email
{
    "email": "destinatario@email.com"
}
```

### E-mail Personalizado
```javascript
// POST /api/enviar-email-personalizado
{
    "email": "destinatario@email.com",
    "assunto": "Assunto do e-mail",
    "mensagem": "Conteúdo da mensagem"
}
```

### E-mail para Múltiplos Destinatários
```javascript
// POST /api/enviar-email-multiplos
{
    "emails": ["email1@teste.com", "email2@teste.com"],
    "assunto": "Assunto do e-mail",
    "mensagem": "Conteúdo da mensagem"
}
```

### Verificar Notificações Manualmente
```javascript
// POST /api/verificar-notificacoes
// GET /api/verificar-notificacoes
```

## 🔧 Configuração Técnica

### Variáveis de Ambiente
```bash
EMAIL_PASSWORD=sua_senha_de_app_gmail
```

### Configuração SMTP (Gmail)
```javascript
{
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'jamarestudo@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
}
```

## 📱 Templates HTML

O sistema usa templates HTML responsivos com:
- **Cabeçalho:** Gradiente azul com logo
- **Corpo:** Conteúdo principal com cores temáticas
- **Rodapé:** Informações do sistema e data/hora
- **Botões:** Call-to-action estilizados

### Cores Temáticas
- **⚠️ Contas Vencendo:** Laranja (#ff6b35)
- **🚨 Contas Vencidas:** Vermelho (#dc3545)
- **🧪 Teste:** Cinza (#6c757d)
- **📧 Geral:** Azul (#007bff)

## ⏰ Agendamento

### Modo Local (Desenvolvimento)
- Verificação automática a cada 6 horas
- Notificações de teste a cada 5 minutos

### Modo Produção (Vercel)
- Usar cron jobs ou UptimeRobot
- Endpoint: `/api/verificar-notificacoes`

## 🔍 Monitoramento

### Logs do Sistema
```javascript
console.log('📧 Tentando enviar e-mail para:', destinatario);
console.log('✅ E-mail enviado com sucesso');
console.log('❌ Erro ao enviar e-mail:', error.message);
```

### Status da Conexão
```javascript
// GET /api/db-status
// Verifica status do banco e e-mail configurado
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **E-mail não chega**
   - Verificar spam/lixo eletrônico
   - Confirmar senha de app do Gmail
   - Testar com `/api/testar-email`

2. **Erro de autenticação**
   - Verificar `EMAIL_PASSWORD` no ambiente
   - Usar senha de app, não senha normal

3. **Notificações não automáticas**
   - Verificar se e-mail está configurado
   - Usar `/api/verificar-notificacoes` manualmente

### Comandos de Teste

```bash
# Testar envio de e-mail
curl -X POST http://localhost:3000/api/testar-email \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@email.com"}'

# Verificar status
curl http://localhost:3000/api/email-status

# Verificar notificações
curl http://localhost:3000/api/verificar-notificacoes
```

## 📈 Melhorias Futuras

- [ ] Suporte a múltiplos provedores de e-mail
- [ ] Templates personalizáveis
- [ ] Agendamento de e-mails
- [ ] Relatórios em PDF
- [ ] Integração com WhatsApp/SMS
- [ ] Dashboard de e-mails enviados

---

**📱 Sistema Família Jamar** - Controle suas contas com notificações automáticas! 