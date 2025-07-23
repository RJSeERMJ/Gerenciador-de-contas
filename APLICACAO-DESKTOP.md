# 🖥️ Aplicação Desktop - Gerenciador de Contas

## 🚀 Como Usar a Aplicação Desktop

### ⚡ Iniciar a Aplicação

1. **Modo Desenvolvimento:**
   ```bash
   npm run desktop
   ```

2. **Modo Produção (após build):**
   ```bash
   npm run dist
   ```
   Depois execute o arquivo `.exe` gerado na pasta `dist`.

### 🎯 Funcionalidades da Aplicação Desktop

#### 📱 **Interface Nativa**
- Janela nativa do Windows
- Ícone na bandeja do sistema
- Minimiza para bandeja (não fecha)
- Menu nativo da aplicação

#### ⌨️ **Atalhos de Teclado**
- `Ctrl + N` - Nova Conta
- `Ctrl + E` - Exportar Contas
- `F1` - Mostrar Atalhos
- `Esc` - Fechar Modais

#### 🔔 **Notificações Desktop**
- Notificações nativas do Windows
- Alertas de contas vencendo
- Lembretes automáticos

#### 💾 **Persistência**
- Dados salvos localmente
- Funciona offline
- Backup automático

## 🛠️ Como Configurar

### 1. **Instalar Dependências**
```bash
npm install
```

### 2. **Configurar Notificações (Opcional)**
```bash
copy env.example .env
```
Edite o arquivo `.env` com suas credenciais.

### 3. **Executar em Modo Desenvolvimento**
```bash
npm run desktop
```

### 4. **Criar Executável**
```bash
npm run dist
```

## 📁 Estrutura da Aplicação Desktop

```
gerenciador-contas/
├── electron/
│   ├── main.js              # Processo principal
│   ├── preload.js           # Comunicação segura
│   ├── icon.png             # Ícone da aplicação
│   └── tray-icon.png        # Ícone da bandeja
├── public/                  # Interface web
├── server.js               # Servidor backend
└── package.json            # Configurações
```

## 🎨 Interface da Aplicação

### **Dashboard Principal**
- 📊 Estatísticas em tempo real
- 💰 Total de contas pendentes
- 📅 Contas vencendo
- ✅ Contas pagas

### **Gestão de Contas**
- ➕ Adicionar nova conta
- ✏️ Editar conta existente
- 🗑️ Deletar conta
- ✅ Marcar como paga

### **Filtros e Busca**
- 🔍 Busca por texto
- 🏷️ Filtro por categoria
- 📊 Filtro por status
- 📤 Exportação para CSV

## 🔧 Configurações Avançadas

### **Personalizar Ícone**
1. Substitua `electron/icon.png` (256x256)
2. Substitua `electron/tray-icon.png` (32x32)
3. Rebuild: `npm run dist`

### **Configurar Inicialização Automática**
```javascript
// Em electron/main.js
app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true
});
```

### **Personalizar Menu**
Edite o template de menu em `electron/main.js`:
```javascript
const template = [
    {
        label: 'Arquivo',
        submenu: [
            { label: 'Nova Conta', accelerator: 'CmdOrCtrl+N' },
            { label: 'Exportar', accelerator: 'CmdOrCtrl+E' },
            { type: 'separator' },
            { label: 'Sair', accelerator: 'Ctrl+Q' }
        ]
    }
];
```

## 🚨 Solução de Problemas

### **Aplicação não inicia**
```bash
# Verificar dependências
npm install

# Limpar cache
npm cache clean --force

# Reinstalar node_modules
rm -rf node_modules
npm install
```

### **Erro de porta**
```bash
# Verificar se porta 3000 está livre
netstat -an | findstr :3000

# Matar processo se necessário
taskkill /F /PID <PID>
```

### **Ícone não aparece**
- Verifique se os arquivos `icon.png` e `tray-icon.png` existem
- Use imagens PNG de 256x256 e 32x32 pixels
- Rebuild a aplicação: `npm run dist`

### **Notificações não funcionam**
- Verifique as configurações do Windows
- Confirme se as notificações estão habilitadas
- Teste com `window.desktopUtils.showDesktopNotification()`

## 📱 Recursos Especiais

### **Bandeja do Sistema**
- Clique duplo para abrir
- Menu de contexto com opções rápidas
- Indicador visual de status

### **Notificações Inteligentes**
- Alertas de contas vencendo
- Lembretes automáticos
- Notificações nativas do Windows

### **Persistência de Dados**
- Banco SQLite local
- Backup automático
- Sincronização offline

### **Interface Responsiva**
- Adapta ao tamanho da janela
- Design moderno e intuitivo
- Animações suaves

## 🎯 Próximos Passos

1. **Teste a aplicação:**
   ```bash
   npm run desktop
   ```

2. **Configure notificações** (opcional)

3. **Crie o executável:**
   ```bash
   npm run dist
   ```

4. **Instale na área de trabalho**

5. **Use normalmente!**

---

**🎉 Sua aplicação desktop está pronta!**

Agora você tem um gerenciador de contas completo que roda nativamente no Windows, com interface moderna e todas as funcionalidades que você precisa! 