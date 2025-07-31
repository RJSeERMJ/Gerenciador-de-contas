# 📧 Sistema de Notificação por E-mail - Família Jamar

## 🔧 Configuração do Sistema

### 1. **Configurações SMTP (Gmail)**
```javascript
const emailConfigs = {
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jamarestudo@gmail.com', // E-mail que ENVIA as notificações
            pass: process.env.EMAIL_PASSWORD || 'mekz ihei gvuz fkgb'
        }
    }
};
```

### 2. **Variável de Ambiente Necessária**
- **EMAIL_PASSWORD**: Senha de aplicativo do Gmail (configurada no Vercel)
- **Importante**: Deve ser uma senha de aplicativo, não a senha normal da conta

---

## 📋 Tipos de Notificações

### 1. **⚠️ Alertas de Contas Vencendo**
- **Quando**: Contas que vencem nos próximos 3 dias
- **Frequência**: Máximo 1x por dia
- **Conteúdo**: Lista de contas, valores e datas de vencimento

### 2. **🚨 Alertas de Contas Vencidas**
- **Quando**: Contas que já passaram da data de vencimento
- **Frequência**: Máximo 1x por dia
- **Conteúdo**: Lista de contas em atraso com valores

### 3. **📊 Relatório Completo**
- **Quando**: Ao configurar e-mail pela primeira vez
- **Conteúdo**: Todas as contas (pagas, pendentes, vencidas) com resumo financeiro

### 4. **✅ E-mail de Confirmação**
- **Quando**: Ao configurar e-mail no sistema
- **Conteúdo**: Confirmação de que o e-mail foi configurado com sucesso

---

## ⚙️ Como Funciona

### 1. **Configuração Inicial**
```javascript
// Usuário configura e-mail via frontend
POST /api/configurar-email
{
    "email": "usuario@exemplo.com"
}
```

### 2. **Verificação Automática**
```javascript
// Executa a cada 2 horas e 6 horas
setInterval(verificarContasVencendo, 2 * 60 * 60 * 1000); // 2 horas
setInterval(verificarContasVencendo, 6 * 60 * 60 * 1000); // 6 horas
```

### 3. **Lógica de Verificação**
```javascript
async function verificarContasVencendo() {
    const hoje = new Date();
    const proximos3Dias = new Date();
    proximos3Dias.setDate(hoje.getDate() + 3);
    
    // Contas vencendo nos próximos 3 dias
    const contasVencendo = contas.filter(conta => {
        if (conta.paga) return false;
        const dataVencimento = new Date(conta.dataVencimento);
        return dataVencimento >= hoje && dataVencimento <= proximos3Dias;
    });
    
    // Contas já vencidas
    const contasVencidas = contas.filter(conta => {
        if (conta.paga) return false;
        const dataVencimento = new Date(conta.dataVencimento);
        return dataVencimento < hoje;
    });
}
```

---

## 📧 Função de Envio de E-mail

### **Função Principal**
```javascript
async function enviarEmail(destinatario, assunto, conteudo) {
    try {
        // Verificar configuração
        if (!process.env.EMAIL_PASSWORD) {
            console.log('❌ Senha de e-mail não configurada');
            return false;
        }
        
        // Criar transportador
        const transporter = nodemailer.createTransport(emailConfigs.gmail);
        
        // Verificar conexão
        await transporter.verify();
        
        // Enviar e-mail
        const result = await transporter.sendMail({
            from: 'jamarestudo@gmail.com',
            to: destinatario,
            subject: assunto,
            html: conteudo
        });
        
        return true;
    } catch (error) {
        console.log('❌ Erro ao enviar e-mail:', error.message);
        return false;
    }
}
```

---

## 🛡️ Controles de Segurança

### 1. **Prevenção de Spam**
- **Controle de frequência**: Máximo 1 notificação por tipo por dia
- **Verificação de e-mail configurado**: Só envia se e-mail estiver configurado

### 2. **Validações**
- **E-mail obrigatório**: Verifica se e-mail foi fornecido
- **Senha configurada**: Verifica se EMAIL_PASSWORD está configurada
- **Conexão SMTP**: Testa conexão antes de enviar

### 3. **Logs Detalhados**
- **Sucesso**: Confirma envio com Message ID
- **Erros**: Logs específicos por tipo de erro (EAUTH, ECONNECTION, etc.)

---

## 🔄 Rotas da API

### 1. **Configurar E-mail**
```
POST /api/configurar-email
Body: { "email": "usuario@exemplo.com" }
```

### 2. **Testar Notificações**
```
POST /api/testar-notificacoes
```

### 3. **Testar E-mail Simples**
```
POST /api/testar-email
Body: { "email": "usuario@exemplo.com" }
```

---

## 📊 Exemplo de E-mail Enviado

### **Alerta de Contas Vencendo**
```html
<h2>⚠️ Contas Vencendo nos Próximos 3 Dias</h2>
<p>Olá! Você tem contas vencendo em breve:</p>
<br>
<ul>
    <li><strong>Conta de Luz</strong> - R$ 150.00 - Vence: 15/12/2024</li>
    <li><strong>Internet</strong> - R$ 89.90 - Vence: 16/12/2024</li>
</ul>
<br>
<p>💰 Total: R$ 239.90</p>
<br>
<p>📱 Sistema Família Jamar</p>
```

### **Relatório Completo**
```html
<h2>📊 Relatório Completo de Contas</h2>
<p>Olá! Aqui está o relatório completo de todas as suas contas:</p>
<br>
<h3>📈 Resumo Geral</h3>
<ul>
    <li><strong>Total de contas:</strong> 8</li>
    <li><strong>Contas pagas:</strong> 3</li>
    <li><strong>Contas pendentes:</strong> 4</li>
    <li><strong>Contas vencidas:</strong> 1</li>
</ul>
<br>
<h3>💰 Valores</h3>
<ul>
    <li><strong>Total pago:</strong> R$ 450.00</li>
    <li><strong>Total pendente:</strong> R$ 650.00</li>
    <li><strong>Total vencido:</strong> R$ 120.00</li>
</ul>
```

---

## 🚀 Como Configurar no Vercel

### 1. **Configurar Variável de Ambiente**
- Acesse o Vercel Dashboard
- Vá em Settings > Environment Variables
- Adicione: `EMAIL_PASSWORD` = sua_senha_de_aplicativo

### 2. **Gerar Senha de Aplicativo no Gmail**
1. Acesse sua conta Google
2. Vá em Segurança > Verificação em duas etapas
3. Senhas de app > Gerar nova senha
4. Use essa senha no EMAIL_PASSWORD

### 3. **Testar Configuração**
- Use a rota `/api/testar-email` para verificar se está funcionando
- Verifique os logs no Vercel para debug

---

## 🔍 Troubleshooting

### **Erro EAUTH**
- Verifique se está usando senha de aplicativo
- Confirme se a verificação em duas etapas está ativada

### **Erro ECONNECTION**
- Verifique conexão com internet
- Confirme se o Gmail não está bloqueando

### **E-mail não chega**
- Verifique pasta de spam
- Confirme se o e-mail está correto
- Verifique logs no Vercel

---

## 📱 Integração com Frontend

### **Configuração via Interface**
```javascript
// No frontend (script-wix.js)
async function configurarEmail() {
    const email = document.getElementById('emailNotificacao').value;
    
    const response = await fetch('/api/configurar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    
    const result = await response.json();
    
    if (result.success) {
        alert('E-mail configurado com sucesso!');
        emailConfigurado = { email };
        localStorage.setItem('familiaJamarEmail', JSON.stringify(emailConfigurado));
    }
}
```

---

## ✅ Status do Sistema

- **✅ Configuração SMTP**: Funcionando
- **✅ Envio automático**: Ativo (a cada 2h e 6h)
- **✅ Prevenção de spam**: Implementada
- **✅ Logs detalhados**: Ativos
- **✅ Tratamento de erros**: Implementado
- **✅ Interface de configuração**: Disponível 