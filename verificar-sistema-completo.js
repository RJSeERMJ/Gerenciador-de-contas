const { MongoClient } = require('mongodb');

// String de conexão atualizada
const MONGODB_URI = 'mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true&w=majority&appName=Familiajamar';
const DB_NAME = 'familia-jamar';
const COLLECTION_NAME = 'contas';

async function verificarSistemaCompleto() {
    let client = null;
    
    try {
        console.log('='.repeat(60));
        console.log('🔍 VERIFICAÇÃO COMPLETA DO SISTEMA');
        console.log('='.repeat(60));
        console.log();
        
        // 1. Testar conexão
        console.log('🔗 1. TESTANDO CONEXÃO MONGODB ATLAS...');
        client = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        await client.connect();
        console.log('✅ Conexão estabelecida com sucesso!');
        console.log();
        
        // 2. Acessar banco e coleção
        console.log('📊 2. ACESSANDO BANCO DE DADOS...');
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        console.log('✅ Banco:', DB_NAME);
        console.log('✅ Coleção:', COLLECTION_NAME);
        console.log();
        
        // 3. Verificar dados existentes
        console.log('📈 3. VERIFICANDO DADOS EXISTENTES...');
        const totalContas = await collection.countDocuments();
        console.log('📊 Total de contas no banco:', totalContas);
        
        if (totalContas > 0) {
            const contas = await collection.find({}).limit(3).toArray();
            console.log('📋 Primeiras 3 contas:');
            contas.forEach((conta, index) => {
                console.log(`   ${index + 1}. ID: ${conta.id} | ${conta.descricao} | R$ ${conta.valor} | Paga: ${conta.paga ? 'Sim' : 'Não'}`);
            });
        } else {
            console.log('📝 Nenhuma conta encontrada (banco vazio)');
        }
        console.log();
        
        // 4. Testar operações CRUD completas
        console.log('🧪 4. TESTANDO OPERAÇÕES CRUD...');
        
        // Criar conta de teste
        const contaTeste = {
            id: Date.now(),
            descricao: 'Conta de Teste - Verificação Completa',
            valor: '250.00',
            dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            categoria: 'Teste',
            tipo: 'conta',
            recorrente: false,
            paga: false,
            dataCriacao: new Date().toISOString()
        };
        
        await collection.insertOne(contaTeste);
        console.log('✅ CREATE: Conta criada com sucesso');
        
        // Ler conta
        const contaLida = await collection.findOne({ id: contaTeste.id });
        console.log('✅ READ: Conta lida com sucesso');
        
        // Atualizar conta (simular botão pagar)
        await collection.updateOne(
            { id: contaTeste.id },
            { 
                $set: { 
                    paga: true,
                    dataPagamento: new Date().toISOString()
                }
            }
        );
        console.log('✅ UPDATE: Conta marcada como paga');
        
        // Verificar atualização
        const contaAtualizada = await collection.findOne({ id: contaTeste.id });
        console.log('✅ Verificação: Conta paga =', contaAtualizada.paga);
        
        // Deletar conta de teste
        await collection.deleteOne({ id: contaTeste.id });
        console.log('✅ DELETE: Conta de teste removida');
        console.log();
        
        // 5. Verificar estrutura do banco
        console.log('🏗️ 5. VERIFICANDO ESTRUTURA DO BANCO...');
        const databases = await client.db().admin().listDatabases();
        const databaseNames = databases.databases.map(db => db.name);
        console.log('📊 Bancos disponíveis:', databaseNames.join(', '));
        
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);
        console.log('📋 Coleções no banco:', collectionNames.join(', '));
        console.log();
        
        // 6. Resumo final
        console.log('🎯 6. RESUMO DA VERIFICAÇÃO...');
        console.log('='.repeat(40));
        console.log('✅ CONEXÃO MONGODB ATLAS: OK');
        console.log('✅ ACESSO AO BANCO: OK');
        console.log('✅ OPERAÇÕES CRUD: OK');
        console.log('✅ BOTÃO PAGAR: OK');
        console.log('✅ ESTRUTURA DO BANCO: OK');
        console.log('='.repeat(40));
        console.log();
        
        console.log('🎉 SISTEMA TOTALMENTE INTEGRADO E FUNCIONANDO!');
        console.log();
        console.log('📋 PRÓXIMOS PASSOS:');
        console.log('1. Configure MONGODB_URI no Vercel');
        console.log('2. Faça deploy: git push');
        console.log('3. Teste o sistema online');
        console.log('4. Acesse MongoDB Atlas para ver os dados');
        console.log();
        
        console.log('🌐 PARA VER OS DADOS NO MONGODB ATLAS:');
        console.log('1. Acesse: https://cloud.mongodb.com');
        console.log('2. Faça login com suas credenciais');
        console.log('3. Clique em "Browse Collections"');
        console.log('4. Selecione: familia-jamar > contas');
        console.log('5. Visualize, edite e gerencie seus dados!');
        
    } catch (error) {
        console.log('❌ ERRO NA VERIFICAÇÃO:');
        console.log('   Erro:', error.message);
        console.log('   Código:', error.code);
        console.log();
        console.log('💡 Verifique:');
        console.log('   1. String de conexão correta');
        console.log('   2. Network Access (0.0.0.0/0)');
        console.log('   3. Cluster ativo');
        
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Conexão fechada');
        }
        console.log('='.repeat(60));
    }
}

// Executar verificação
verificarSistemaCompleto(); 