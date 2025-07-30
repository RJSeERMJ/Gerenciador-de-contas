# 📊 **VERIFICAR LOGS NO VERCEL - ERRO 500**

## ❌ **Problema:** Erro 500 na rota `/api/configurar-email`

## 🔍 **COMO VERIFICAR LOGS DETALHADOS:**

### **1. Acessar Vercel Dashboard:**
1. **Vá para:** https://vercel.com/dashboard
2. **Selecione** seu projeto
3. **Vá em** "Functions" (menu lateral)

### **2. Verificar Logs da Função:**
1. **Procure** por `server-web.js`
2. **Clique** na função
3. **Veja** os logs em tempo real
4. **Procure** por erros específicos

### **3. Logs Esperados (se funcionar):**
```
📧 Tentando enviar e-mail para: email@exemplo.com
🔧 Configuração de e-mail: { pass: '***CONFIGURADA***' }
🔍 Verificando conexão com Gmail...
✅ Conexão com Gmail verificada com sucesso
📤 Enviando e-mail...
✅ E-mail enviado com sucesso
```

### **4. Logs de Erro (problema atual):**
```
❌ Senha de e-mail não configurada no Vercel
💡 Configure a variável EMAIL_PASSWORD no Vercel Dashboard
```

## 🔧 **POSSÍVEIS CAUSAS DO ERRO 500:**

### **1. ❌ Variável EMAIL_PASSWORD não configurada**
- **Solução:** Configure no Vercel Dashboard

### **2. ❌ Erro de sintaxe no código**
- **Solução:** Verificar logs de build

### **3. ❌ Dependência faltando**
- **Solução:** Verificar package.json

### **4. ❌ Timeout da função**
- **Solução:** Otimizar código

## 🧪 **TESTE RÁPIDO:**

### **Para testar se a variável está configurada:**
1. **Vercel Dashboard** > seu projeto
2. **Settings** > Environment Variables
3. **Verifique** se `EMAIL_PASSWORD` existe
4. **Verifique** se o valor está correto

## 📋 **CHECKLIST DE VERIFICAÇÃO:**

- ✅ **Variável EMAIL_PASSWORD** configurada no Vercel
- ✅ **Valor correto:** `mekz ihei gvuz fkgb`
- ✅ **Environment:** Production
- ✅ **Redeploy** realizado após configuração
- ✅ **Logs** verificados no Vercel

---

**🔍 Verifique os logs e me informe o que aparece!** 