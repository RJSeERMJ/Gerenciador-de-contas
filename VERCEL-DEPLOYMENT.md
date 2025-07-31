# 🚀 Deploy no Vercel - Sistema Família Jamar

## ✅ Configuração Completa

### 📋 Pré-requisitos

1. **Conta no Vercel**: https://vercel.com
2. **Conta no MongoDB Atlas**: https://mongodb.com/atlas
3. **Repositório no GitHub**: Para conectar com o Vercel

### 🔧 Passo a Passo

#### 1. Configurar MongoDB Atlas

1. **Criar cluster gratuito**:
   - Acesse: https://mongodb.com/atlas
   - Clique em "Try Free"
   - Crie uma conta ou faça login

2. **Configurar banco de dados**:
   - Crie um novo cluster (gratuito)
   - Escolha "Shared" → "M0 Sandbox"
   - Escolha região mais próxima (ex: São Paulo)
   - Clique em "Create"

3. **Configurar acesso**:
   - Vá em "Database Access"
   - Clique em "Add New Database User"
   - Username: `familiajamar`
   - Password: `sua_senha_segura_123`
   - Role: "Read and write to any database"
   - Clique em "Add User"

4. **Configurar rede**:
   - Vá em "Network Access"
   - Clique em "Add IP Address"
   - Clique em "Allow Access from Anywhere" (0.0.0.0/0)
   - Clique em "Confirm"

5. **Obter string de conexão**:
   - Vá em "Database" → "Connect"
   - Escolha "Connect your application"
   - Copie a string de conexão
   - Substitua `<password>` pela senha que você criou

#### 2. Configurar Variáveis de Ambiente no Vercel

1. **Acesse o Vercel Dashboard**
2. **Crie novo projeto**:
   - Conecte com GitHub
   - Selecione o repositório `ideia`
   - Clique em "Deploy"

3. **Configure variáveis de ambiente**:
   - Vá em "Settings" → "Environment Variables"
   - Adicione as seguintes variáveis:

```
MONGODB_URI=mongodb+srv://familiajamar:sua_senha_segura_123@cluster0.xxxxx.mongodb.net/familia-jamar?retryWrites=true&w=majority
EMAIL_PASSWORD=sua_senha_de_app_do_gmail
```

4. **Configurar domínio** (opcional):
   - Vá em "Settings" → "Domains"
   - Adicione seu domínio personalizado

#### 3. Deploy Automático

1. **Push para GitHub**:
   ```bash
   git add .
   git commit -m "Configuração para Vercel"
   git push origin main
   ```

2. **Vercel fará deploy automático**:
   - Cada push para `main` dispara novo deploy
   - Deploy leva ~2-3 minutos
   - URL será: `https://seu-projeto.vercel.app`

### 🔍 Verificação

#### Teste 1: API de Contas
```bash
curl https://seu-projeto.vercel.app/api/contas
```
**Resultado esperado**: `[]` (array vazio inicial)

#### Teste 2: Adicionar Conta
```bash
curl -X POST https://seu-projeto.vercel.app/api/contas \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Conta de Luz",
    "valor": 150.00,
    "dataVencimento": "2024-12-15",
    "categoria": "Energia",
    "tipo": "conta"
  }'
```

#### Teste 3: Verificar Conta Salva
```bash
curl https://seu-projeto.vercel.app/api/contas
```
**Resultado esperado**: Array com a conta criada

### 🛠️ Troubleshooting

#### Problema: "MongoDB connection failed"
**Solução**:
1. Verifique se a string de conexão está correta
2. Verifique se o usuário tem permissões de escrita
3. Verifique se o IP está liberado no MongoDB Atlas

#### Problema: "Email not working"
**Solução**:
1. Configure a variável `EMAIL_PASSWORD` no Vercel
2. Use senha de aplicativo do Gmail (não senha normal)
3. Ative autenticação de 2 fatores no Gmail

#### Problema: "Deploy failed"
**Solução**:
1. Verifique os logs no Vercel Dashboard
2. Certifique-se de que `server-web.js` é o arquivo principal
3. Verifique se todas as dependências estão no `package.json`

### 📊 Monitoramento

#### Logs do Vercel
- Acesse: https://vercel.com/dashboard
- Clique no projeto
- Vá em "Functions" para ver logs

#### Métricas
- **Uptime**: 99.9% (Vercel garante)
- **Performance**: CDN global
- **Escalabilidade**: Automática

### 🔒 Segurança

#### Variáveis Sensíveis
- `MONGODB_URI`: String de conexão do MongoDB
- `EMAIL_PASSWORD`: Senha de aplicativo do Gmail
- **Nunca** commite essas variáveis no GitHub

#### CORS
- Configurado para aceitar requisições de qualquer origem
- Para produção, configure domínios específicos

### 🚀 Benefícios do Vercel

✅ **Deploy automático** - Cada push gera novo deploy
✅ **CDN global** - Performance em qualquer lugar
✅ **SSL gratuito** - HTTPS automático
✅ **Escalabilidade** - Suporta milhões de usuários
✅ **Logs detalhados** - Monitoramento completo
✅ **Rollback fácil** - Volte para versão anterior

### 📱 Acesso ao Sistema

**URL de produção**: `https://seu-projeto.vercel.app`

**Funcionalidades disponíveis**:
- ✅ Login e autenticação
- ✅ Adicionar contas e receitas
- ✅ Editar e deletar contas
- ✅ Marcar como paga
- ✅ Notificações por e-mail
- ✅ Exportar/importar CSV
- ✅ Dashboard com gráficos

### 🎯 Próximos Passos

1. **Deploy inicial**: Siga o passo a passo acima
2. **Teste completo**: Use todas as funcionalidades
3. **Configurar domínio**: Adicione domínio personalizado
4. **Monitoramento**: Configure alertas se necessário

---

**Sistema Família Jamar** - Versão Vercel
*Configurado para produção com MongoDB Atlas* 