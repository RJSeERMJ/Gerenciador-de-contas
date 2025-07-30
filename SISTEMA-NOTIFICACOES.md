# 📧 **SISTEMA DE NOTIFICAÇÕES - FAMÍLIA JAMAR**

## 🔔 **TIPOS DE NOTIFICAÇÕES ATIVAS:**

### **1. ✅ E-mail de Confirmação**
- **Quando:** Ao configurar e-mail pela primeira vez
- **Conteúdo:** Confirmação de configuração
- **Status:** ✅ **FUNCIONANDO**

### **2. ⚠️ Alertas de Contas Vencendo**
- **Quando:** Contas que vencem nos próximos 3 dias
- **Frequência:** Verificação a cada 30 minutos (teste) / 6 horas (produção)
- **Conteúdo:** Lista de contas vencendo + valores
- **Status:** ✅ **IMPLEMENTADO**

### **3. 🚨 Alertas de Contas Vencidas**
- **Quando:** Contas que já passaram do vencimento
- **Frequência:** Verificação a cada 30 minutos (teste) / 6 horas (produção)
- **Conteúdo:** Lista de contas em atraso + valores
- **Status:** ✅ **IMPLEMENTADO**

### **4. 📊 Resumos Mensais**
- **Quando:** Fim do mês
- **Conteúdo:** Relatório completo de contas
- **Status:** ⚠️ **EM DESENVOLVIMENTO**

## 🧪 **COMO TESTAR AS NOTIFICAÇÕES:**

### **1. Configurar E-mail:**
1. **Acesse** o sistema
2. **Clique** em "Configurar E-mail"
3. **Digite** seu e-mail
4. **Salve** a configuração

### **2. Testar Manualmente:**
1. **Adicione** uma conta com vencimento próximo
2. **Aguarde** 30 minutos para verificação automática
3. **Ou use** a rota de teste: `/api/testar-notificacoes`

### **3. Verificar Logs:**
- **Vercel Dashboard** > Functions > server-web.js
- **Procure** por mensagens de notificação

## 📅 **FREQUÊNCIA DAS VERIFICAÇÕES:**

### **🔄 Verificação Automática:**
- **Teste:** A cada 2 horas
- **Produção:** A cada 6 horas
- **Horário:** 24/7 (sistema sempre ativo)

### **📧 Envio de E-mails:**
- **Máximo 1x por dia** para cada tipo de alerta
- **Não há spam** - controle inteligente de repetição
- **E-mail configurado:** O que você definir na interface

### **🎯 Controle Anti-Spam:**
- **Contas vencendo:** Máximo 1 e-mail por dia
- **Contas vencidas:** Máximo 1 e-mail por dia
- **Verificação:** Continua a cada 2-6 horas
- **Envio:** Só quando necessário e não repetido

## 🎯 **EXEMPLOS DE NOTIFICAÇÕES:**

### **⚠️ Contas Vencendo:**
```
Assunto: ⚠️ Contas Vencendo - Sistema Família Jamar

⚠️ Contas Vencendo nos Próximos 3 Dias

Olá! Você tem contas vencendo em breve:

• Luz - R$ 150.00 - Vence: 15/08/2024
• Água - R$ 80.00 - Vence: 16/08/2024

💰 Total: R$ 230.00

📱 Sistema Família Jamar
```

### **🚨 Contas Vencidas:**
```
Assunto: 🚨 Contas Vencidas - Sistema Família Jamar

🚨 Contas Vencidas

Olá! Você tem contas em atraso:

• Internet - R$ 120.00 - Venceu: 10/08/2024
• Telefone - R$ 45.00 - Venceu: 12/08/2024

💰 Total: R$ 165.00

📱 Sistema Família Jamar
```

## ⚙️ **CONFIGURAÇÕES TÉCNICAS:**

### **📧 E-mail Remetente:**
- **De:** `jamarestudo@gmail.com`
- **Para:** E-mail configurado pelo usuário
- **SMTP:** Gmail (configurado)

### **🔧 Variáveis de Ambiente:**
- **EMAIL_PASSWORD:** Senha de aplicativo do Gmail
- **Configurada no Vercel:** ✅

### **📊 Armazenamento:**
- **E-mail configurado:** Em memória (atualiza ao configurar)
- **Contas:** Em memória (reseta ao reiniciar)

## 🎊 **BENEFÍCIOS:**

### **✅ Nunca mais esqueça contas:**
- Alertas automáticos 3 dias antes
- Notificações de contas vencidas
- Sistema 24/7 funcionando

### **✅ Economia de tempo:**
- Não precisa verificar manualmente
- E-mails organizados e claros
- Informações completas

### **✅ Controle financeiro:**
- Visão clara de gastos
- Alertas de valores totais
- Histórico de notificações

---

**🚀 Sistema de Notificações - Família Jamar funcionando perfeitamente!** 