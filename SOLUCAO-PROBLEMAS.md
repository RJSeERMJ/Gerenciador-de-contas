# 🔧 Solução de Problemas - Aplicação Desktop

## 🚨 Problemas Comuns e Soluções

### ❌ **Erro: "username is required" (Twilio)**
**Causa:** Twilio tentando inicializar sem credenciais

**Solução:**
```bash
# Use o teste rápido (sem notificações)
node teste-rapido.js

# Ou configure o arquivo .env
copy env.example .env
# Edite o arquivo .env com suas credenciais
```

### ❌ **Erro: "address already in use :::3000"**
**Causa:** Porta 3000 já está em uso

**Solução:**
```bash
# Matar todos os processos Node.js
taskkill /F /IM node.exe

# Ou matar processo específico na porta 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

### ❌ **Erro: "Cannot find module 'electron-is-dev'"**
**Causa:** Módulo não instalado

**Solução:**
```bash
npm install electron-is-dev --save-dev
```

### ❌ **Erro: "Cannot find module 'node-fetch'"**
**Causa:** Módulo não instalado

**Solução:**
```bash
npm install node-fetch@2 --save-dev
```

### ❌ **Aplicação não abre**
**Causa:** Problemas com Electron ou servidor

**Solução:**
```bash
# 1. Verificar dependências
npm install

# 2. Testar servidor primeiro
node teste-rapido.js

# 3. Testar aplicação desktop
node teste-desktop.js

# 4. Se não funcionar, usar modo simples
npm run desktop
```

## 🛠️ **Modos de Execução**

### **1. Teste Rápido (Recomendado para início)**
```bash
node teste-rapido.js
```
- ✅ Sem dependências de notificação
- ✅ Interface web completa
- ✅ Funciona imediatamente

### **2. Aplicação Desktop Simples**
```bash
node teste-desktop.js
```
- ✅ Inicia servidor automaticamente
- ✅ Abre aplicação Electron
- ✅ Trata erros automaticamente

### **3. Aplicação Desktop Completa**
```bash
npm run desktop
```
- ⚠️ Requer configuração do .env
- ⚠️ Pode dar erro se porta ocupada

### **4. Modo Web Apenas**
```bash
npm start
```
- ⚠️ Requer configuração do .env
- ✅ Interface web completa

## 🔧 **Comandos de Diagnóstico**

### **Verificar Portas**
```bash
# Verificar se porta 3000 está livre
netstat -an | findstr :3000

# Verificar processos Node.js
tasklist | findstr node
```

### **Limpar Cache**
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules
npm install
```

### **Verificar Arquivos**
```bash
# Verificar se arquivos existem
dir electron
dir public
dir database
```

## 📱 **Configuração de Notificações**

### **Para SMS (Twilio):**
1. Crie conta em [twilio.com](https://www.twilio.com)
2. Obtenha Account SID e Auth Token
3. Compre número de telefone
4. Configure no `.env`:
```env
TWILIO_ACCOUNT_SID=seu_sid
TWILIO_AUTH_TOKEN=seu_token
TWILIO_PHONE_NUMBER=+1234567890
```

### **Para WhatsApp:**
1. Crie conta em [developers.facebook.com](https://developers.facebook.com)
2. Configure WhatsApp Business API
3. Obtenha token e Phone ID
4. Configure no `.env`:
```env
WHATSAPP_TOKEN=seu_token
WHATSAPP_PHONE_ID=seu_phone_id
```

## 🎯 **Ordem Recomendada de Teste**

### **Passo 1: Teste Básico**
```bash
node teste-rapido.js
```
- Acesse: http://localhost:3000
- Teste todas as funcionalidades
- Confirme que está funcionando

### **Passo 2: Teste Desktop**
```bash
node teste-desktop.js
```
- Aguarde abrir a aplicação
- Teste interface desktop
- Confirme atalhos de teclado

### **Passo 3: Configurar Notificações (Opcional)**
```bash
copy env.example .env
# Configure suas credenciais
npm run desktop
```

### **Passo 4: Criar Executável**
```bash
npm run dist
```

## 🚀 **Comandos Rápidos**

### **Iniciar Sempre Funciona:**
```bash
node teste-rapido.js
```

### **Desktop Sem Problemas:**
```bash
node teste-desktop.js
```

### **Limpar Tudo:**
```bash
taskkill /F /IM node.exe
npm cache clean --force
npm install
```

## 📞 **Se Nada Funcionar**

1. **Verifique Node.js:**
   ```bash
   node --version
   npm --version
   ```

2. **Reinstale tudo:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Use apenas o teste rápido:**
   ```bash
   node teste-rapido.js
   ```

4. **Verifique logs:**
   - Abra o console do navegador (F12)
   - Verifique mensagens de erro

---

**💡 Dica:** Sempre comece com `node teste-rapido.js` - é o mais confiável! 