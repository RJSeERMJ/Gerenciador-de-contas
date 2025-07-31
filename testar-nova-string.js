const { MongoClient } = require('mongodb');

// Nova string de conexão
const MONGODB_URI = 'mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true&w=majority&appName=Familiajamar';
const DB_NAME = 'familia-jamar';
const COLLECTION_NAME = 'contas';

async function testarNovaString() {
    let client = null;
    
    try {
        console.log('='.repeat(50));
        console.log('🆕 TESTE DA NOVA STRING DE CONEXÃO');
        console.log('='.repeat(50));
        console.log();
        
        console.log('🔗 Testando nova string de conexão...');
        console.log('🌐 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
        console.log();
        
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
        console.log('📈 Total de contas no banco:', totalContas);
        
        // Testar inserção de uma conta de teste
        console.log('🧪 Testando inserção de conta...');
        const contaTeste = {
            id: Date.now(),
            descricao: 'Conta de Teste - Nova String',
            valor: '200.00',
            dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            categoria: 'Teste',
            tipo: 'conta',
            recorrente: false,
            paga: false,
            dataCriacao: new Date().toISOString()
        };
        
        await collection.insertOne(contaTeste);
        console.log('✅ Conta de teste inserida com sucesso!');
        
        // Testar atualização (simular botão pagar)
        console.log('💰 Testando atualização (botão pagar)...');
        await collection.updateOne(
            { id: contaTeste.id },
            { 
                $set: { 
                    paga: true,
                    dataPagamento: new Date().toISOString()
                }
            }
        );
        console.log('✅ Conta marcada como paga com sucesso!');
        
        // Verificar atualização
        const contaAtualizada = await collection.findOne({ id: contaTeste.id });
        console.log('🔍 Conta atualizada:', {
            id: contaAtualizada.id,
            descricao: contaAtualizada.descricao,
            paga: contaAtualizada.paga,
            dataPagamento: contaAtualizada.dataPagamento
        });
        
        // Remover conta de teste
        await collection.deleteOne({ id: contaTeste.id });
        console.log('🗑️ Conta de teste removida');
        
        console.log();
        console.log('🎉 NOVA STRING DE CONEXÃO FUNCIONANDO PERFEITAMENTE!');
        console.log('✅ Conexão estabelecida');
        console.log('✅ Operações de CRUD funcionando');
        console.log('✅ Botão pagar simulado com sucesso');
        console.log('🚀 Sistema pronto para usar!');
        
    } catch (error) {
        console.log('❌ Erro ao testar nova string:');
        console.log('   Erro:', error.message);
        console.log('   Código:', error.code);
        console.log();
        console.log('💡 Verifique:');
        console.log('   1. Se a senha está correta');
        console.log('   2. Se o Network Access permite conexão (0.0.0.0/0)');
        console.log('   3. Se o cluster está ativo');
        
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Conexão fechada');
        }
        console.log('='.repeat(50));
    }
}

// Executar teste
testarNovaString(); 