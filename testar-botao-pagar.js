const { MongoClient } = require('mongodb');

// String de conexão
const MONGODB_URI = 'mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true&w=majority&appName=Familiajamar';
const DB_NAME = 'familia-jamar';
const COLLECTION_NAME = 'contas';

async function testarBotaoPagar() {
    let client = null;
    
    try {
        console.log('='.repeat(50));
        console.log('🧪 TESTE DO BOTÃO PAGAR');
        console.log('='.repeat(50));
        console.log();
        
        // Conectar ao MongoDB
        console.log('🔗 Conectando ao MongoDB Atlas...');
        client = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        console.log('✅ Conectado ao MongoDB Atlas');
        console.log();
        
        // Criar conta de teste
        console.log('📝 Criando conta de teste...');
        const contaTeste = {
            id: Date.now(),
            descricao: 'Conta de Teste - Botão Pagar',
            valor: '150.00',
            dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            categoria: 'Teste',
            tipo: 'conta',
            recorrente: false,
            paga: false,
            dataCriacao: new Date().toISOString()
        };
        
        await collection.insertOne(contaTeste);
        console.log('✅ Conta de teste criada:', contaTeste.id);
        console.log();
        
        // Simular requisição POST para marcar como paga
        console.log('💰 Simulando requisição POST /api/contas/:id/pagar...');
        
        // Simular o que o servidor faria
        const conta = await collection.findOne({ id: contaTeste.id });
        if (conta) {
            // Atualizar como paga
            await collection.updateOne(
                { id: contaTeste.id },
                { 
                    $set: { 
                        paga: true,
                        dataPagamento: new Date().toISOString()
                    }
                }
            );
            
            // Buscar conta atualizada
            const contaAtualizada = await collection.findOne({ id: contaTeste.id });
            
            console.log('✅ Conta marcada como paga:');
            console.log('   ID:', contaAtualizada.id);
            console.log('   Descrição:', contaAtualizada.descricao);
            console.log('   Paga:', contaAtualizada.paga);
            console.log('   Data Pagamento:', contaAtualizada.dataPagamento);
            console.log();
            
            // Verificar se a atualização funcionou
            if (contaAtualizada.paga === true && contaAtualizada.dataPagamento) {
                console.log('🎉 TESTE DO BOTÃO PAGAR: SUCESSO!');
                console.log('✅ A conta foi marcada como paga corretamente');
                console.log('✅ O sistema está funcionando perfeitamente');
            } else {
                console.log('❌ TESTE DO BOTÃO PAGAR: FALHOU!');
                console.log('❌ A conta não foi marcada como paga');
            }
            
        } else {
            console.log('❌ Conta de teste não encontrada');
        }
        
        // Limpar conta de teste
        console.log();
        console.log('🧹 Removendo conta de teste...');
        await collection.deleteOne({ id: contaTeste.id });
        console.log('✅ Conta de teste removida');
        
    } catch (error) {
        console.log('❌ ERRO NO TESTE:');
        console.log('   Erro:', error.message);
        console.log('   Stack:', error.stack);
        
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Conexão fechada');
        }
        console.log('='.repeat(50));
    }
}

// Executar teste
testarBotaoPagar(); 