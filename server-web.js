const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'familia-jamar';
const COLLECTION_NAME = 'contas';

let db = null;
let contas = [];
let nextId = 1;

// Função para conectar ao MongoDB
async function conectarMongoDB() {
    try {
        console.log('🔄 Conectando ao MongoDB...');
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('✅ Conectado ao MongoDB com sucesso');
        
        // Carregar dados iniciais
        await carregarDados();
    } catch (error) {
        console.log('❌ Erro ao conectar ao MongoDB:', error.message);
        console.log('🔍 Stack trace:', error.stack);
        
        // Fallback para arquivo local se MongoDB não estiver disponível
        console.log('🔄 Usando fallback para arquivo local...');
        await carregarDadosFallback();
    }
}

// Função para carregar dados do MongoDB
async function carregarDados() {
    try {
        console.log('🔄 Carregando dados do MongoDB...');
        
        if (!db) {
            console.log('❌ Conexão com MongoDB não disponível');
            return;
        }
        
        const collection = db.collection(COLLECTION_NAME);
        
        // Buscar todas as contas
        const contasDB = await collection.find({}).toArray();
        contas = contasDB;
        
        // Buscar o próximo ID
        const configCollection = db.collection('config');
        const config = await configCollection.findOne({ _id: 'nextId' });
        nextId = config ? config.value : 1;
        
        console.log('✅ Dados carregados do MongoDB:', contas.length, 'contas');
        console.log('🆔 Próximo ID:', nextId);
        
        // Log detalhado das contas
        if (contas.length > 0) {
            console.log('📋 Detalhes das contas:');
            contas.forEach((conta, index) => {
                console.log(`  ${index + 1}. ID: ${conta.id}, Descrição: ${conta.descricao}, Tipo: ${conta.tipo}, Paga: ${conta.paga}`);
            });
        }
        
    } catch (error) {
        console.log('❌ Erro ao carregar dados do MongoDB:', error.message);
        console.log('🔍 Stack trace:', error.stack);
        contas = [];
        nextId = 1;
    }
}

// Função para salvar dados no MongoDB
async function salvarDados() {
    try {
        console.log('💾 Salvando dados no MongoDB...');
        console.log('📊 Total de contas para salvar:', contas.length);
        console.log('🆔 Próximo ID:', nextId);
        
        if (!db) {
            console.log('❌ Conexão com MongoDB não disponível');
            return;
        }
        
        const collection = db.collection(COLLECTION_NAME);
        const configCollection = db.collection('config');
        
        // Limpar coleção e inserir todas as contas
        await collection.deleteMany({});
        if (contas.length > 0) {
            await collection.insertMany(contas);
        }
        
        // Atualizar próximo ID
        await configCollection.updateOne(
            { _id: 'nextId' },
            { $set: { value: nextId } },
            { upsert: true }
        );
        
        console.log('✅ Dados salvos no MongoDB com sucesso');
        console.log('📅 Última atualização:', new Date().toISOString());
        
    } catch (error) {
        console.log('❌ Erro ao salvar dados no MongoDB:', error.message);
        console.log('🔍 Stack trace:', error.stack);
    }
}

// Função fallback para carregar dados de arquivo local
async function carregarDadosFallback() {
    try {
        console.log('🔄 Carregando dados do arquivo local (fallback)...');
        const fs = require('fs-extra');
        const DATA_FILE = path.join(__dirname, 'database', 'contas.json');
        
        // Criar pasta database se não existir
        await fs.ensureDir(path.dirname(DATA_FILE));
        
        // Verificar se o arquivo existe
        if (await fs.pathExists(DATA_FILE)) {
            console.log('📄 Arquivo de dados encontrado, lendo...');
            const dados = await fs.readJson(DATA_FILE);
            contas = dados.contas || [];
            nextId = dados.nextId || 1;
            console.log('✅ Dados carregados do arquivo:', contas.length, 'contas');
        } else {
            console.log('📁 Arquivo de dados não encontrado, iniciando com dados vazios');
            contas = [];
            nextId = 1;
        }
    } catch (error) {
        console.log('❌ Erro ao carregar dados do arquivo:', error.message);
        contas = [];
        nextId = 1;
    }
}

// Conectar ao MongoDB ao iniciar o servidor
conectarMongoDB();

// Configurações de e-mail
const emailConfigs = {
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jamarestudo@gmail.com', // E-mail que ENVIA as notificações
            pass: process.env.EMAIL_PASSWORD || 'mekz ihei gvuz fkgb'
        }
    }
};

// Função para enviar e-mail
async function enviarEmail(destinatario, assunto, conteudo) {
    try {
        console.log('📧 Tentando enviar e-mail para:', destinatario);
        console.log('🔧 Configuração de e-mail:', {
            host: emailConfigs.gmail.host,
            port: emailConfigs.gmail.port,
            user: emailConfigs.gmail.auth.user,
            pass: process.env.EMAIL_PASSWORD ? '***CONFIGURADA***' : '***NÃO CONFIGURADA***'
        });
        
        // Verificar se a senha está configurada
        if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'sua_senha_aqui') {
            console.log('❌ Senha de e-mail não configurada no Vercel');
            console.log('💡 Configure a variável EMAIL_PASSWORD no Vercel Dashboard');
            return false;
        }
        
        const transporter = nodemailer.createTransport(emailConfigs.gmail);
        
        console.log('🔍 Verificando conexão com Gmail...');
        // Verificar conexão
        await transporter.verify();
        console.log('✅ Conexão com Gmail verificada com sucesso');
        
        // Enviar e-mail
        console.log('📤 Enviando e-mail...');
        const result = await transporter.sendMail({
            from: 'jamarestudo@gmail.com',
            to: destinatario,
            subject: assunto,
            html: conteudo
        });
        
        console.log('✅ E-mail enviado com sucesso para:', destinatario);
        console.log('📧 Message ID:', result.messageId);
        return true;
    } catch (error) {
        console.log('❌ Erro ao enviar e-mail:', error.message);
        console.log('🔍 Código do erro:', error.code);
        
        // Logs específicos para debug
        if (error.code === 'EAUTH') {
            console.log('❌ Erro de autenticação - verifique a senha do Gmail');
            console.log('💡 Certifique-se de usar uma senha de aplicativo, não a senha normal');
        } else if (error.code === 'ECONNECTION') {
            console.log('❌ Erro de conexão com o servidor SMTP');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('❌ Timeout na conexão com Gmail');
        } else if (error.code === 'EAUTHENTICATION') {
            console.log('❌ Falha na autenticação - verifique as credenciais');
        }
        
        return false;
    }
}

// Sistema de notificações automáticas
let emailConfigurado = null;
let ultimaNotificacao = {}; // Controlar para não enviar repetidas

// Função para verificar contas vencendo
async function verificarContasVencendo() {
    if (!emailConfigurado) {
        console.log('📧 E-mail não configurado - pulando verificação');
        return;
    }
    
    const hoje = new Date();
    const proximos3Dias = new Date();
    proximos3Dias.setDate(hoje.getDate() + 3);
    
    const contasVencendo = contas.filter(conta => {
        if (conta.paga) return false;
        
        const dataVencimento = new Date(conta.dataVencimento);
        return dataVencimento >= hoje && dataVencimento <= proximos3Dias;
    });
    
    const contasVencidas = contas.filter(conta => {
        if (conta.paga) return false;
        
        const dataVencimento = new Date(conta.dataVencimento);
        return dataVencimento < hoje;
    });
    
    // Verificar se já enviamos notificação hoje
    const hojeStr = hoje.toDateString();
    const ultimaVencendo = ultimaNotificacao.vencendo || '';
    const ultimaVencidas = ultimaNotificacao.vencidas || '';
    
    // Enviar alerta de contas vencendo (máximo 1x por dia)
    if (contasVencendo.length > 0 && ultimaVencendo !== hojeStr) {
        const assunto = '⚠️ Contas Vencendo - Sistema Família Jamar';
        const conteudo = `
            <h2>⚠️ Contas Vencendo nos Próximos 3 Dias</h2>
            <p>Olá! Você tem contas vencendo em breve:</p>
            <br>
            <ul>
                ${contasVencendo.map(conta => `
                    <li><strong>${conta.descricao}</strong> - R$ ${conta.valor} - Vence: ${new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</li>
                `).join('')}
            </ul>
            <br>
            <p>💰 Total: R$ ${contasVencendo.reduce((sum, conta) => sum + parseFloat(conta.valor), 0).toFixed(2)}</p>
            <br>
            <p>📱 Sistema Família Jamar</p>
        `;
        
        await enviarEmail(emailConfigurado, assunto, conteudo);
        ultimaNotificacao.vencendo = hojeStr;
        console.log('📧 Alerta de contas vencendo enviado');
    }
    
    // Enviar alerta de contas vencidas (máximo 1x por dia)
    if (contasVencidas.length > 0 && ultimaVencidas !== hojeStr) {
        const assunto = '🚨 Contas Vencidas - Sistema Família Jamar';
        const conteudo = `
            <h2>🚨 Contas Vencidas</h2>
            <p>Olá! Você tem contas em atraso:</p>
            <br>
            <ul>
                ${contasVencidas.map(conta => `
                    <li><strong>${conta.descricao}</strong> - R$ ${conta.valor} - Venceu: ${new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</li>
                `).join('')}
            </ul>
            <br>
            <p>💰 Total: R$ ${contasVencidas.reduce((sum, conta) => sum + parseFloat(conta.valor), 0).toFixed(2)}</p>
            <br>
            <p>📱 Sistema Família Jamar</p>
        `;
        
        await enviarEmail(emailConfigurado, assunto, conteudo);
        ultimaNotificacao.vencidas = hojeStr;
        console.log('📧 Alerta de contas vencidas enviado');
    }
}

// Verificar contas a cada 6 horas (produção)
setInterval(verificarContasVencendo, 6 * 60 * 60 * 1000);

// Verificar contas a cada 2 horas (para teste mais frequente)
setInterval(verificarContasVencendo, 2 * 60 * 60 * 1000);

// Rotas da API
app.get('/api/contas', (req, res) => {
    console.log('📋 GET /api/contas - Solicitado');
    console.log('📊 Total de contas na memória:', contas.length);
    console.log('🕐 Timestamp da requisição:', new Date().toISOString());
    
    // Log detalhado das contas sendo enviadas
    if (contas.length > 0) {
        console.log('📋 Contas sendo enviadas:');
        contas.forEach((conta, index) => {
            console.log(`  ${index + 1}. ID: ${conta.id}, Descrição: ${conta.descricao}, Tipo: ${conta.tipo}, Paga: ${conta.paga}`);
        });
    }
    
    res.json(contas);
});

app.post('/api/contas', async (req, res) => {
    try {
        console.log('➕ POST /api/contas - Nova conta sendo adicionada');
        console.log('📝 Dados recebidos:', req.body);
        console.log('🆔 Próximo ID a ser usado:', nextId);
        
        const novaConta = {
            id: nextId++,
            descricao: req.body.descricao,
            valor: req.body.valor,
            dataVencimento: req.body.dataVencimento,
            categoria: req.body.categoria || 'Outros',
            tipo: req.body.tipo || 'conta', // 'conta' ou 'receita'
            recorrente: req.body.recorrente || false,
            paga: false,
            dataCriacao: new Date().toISOString()
        };
        
        console.log('📋 Nova conta criada:', novaConta);
        
        contas.push(novaConta);
        console.log('📊 Total de contas após adicionar:', contas.length);
        
        await salvarDados(); // Salvar dados após adicionar
        console.log('✅ Conta salva no arquivo');
        
        res.json(novaConta);
    } catch (error) {
        console.log('❌ Erro ao adicionar conta:', error.message);
        console.log('🔍 Stack trace:', error.stack);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/contas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = contas.findIndex(conta => conta.id === id);
        
        if (index !== -1) {
            contas[index] = { ...contas[index], ...req.body };
            await salvarDados(); // Salvar dados após editar
            res.json(contas[index]);
        } else {
            res.status(404).json({ error: 'Conta não encontrada' });
        }
    } catch (error) {
        console.log('❌ Erro ao editar conta:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/contas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = contas.findIndex(conta => conta.id === id);
        
        if (index !== -1) {
            contas.splice(index, 1);
            await salvarDados(); // Salvar dados após deletar
            res.json({ message: 'Conta deletada com sucesso' });
        } else {
            res.status(404).json({ error: 'Conta não encontrada' });
        }
    } catch (error) {
        console.log('❌ Erro ao deletar conta:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.patch('/api/contas/:id/pagar', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const conta = contas.find(c => c.id === id);
        
        if (conta) {
            conta.paga = true;
            conta.dataPagamento = new Date().toISOString();
            await salvarDados(); // Salvar dados após marcar como paga
            res.json(conta);
        } else {
            res.status(404).json({ error: 'Conta não encontrada' });
        }
    } catch (error) {
        console.log('❌ Erro ao marcar conta como paga:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para enviar e-mail
app.post('/api/enviar-email', async (req, res) => {
    const { destinatario, assunto, conteudo } = req.body;
    
    try {
        const sucesso = await enviarEmail(destinatario, assunto, conteudo);
        if (sucesso) {
            res.json({ message: 'E-mail enviado com sucesso' });
        } else {
            res.status(500).json({ error: 'Erro ao enviar e-mail' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para configurar e-mail
app.post('/api/configurar-email', async (req, res) => {
    console.log('📧 Rota /api/configurar-email chamada');
    console.log('📨 Dados recebidos:', req.body);
    
    const { email } = req.body;
    
    if (!email) {
        console.log('❌ E-mail não fornecido');
        return res.status(400).json({ 
            success: false, 
            error: 'E-mail é obrigatório' 
        });
    }
    
    try {
        console.log('📧 Tentando configurar e-mail para:', email);
        
        // Verificar se a senha está configurada
        if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'sua_senha_aqui') {
            console.log('❌ Senha de e-mail não configurada no Vercel');
            console.log('🔍 EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***CONFIGURADA***' : '***NÃO CONFIGURADA***');
            return res.status(500).json({ 
                success: false, 
                error: 'Senha de e-mail não configurada no servidor. Configure a variável EMAIL_PASSWORD no Vercel.' 
            });
        }
        
        // Enviar e-mail de confirmação
        const assunto = '✅ E-mail Configurado - Sistema Família Jamar';
        const conteudo = `
            <h2>✅ E-mail configurado com sucesso!</h2>
            <p>Olá! Seu e-mail foi configurado no Sistema Família Jamar.</p>
            <p>A partir de agora você receberá notificações sobre suas contas neste e-mail.</p>
            <br>
            <p><strong>E-mail configurado:</strong> ${email}</p>
            <br>
            <p>📱 Sistema Família Jamar</p>
        `;
        
        console.log('📤 Enviando e-mail de confirmação...');
        const sucesso = await enviarEmail(email, assunto, conteudo);
        
        if (sucesso) {
            console.log('✅ E-mail de confirmação enviado com sucesso');
            emailConfigurado = email; // Atualiza a configuração do e-mail
            
            // Enviar relatório completo de todas as contas
            if (contas.length > 0) {
                console.log('📊 Enviando relatório completo de contas...');
                await enviarRelatorioCompleto(email);
            }
            
            res.json({ 
                success: true, 
                message: 'E-mail configurado com sucesso! Verifique sua caixa de entrada para o relatório completo.' 
            });
        } else {
            console.log('❌ Falha ao enviar e-mail de confirmação');
            res.status(500).json({ 
                success: false, 
                error: 'Erro ao enviar e-mail de confirmação. Verifique a configuração do servidor.' 
            });
        }
    } catch (error) {
        console.log('❌ Erro interno na rota configurar-email:', error.message);
        console.log('🔍 Stack trace:', error.stack);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor: ' + error.message 
        });
    }
});

// Função para enviar relatório completo de contas
async function enviarRelatorioCompleto(email) {
    try {
        const hoje = new Date();
        
        // Separar contas por status
        const contasPagas = contas.filter(conta => conta.paga);
        const contasPendentes = contas.filter(conta => 
            !conta.paga && new Date(conta.dataVencimento) >= hoje
        );
        const contasVencidas = contas.filter(conta => 
            !conta.paga && new Date(conta.dataVencimento) < hoje
        );
        
        // Calcular totais
        const totalPendente = contasPendentes.reduce((sum, conta) => 
            sum + parseFloat(conta.valor), 0
        );
        const totalVencido = contasVencidas.reduce((sum, conta) => 
            sum + parseFloat(conta.valor), 0
        );
        const totalPago = contasPagas.reduce((sum, conta) => 
            sum + parseFloat(conta.valor), 0
        );
        
        const assunto = '📊 Relatório Completo - Sistema Família Jamar';
        const conteudo = `
            <h2>📊 Relatório Completo de Contas</h2>
            <p>Olá! Aqui está o relatório completo de todas as suas contas:</p>
            <br>
            
            <h3>📈 Resumo Geral</h3>
            <ul>
                <li><strong>Total de contas:</strong> ${contas.length}</li>
                <li><strong>Contas pagas:</strong> ${contasPagas.length}</li>
                <li><strong>Contas pendentes:</strong> ${contasPendentes.length}</li>
                <li><strong>Contas vencidas:</strong> ${contasVencidas.length}</li>
            </ul>
            <br>
            
            <h3>💰 Valores</h3>
            <ul>
                <li><strong>Total pago:</strong> R$ ${totalPago.toFixed(2)}</li>
                <li><strong>Total pendente:</strong> R$ ${totalPendente.toFixed(2)}</li>
                <li><strong>Total vencido:</strong> R$ ${totalVencido.toFixed(2)}</li>
            </ul>
            <br>
            
            ${contasPendentes.length > 0 ? `
            <h3>⏰ Contas Pendentes</h3>
            <ul>
                ${contasPendentes.map(conta => `
                    <li><strong>${conta.descricao}</strong> - R$ ${conta.valor} - Vence: ${new Date(conta.dataVencimento).toLocaleDateString('pt-BR')} - ${conta.categoria}</li>
                `).join('')}
            </ul>
            <br>
            ` : ''}
            
            ${contasVencidas.length > 0 ? `
            <h3>🚨 Contas Vencidas</h3>
            <ul>
                ${contasVencidas.map(conta => `
                    <li><strong>${conta.descricao}</strong> - R$ ${conta.valor} - Venceu: ${new Date(conta.dataVencimento).toLocaleDateString('pt-BR')} - ${conta.categoria}</li>
                `).join('')}
            </ul>
            <br>
            ` : ''}
            
            ${contasPagas.length > 0 ? `
            <h3>✅ Contas Pagas</h3>
            <ul>
                ${contasPagas.map(conta => `
                    <li><strong>${conta.descricao}</strong> - R$ ${conta.valor} - Paga em: ${conta.dataPagamento ? new Date(conta.dataPagamento).toLocaleDateString('pt-BR') : 'Data não registrada'} - ${conta.categoria}</li>
                `).join('')}
            </ul>
            <br>
            ` : ''}
            
            <p><strong>📅 Data do relatório:</strong> ${hoje.toLocaleDateString('pt-BR')} às ${hoje.toLocaleTimeString('pt-BR')}</p>
            <br>
            <p>📱 Sistema Família Jamar</p>
        `;
        
        await enviarEmail(email, assunto, conteudo);
        console.log('📊 Relatório completo enviado com sucesso');
        
    } catch (error) {
        console.log('❌ Erro ao enviar relatório completo:', error.message);
    }
}

// Rota para estatísticas
app.get('/api/estatisticas', (req, res) => {
    const hoje = new Date();
    const contasVencidas = contas.filter(conta => 
        !conta.paga && new Date(conta.dataVencimento) < hoje
    );
    const contasPendentes = contas.filter(conta => 
        !conta.paga && new Date(conta.dataVencimento) >= hoje
    );
    const contasPagas = contas.filter(conta => conta.paga);
    
    const totalPendente = contasPendentes.reduce((sum, conta) => 
        sum + parseFloat(conta.valor), 0
    );
    const totalVencido = contasVencidas.reduce((sum, conta) => 
        sum + parseFloat(conta.valor), 0
    );
    
    res.json({
        total: contas.length,
        pendentes: contasPendentes.length,
        vencidas: contasVencidas.length,
        pagas: contasPagas.length,
        totalPendente: totalPendente.toFixed(2),
        totalVencido: totalVencido.toFixed(2)
    });
});

// Rota para testar notificações
app.post('/api/testar-notificacoes', async (req, res) => {
    console.log('🧪 Testando notificações...');
    
    if (!emailConfigurado) {
        return res.status(400).json({ 
            success: false, 
            error: 'E-mail não configurado. Configure um e-mail primeiro.' 
        });
    }
    
    try {
        // Criar uma conta de teste
        const contaTeste = {
            id: nextId++,
            descricao: 'Conta de Teste - Luz',
            valor: '150.00',
            dataVencimento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias
            categoria: 'Energia',
            recorrente: false,
            paga: false,
            dataCriacao: new Date().toISOString()
        };
        
        contas.push(contaTeste);
        
        // Executar verificação manual
        await verificarContasVencendo();
        
        res.json({ 
            success: true, 
            message: 'Notificação de teste enviada! Verifique sua caixa de entrada.',
            contaTeste: contaTeste
        });
    } catch (error) {
        console.log('❌ Erro ao testar notificações:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao testar notificações: ' + error.message 
        });
    }
});


// Rota para testar e-mail (simples)
app.post('/api/testar-email', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ 
            success: false, 
            error: 'E-mail é obrigatório' 
        });
    }
    
    try {
        // Verificar se a senha está configurada
        if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'sua_senha_aqui') {
            return res.status(500).json({ 
                success: false, 
                error: 'Senha de e-mail não configurada no servidor. Configure a variável EMAIL_PASSWORD no Vercel.' 
            });
        }
        
        const assunto = '✅ E-mail Configurado - Sistema Família Jamar';
        const conteudo = `
            <h2>✅ E-mail configurado com sucesso!</h2>
            <p>Olá! Seu e-mail foi configurado no Sistema Família Jamar.</p>
            <p>A partir de agora você receberá notificações sobre suas contas neste e-mail.</p>
            <br>
            <p><strong>E-mail configurado:</strong> ${email}</p>
            <br>
            <p>📱 Sistema Família Jamar</p>
        `;
        
        const sucesso = await enviarEmail(email, assunto, conteudo);
        
        if (sucesso) {
            res.json({ 
                success: true, 
                message: 'E-mail de teste enviado com sucesso! Verifique sua caixa de entrada.' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Erro ao enviar e-mail de teste. Verifique a configuração do servidor.' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor: ' + error.message 
        });
    }
});

// Rota principal - redirecionar para o sistema com login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index-wix.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Sistema Família Jamar online!`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});

module.exports = app; 