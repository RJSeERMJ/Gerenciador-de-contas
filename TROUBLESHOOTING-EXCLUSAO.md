# 🗑️ Troubleshooting - Problema de Exclusão no Vercel

## Problema
As contas não são excluídas do MongoDB quando deletadas no site do Vercel.

## Possíveis Causas

### 1. **Timeout de Conexão**
- O Vercel tem limite de 10 segundos para funções gratuitas
- Operações de banco podem demorar mais que isso
- **Solução**: Aumentado timeout para 60 segundos no `vercel.json`

### 2. **Conexão MongoDB Interrompida**
- Conexões podem ser perdidas entre requisições
- **Solução**: Adicionado sistema de reconexão automática

### 3. **Erro Silencioso**
- Erros podem não estar sendo logados corretamente
- **Solução**: Adicionados logs detalhados

## Testes Implementados

### 1. **Rota de Status do Banco**
```bash
curl https://seu-dominio.vercel.app/api/db-status
```

### 2. **Rota de Teste de Exclusão**
```bash
curl -X POST https://seu-dominio.vercel.app/api/testar-exclusao
```

### 3. **Teste Manual de Exclusão**
```bash
curl -X DELETE https://seu-dominio.vercel.app/api/contas/ID_DA_CONTA
```

## Logs para Verificar

### No Dashboard do Vercel:
1. Acesse o dashboard do Vercel
2. Vá em Functions → server-web.js
3. Clique em "View Function Logs"
4. Procure por:
   - `🗑️ DELETE /api/contas/:id`
   - `💾 Salvando dados...`
   - `✅ Dados salvos no MongoDB Atlas`

### Logs Esperados:
```
🗑️ DELETE /api/contas/:id - Deletando conta
🌐 Ambiente: production
🆔 ID da conta a ser deletada: 23
📊 Total de contas antes da exclusão: 7
🔍 Índice da conta encontrada: 6
📋 Conta que será deletada: { id: 23, descricao: 'seguro carro', valor: 445 }
✅ Conta removida da lista local
📊 Total de contas após remoção: 6
💾 Salvando alterações no banco de dados...
💾 Salvando dados...
📊 Total de contas para salvar: 6
🆔 Próximo ID: 24
🌐 Ambiente: production
🗄️ Conectando ao MongoDB Atlas...
✅ Conexão com MongoDB ativa
🧹 Limpando coleção...
🗑️ Documentos removidos: 7
📝 Inserindo contas no MongoDB...
✅ Contas inseridas: 6
✅ Dados salvos no MongoDB Atlas com sucesso
✅ Backup salvo no JSON local
✅ Alterações salvas com sucesso
```

## Soluções Implementadas

### 1. **Timeouts Otimizados**
- Ping: 5 segundos
- Delete: 10 segundos
- Insert: 15 segundos
- Reconexão: 5 segundos
- Salvamento total: 20 segundos

### 2. **Tratamento de Erros Melhorado**
- Erros específicos para timeout
- Reconexão automática
- Logs detalhados

### 3. **Verificação de Status**
- Rota `/api/db-status` para verificar conexão
- Contagem de documentos no MongoDB
- Status da conexão

## Como Testar

### 1. **Teste Local**
```bash
# Iniciar servidor
node server-web.js

# Testar exclusão
curl -X DELETE http://localhost:3000/api/contas/23

# Verificar status
curl http://localhost:3000/api/db-status
```

### 2. **Teste no Vercel**
```bash
# Testar função de exclusão
curl -X POST https://seu-dominio.vercel.app/api/testar-exclusao

# Verificar status
curl https://seu-dominio.vercel.app/api/db-status

# Deletar conta específica
curl -X DELETE https://seu-dominio.vercel.app/api/contas/23
```

## Scripts de Teste

### `testar-exclusao.bat`
Script para testar exclusão localmente ou no Vercel.

### `testar-notificacoes.bat`
Script para testar notificações e status geral.

## Próximos Passos

1. **Deploy no Vercel** com as modificações
2. **Testar exclusão** usando os scripts
3. **Verificar logs** no dashboard do Vercel
4. **Configurar UptimeRobot** para notificações

## Contato para Suporte

Se o problema persistir:
1. Verifique os logs no Vercel
2. Teste com a rota `/api/testar-exclusao`
3. Verifique o status com `/api/db-status`
4. Compare com o funcionamento local 