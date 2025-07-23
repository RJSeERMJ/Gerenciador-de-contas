# 📧 **E-MAIL - Notificações Automáticas**

## 🎯 **Como Configurar Notificações por E-mail**

### **📋 Vantagens do E-mail:**
- ✅ **Mais simples** de configurar
- ✅ **Gratuito** (sem limites)
- ✅ **Confiável** e rápido
- ✅ **Design profissional** com HTML
- ✅ **Funciona em qualquer lugar**

---

## 🚀 **CONFIGURAÇÃO RÁPIDA (5 MINUTOS)**

### **1. 📧 Configurar Gmail (2 min)**
1. **Acesse:** https://myaccount.google.com/
2. **Vá em:** "Segurança"
3. **Ative:** "Verificação em 2 etapas"
4. **Vá em:** "Senhas de app"
5. **Gere:** Senha para "Família Jamar"

### **2. ⚙️ Configurar Sistema (2 min)**
```bash
# Execute o script de configuração
configurar-email.bat
```

**Ou configure manualmente:**
```env
# Arquivo .env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
EMAIL_FROM=seu_email@gmail.com
EMAIL_TO=seu_email@gmail.com
```

### **3. 🧪 Testar (1 min)**
```bash
# Iniciar servidor
node server.js

# Abrir navegador
http://localhost:3000

# Clicar em "Testar E-mail"
```

---

## 🎯 **PASSO A PASSO DETALHADO**

### **PASSO 1: Configurar Gmail**

#### **1.1 Ativar Verificação em 2 Etapas**
1. **Acesse:** https://myaccount.google.com/
2. **Clique:** "Segurança"
3. **Procure:** "Verificação em 2 etapas"
4. **Clique:** "Ativar"
5. **Siga** as instruções

#### **1.2 Gerar Senha de App**
1. **Ainda em Segurança**
2. **Procure:** "Senhas de app"
3. **Clique:** "Criar"
4. **Selecione:** "Outro (nome personalizado)"
5. **Digite:** "Família Jamar"
6. **Copie** a senha gerada

### **PASSO 2: Configurar Sistema**

#### **Método Automático:**
```bash
# Execute o script
configurar-email.bat
```

#### **Método Manual:**
1. **Copie** o arquivo de exemplo:
   ```bash
   copy env-email-exemplo.txt .env
   ```

2. **Edite** o arquivo `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=seu_email@gmail.com
   EMAIL_PASS=sua_senha_de_app
   EMAIL_FROM=seu_email@gmail.com
   EMAIL_TO=seu_email@gmail.com
   ```

### **PASSO 3: Testar**

1. **Iniciar servidor:**
   ```bash
   node server.js
   ```

2. **Abrir navegador:**
   ```
   http://localhost:3000
   ```

3. **Testar e-mail:**
   - Clique em "Testar E-mail"
   - Verifique sua caixa de entrada

---

## 📧 **OUTROS PROVEDORES DE E-MAIL**

### **Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### **Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### **Provedores Corporativos:**
- **Consulte** a documentação do seu provedor
- **Configure** host, porta e segurança adequados

---

## 🛠️ **SOLUÇÃO DE PROBLEMAS**

### **❌ "Autenticação falhou"**
- **Verifique** se a senha está correta
- **Confirme** se é uma senha de app (Gmail)
- **Teste** com senha normal primeiro

### **❌ "Servidor não encontrado"**
- **Verifique** o EMAIL_HOST
- **Confirme** se o provedor está correto
- **Teste** conectividade de internet

### **❌ "Porta bloqueada"**
- **Verifique** se a porta está correta
- **Teste** com porta 587 ou 465
- **Confirme** configurações de firewall

### **❌ "E-mail não chega"**
- **Verifique** pasta de spam
- **Confirme** EMAIL_TO está correto
- **Teste** com e-mail diferente

---

## 📱 **EXEMPLOS DE E-MAILS**

### **Conta Vencendo:**
```
🏠 Família Jamar - Contas Vencendo (2 contas)

⚠️ Contas Vencendo
Você tem 2 contas vencendo em breve:

┌─────────────────┬──────────┬─────────────┬─────┐
│ Conta           │ Valor    │ Vencimento  │ Dias│
├─────────────────┼──────────┼─────────────┼─────┤
│ Energia Elétrica│ R$ 150,00│ 15/12/2024  │ 3   │
│ Água            │ R$ 80,00 │ 16/12/2024  │ 4   │
└─────────────────┴──────────┴─────────────┴─────┘

💡 Dica: Não esqueça de pagar essas contas!
```

### **Conta Vencida:**
```
🚨 Família Jamar - CONTAS VENCIDAS (1 conta)

🚨 CONTAS VENCIDAS
Você tem 1 conta vencida:

┌─────────┬──────────┬─────────────┬─────────┐
│ Conta   │ Valor    │ Vencimento  │ Dias    │
├─────────┼──────────┼─────────────┼─────────┤
│ Água    │ R$ 80,00 │ 10/12/2024  │ 2 atrás │
└─────────┴──────────┴─────────────┴─────────┘

⚠️ URGENTE: Pague essas contas imediatamente!
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

**Com e-mail configurado, você terá:**
- 📧 **Notificações automáticas** por e-mail
- ⏰ **Lembretes** nos horários configurados
- 🚨 **Alertas** para contas vencidas
- 💰 **Controle total** das finanças
- 🏠 **Sistema personalizado** para Família Jamar
- 🎨 **E-mails bonitos** com design profissional

---

## 🎯 **CONFIGURAÇÃO RÁPIDA**

### **1. Configuração Mínima:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
EMAIL_FROM=seu_email@gmail.com
EMAIL_TO=seu_email@gmail.com
```

### **2. Testar:**
```bash
node server.js
```

### **3. Verificar:**
- Abra: `http://localhost:3000`
- Clique: "Testar E-mail"
- Verifique: Caixa de entrada

---

**🎉 Pronto! Agora você tem notificações automáticas por e-mail!**

**Para ativar:**
1. Configure o arquivo `.env`
2. Inicie o servidor: `node server.js`
3. Teste as notificações
4. Use normalmente! 