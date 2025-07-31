# 🔐 Sistema de Login - Família Jamar

## 📋 **Visão Geral**

O sistema agora possui uma tela de login para proteger o acesso exclusivo aos membros da Família Jamar.

## 🚀 **Como Usar**

### **1. Acessar o Sistema**
- Abra o arquivo `login.html` no navegador
- Ou acesse diretamente `index.html` (será redirecionado para login se não estiver logado)

### **2. Credenciais Disponíveis**

| Usuário | Senha | Descrição |
|---------|-------|-----------|
| `jamar` | `familia2024` | Acesso principal da família |
| `admin` | `admin123` | Acesso administrativo |
| `teste` | `teste123` | Acesso para testes |

### **3. Processo de Login**
1. Digite o usuário e senha
2. Clique em "Entrar" ou pressione Enter
3. Aguarde a validação (1 segundo)
4. Será redirecionado automaticamente para o sistema

## 🔒 **Recursos de Segurança**

### **Verificação de Sessão**
- ✅ Login obrigatório para acessar o sistema
- ✅ Sessão expira após 24 horas
- ✅ Redirecionamento automático para login
- ✅ Logout com confirmação

### **Interface de Usuário**
- 👤 Nome do usuário logado no canto superior direito
- 🚪 Botão de logout sempre visível
- ⏰ Expiração automática da sessão

## 🎨 **Características da Tela de Login**

### **Design**
- 🎨 Interface moderna com gradiente
- 📱 Responsivo para mobile
- 🔍 Campo de senha com toggle de visibilidade
- ⚡ Animações suaves
- 🎯 Foco automático no campo de usuário

### **Funcionalidades**
- ⌨️ Login com Enter
- 👁️ Mostrar/ocultar senha
- ⏳ Loading durante autenticação
- ❌ Mensagens de erro claras
- ✅ Feedback de sucesso

## 🛠️ **Atalhos de Desenvolvimento**

### **Preencher Credenciais Rapidamente**
- Pressione `Ctrl + Shift + L` para preencher automaticamente:
  - Usuário: `jamar`
  - Senha: `familia2024`

## 📁 **Arquivos do Sistema**

### **Páginas**
- `login.html` - Tela de login
- `index.html` - Sistema principal (com verificação)
- `index-wix.html` - Versão para hospedagem (com verificação)

### **Funcionalidades**
- ✅ Verificação automática de login
- ✅ Redirecionamento se não logado
- ✅ Expiração de sessão (24h)
- ✅ Logout seguro
- ✅ Interface de usuário

## 🔧 **Personalização**

### **Alterar Credenciais**
Para adicionar ou modificar usuários, edite o arquivo `login.html`:

```javascript
const FAMILY_CREDENTIALS = {
    'jamar': 'familia2024',
    'admin': 'admin123',
    'teste': 'teste123',
    'novo_usuario': 'nova_senha'  // Adicionar aqui
};
```

### **Alterar Tempo de Sessão**
Para modificar o tempo de expiração (padrão: 24 horas):

```javascript
if (hoursDiff > 24) {  // Alterar este valor
    // Login expirado
}
```

## 🚨 **Importante**

### **Segurança**
- 🔐 As credenciais estão no código JavaScript (visível)
- 🛡️ Para maior segurança, use um servidor backend
- 🔄 Troque as senhas regularmente
- 👥 Compartilhe as credenciais apenas com membros da família

### **Uso Recomendado**
- 📱 Use em dispositivos pessoais
- 🔒 Não compartilhe as credenciais publicamente
- ⚠️ Não use em computadores públicos
- 💾 Faça backup regular dos dados

## 🎯 **Próximos Passos**

Para melhorar a segurança, considere:
1. 🔐 Implementar criptografia das senhas
2. 🌐 Criar um servidor backend
3. 📧 Sistema de recuperação de senha
4. 📱 Autenticação de dois fatores
5. 📊 Logs de acesso

---

**Desenvolvido para a Família Jamar** 🏠
*Sistema de Gerenciamento de Contas Seguro* 