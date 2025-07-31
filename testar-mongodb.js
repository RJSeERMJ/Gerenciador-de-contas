const { MongoClient } = require('mongodb');

// Configuração MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'familia-jamar';
const COLLECTION_NAME = 'contas';

async function testarConexaoMongoDB() {
    let client = null;
    
    try {
        console.log('🔄 Testando conexão com MongoDB Atlas...');
        console.log('📊 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Oculta credenciais
        
        // Conectar ao MongoDB
        client = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        await client.connect();
        console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
        
        // Testar acesso ao banco
        const db = client.db(DB_NAME);
        console.log('📊 Banco:', DB_NAME);
        
        // Testar acesso à coleção
        const collection = db.collection(COLLECTION_NAME);
        console.log('📋 Coleção:', COLLECTION_NAME);
        
        // Contar documentos
        const totalContas = await collection.countDocuments();
        console.log('📈 Total de contas:', totalContas);
        
        // Listar algumas contas
        if (totalContas > 0) {
            const contas = await collection.find({}).limit(3).toArray();
            console.log('📋 Primeiras contas:');
            contas.forEach((conta, index) => {
                console.log(`  ${index + 1}. ${conta.descricao} - R$ ${conta.valor} - ${conta.paga ? 'Paga' : 'Pendente'}`);
            });
        } else {
            console.log('📝 Nenhuma conta encontrada no banco');
        }
        
        // Testar inserção de uma conta de teste
        console.log('🧪 Testando inserção de conta...');
        const contaTeste = {
            id: Date.now(),
            descricao: 'Conta de Teste - MongoDB',
            valor: '100.00',
            dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            categoria: 'Teste',
            tipo: 'conta',
            recorrente: false,
            paga: false,
            dataCriacao: new Date().toISOString()
        };
        
        await collection.insertOne(contaTeste);
        console.log('✅ Conta de teste inserida com sucesso!');
        
        // Remover conta de teste
        await collection.deleteOne({ id: contaTeste.id });
        console.log('🗑️ Conta de teste removida');
        
        console.log('🎉 Teste de conexão concluído com sucesso!');
        
    } catch (error) {
        console.log('❌ Erro ao conectar ao MongoDB Atlas:');
        console.log('   Erro:', error.message);
        console.log('💡 Verifique:');
        console.log('   1. Se a variável MONGODB_URI está configurada');
        console.log('   2. Se o usuário e senha estão corretos');
        console.log('   3. Se o Network Access permite conexão (0.0.0.0/0)');
        console.log('   4. Se o cluster está ativo');
        
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Conexão fechada');
        }
    }
}

// Executar teste
testarConexaoMongoDB(); 