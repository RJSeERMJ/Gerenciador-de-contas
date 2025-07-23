# 📱 **WHATSAPP - Notificações Automáticas**

## 🎯 **Como Configurar Notificações do WhatsApp**

### **📋 Pré-requisitos:**
1. **Conta WhatsApp Business** (gratuita)
2. **Número de telefone** verificado
3. **Token de acesso** do WhatsApp Business API

---

## 🚀 **PASSO A PASSO COMPLETO**

### **1. 📞 Criar Conta WhatsApp Business**

#### **Opção A: WhatsApp Business App (Mais Fácil)**
1. **Baixe** o WhatsApp Business no celular
2. **Crie** uma conta com seu número
3. **Verifique** o número por SMS
4. **Configure** o perfil da empresa

#### **Opção B: WhatsApp Business API (Profissional)**
1. **Acesse:** https://business.whatsapp.com/
2. **Crie** uma conta Business
3. **Verifique** o número de telefone
4. **Configure** o perfil da empresa

### **2. 🔑 Obter Token de Acesso**

#### **Para WhatsApp Business API:**
1. **Acesse:** https://developers.facebook.com/
2. **Crie** uma conta de desenvolvedor
3. **Crie** um app do Facebook
4. **Configure** o WhatsApp Business API
5. **Obtenha** o token de acesso

#### **Para WhatsApp Business App:**
1. **Use** o número verificado
2. **Configure** o webhook (opcional)

### **3. ⚙️ Configurar o Sistema**

#### **A. Criar arquivo .env**
```bash
# Copie o arquivo env.example
copy env.example .env
```

#### **B. Editar o arquivo .env**
```env
# Configurações do Servidor
PORT=3000
DB_PATH=./database/contas.db

# Configurações do WhatsApp
WHATSAPP_TOKEN=seu_token_aqui
WHATSAPP_PHONE_ID=seu_phone_id_aqui
WHATSAPP_BUSINESS_ACCOUNT_ID=seu_business_account_id

# Seu número de telefone (para receber notificações)
SEU_TELEFONE=5511999999999

# Configurações do Twilio (opcional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### **4. 🔧 Configuração Detalhada**

#### **A. WhatsApp Business API (Recomendado)**

**1. Criar App no Facebook:**
- Acesse: https://developers.facebook.com/
- Clique em "Criar App"
- Selecione "Business"
- Nome: "Família Jamar - Notificações"

**2. Configurar WhatsApp:**
- No painel do app, vá em "Produtos"
- Adicione "WhatsApp"
- Configure o número de telefone
- Obtenha o Phone Number ID

**3. Obter Token:**
- Vá em "Configurações" > "Básico"
- Copie o "App ID" e "App Secret"
- Gere um token de acesso

#### **B. Configuração Simplificada**

**1. Usar WhatsApp Business App:**
```env
# Configuração básica
WHATSAPP_TOKEN=seu_token
WHATSAPP_PHONE_ID=seu_phone_id
SEU_TELEFONE=5511999999999
```

**2. Testar configuração:**
```bash
# Iniciar servidor com notificações
node server.js
```

### **5. 🧪 Testar Notificações**

#### **A. Teste Manual**
1. **Inicie** o servidor: `node server.js`
2. **Abra** o navegador: `http://localhost:3000`
3. **Clique** em "Testar Notificação"
4. **Verifique** se recebeu no WhatsApp

#### **B. Teste Automático**
1. **Adicione** uma conta com vencimento próximo
2. **Aguarde** o horário configurado (9h, 10h, 18h)
3. **Verifique** se recebeu a notificação

### **6. ⏰ Configurar Horários**

#### **Horários Padrão:**
- **9h:** Contas vencendo em 3 dias
- **10h:** Contas vencidas
- **18h:** Contas vencendo em 1 dia

#### **Personalizar Horários:**
Edite o arquivo `services/cronService.js`:
```javascript
// Verificar contas vencendo (9h e 18h)
cron.schedule('0 9,18 * * *', async () => {
    // código aqui
});

// Verificar contas vencidas (10h)
cron.schedule('0 10 * * *', async () => {
    // código aqui
});
```

---

## 🛠️ **SOLUÇÃO DE PROBLEMAS**

### **❌ Erro: Token inválido**
```bash
# Verificar token
curl -X GET "https://graph.facebook.com/v17.0/me" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### **❌ Erro: Número não verificado**
1. **Verifique** se o número está ativo
2. **Confirme** a verificação no WhatsApp Business
3. **Aguarde** 24h após verificação

### **❌ Erro: Limite de mensagens**
- **Gratuito:** 1.000 mensagens/mês
- **Pago:** Mais mensagens disponíveis
- **Verifique** o uso no painel do Facebook

### **❌ Notificações não chegam**
1. **Verifique** se o número está correto
2. **Confirme** se o WhatsApp está ativo
3. **Teste** com número diferente

---

## 📱 **EXEMPLOS DE MENSAGENS**

### **Conta Vencendo:**
```
🏠 Família Jamar - Lembrete

Conta: Energia Elétrica
Valor: R$ 150,00
Vencimento: 15/12/2024
Status: Vence em 3 dias

💡 Não esqueça de pagar!
```

### **Conta Vencida:**
```
🚨 Família Jamar - URGENTE

Conta: Água
Valor: R$ 80,00
Vencimento: 10/12/2024
Status: VENCIDA há 2 dias

⚠️ Pague imediatamente!
```

---

## 🎯 **CONFIGURAÇÃO RÁPIDA**

### **1. Configuração Mínima:**
```env
WHATSAPP_TOKEN=seu_token
WHATSAPP_PHONE_ID=seu_phone_id
SEU_TELEFONE=5511999999999
```

### **2. Testar:**
```bash
node server.js
```

### **3. Verificar:**
- Abra: `http://localhost:3000`
- Clique: "Testar Notificação"
- Verifique WhatsApp

---

## 🎊 **RESULTADO FINAL**

**Com notificações configuradas, você terá:**
- 📱 **Notificações automáticas** no WhatsApp
- ⏰ **Lembretes** nos horários configurados
- 🚨 **Alertas** para contas vencidas
- 💰 **Controle total** das finanças
- 🏠 **Sistema personalizado** para Família Jamar

---

**🎉 Pronto! Agora você tem notificações automáticas no WhatsApp!**

**Para ativar:**
1. Configure o arquivo `.env`
2. Inicie o servidor: `node server.js`
3. Teste as notificações
4. Use normalmente! 