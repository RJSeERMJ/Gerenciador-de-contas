# 📱 **WHATSAPP - Configuração Rápida**

## ⚡ **CONFIGURAÇÃO EM 5 MINUTOS**

### **1. 📞 WhatsApp Business (2 min)**
1. **Baixe** WhatsApp Business no celular
2. **Crie** conta com seu número
3. **Verifique** o número por SMS
4. **Configure** perfil da empresa

### **2. 🔑 Token de Acesso (3 min)**
1. **Acesse:** https://developers.facebook.com/
2. **Clique:** "Criar App"
3. **Selecione:** "Business"
4. **Nome:** "Família Jamar"
5. **Adicione:** "WhatsApp" nos produtos
6. **Configure:** Número de telefone
7. **Copie:** Token de acesso

### **3. ⚙️ Configurar Sistema (1 min)**
```bash
# Execute o script de configuração
configurar-whatsapp.bat
```

**Ou configure manualmente:**
```env
# Arquivo .env
WHATSAPP_TOKEN=seu_token_aqui
WHATSAPP_PHONE_ID=seu_phone_id_aqui
SEU_TELEFONE=5511999999999
```

### **4. 🧪 Testar (1 min)**
```bash
# Iniciar servidor
node server.js

# Abrir navegador
http://localhost:3000

# Clicar em "Testar Notificação"
```

---

## 🎯 **PASSO A PASSO DETALHADO**

### **PASSO 1: WhatsApp Business**

#### **Opção A: App do Celular (Mais Fácil)**
1. **Google Play/App Store:** "WhatsApp Business"
2. **Instalar** e abrir
3. **Criar conta** com seu número
4. **Verificar** por SMS
5. **Configurar** perfil da empresa

#### **Opção B: API Profissional**
1. **Acesse:** https://business.whatsapp.com/
2. **Criar conta** Business
3. **Verificar** número de telefone
4. **Configurar** perfil da empresa

### **PASSO 2: Facebook Developers**

1. **Acesse:** https://developers.facebook.com/
2. **Faça login** com Facebook
3. **Clique:** "Criar App"
4. **Selecione:** "Business"
5. **Nome:** "Família Jamar - Notificações"
6. **Clique:** "Criar App"

### **PASSO 3: Configurar WhatsApp**

1. **No painel do app:**
   - Vá em "Produtos"
   - Clique em "WhatsApp"
   - Clique em "Configurar"

2. **Configurar número:**
   - Clique em "Adicionar número de telefone"
   - Digite seu número
   - Verifique por SMS
   - Copie o "Phone Number ID"

3. **Obter token:**
   - Vá em "Configurações" > "Básico"
   - Copie "App ID" e "App Secret"
   - Vá em "Ferramentas" > "Graph API Explorer"
   - Gere um token de acesso

### **PASSO 4: Configurar Sistema**

#### **Método Automático:**
```bash
# Execute o script
configurar-whatsapp.bat
```

#### **Método Manual:**
1. **Copie** o arquivo de exemplo:
   ```bash
   copy env.example .env
   ```

2. **Edite** o arquivo `.env`:
   ```env
   WHATSAPP_TOKEN=seu_token_aqui
   WHATSAPP_PHONE_ID=seu_phone_id_aqui
   SEU_TELEFONE=5511999999999
   ```

### **PASSO 5: Testar**

1. **Iniciar servidor:**
   ```bash
   node server.js
   ```

2. **Abrir navegador:**
   ```
   http://localhost:3000
   ```

3. **Testar notificação:**
   - Clique em "Testar Notificação"
   - Verifique se recebeu no WhatsApp

---

## 🛠️ **SOLUÇÃO DE PROBLEMAS**

### **❌ "Token inválido"**
- **Verifique** se o token está correto
- **Confirme** se o app está ativo
- **Teste** no Graph API Explorer

### **❌ "Número não verificado"**
- **Verifique** se o número está ativo
- **Confirme** verificação no WhatsApp Business
- **Aguarde** 24h após verificação

### **❌ "Limite de mensagens"**
- **Gratuito:** 1.000 mensagens/mês
- **Pago:** Mais mensagens disponíveis
- **Verifique** uso no painel do Facebook

### **❌ "Notificações não chegam"**
- **Verifique** se o número está correto
- **Confirme** se o WhatsApp está ativo
- **Teste** com número diferente

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

## ⏰ **HORÁRIOS DAS NOTIFICAÇÕES**

### **Horários Padrão:**
- **9h:** Contas vencendo em 3 dias
- **10h:** Contas vencidas
- **18h:** Contas vencendo em 1 dia

### **Personalizar:**
Edite `services/cronService.js`:
```javascript
// Exemplo: notificar às 8h e 20h
cron.schedule('0 8,20 * * *', async () => {
    // código aqui
});
```

---

## 🎊 **RESULTADO FINAL**

**Com WhatsApp configurado, você terá:**
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