# 🔐 **OUTLOOK - Problema de Autenticação**

## ❌ **Erro: "Authentication unsuccessful, basic authentication is disabled"**

### **🔍 Causa do Problema:**
O Microsoft Outlook desabilitou a autenticação básica por segurança. Para resolver, você precisa:

1. **Habilitar autenticação de aplicativo**
2. **Usar senha de aplicativo**
3. **Configurar autenticação OAuth2**

---

## 🛠️ **SOLUÇÃO 1: Senha de Aplicativo (Recomendado)**

### **Passo 1: Acessar configurações de segurança**
1. **Acesse:** https://account.live.com/proofs/
2. **Faça login** com sua conta Microsoft
3. **Vá em:** "Segurança" → "Opções de segurança avançadas"

### **Passo 2: Habilitar verificação em 2 etapas**
1. **Clique** em "Verificação em duas etapas"
2. **Ative** a verificação em duas etapas
3. **Configure** com seu telefone

### **Passo 3: Criar senha de aplicativo**
1. **Vá em:** "Senhas de aplicativo"
2. **Clique** em "Criar uma nova senha de aplicativo"
3. **Digite:** "Família Jamar"
4. **Copie** a senha gerada (16 caracteres)

### **Passo 4: Atualizar configuração**
```env
EMAIL_PASS=sua_senha_de_aplicativo_aqui
```

---

## 🛠️ **SOLUÇÃO 2: Gmail (Alternativa)**

### **Configuração Gmail:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app_gmail
EMAIL_FROM=seu_email@gmail.com
EMAIL_TO=jamar.rodrigo@outlook.com
```

### **Como criar senha de app no Gmail:**
1. **Acesse:** https://myaccount.google.com/security
2. **Ative** verificação em 2 etapas
3. **Vá em:** "Senhas de app"
4. **Crie** senha para "Família Jamar"

---

## 🛠️ **SOLUÇÃO 3: Outlook com OAuth2**

### **Configuração avançada:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=jamar.rodrigo@outlook.com
EMAIL_PASS=sua_senha_de_aplicativo
EMAIL_FROM=jamar.rodrigo@outlook.com
EMAIL_TO=jamar.rodrigo@outlook.com
```

---

## 🧪 **TESTE RÁPIDO**

### **1. Testar com senha de aplicativo:**
```bash
# Atualizar .env com senha de aplicativo
# Executar teste
node teste-email.js
```

### **2. Verificar resultado:**
- ✅ **Sucesso:** "E-mail enviado com sucesso!"
- ❌ **Erro:** Verificar configurações

---

## 📋 **CHECKLIST DE VERIFICAÇÃO**

### **✅ Conta Microsoft:**
- [ ] Verificação em 2 etapas ativada
- [ ] Senha de aplicativo criada
- [ ] Conta não está bloqueada
- [ ] Sem restrições de segurança

### **✅ Configuração:**
- [ ] EMAIL_PASS = senha de aplicativo
- [ ] EMAIL_HOST = smtp-mail.outlook.com
- [ ] EMAIL_PORT = 587
- [ ] EMAIL_SECURE = false

### **✅ Teste:**
- [ ] Servidor inicia sem erro
- [ ] E-mail de teste é enviado
- [ ] E-mail chega na caixa de entrada
- [ ] Não vai para spam

---

## 🎯 **SOLUÇÃO RÁPIDA**

### **Opção 1: Usar Gmail (Mais fácil)**
1. **Crie** conta Gmail
2. **Ative** verificação em 2 etapas
3. **Crie** senha de aplicativo
4. **Configure** .env com Gmail

### **Opção 2: Corrigir Outlook**
1. **Acesse** configurações de segurança
2. **Ative** verificação em 2 etapas
3. **Crie** senha de aplicativo
4. **Atualize** .env

### **Opção 3: Usar servidor local (Desenvolvimento)**
```env
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_SECURE=false
EMAIL_USER=teste
EMAIL_PASS=teste
```

---

## 🎊 **RESULTADO ESPERADO**

**Quando funcionar:**
```
✅ Serviço de e-mail configurado com sucesso
📤 Enviando e-mail de teste...
✅ E-mail enviado com sucesso!
📬 Verifique sua caixa de entrada: jamar.rodrigo@outlook.com
```

---

## 🆘 **AINDA COM PROBLEMAS?**

### **1. Verificar logs detalhados:**
```bash
node teste-email.js
```

### **2. Testar conectividade:**
```bash
ping smtp-mail.outlook.com
```

### **3. Verificar firewall:**
- **Desabilitar** temporariamente
- **Testar** novamente

### **4. Usar Gmail como alternativa:**
- **Mais fácil** de configurar
- **Menos restrições**
- **Funciona** imediatamente

---

**🎉 Recomendação: Use Gmail para começar rapidamente!** 