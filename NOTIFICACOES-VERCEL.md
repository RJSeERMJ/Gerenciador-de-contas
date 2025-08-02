# 📧 Configuração de Notificações no Vercel

## Problema
O sistema roda no Vercel, que usa funções serverless. Isso significa que o servidor não fica rodando continuamente, então as notificações automáticas não funcionam.

## Solução
Usar verificação manual através de serviços externos como UptimeRobot.

## Passos para Configurar

### 1. Configurar E-mail no Sistema
1. Acesse o sistema online
2. Vá em "Configurações" → "Configurar E-mail"
3. Digite seu e-mail e salve
4. Você receberá um e-mail de confirmação

### 2. Configurar UptimeRobot (Recomendado)
1. Acesse [uptimerobot.com](https://uptimerobot.com)
2. Crie uma conta gratuita
3. Adicione um novo monitor:
   - **Tipo**: HTTP(s)
   - **URL**: `https://seu-dominio.vercel.app/api/verificar-notificacoes`
   - **Método**: POST
   - **Intervalo**: 6 horas (ou conforme necessário)
   - **Nome**: "Família Jamar - Notificações"

### 3. Testar Notificações
Use a rota de teste para verificar se o e-mail está funcionando:
```bash
curl -X POST https://seu-dominio.vercel.app/api/testar-email \
  -H "Content-Type: application/json" \
  -d '{"email":"seu-email@exemplo.com"}'
```

### 4. Verificar Status
Para verificar o status das notificações:
```bash
curl https://seu-dominio.vercel.app/api/email-status
```

## Rotas Disponíveis

### POST /api/verificar-notificacoes
- **Uso**: Verificação manual de notificações
- **Chamado por**: UptimeRobot ou outros serviços
- **Frequência**: Recomendado a cada 6 horas

### POST /api/testar-email
- **Uso**: Testar envio de e-mail
- **Body**: `{"email": "seu-email@exemplo.com"}`

### GET /api/email-status
- **Uso**: Verificar status do e-mail configurado
- **Retorna**: Status das notificações

## Configuração de Ambiente

### Variáveis de Ambiente no Vercel
1. Acesse o dashboard do Vercel
2. Vá em Settings → Environment Variables
3. Adicione:
   - `EMAIL_PASSWORD`: Senha do app do Gmail

### Configurar Senha do App Gmail
1. Acesse [myaccount.google.com](https://myaccount.google.com)
2. Vá em "Segurança" → "Verificação em duas etapas"
3. Ative a verificação em duas etapas
4. Vá em "Senhas de app"
5. Gere uma senha para o sistema
6. Use essa senha na variável `EMAIL_PASSWORD`

## Troubleshooting

### E-mail não configurado
- Verifique se configurou o e-mail no sistema
- Use a rota `/api/email-status` para verificar

### E-mail não enviado
- Verifique se a variável `EMAIL_PASSWORD` está configurada no Vercel
- Teste com a rota `/api/testar-email`

### Notificações não funcionam
- Verifique se o UptimeRobot está configurado corretamente
- Confirme se a URL está correta
- Verifique os logs no dashboard do Vercel

## Logs e Monitoramento

### Verificar Logs no Vercel
1. Acesse o dashboard do Vercel
2. Vá em Functions → server-web.js
3. Clique em "View Function Logs"

### Testar Localmente
```bash
# Iniciar servidor local
node server-web.js

# Testar verificação manual
curl -X POST http://localhost:3000/api/verificar-notificacoes

# Testar envio de e-mail
curl -X POST http://localhost:3000/api/testar-email \
  -H "Content-Type: application/json" \
  -d '{"email":"seu-email@exemplo.com"}'
```

## Alternativas ao UptimeRobot

### Cron-job.org
- Gratuito
- Configuração similar ao UptimeRobot

### GitHub Actions
- Criar workflow para chamar a API periodicamente
- Exemplo:
```yaml
name: Verificar Notificações
on:
  schedule:
    - cron: '0 */6 * * *'  # A cada 6 horas
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Verificar notificações
        run: |
          curl -X POST https://seu-dominio.vercel.app/api/verificar-notificacoes
```

### Vercel Cron Jobs (Premium)
- Se tiver plano pago do Vercel
- Configurar cron job diretamente no Vercel 