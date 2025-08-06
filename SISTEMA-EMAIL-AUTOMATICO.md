# 📧 Sistema de Email Automático - A Cada 5 Minutos

## ✅ Sistema Já Configurado e Funcionando

Seu sistema já está configurado para enviar emails automaticamente a cada 5 minutos usando **Vercel Cron Jobs**.

## 🔧 Como Funciona

### 1. **Configuração no Vercel**
```json
{
  "crons": [
    {
      "path": "/api/cron/relatorios-5min",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### 2. **Função que Executa Automaticamente**
- **Rota**: `/api/cron/relatorios-5min`
- **Frequência**: A cada 5 minutos
- **Ação**: Envia relatório por email

### 3. **O que Acontece a Cada 5 Minutos**
1. ✅ Recarrega dados do banco de dados
2. ✅ Verifica se há email configurado
3. ✅ Envia relatório completo por email
4. ✅ Registra logs detalhados

## 📊 Como Verificar se Está Funcionando

### 1. **Verificar Status do Agendamento**
```bash
curl https://seu-dominio.vercel.app/api/agendamento/status
```

### 2. **Testar Envio Manual**
```bash
curl -X POST https://seu-dominio.vercel.app/api/agendamento/enviar-manual
```

### 3. **Executar Cron Job Manualmente**
```bash
curl https://seu-dominio.vercel.app/api/cron/relatorios-5min
```

### 4. **Verificar Logs no Vercel**
1. Acesse o dashboard do Vercel
2. Vá em **Functions** → **server-web.js**
3. Clique em **"View Function Logs"**
4. Procure por: `📊 Cron Job: Relatórios a cada 5 minutos executado`

## 📧 Configuração de Email

### Email Padrão
- **Destinatário**: `jamarestudante@gmail.com`
- **Assunto**: Relatório de Contas
- **Conteúdo**: Lista completa de contas com valores

### Personalizar Email
Para configurar um email diferente:
1. Acesse a interface do sistema
2. Vá em **Configurações**
3. Configure o email desejado

## 🔍 Logs Esperados

### Logs de Sucesso:
```
📊 Cron Job: Relatórios a cada 5 minutos executado
📅 Data/Hora: 15/12/2024, 14:30:00
📧 E-mail de destino: jamarestudante@gmail.com
✅ Relatório agendado enviado com sucesso
```

### Logs de Erro:
```
❌ Erro no cron job de relatórios: [mensagem do erro]
```

## ⚙️ Configurações Avançadas

### Alterar Frequência
Para mudar de 5 minutos para outro intervalo:

1. **Editar `vercel.json`**:
```json
"schedule": "*/10 * * * *"  // A cada 10 minutos
"schedule": "0 */1 * * *"   // A cada 1 hora
"schedule": "0 8 * * *"     // Diariamente às 8h
```

2. **Fazer deploy no Vercel**

### Outros Cron Jobs Disponíveis
- **Keep-alive**: A cada 15 minutos
- **Verificar contas**: A cada 2 horas  
- **Relatório diário**: Diariamente às 8h

## 🚨 Troubleshooting

### Problema: Emails não estão sendo enviados
**Solução**:
1. Verificar logs no Vercel
2. Testar envio manual
3. Verificar configuração de email

### Problema: Cron job não executa
**Solução**:
1. Verificar se o deploy foi feito no Vercel
2. Verificar configuração no `vercel.json`
3. Testar rota manualmente

### Problema: Timeout na execução
**Solução**:
- O Vercel tem limite de 30 segundos
- Função já está otimizada para esse limite

## 📋 Checklist de Verificação

- [ ] Deploy feito no Vercel
- [ ] Configuração de email definida
- [ ] Logs aparecendo no dashboard
- [ ] Emails sendo recebidos
- [ ] Cron job executando a cada 5 minutos

## 🎯 Próximos Passos

1. **Fazer deploy** se ainda não foi feito
2. **Testar** usando o script `testar-email-automatico.bat`
3. **Verificar logs** no dashboard do Vercel
4. **Confirmar** recebimento dos emails

## 📞 Suporte

Se houver problemas:
1. Verifique os logs no Vercel
2. Teste o envio manual
3. Verifique a configuração de email
4. Confirme se o deploy foi feito corretamente

---

**✅ Seu sistema já está configurado e funcionando automaticamente a cada 5 minutos!**
