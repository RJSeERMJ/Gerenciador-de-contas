# 📧 Rotas de Envio de E-mail - Sistema Família Jamar

## 🎯 Principais Rotas de Envio

### 1. **Configurar E-mail Principal** 
```
POST /api/configurar-email
```
**Localização:** Linha 726 e 1519 do `server-web.js`

**Função:** 
- Configura e-mail para receber relatórios
- Envia e-mail de confirmação
- Envia relatório completo imediatamente
- Ativa agendamento automático a cada 5 minutos

**Exemplo de uso:**
```bash
curl -X POST https://seu-dominio.vercel.app/api/configurar-email \
  -H "Content-Type: application/json" \
  -d '{"email": "seu-email@gmail.com"}'
```

---

### 2. **Testar Envio de E-mail**
```
POST /api/testar-email
```
**Localização:** Linha 841 do `server-web.js`

**Função:** 
- Envia e-mail de teste
- Verifica se o sistema de e-mail está funcionando

**Exemplo de uso:**
```bash
curl -X POST https://seu-dominio.vercel.app/api/testar-email \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@gmail.com"}'
```

---

### 3. **Enviar E-mail Personalizado**
```
POST /api/enviar-email-personalizado
```
**Localização:** Linha 896 do `server-web.js`

**Função:** 
- Envia e-mail com assunto e mensagem personalizados

**Exemplo de uso:**
```bash
curl -X POST https://seu-dominio.vercel.app/api/enviar-email-personalizado \
  -H "Content-Type: application/json" \
  -d '{
    "email": "destinatario@gmail.com",
    "assunto": "Assunto personalizado",
    "mensagem": "Sua mensagem aqui"
  }'
```

---

### 4. **Enviar E-mail para Múltiplos Destinatários**
```
POST /api/enviar-email-multiplos
```
**Localização:** Linha 942 do `server-web.js`

**Função:** 
- Envia o mesmo e-mail para vários destinatários

**Exemplo de uso:**
```bash
curl -X POST https://seu-dominio.vercel.app/api/enviar-email-multiplos \
  -H "Content-Type: application/json" \
  -d '{
    "emails": ["email1@gmail.com", "email2@gmail.com"],
    "assunto": "Assunto",
    "mensagem": "Mensagem"
  }'
```

---

### 5. **Configurar E-mail para Agendamento**
```
POST /api/configurar-email-agendamento
```
**Localização:** Linha 1479 do `server-web.js`

**Função:** 
- Configura e-mail especificamente para relatórios agendados
- Ativa agendamento via Vercel Cron Jobs

---

### 6. **Enviar Relatório Manualmente**
```
POST /api/agendamento/enviar-manual
```
**Localização:** Linha 1430 do `server-web.js`

**Função:** 
- Envia relatório completo manualmente
- Útil para testes

**Exemplo de uso:**
```bash
curl -X POST https://seu-dominio.vercel.app/api/agendamento/enviar-manual
```

---

## 🔍 Rotas de Status

### **Verificar Status do E-mail**
```
GET /api/email-status
```
**Localização:** Linha 781 do `server-web.js`

**Função:** 
- Mostra se e-mail está configurado
- Conta contas vencidas e vencendo

### **Verificar Status do Agendamento**
```
GET /api/agendamento/status
```
**Localização:** Linha 1453 do `server-web.js`

**Função:** 
- Mostra status do agendamento automático
- Informa intervalo e plataforma

---

## ⏰ Rotas de Cron Job (Automáticas)

### **Relatórios a Cada 5 Minutos**
```
GET /api/cron/relatorios-5min
```
**Localização:** Linha 1368 do `server-web.js`

**Função:** 
- Executada automaticamente pelo Vercel Cron
- Envia relatórios a cada 5 minutos

### **Keep Alive**
```
GET /api/cron/keep-alive
```
**Localização:** Linha 1350 do `server-web.js`

**Função:** 
- Mantém o sistema ativo
- Executada a cada 15 minutos

---

## 📊 Estrutura das Respostas

### **Sucesso:**
```json
{
  "success": true,
  "message": "E-mail enviado com sucesso!",
  "email": "destinatario@gmail.com"
}
```

### **Erro:**
```json
{
  "success": false,
  "error": "Descrição do erro"
}
```

---

## 🎯 Como Encontrar no Código

### **No arquivo `server-web.js`:**

1. **Linha 726** - Primeira rota `/api/configurar-email`
2. **Linha 781** - Status do e-mail
3. **Linha 841** - Teste de e-mail
4. **Linha 896** - E-mail personalizado
5. **Linha 942** - E-mail múltiplos
6. **Linha 1350** - Cron keep-alive
7. **Linha 1368** - Cron relatórios 5min
8. **Linha 1430** - Envio manual
9. **Linha 1453** - Status agendamento
10. **Linha 1479** - Configurar agendamento
11. **Linha 1519** - Segunda rota `/api/configurar-email`

### **Buscar no código:**
```bash
# Encontrar todas as rotas de e-mail
grep -n "app\.(get|post).*email" server-web.js

# Encontrar função enviarEmail
grep -n "enviarEmail" server-web.js
```

---

## 🚀 Teste Rápido

```bash
# 1. Configurar e-mail
curl -X POST https://seu-dominio.vercel.app/api/configurar-email \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@gmail.com"}'

# 2. Verificar status
curl https://seu-dominio.vercel.app/api/email-status

# 3. Testar envio
curl -X POST https://seu-dominio.vercel.app/api/testar-email \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@gmail.com"}'
```

Todas essas rotas estão implementadas e funcionais no seu sistema! 🎉
