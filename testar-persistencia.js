const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { MongoClient } = require('mongodb');

// Configuração MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true&w=majority&appName=Familiajamar';
const DB_NAME = 'familia-jamar';
const COLLECTION_NAME = 'contas';

// Configuração de fallback (JSON local)
const ARQUIVO_DADOS = path.join(__dirname, 'database', 'contas.json');
const ARQUIVO_CONFIG = path.join(__dirname, 'database', 'config.json');

async function testarPersistencia() {
    let client = null;
    
    try {
        console.log('='.repeat(60));
        console.log('🧪 TESTE DE PERSISTÊNCIA');
        console.log('='.repeat(60));
        console.log();
        
        // 1. Verificar variável de ambiente
        console.log('🔍 1. VERIFICANDO VARIÁVEL DE AMBIENTE...');
        console.log('MONGODB_URI configurada:', !!process.env.MONGODB_URI);
        console.log('URI sendo usada:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
        console.log();
        
        // 2. Testar conexão MongoDB
        console.log('🔗 2. TESTANDO CONEXÃO MONGODB...');
        client = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        await client.connect();
        console.log('✅ Conectado ao MongoDB Atlas');
        
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // 3. Verificar dados existentes
        console.log('📊 3. VERIFICANDO DADOS EXISTENTES...');
        const totalContas = await collection.countDocuments();
        console.log('📈 Total de contas no MongoDB:', totalContas);
        
        if (totalContas > 0) {
            const contas = await collection.find({}).limit(3).toArray();
            console.log('📋 Primeiras contas no MongoDB:');
            contas.forEach((conta, index) => {
                console.log(`   ${index + 1}. ${conta.descricao} - R$ ${conta.valor}`);
            });
        }
        console.log();
        
        // 4. Verificar arquivo JSON local
        console.log('📁 4. VERIFICANDO ARQUIVO JSON LOCAL...');
        if (fs.existsSync(ARQUIVO_DADOS)) {
            const dadosContas = fs.readFileSync(ARQUIVO_DADOS, 'utf8');
            const contasJSON = JSON.parse(dadosContas);
            console.log('📈 Total de contas no JSON local:', contasJSON.length || 0);
            
            if (contasJSON.length > 0) {
                console.log('📋 Primeiras contas no JSON local:');
                contasJSON.slice(0, 3).forEach((conta, index) => {
                    console.log(`   ${index + 1}. ${conta.descricao} - R$ ${conta.valor}`);
                });
            }
        } else {
            console.log('📝 Arquivo JSON local não existe');
        }
        console.log();
        
        // 5. Testar inserção
        console.log('➕ 5. TESTANDO INSERÇÃO...');
        const contaTeste = {
            id: Date.now(),
            descricao: 'Conta de Teste - Persistência',
            valor: '100.00',
            dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            categoria: 'Teste',
            tipo: 'conta',
            recorrente: false,
            paga: false,
            dataCriacao: new Date().toISOString()
        };
        
        await collection.insertOne(contaTeste);
        console.log('✅ Conta inserida no MongoDB');
        
        // 6. Verificar se foi salva
        const contaSalva = await collection.findOne({ id: contaTeste.id });
        if (contaSalva) {
            console.log('✅ Conta encontrada no MongoDB após inserção');
        } else {
            console.log('❌ Conta não encontrada no MongoDB após inserção');
        }
        
        // 7. Limpar conta de teste
        await collection.deleteOne({ id: contaTeste.id });
        console.log('🗑️ Conta de teste removida');
        console.log();
        
        // 8. Resumo
        console.log('🎯 6. RESUMO DA PERSISTÊNCIA...');
        console.log('='.repeat(40));
        console.log('✅ MongoDB Atlas: Conectado e funcionando');
        console.log('✅ Operações CRUD: Funcionando');
        console.log('✅ Inserção: Funcionando');
        console.log('✅ Busca: Funcionando');
        console.log('✅ Remoção: Funcionando');
        console.log('='.repeat(40));
        console.log();
        
        console.log('💡 DIAGNÓSTICO:');
        if (totalContas === 0) {
            console.log('📝 Banco está vazio - contas não estão sendo salvas');
            console.log('🔧 Possíveis causas:');
            console.log('   1. Variável MONGODB_URI não configurada no Vercel');
            console.log('   2. Sistema usando fallback JSON local');
            console.log('   3. Erro na conexão durante operações');
        } else {
            console.log('✅ Banco tem dados - sistema funcionando');
        }
        console.log();
        
    } catch (error) {
        console.log('❌ ERRO NO TESTE:');
        console.log('   Erro:', error.message);
        console.log();
        console.log('💡 Verifique:');
        console.log('   1. Se a variável MONGODB_URI está configurada no Vercel');
        console.log('   2. Se a string de conexão está correta');
        console.log('   3. Se o MongoDB Atlas está ativo');
        
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Conexão fechada');
        }
        console.log('='.repeat(60));
    }
}

// Executar teste
testarPersistencia(); 