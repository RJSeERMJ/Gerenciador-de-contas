const { MongoClient } = require('mongodb');

// String de conexão completa
const MONGODB_URI = 'mongodb+srv://jamarestudo:Vx1Di4kf45522JIG@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true&w=majority&appName=Familiajamar';
const DB_NAME = 'familia-jamar';
const COLLECTION_NAME = 'contas';

async function testarStringCompleta() {
    let client = null;
    
    try {
        console.log('🔄 Testando string de conexão completa...');
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
        
        // Testar inserção de uma conta de teste
        console.log('🧪 Testando inserção de conta...');
        const contaTeste = {
            id: Date.now(),
            descricao: 'Conta de Teste - String Completa',
            valor: '150.00',
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
        
        console.log('🎉 String de conexão funcionando perfeitamente!');
        console.log('🚀 Você pode configurar no Vercel agora!');
        
    } catch (error) {
        console.log('❌ Erro ao conectar com a string completa:');
        console.log('   Erro:', error.message);
        console.log('💡 Verifique:');
        console.log('   1. Se a senha está correta');
        console.log('   2. Se o Network Access permite conexão (0.0.0.0/0)');
        console.log('   3. Se o cluster está ativo');
        
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Conexão fechada');
        }
    }
}

// Executar teste
testarStringCompleta(); 