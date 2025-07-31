@echo off
echo ========================================
echo CONFIGURAR MONGODB ATLAS - FAMILIA JAMAR
echo ========================================
echo.
echo 🗄️ Script para configurar MongoDB Atlas
echo.
echo ========================================
echo PASSO 1: VERIFICAR CONFIGURACAO
echo ========================================
echo.
echo 📋 Verificando arquivos do sistema...
echo.

:: Verificar se existe o diretório database
if exist "database" (
    echo ✅ Diretório database encontrado
) else (
    echo ❌ Diretório database não encontrado
    echo 📁 Criando diretório...
    mkdir database
)

:: Verificar arquivos de backup local
if exist "database\contas.json" (
    echo ✅ Arquivo contas.json encontrado (backup local)
    echo 📊 Tamanho: 
    for %%A in ("database\contas.json") do echo    %%~zA bytes
) else (
    echo ❌ Arquivo contas.json não encontrado (será criado automaticamente)
)

echo.
echo ========================================
echo PASSO 2: INSTALAR DEPENDENCIAS
echo ========================================
echo.
echo 📦 Instalando dependências MongoDB...
npm install mongodb
echo.
echo ✅ Dependências instaladas!
echo.

echo ========================================
echo PASSO 3: CONFIGURAR MONGODB ATLAS
echo ========================================
echo.
echo 📋 Como você já tem conta no MongoDB Atlas:
echo.
echo 1. Acesse: https://cloud.mongodb.com
echo 2. Faça login na sua conta
echo 3. Crie um novo cluster (se não tiver):
echo    - Clique em "Build a Database"
echo    - Escolha "FREE" (M0)
echo    - Escolha região (São Paulo)
echo    - Clique em "Create"
echo.
echo 4. Configure Database Access:
echo    - Clique em "Database Access"
echo    - Clique em "Add New Database User"
echo    - Username: familia-jamar
echo    - Password: (crie uma senha forte)
echo    - Role: Read and write to any database
echo    - Clique em "Add User"
echo.
echo 5. Configure Network Access:
echo    - Clique em "Network Access"
echo    - Clique em "Add IP Address"
echo    - Clique em "Allow Access from Anywhere" (0.0.0.0/0)
echo    - Clique em "Confirm"
echo.
echo 6. Obter String de Conexão:
echo    - Clique em "Connect"
echo    - Escolha "Connect your application"
echo    - Copie a string de conexão
echo    - Substitua ^<password^> pela senha criada
echo    - Substitua ^<dbname^> por familia-jamar
echo.
echo 💡 Exemplo de string de conexão:
echo mongodb+srv://familia-jamar:sua_senha@cluster0.xxxxx.mongodb.net/familia-jamar
echo.

echo ========================================
echo PASSO 4: CONFIGURAR NO VERCEL
echo ========================================
echo.
echo 🔧 Para configurar no Vercel:
echo.
echo 1. Acesse seu projeto no Vercel
echo 2. Vá em "Settings" → "Environment Variables"
echo 3. Adicione nova variável:
echo    - Name: MONGODB_URI
echo    - Value: (cole sua string de conexão)
echo    - Environment: Production, Preview, Development
echo 4. Clique em "Save"
echo.

echo ========================================
echo PASSO 5: TESTAR CONEXAO
echo ========================================
echo.
echo 🧪 Criando script de teste...
echo.

:: Criar script de teste
echo const { MongoClient } = require('mongodb'); > testar-mongodb.js
echo. >> testar-mongodb.js
echo // Configuração MongoDB Atlas >> testar-mongodb.js
echo const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'; >> testar-mongodb.js
echo const DB_NAME = 'familia-jamar'; >> testar-mongodb.js
echo const COLLECTION_NAME = 'contas'; >> testar-mongodb.js
echo. >> testar-mongodb.js
echo async function testarConexaoMongoDB() { >> testar-mongodb.js
echo     let client = null; >> testar-mongodb.js
echo     try { >> testar-mongodb.js
echo         console.log('🔄 Testando conexão com MongoDB Atlas...'); >> testar-mongodb.js
echo         client = new MongoClient(MONGODB_URI, { >> testar-mongodb.js
echo             useNewUrlParser: true, >> testar-mongodb.js
echo             useUnifiedTopology: true, >> testar-mongodb.js
echo         }); >> testar-mongodb.js
echo         await client.connect(); >> testar-mongodb.js
echo         console.log('✅ Conectado ao MongoDB Atlas com sucesso!'); >> testar-mongodb.js
echo         const db = client.db(DB_NAME); >> testar-mongodb.js
echo         const collection = db.collection(COLLECTION_NAME); >> testar-mongodb.js
echo         const totalContas = await collection.countDocuments(); >> testar-mongodb.js
echo         console.log('📈 Total de contas:', totalContas); >> testar-mongodb.js
echo         console.log('🎉 Teste concluído!'); >> testar-mongodb.js
echo     } catch (error) { >> testar-mongodb.js
echo         console.log('❌ Erro:', error.message); >> testar-mongodb.js
echo     } finally { >> testar-mongodb.js
echo         if (client) await client.close(); >> testar-mongodb.js
echo     } >> testar-mongodb.js
echo } >> testar-mongodb.js
echo. >> testar-mongodb.js
echo testarConexaoMongoDB(); >> testar-mongodb.js

echo ✅ Script de teste criado: testar-mongodb.js
echo.

echo ========================================
echo PASSO 6: EXECUTAR TESTES
echo ========================================
echo.
echo 🚀 Para testar a conexão:
echo.
echo 1. Configure a variável MONGODB_URI no Vercel
echo 2. Execute: node testar-mongodb.js
echo 3. Ou execute: npm start (para testar o sistema completo)
echo.

echo ========================================
echo PASSO 7: DEPLOY NO VERCEL
echo ========================================
echo.
echo 📤 Para fazer deploy:
echo.
echo 1. Faça commit das mudanças:
echo    git add .
echo    git commit -m "MongoDB Atlas configurado"
echo    git push
echo.
echo 2. Vercel fará deploy automático
echo 3. Verifique os logs no Vercel Dashboard
echo 4. Teste o sistema online
echo.

echo ========================================
echo LOGS ESPERADOS
echo ========================================
echo.
echo ✅ Logs de sucesso:
echo 🔄 Conectando ao MongoDB Atlas...
echo ✅ Conectado ao MongoDB Atlas com sucesso
echo 📊 Banco: familia-jamar
echo 📋 Coleção: contas
echo ✅ Dados salvos no MongoDB Atlas
echo ✅ Backup salvo no JSON local
echo.
echo ❌ Logs de erro:
echo ❌ Erro ao conectar ao MongoDB Atlas
echo 💡 Usando fallback para JSON local
echo.

echo ========================================
echo SOLUCAO DE PROBLEMAS
echo ========================================
echo.
echo 🔧 Se tiver problemas:
echo.
echo 1. Verifique a string de conexão no Vercel
echo 2. Confirme usuário e senha no MongoDB Atlas
echo 3. Verifique Network Access (0.0.0.0/0)
echo 4. Teste local: node testar-mongodb.js
echo 5. Verifique logs no Vercel Dashboard
echo.

echo ========================================
echo SISTEMA HIBRIDO
echo ========================================
echo.
echo 💡 O sistema funciona de forma híbrida:
echo.
echo ✅ MongoDB Atlas: Banco principal (nuvem)
echo ✅ JSON Local: Backup automático
echo ✅ Fallback: Se MongoDB falhar, usa JSON
echo ✅ Sempre funciona: Nunca perde dados
echo.

echo ========================================
echo CONFIGURACAO CONCLUIDA!
echo ========================================
echo.
echo 🎉 Agora você pode:
echo.
echo 1. Configurar MongoDB Atlas seguindo os passos
echo 2. Adicionar MONGODB_URI no Vercel
echo 3. Fazer deploy: git push
echo 4. Testar o sistema online
echo.
echo 📞 Se precisar de ajuda, consulte:
echo - CONFIGURAR-MONGODB-ATLAS.md
echo - Logs do Vercel Dashboard
echo - Teste local: node testar-mongodb.js
echo.

pause 