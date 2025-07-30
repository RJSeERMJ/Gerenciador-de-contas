# 📧 **CONFIGURAR E-MAIL NO VERCEL**

## ❌ **Problema Atual:**
O e-mail não está funcionando porque a senha do Gmail não está configurada no Vercel.

## ✅ **Solução:**

### **1. 🌐 Configurar Senha no Vercel:**

#### **Acessar Vercel Dashboard:**
1. **Vá para:** https://vercel.com/dashboard
2. **Selecione** seu projeto
3. **Vá em** "Settings" > "Environment Variables"
4. **Adicione** a variável:
   - **Name:** `EMAIL_PASSWORD`
   - **Value:** `sua_senha_de_aplicativo_do_gmail`
   - **Environment:** Production

### **2. 🔐 Criar Senha de Aplicativo no Gmail:**

#### **Passo a Passo:**
1. **Acesse:** https://myaccount.google.com/
2. **Vá em** "Segurança"
3. **Ative** "Verificação em duas etapas" (se não estiver ativa)
4. **Vá em** "Senhas de app"
5. **Selecione** "Outro (nome personalizado)"
6. **Digite:** "Sistema Família Jamar"
7. **Clique** em "Gerar"
8. **Copie** a senha gerada (16 caracteres)

### **3. ⚙️ Configurar no Vercel:**

#### **No Vercel Dashboard:**
1. **Cole** a senha gerada no campo "Value"
2. **Clique** em "Save"
3. **Aguarde** o redeploy automático

### **4. 🧪 Testar:**

#### **Após o redeploy:**
1. **Acesse** seu sistema online
2. **Clique** em "Configurar E-mail"
3. **Digite** seu e-mail
4. **Salve** a configuração
5. **Verifique** sua caixa de entrada

## 🎯 **E-mails Configurados:**

### **E-mail que ENVIA:** `jamarestudo@gmail.com`
### **E-mail que RECEBE:** O que você configurar na interface

## 📋 **Tipos de Notificações:**

- ✅ **Confirmação de configuração**
- ✅ **Alertas de contas vencendo**
- ✅ **Lembretes de pagamento**
- ✅ **Resumos mensais**

## 🔧 **Se ainda não funcionar:**

### **Verificar logs no Vercel:**
1. **Vercel Dashboard** > "Functions" > "server-web.js"
2. **Veja** os logs de erro
3. **Verifique** se a senha está correta

### **Testar localmente:**
1. **Crie** arquivo `.env` na raiz
2. **Adicione:** `EMAIL_PASSWORD=sua_senha_aqui`
3. **Execute:** `npm start`
4. **Teste** a configuração

## 🎊 **Resultado:**
Após configurar, você receberá e-mails automáticos do sistema Família Jamar!

---

**🚀 Sistema Família Jamar - Notificações por e-mail funcionando!** 