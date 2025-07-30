# 🔐 **CONFIGURAR SENHA NO VERCEL - PASSO A PASSO**

## ✅ **Sua senha de aplicativo:** `mekz ihei gvuz fkgb`

## 🌐 **CONFIGURAR NO VERCEL:**

### **1. Acessar Vercel Dashboard:**
1. **Vá para:** https://vercel.com/dashboard
2. **Faça login** na sua conta
3. **Selecione** seu projeto "Sistema Família Jamar"

### **2. Configurar Variável de Ambiente:**
1. **Clique** em "Settings" (no menu lateral)
2. **Vá em** "Environment Variables"
3. **Clique** em "Add New"

### **3. Adicionar a Variável:**
- **Name:** `EMAIL_PASSWORD`
- **Value:** `mekz ihei gvuz fkgb`
- **Environment:** Production
- **Clique** em "Save"

### **4. Aguardar Redeploy:**
- **Aguarde** 1-2 minutos para o redeploy automático
- **Você verá** uma mensagem de "Redeploying..."

## 🧪 **TESTAR APÓS CONFIGURAÇÃO:**

### **1. Acessar o Sistema:**
- **Vá para** seu site no Vercel
- **Clique** em "Configurar E-mail"

### **2. Configurar E-mail:**
- **Digite** seu e-mail pessoal
- **Clique** em "Salvar"
- **Aguarde** a confirmação

### **3. Verificar:**
- **Verifique** sua caixa de entrada
- **Procure** por e-mail de confirmação
- **Verifique** logs no Vercel Dashboard

## 📊 **VERIFICAR LOGS NO VERCEL:**

### **Para ver os logs:**
1. **Vercel Dashboard** > seu projeto
2. **Vá em** "Functions" > "server-web.js"
3. **Veja** os logs em tempo real
4. **Procure** por mensagens de sucesso

## 🎯 **LOGS ESPERADOS:**

### **Se funcionar, você verá:**
```
📧 Tentando enviar e-mail para: seu@email.com
🔧 Configuração de e-mail: { pass: '***CONFIGURADA***' }
🔍 Verificando conexão com Gmail...
✅ Conexão com Gmail verificada com sucesso
📤 Enviando e-mail...
✅ E-mail enviado com sucesso para: seu@email.com
📧 Message ID: [ID_DO_EMAIL]
```

### **Se não funcionar, você verá:**
```
❌ Senha de e-mail não configurada no Vercel
💡 Configure a variável EMAIL_PASSWORD no Vercel Dashboard
```

## 🎊 **RESULTADO ESPERADO:**

Após configurar corretamente:
- ✅ **E-mail de confirmação** recebido
- ✅ **Logs de sucesso** no Vercel
- ✅ **Sistema de notificações** funcionando

---

**🚀 Sistema Família Jamar - E-mail configurado com sucesso!** 