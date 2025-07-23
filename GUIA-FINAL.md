# 🏠 **FAMÍLIA JAMAR - Gerenciador de Contas**

## 🎯 **Sistema Simplificado e Funcional**

### ✅ **O que foi implementado:**
- **Interface limpa** com apenas o essencial
- **Configuração de e-mail** simples e direta
- **Sistema estável** sem dependências problemáticas
- **Inicialização fácil** com script automático

---

## 🚀 **COMO USAR:**

### **Opção 1 - Inicialização Automática:**
```bash
# Clique duas vezes no arquivo:
iniciar.bat
```

### **Opção 2 - Comando Manual:**
```bash
node server-simples.js
```

### **Opção 3 - NPM:**
```bash
npm start
```

### **2. Acessar a Interface:**
```
http://localhost:3000
```

### **3. Configurar E-mail de Notificação:**
1. **Clique** em "Configurar E-mail"
2. **Digite** seu e-mail
3. **Clique** em "Salvar Configuração"

### **4. Adicionar Contas:**
1. **Clique** em "Nova Conta"
2. **Preencha** os dados:
   - Descrição
   - Valor
   - Data de vencimento
   - Categoria
3. **Clique** em "Salvar Conta"

---

## 📁 **ARQUIVOS ESSENCIAIS:**

### **Core do Sistema:**
- `server-simples.js` - Servidor principal (sem dependências problemáticas)
- `package.json` - Dependências
- `iniciar.bat` - Script de inicialização automática

### **Interface:**
- `public/index.html` - Página web
- `public/script.js` - JavaScript
- `public/styles.css` - Estilos

### **Banco de Dados:**
- `database/` - Banco de dados SQLite (criado automaticamente)

---

## 🔧 **CONFIGURAÇÃO RÁPIDA:**

### **1. Instalar dependências (se necessário):**
```bash
npm install
```

### **2. Iniciar sistema:**
```bash
# Opção mais fácil:
iniciar.bat

# Ou manualmente:
node server-simples.js
```

### **3. Acessar:**
```
http://localhost:3000
```

---

## 🎊 **FUNCIONALIDADES:**

### **✅ Gerenciamento de Contas:**
- Adicionar contas
- Editar contas
- Marcar como paga
- Deletar contas
- Filtrar por status/categoria
- Buscar contas

### **✅ Dashboard:**
- Contas pendentes
- Contas vencidas
- Total pendente
- Contas pagas

### **✅ Configuração de E-mail:**
- Interface simples
- Validação automática
- Salvamento local

### **✅ Exportação:**
- Exportar contas em CSV

---

## 🎯 **PRÓXIMOS PASSOS:**

### **1. Configurar E-mail:**
- Acesse a interface
- Clique em "Configurar E-mail"
- Digite seu e-mail
- Salve a configuração

### **2. Adicionar Contas:**
- Adicione suas contas mensais
- Configure vencimentos
- Organize por categorias

### **3. Usar o Sistema:**
- Gerencie suas contas
- Acompanhe vencimentos
- Mantenha controle financeiro

---

## 🆘 **SOLUÇÃO DE PROBLEMAS:**

### **❌ Página não abre:**
```bash
# Verificar se porta 3000 está livre
taskkill /F /IM node.exe
node server-simples.js
```

### **❌ Erro de dependências:**
```bash
npm install
```

### **❌ Erro de banco de dados:**
```bash
# Recriar banco (deletar pasta database)
rmdir /s database
node server-simples.js
```

---

## 🎉 **RESULTADO FINAL:**

**Sistema completo e funcional com:**
- ✅ Interface limpa e intuitiva
- ✅ Configuração simples de e-mail
- ✅ Sistema estável sem erros
- ✅ Gerenciamento completo de contas
- ✅ Inicialização automática

**Para usar:**
1. **Clique duas vezes** em `iniciar.bat`
2. **Aguarde** o servidor iniciar
3. **Abra** http://localhost:3000
4. **Configure** seu e-mail
5. **Adicione** suas contas

---

**🎊 Sistema Família Jamar pronto para uso!**

### **📝 Nota:**
Este sistema foi simplificado para funcionar sem dependências externas de notificação, garantindo estabilidade e facilidade de uso. O foco está no gerenciamento eficiente das contas com interface limpa e intuitiva. 