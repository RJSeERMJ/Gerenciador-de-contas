const { MongoClient } = require('mongodb');

// String de conexão
const MONGODB_URI = 'mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true&w=majority&appName=Familiajamar';
const DB_NAME = 'familia-jamar';
const COLLECTION_NAME = 'contas';

async function mostrarProcessoConexao() {
    let client = null;
    
    try {
        console.log('='.repeat(50));
        console.log('🔗 PROCESSO DE CONEXÃO MONGODB ATLAS');
        console.log('='.repeat(50));
        console.log();
        
        // Passo 1: Criar cliente
        console.log('📋 PASSO 1: Criando cliente MongoDB...');
        client = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Cliente criado com sucesso');
        console.log();
        
        // Passo 2: Tentar conectar
        console.log('📋 PASSO 2: Tentando conectar ao cluster...');
        console.log('🌐 Endereço:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
        console.log('⏳ Aguardando resposta do servidor...');
        
        await client.connect();
        console.log('✅ Conexão estabelecida com sucesso!');
        console.log();
        
        // Passo 3: Acessar banco
        console.log('📋 PASSO 3: Acessando banco de dados...');
        const db = client.db(DB_NAME);
        console.log('📊 Banco:', DB_NAME);
        console.log('✅ Banco acessado com sucesso');
        console.log();
        
        // Passo 4: Acessar coleção
        console.log('📋 PASSO 4: Acessando coleção...');
        const collection = db.collection(COLLECTION_NAME);
        console.log('📋 Coleção:', COLLECTION_NAME);
        console.log('✅ Coleção acessada com sucesso');
        console.log();
        
        // Passo 5: Verificar dados existentes
        console.log('📋 PASSO 5: Verificando dados existentes...');
        const totalContas = await collection.countDocuments();
        console.log('📈 Total de contas no banco:', totalContas);
        console.log();
        
        // Passo 6: Testar operações
        console.log('📋 PASSO 6: Testando operações...');
        
        // Inserir conta de teste
        console.log('➕ Inserindo conta de teste...');
        const contaTeste = {
            id: Date.now(),
            descricao: 'Conta de Teste - Conexão',
            valor: '200.00',
            dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            categoria: 'Teste',
            tipo: 'conta',
            recorrente: false,
            paga: false,
            dataCriacao: new Date().toISOString()
        };
        
        await collection.insertOne(contaTeste);
        console.log('✅ Conta inserida com sucesso');
        
        // Verificar se foi inserida
        const novaConta = await collection.findOne({ id: contaTeste.id });
        console.log('🔍 Conta encontrada:', novaConta ? 'Sim' : 'Não');
        
        // Remover conta de teste
        console.log('🗑️ Removendo conta de teste...');
        await collection.deleteOne({ id: contaTeste.id });
        console.log('✅ Conta removida com sucesso');
        console.log();
        
        // Passo 7: Resumo final
        console.log('📋 PASSO 7: Resumo da conexão...');
        console.log('🎉 CONEXÃO MONGODB ATLAS FUNCIONANDO PERFEITAMENTE!');
        console.log();
        console.log('✅ O que foi testado:');
        console.log('   - Conexão com o cluster');
        console.log('   - Acesso ao banco de dados');
        console.log('   - Acesso à coleção');
        console.log('   - Inserção de dados');
        console.log('   - Consulta de dados');
        console.log('   - Remoção de dados');
        console.log();
        console.log('🚀 Sistema pronto para usar no Vercel!');
        
    } catch (error) {
        console.log('❌ ERRO NA CONEXÃO:');
        console.log('   Tipo de erro:', error.name);
        console.log('   Mensagem:', error.message);
        console.log('   Código:', error.code);
        console.log();
        
        console.log('💡 Possíveis causas:');
        if (error.message.includes('Authentication failed')) {
            console.log('   - Senha ou usuário incorretos');
            console.log('   - Verifique Database Access no MongoDB Atlas');
        } else if (error.message.includes('Network timeout')) {
            console.log('   - Network Access não permite conexão');
            console.log('   - Configure "Allow Access from Anywhere" (0.0.0.0/0)');
        } else if (error.message.includes('Cluster not found')) {
            console.log('   - Cluster inativo ou endereço incorreto');
            console.log('   - Verifique se o cluster está ativo');
        } else {
            console.log('   - Erro desconhecido, verifique a configuração');
        }
        
        console.log();
        console.log('🔄 O sistema usará JSON local como fallback');
        
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Conexão fechada');
        }
        console.log('='.repeat(50));
    }
}

// Executar demonstração
mostrarProcessoConexao(); 