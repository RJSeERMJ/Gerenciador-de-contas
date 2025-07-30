# 🔧 **SOLUÇÃO DE PROBLEMAS - E-MAIL**

## ❌ **Problema:** E-mail não está funcionando

## 🔍 **DIAGNÓSTICO PASSO A PASSO:**

### **1. 📧 Verificar se a senha está configurada no Vercel:**

#### **Acessar Vercel Dashboard:**
1. **Vá para:** https://vercel.com/dashboard
2. **Selecione** seu projeto
3. **Vá em** "Settings" > "Environment Variables"
4. **Verifique** se existe a variável `EMAIL_PASSWORD`

#### **Se NÃO existir:**
- **Clique** em "Add New"
- **Name:** `EMAIL_PASSWORD`
- **Value:** `sua_senha_de_aplicativo_do_gmail`
- **Environment:** Production
- **Clique** em "Save"

### **2. 🔐 Criar Senha de Aplicativo no Gmail:**

#### **IMPORTANTE:** Use senha de aplicativo, NÃO a senha normal!

#### **Passo a Passo:**
1. **Acesse:** https://myaccount.google.com/
2. **Vá em** "Segurança"
3. **Ative** "Verificação em duas etapas" (obrigatório)
4. **Vá em** "Senhas de app"
5. **Selecione** "Outro (nome personalizado)"
6. **Digite:** "Sistema Família Jamar"
7. **Clique** em "Gerar"
8. **Copie** a senha gerada (16 caracteres)

### **3. ⚙️ Configurar no Vercel:**

#### **No Vercel Dashboard:**
1. **Cole** a senha gerada no campo "Value"
2. **Clique** em "Save"
3. **Aguarde** o redeploy automático (1-2 minutos)

### **4. 🧪 Testar:**

#### **Após o redeploy:**
1. **Acesse** seu sistema online
2. **Clique** em "Configurar E-mail"
3. **Digite** seu e-mail
4. **Salve** a configuração
5. **Verifique** sua caixa de entrada

## 🔧 **SE AINDA NÃO FUNCIONAR:**

### **Verificar Logs no Vercel:**
1. **Vercel Dashboard** > seu projeto
2. **Vá em** "Functions" > "server-web.js"
3. **Veja** os logs de erro
4. **Procure** por mensagens de erro específicas

### **Erros Comuns e Soluções:**

#### **❌ "Senha de e-mail não configurada"**
- **Solução:** Configure a variável `EMAIL_PASSWORD` no Vercel

#### **❌ "Erro de autenticação"**
- **Solução:** Use senha de aplicativo, não senha normal

#### **❌ "Erro de conexão"**
- **Solução:** Verifique se o Gmail não está bloqueado

#### **❌ "Timeout"**
- **Solução:** Aguarde e tente novamente

## 🧪 **TESTE LOCAL:**

### **Para testar localmente:**
1. **Crie** arquivo `.env` na raiz do projeto
2. **Adicione:** `EMAIL_PASSWORD=sua_senha_de_aplicativo`
3. **Execute:** `node teste-email.js`
4. **Veja** os logs de teste

## 📧 **CONFIGURAÇÃO ATUAL:**

### **E-mail que ENVIA:** `jamarestudo@gmail.com`
### **E-mail que RECEBE:** Configurável pelo usuário

## 🎯 **CHECKLIST FINAL:**

- ✅ **Verificação em duas etapas** ativada no Gmail
- ✅ **Senha de aplicativo** criada
- ✅ **Variável EMAIL_PASSWORD** configurada no Vercel
- ✅ **Redeploy** realizado
- ✅ **Teste** realizado

## 🎊 **RESULTADO ESPERADO:**

Após seguir todos os passos, você deve:
- ✅ **Receber e-mail de confirmação** ao configurar
- ✅ **Ver logs de sucesso** no Vercel
- ✅ **Receber notificações** automáticas

---

**🚀 Sistema Família Jamar - E-mail funcionando perfeitamente!** 