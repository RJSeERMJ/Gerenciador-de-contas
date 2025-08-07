const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jamarestudo:A91L9XOUYiCaHetq@familiajamar.wu9knb3.mongodb.net/familia-jamar?retryWrites=true&w=majority&appName=Familiajamar';
const DB_NAME = 'familia-jamar';
const COLLECTION_NAME = 'contas';

// Configuração de fallback (JSON local)
const ARQUIVO_DADOS = path.join(__dirname, 'database', 'contas.json');
const ARQUIVO_CONFIG = path.join(__dirname, 'database', 'config.json');

let contas = [];
let nextId = 1;
let db = null;
let client = null;

// Função para conectar ao MongoDB Atlas
async function conectarMongoDB() {
    try {
        console.log('🔄 Conectando ao MongoDB Atlas...');
        
        client = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        await client.connect();
        db = client.db(DB_NAME);
        
        console.log('✅ Conectado ao MongoDB Atlas com sucesso');
        console.log('📊 Banco:', DB_NAME);
        console.log('📋 Coleção:', COLLECTION_NAME);
        
        return true;
    } catch (error) {
        console.log('❌ Erro ao conectar ao MongoDB Atlas:', error.message);
        console.log('💡 Usando fallback para JSON local...');
        return false;
    }
}

// Função para carregar dados (MongoDB + fallback JSON)
async function carregarDados() {
    try {
        console.log('🔄 Carregando dados...');
        
        // Tentar carregar do MongoDB Atlas
        if (db) {
            try {
                const collection = db.collection(COLLECTION_NAME);
                const contasMongo = await collection.find({}).toArray();
                
                if (contasMongo.length > 0) {
                    contas = contasMongo;
                    nextId = Math.max(...contas.map(c => c.id), 0) + 1;
                    console.log('✅ Contas carregadas do MongoDB Atlas:', contas.length);
                    console.log('🆔 Próximo ID:', nextId);
                    
                    // Salvar backup no JSON local
                    salvarDadosLocais();
                    return;
                }
            } catch (error) {
                console.log('❌ Erro ao carregar do MongoDB:', error.message);
            }
        }
        
        // Fallback: carregar do JSON local
        carregarDadosLocais();
        
    } catch (error) {
        console.log('❌ Erro ao carregar dados:', error.message);
        contas = [];
        nextId = 1;
    }
}

// Função para carregar dados do JSON local
function carregarDadosLocais() {
    try {
        console.log('📁 Carregando dados do JSON local...');
        
        // Criar diretório se não existir
        const dir = path.dirname(ARQUIVO_DADOS);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Carregar contas
        if (fs.existsSync(ARQUIVO_DADOS)) {
            const dadosContas = fs.readFileSync(ARQUIVO_DADOS, 'utf8');
            contas = JSON.parse(dadosContas);
            console.log('✅ Contas carregadas do JSON local:', contas.length);
        } else {
            contas = [];
            console.log('📝 Arquivo de contas não encontrado, inicializando vazio');
        }
        
        // Carregar configuração
        if (fs.existsSync(ARQUIVO_CONFIG)) {
            const dadosConfig = fs.readFileSync(ARQUIVO_CONFIG, 'utf8');
            const config = JSON.parse(dadosConfig);
            nextId = config.nextId || 1;
            emailConfigurado = config.emailConfigurado || 'jamarestudante@gmail.com'; // E-mail padrão
            console.log('✅ Configuração carregada do JSON local');
            if (emailConfigurado) {
                console.log('📧 E-mail configurado:', emailConfigurado);
            }
        } else {
            nextId = 1;
            emailConfigurado = 'jamarestudante@gmail.com'; // E-mail padrão fixo
            console.log('📝 Arquivo de configuração não encontrado, inicializando com e-mail padrão');
        }
        
        console.log('🆔 Próximo ID:', nextId);
        
    } catch (error) {
        console.log('❌ Erro ao carregar dados locais:', error.message);
        contas = [];
        nextId = 1;
        emailConfigurado = null;
    }
}

// Função para salvar dados (MongoDB + backup JSON)
async function salvarDados() {
    try {
        console.log('💾 Salvando dados...');
        console.log('📊 Total de contas para salvar:', contas.length);
        console.log('🆔 Próximo ID:', nextId);
        console.log('🌐 Ambiente:', process.env.NODE_ENV || 'development');
        
        // Tentar salvar no MongoDB Atlas
        if (db) {
            try {
                console.log('🗄️ Conectando ao MongoDB Atlas...');
                const collection = db.collection(COLLECTION_NAME);
                
                // Verificar se a conexão ainda está ativa (com timeout)
                const pingPromise = db.admin().ping();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                );
                
                await Promise.race([pingPromise, timeoutPromise]);
                console.log('✅ Conexão com MongoDB ativa');
                
                // Limpar coleção e inserir todas as contas (com timeout)
                console.log('🧹 Limpando coleção...');
                const deletePromise = collection.deleteMany({});
                const deleteTimeout = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Delete timeout')), 10000)
                );
                const deleteResult = await Promise.race([deletePromise, deleteTimeout]);
                console.log('🗑️ Documentos removidos:', deleteResult.deletedCount);
                
                if (contas.length > 0) {
                    console.log('📝 Inserindo contas no MongoDB...');
                    const insertPromise = collection.insertMany(contas);
                    const insertTimeout = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Insert timeout')), 15000)
                    );
                    const insertResult = await Promise.race([insertPromise, insertTimeout]);
                    console.log('✅ Contas inseridas:', insertResult.insertedCount);
                } else {
                    console.log('📝 Nenhuma conta para inserir');
                }
                
                console.log('✅ Dados salvos no MongoDB Atlas com sucesso');
            } catch (error) {
                console.log('❌ Erro ao salvar no MongoDB:', error.message);
                console.log('🔍 Stack trace:', error.stack);
                
                // Tentar reconectar se houver erro de conexão
                if (error.message.includes('connection') || error.message.includes('timeout')) {
                    console.log('🔄 Tentando reconectar ao MongoDB...');
                    try {
                        const reconnectPromise = client.connect();
                        const reconnectTimeout = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Reconnect timeout')), 5000)
                        );
                        await Promise.race([reconnectPromise, reconnectTimeout]);
                        console.log('✅ Reconectado ao MongoDB');
                    } catch (reconnectError) {
                        console.log('❌ Erro ao reconectar:', reconnectError.message);
                    }
                }
            }
        } else {
            console.log('⚠️ MongoDB não disponível, salvando apenas localmente');
        }
        
        // Sempre salvar backup no JSON local
        salvarDadosLocais();
        
    } catch (error) {
        console.log('❌ Erro ao salvar dados:', error.message);
        console.log('🔍 Stack trace:', error.stack);
    }
}

// Função para salvar dados no JSON local
function salvarDadosLocais() {
    try {
        // Criar diretório se não existir
        const dir = path.dirname(ARQUIVO_DADOS);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Salvar contas
        fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(contas, null, 2));
        
        // Salvar configuração
        const config = { 
            nextId, 
            emailConfigurado,
            ultimaAtualizacao: new Date().toISOString() 
        };
        fs.writeFileSync(ARQUIVO_CONFIG, JSON.stringify(config, null, 2));
        
        console.log('✅ Backup salvo no JSON local');
        console.log('📁 Arquivo:', ARQUIVO_DADOS);
        
    } catch (error) {
        console.log('❌ Erro ao salvar dados locais:', error.message);
    }
}

// Configurações de e-mail
const emailConfigs = {
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jamarestudo@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'mekz ihei gvuz fkgb'
        }
    }
};

// Template HTML para e-mails
const emailTemplates = {
    header: `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; text-align: center; font-family: Arial, sans-serif;">
                📱 Sistema Família Jamar
            </h1>
        </div>
    `,
    footer: `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-top: 20px; text-align: center; color: #6c757d; font-family: Arial, sans-serif;">
            <p style="margin: 0;">📧 Notificação automática do Sistema Família Jamar</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Enviado em: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
    `,
    button: (text, color = '#007bff') => `
        <a href="#" style="background-color: ${color}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; font-family: Arial, sans-serif;">
            ${text}
        </a>
    `
};

// Função para criar template HTML completo
function criarTemplateEmail(titulo, conteudo) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${titulo}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            ${emailTemplates.header}
            
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                ${conteudo}
            </div>
            
            ${emailTemplates.footer}
        </body>
        </html>
    `;
}

// Função para enviar e-mail com template
async function enviarEmail(destinatario, assunto, conteudo) {
    try {
        console.log('📧 Tentando enviar e-mail para:', destinatario);
        console.log('📝 Assunto:', assunto);
        
        if (!process.env.EMAIL_PASSWORD) {
            console.log('❌ Senha de e-mail não configurada');
            return false;
        }
        
        const transporter = nodemailer.createTransport(emailConfigs.gmail);
        
        // Verificar conexão
        await transporter.verify();
        console.log('✅ Conexão SMTP verificada');
        
        // Criar template HTML
        const htmlContent = criarTemplateEmail(assunto, conteudo);
        
        const result = await transporter.sendMail({
            from: '"Sistema Família Jamar" <jamarestudo@gmail.com>',
            to: destinatario,
            subject: assunto,
            html: htmlContent,
            text: conteudo.replace(/<[^>]*>/g, '') // Versão texto simples
        });
        
        console.log('✅ E-mail enviado com sucesso');
        console.log('📨 Message ID:', result.messageId);
        return true;
    } catch (error) {
        console.log('❌ Erro ao enviar e-mail:', error.message);
        console.log('🔍 Detalhes do erro:', error);
        return false;
    }
}

// Função para enviar e-mail para múltiplos destinatários
async function enviarEmailMultiplos(destinatarios, assunto, conteudo) {
    try {
        console.log('📧 Enviando e-mail para múltiplos destinatários:', destinatarios);
        
        const resultados = [];
        for (const destinatario of destinatarios) {
            const sucesso = await enviarEmail(destinatario, assunto, conteudo);
            resultados.push({ destinatario, sucesso });
        }
        
        const sucessos = resultados.filter(r => r.sucesso).length;
        console.log(`✅ ${sucessos}/${destinatarios.length} e-mails enviados com sucesso`);
        
        return resultados;
    } catch (error) {
        console.log('❌ Erro ao enviar e-mails múltiplos:', error.message);
        return [];
    }
}

// Sistema de notificações
let emailConfigurado = null;
let ultimaNotificacao = {};

async function verificarContasVencendo() {
    // Usar e-mail padrão se não estiver configurado
    const emailDestino = emailConfigurado || 'jamarestudante@gmail.com';
    
    if (!emailDestino) {
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
    
    // Verificar se já enviamos notificação hoje (para teste: a cada 5 minutos)
    const agora = new Date();
    const agoraStr = agora.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
    const ultimaVencendo = ultimaNotificacao.vencendo || '';
    const ultimaVencidas = ultimaNotificacao.vencidas || '';
    
    // Enviar alerta de contas vencendo (para teste: a cada 5 minutos)
    if (contasVencendo.length > 0 && ultimaVencendo !== agoraStr) {
        const assunto = '⚠️ Contas Vencendo - Sistema Família Jamar';
        const conteudo = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #ff6b35; margin-bottom: 10px;">⚠️ Contas Vencendo nos Próximos 3 Dias</h2>
                <p style="color: #666; font-size: 16px;">Olá! Você tem contas vencendo em breve:</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${contasVencendo.map(conta => `
                        <li style="padding: 10px; margin: 5px 0; background: white; border-radius: 5px; border-left: 4px solid #ff6b35;">
                            <strong style="color: #333;">${conta.descricao}</strong><br>
                            <span style="color: #666;">R$ ${conta.valor}</span> - 
                            <span style="color: #ff6b35; font-weight: bold;">Vence: ${new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <div style="background: #ff6b35; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                    <strong>💰 Total: R$ ${contasVencendo.reduce((sum, conta) => sum + parseFloat(conta.valor), 0).toFixed(2)}</strong>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                ${emailTemplates.button('Ver Todas as Contas', '#ff6b35')}
            </div>
        `;
        
        await enviarEmail(emailDestino, assunto, conteudo);
        ultimaNotificacao.vencendo = agoraStr;
        console.log('📧 Alerta de contas vencendo enviado para:', emailDestino);
    }
    
    // Enviar alerta de contas vencidas (para teste: a cada 5 minutos)
    if (contasVencidas.length > 0 && ultimaVencidas !== agoraStr) {
        const assunto = '🚨 Contas Vencidas - Sistema Família Jamar';
        const conteudo = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #dc3545; margin-bottom: 10px;">🚨 Contas Vencidas</h2>
                <p style="color: #666; font-size: 16px;">Olá! Você tem contas em atraso:</p>
            </div>
            
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${contasVencidas.map(conta => `
                        <li style="padding: 10px; margin: 5px 0; background: white; border-radius: 5px; border-left: 4px solid #dc3545;">
                            <strong style="color: #333;">${conta.descricao}</strong><br>
                            <span style="color: #666;">R$ ${conta.valor}</span> - 
                            <span style="color: #dc3545; font-weight: bold;">Venceu: ${new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <div style="background: #dc3545; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                    <strong>💰 Total: R$ ${contasVencidas.reduce((sum, conta) => sum + parseFloat(conta.valor), 0).toFixed(2)}</strong>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                ${emailTemplates.button('Ver Todas as Contas', '#dc3545')}
            </div>
        `;
        
        await enviarEmail(emailDestino, assunto, conteudo);
        ultimaNotificacao.vencidas = agoraStr;
        console.log('📧 Alerta de contas vencidas enviado para:', emailDestino);
    }
    
    // Enviar notificação de teste a cada 5 minutos
    const ultimaTeste = ultimaNotificacao.teste || '';
    if (ultimaTeste !== agoraStr) {
        const assunto = '🧪 Teste - Sistema Família Jamar (5min)';
        const conteudo = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #6c757d; margin-bottom: 10px;">🧪 Teste de Notificação - 5 Minutos</h2>
                <p style="color: #666; font-size: 16px;">Olá! Esta é uma notificação de teste do Sistema Família Jamar.</p>
                <p style="color: #666; font-size: 14px;">Esta notificação é enviada a cada 5 minutos para verificar se o sistema está funcionando.</p>
            </div>
            
            <div style="background: #e9ecef; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: center;">
                    <div style="background: white; padding: 10px; border-radius: 5px;">
                        <strong style="color: #333;">Total de contas</strong><br>
                        <span style="color: #007bff; font-size: 18px;">${contas.length}</span>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 5px;">
                        <strong style="color: #333;">Contas vencendo</strong><br>
                        <span style="color: #ff6b35; font-size: 18px;">${contasVencendo.length}</span>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 5px;">
                        <strong style="color: #333;">Contas vencidas</strong><br>
                        <span style="color: #dc3545; font-size: 18px;">${contasVencidas.length}</span>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 5px;">
                        <strong style="color: #333;">Data/Hora</strong><br>
                        <span style="color: #6c757d; font-size: 12px;">${agora.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            </div>
        `;
        
        await enviarEmail(emailConfigurado, assunto, conteudo);
        ultimaNotificacao.teste = agoraStr;
        console.log('🧪 Notificação de teste enviada');
    }
}

if (process.env.NODE_ENV !== 'production') {
    setInterval(verificarContasVencendo, 6 * 60 * 60 * 1000); // 6 horas
    console.log('🔄 Verificação automática ativada (modo local)');
} else {
    console.log('📧 Modo produção: usar POST /api/verificar-notificacoes para verificação manual');
}

// Rotas da API
app.get('/api/contas', (req, res) => {
    console.log('📋 GET /api/contas - Solicitado');
    console.log('📊 Total de contas na memória:', contas.length);
    res.json(contas);
});

app.post('/api/contas', async (req, res) => {
    try {
        console.log('➕ POST /api/contas - Nova conta sendo adicionada');
        console.log('📝 Dados recebidos:', req.body);
        
        const novaConta = {
            id: nextId++,
            descricao: req.body.descricao,
            valor: req.body.valor,
            dataVencimento: req.body.dataVencimento,
            categoria: req.body.categoria || 'Outros',
            tipo: req.body.tipo || 'conta',
            recorrente: req.body.recorrente || false,
            paga: false,
            dataCriacao: new Date().toISOString()
        };
        
        contas.push(novaConta);
        await salvarDados();
        
        // Notificar clientes SSE sobre a nova conta
        notificarClientesSSE({
            type: 'data_update',
            message: 'Nova conta adicionada',
            timestamp: new Date().toISOString()
        });
        
        res.json(novaConta);
    } catch (error) {
        console.log('❌ Erro ao adicionar conta:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/contas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = contas.findIndex(conta => conta.id === id);
        
        if (index !== -1) {
            contas[index] = { ...contas[index], ...req.body };
            await salvarDados();
            
            // Notificar clientes SSE sobre a atualização
            notificarClientesSSE({
                type: 'data_update',
                message: 'Conta atualizada',
                timestamp: new Date().toISOString()
            });
            
            res.json(contas[index]);
        } else {
            res.status(404).json({ error: 'Conta não encontrada' });
        }
    } catch (error) {
        console.log('❌ Erro ao atualizar conta:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/contas/:id', async (req, res) => {
    try {
        console.log('🗑️ DELETE /api/contas/:id - Deletando conta');
        console.log('🌐 Ambiente:', process.env.NODE_ENV || 'development');
        const id = parseInt(req.params.id);
        console.log('🆔 ID da conta a ser deletada:', id);
        console.log('📊 Total de contas antes da exclusão:', contas.length);
        
        const index = contas.findIndex(conta => conta.id === id);
        console.log('🔍 Índice da conta encontrada:', index);
        
        if (index !== -1) {
            const contaDeletada = contas[index];
            console.log('📋 Conta que será deletada:', {
                id: contaDeletada.id,
                descricao: contaDeletada.descricao,
                valor: contaDeletada.valor
            });
            
            // Remover da lista
            contas.splice(index, 1);
            console.log('✅ Conta removida da lista local');
            console.log('📊 Total de contas após remoção:', contas.length);
            
            // Salvar no banco de dados com timeout
            console.log('💾 Salvando alterações no banco de dados...');
            const savePromise = salvarDados();
            const saveTimeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Save timeout')), 20000)
            );
            
            await Promise.race([savePromise, saveTimeout]);
            console.log('✅ Alterações salvas com sucesso');
            
            // Notificar clientes SSE sobre a exclusão
            notificarClientesSSE({
                type: 'data_update',
                message: 'Conta deletada',
                timestamp: new Date().toISOString()
            });
            
            res.json({ 
                success: true, 
                message: 'Conta deletada com sucesso',
                contaDeletada: {
                    id: contaDeletada.id,
                    descricao: contaDeletada.descricao
                },
                ambiente: process.env.NODE_ENV || 'development'
            });
        } else {
            console.log('❌ Conta não encontrada com ID:', id);
            res.status(404).json({ error: 'Conta não encontrada' });
        }
    } catch (error) {
        console.log('❌ Erro ao deletar conta:', error.message);
        console.log('🔍 Stack trace:', error.stack);
        
        // Retornar erro mais específico
        if (error.message.includes('timeout')) {
            res.status(408).json({ 
                error: 'Timeout ao salvar no banco de dados',
                message: 'A operação demorou muito para completar. Tente novamente.'
            });
        } else {
            res.status(500).json({ 
                error: 'Erro interno do servidor',
                message: error.message
            });
        }
    }
});

app.post('/api/contas/:id/pagar', async (req, res) => {
    try {
        console.log('💰 POST /api/contas/:id/pagar - Marcando conta como paga');
        const id = parseInt(req.params.id);
        
        const conta = contas.find(c => c.id === id);
        if (conta) {
            conta.paga = true;
            conta.dataPagamento = new Date().toISOString();
            await salvarDados();
            
            // Notificar clientes SSE sobre o pagamento
            notificarClientesSSE({
                type: 'data_update',
                message: 'Conta marcada como paga',
                timestamp: new Date().toISOString()
            });
            
            console.log('✅ Conta marcada como paga:', {
                id: conta.id,
                descricao: conta.descricao,
                paga: conta.paga,
                dataPagamento: conta.dataPagamento
            });
            
            res.json(conta); // Retorna a conta atualizada
        } else {
            console.log('❌ Conta não encontrada com ID:', id);
            res.status(404).json({ error: 'Conta não encontrada' });
        }
    } catch (error) {
        console.log('❌ Erro ao marcar conta como paga:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para estatísticas
app.get('/api/estatisticas', (req, res) => {
    try {
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
    } catch (error) {
        console.log('❌ Erro ao buscar estatísticas:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para configurar e-mail
app.post('/api/configurar-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                error: 'E-mail é obrigatório' 
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
            emailConfigurado = email;
            
            // Salvar configuração no servidor
            await salvarDados();
            
            // Enviar relatório completo se houver contas
            if (contas.length > 0) {
                await enviarRelatorioCompleto(email);
            }
            
            res.json({ 
                success: true, 
                message: 'E-mail configurado com sucesso!' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Erro ao enviar e-mail de confirmação.' 
            });
        }
    } catch (error) {
        console.log('❌ Erro ao configurar e-mail:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

// Rota para verificar status do e-mail
app.get('/api/email-status', (req, res) => {
    try {
        res.json({
            emailConfigurado: !!emailConfigurado,
            email: emailConfigurado,
            totalContas: contas.length,
            contasVencidas: contas.filter(conta => 
                !conta.paga && new Date(conta.dataVencimento) < new Date()
            ).length,
            contasVencendo: contas.filter(conta => {
                if (conta.paga) return false;
                const hoje = new Date();
                const proximos3Dias = new Date();
                proximos3Dias.setDate(hoje.getDate() + 3);
                const dataVencimento = new Date(conta.dataVencimento);
                return dataVencimento >= hoje && dataVencimento <= proximos3Dias;
            }).length
        });
    } catch (error) {
        console.log('❌ Erro ao verificar status do e-mail:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para verificar status do banco de dados
app.get('/api/db-status', async (req, res) => {
    try {
        let mongoStatus = 'disconnected';
        let mongoCount = 0;
        
        if (db) {
            try {
                // Verificar conexão
                await db.admin().ping();
                mongoStatus = 'connected';
                
                // Contar documentos
                const collection = db.collection(COLLECTION_NAME);
                mongoCount = await collection.countDocuments();
            } catch (error) {
                mongoStatus = 'error';
                console.log('❌ Erro ao verificar MongoDB:', error.message);
            }
        }
        
        res.json({
            ambiente: process.env.NODE_ENV || 'development',
            mongoStatus,
            mongoCount,
            localCount: contas.length,
            nextId,
            emailConfigurado: !!emailConfigurado
        });
    } catch (error) {
        console.log('❌ Erro ao verificar status do banco:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para testar envio de e-mail
app.post('/api/testar-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                error: 'E-mail é obrigatório' 
            });
        }
        
        const assunto = '🧪 Teste de E-mail - Sistema Família Jamar';
        const conteudo = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #007bff; margin-bottom: 10px;">🧪 Teste de E-mail</h2>
                <p style="color: #666; font-size: 16px;">Olá! Este é um e-mail de teste do Sistema Família Jamar.</p>
                <p style="color: #666; font-size: 14px;">Se você recebeu este e-mail, significa que as notificações estão funcionando corretamente!</p>
            </div>
            
            <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <div style="text-align: center;">
                    <p style="margin: 5px 0;"><strong>E-mail de teste:</strong> ${email}</p>
                    <p style="margin: 5px 0;"><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745;">✅ Funcionando</span></p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                ${emailTemplates.button('Acessar Sistema', '#007bff')}
            </div>
        `;
        
        const sucesso = await enviarEmail(email, assunto, conteudo);
        
        if (sucesso) {
            res.json({ 
                success: true, 
                message: 'E-mail de teste enviado com sucesso!' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Erro ao enviar e-mail de teste.' 
            });
        }
    } catch (error) {
        console.log('❌ Erro ao testar e-mail:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

// Rota para enviar e-mail personalizado
app.post('/api/enviar-email-personalizado', async (req, res) => {
    try {
        const { email, assunto, mensagem } = req.body;
        
        if (!email || !assunto || !mensagem) {
            return res.status(400).json({ 
                success: false, 
                error: 'E-mail, assunto e mensagem são obrigatórios' 
            });
        }
        
        const conteudo = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #007bff; margin-bottom: 10px;">📧 Mensagem Personalizada</h2>
                <p style="color: #666; font-size: 16px;">${mensagem}</p>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Enviado para:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            </div>
        `;
        
        const sucesso = await enviarEmail(email, assunto, conteudo);
        
        if (sucesso) {
            res.json({ 
                success: true, 
                message: 'E-mail personalizado enviado com sucesso!' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Erro ao enviar e-mail personalizado.' 
            });
        }
    } catch (error) {
        console.log('❌ Erro ao enviar e-mail personalizado:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

// Rota para enviar e-mail para múltiplos destinatários
app.post('/api/enviar-email-multiplos', async (req, res) => {
    try {
        const { emails, assunto, mensagem } = req.body;
        
        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Lista de e-mails é obrigatória' 
            });
        }
        
        if (!assunto || !mensagem) {
            return res.status(400).json({ 
                success: false, 
                error: 'Assunto e mensagem são obrigatórios' 
            });
        }
        
        const conteudo = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #007bff; margin-bottom: 10px;">📧 Mensagem em Massa</h2>
                <p style="color: #666; font-size: 16px;">${mensagem}</p>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Enviado para:</strong> ${emails.length} destinatário(s)</p>
                <p style="margin: 5px 0;"><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            </div>
        `;
        
        const resultados = await enviarEmailMultiplos(emails, assunto, conteudo);
        const sucessos = resultados.filter(r => r.sucesso).length;
        
        res.json({ 
            success: true, 
            message: `${sucessos}/${emails.length} e-mails enviados com sucesso!`,
            resultados
        });
    } catch (error) {
        console.log('❌ Erro ao enviar e-mails múltiplos:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

// Rota para testar exclusão no Vercel
app.post('/api/testar-exclusao', async (req, res) => {
    try {
        console.log('🧪 Testando exclusão no Vercel...');
        console.log('🌐 Ambiente:', process.env.NODE_ENV || 'development');
        
        // Verificar status inicial
        const statusInicial = {
            totalContas: contas.length,
            mongoStatus: db ? 'connected' : 'disconnected',
            ambiente: process.env.NODE_ENV || 'development'
        };
        
        console.log('📊 Status inicial:', statusInicial);
        
        // Tentar salvar dados (simular exclusão)
        console.log('💾 Testando salvamento no banco...');
        const savePromise = salvarDados();
        const saveTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Save timeout')), 20000)
        );
        
        await Promise.race([savePromise, saveTimeout]);
        console.log('✅ Salvamento testado com sucesso');
        
        res.json({
            success: true,
            message: 'Teste de exclusão realizado com sucesso',
            statusInicial,
            ambiente: process.env.NODE_ENV || 'development'
        });
        
    } catch (error) {
        console.log('❌ Erro no teste de exclusão:', error.message);
        res.status(500).json({
            success: false,
            error: 'Erro no teste de exclusão',
            message: error.message,
            ambiente: process.env.NODE_ENV || 'development'
        });
    }
});

// ROTA: Verificação manual de notificações (para UptimeRobot/Vercel)
app.post('/api/verificar-notificacoes', async (req, res) => {
    try {
        console.log('🔍 Verificação manual de notificações iniciada');
        console.log('📅 Data/Hora:', new Date().toLocaleString('pt-BR'));
        console.log('🌐 Ambiente:', process.env.NODE_ENV || 'development');
        
        // Verificar se há e-mail configurado
        if (!emailConfigurado) {
            console.log('📧 E-mail não configurado - pulando verificação');
            return res.json({ 
                success: true, 
                message: 'E-mail não configurado - verificação pulada',
                timestamp: new Date().toISOString(),
                emailConfigurado: false,
                totalContas: contas.length
            });
        }
        
        // Executar verificação
        await verificarContasVencendo();
        
        console.log('✅ Verificação manual concluída');
        
        res.json({ 
            success: true, 
            message: 'Verificação de notificações executada',
            timestamp: new Date().toISOString(),
            emailConfigurado: !!emailConfigurado,
            totalContas: contas.length
        });
    } catch (error) {
        console.log('❌ Erro na verificação:', error.message);
        res.status(500).json({ 
            error: 'Erro interno',
            message: error.message 
        });
    }
});
// FUNÇÃO POOLING
// Função verificarPeriodicamente removida - agora usando Vercel Cron Jobs
// para verificação automática de notificações
// ROTA: Verificação manual de notificações via GET (para UptimeRobot)
app.get('/api/verificar-notificacoes', async (req, res) => {
    try {
        console.log('🔍 Verificação manual de notificações (GET) iniciada');
        console.log('📅 Data/Hora:', new Date().toLocaleString('pt-BR'));
        console.log('🌐 Ambiente:', process.env.NODE_ENV || 'development');
        
        // Verificar se há e-mail configurado
        if (!emailConfigurado) {
            console.log('📧 E-mail não configurado - pulando verificação');
            return res.json({ 
                success: true, 
                message: 'E-mail não configurado - verificação pulada',
                timestamp: new Date().toISOString(),
                emailConfigurado: false,
                totalContas: contas.length
            });
        }
        
        // Executar verificação
        await verificarContasVencendo();
        
        console.log('✅ Verificação manual (GET) concluída');
        
        res.json({ 
            success: true, 
            message: 'Verificação de notificações executada via GET',
            timestamp: new Date().toISOString(),
            emailConfigurado: !!emailConfigurado,
            totalContas: contas.length
        });
    } catch (error) {
        console.log('❌ Erro na verificação (GET):', error.message);
        res.status(500).json({ 
            error: 'Erro interno',
            message: error.message 
        });
    }
});

// Função para enviar relatório completo
async function enviarRelatorioCompleto(email) {
    try {
        const hoje = new Date();
        
        const contasPagas = contas.filter(conta => conta.paga);
        const contasPendentes = contas.filter(conta => 
            !conta.paga && new Date(conta.dataVencimento) >= hoje
        );
        const contasVencidas = contas.filter(conta => 
            !conta.paga && new Date(conta.dataVencimento) < hoje
        );
        
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

// ===== ROTAS DE CRON JOBS (Vercel) =====

// Server-Sent Events para atualizações em tempo real
app.get('/api/events', (req, res) => {
    console.log('📡 Cliente conectado via SSE');
    
    // Configurar headers para SSE
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });
    
    // Enviar heartbeat inicial
    res.write(`data: ${JSON.stringify({
        type: 'connection',
        message: 'Conexão SSE estabelecida',
        timestamp: new Date().toISOString()
    })}\n\n`);
    
    // Armazenar referência da conexão
    const clientId = Date.now();
    console.log(`📡 Cliente SSE conectado: ${clientId}`);
    
    // Função para enviar eventos
    const enviarEvento = (data) => {
        if (res.writableEnded) return;
        
        try {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        } catch (error) {
            console.error('❌ Erro ao enviar evento SSE:', error);
        }
    };
    
    // Adicionar à lista de clientes conectados
    if (!global.sseClients) global.sseClients = new Map();
    global.sseClients.set(clientId, enviarEvento);
    
    // Limpar quando a conexão for fechada
    req.on('close', () => {
        console.log(`📡 Cliente SSE desconectado: ${clientId}`);
        if (global.sseClients) {
            global.sseClients.delete(clientId);
        }
    });
    
    // Enviar heartbeat a cada 30 segundos
    const heartbeat = setInterval(() => {
        if (res.writableEnded) {
            clearInterval(heartbeat);
            return;
        }
        
        enviarEvento({
            type: 'heartbeat',
            timestamp: new Date().toISOString()
        });
    }, 30000);
});

// Função para notificar todos os clientes SSE
function notificarClientesSSE(data) {
    if (!global.sseClients) return;
    
    console.log(`📡 Notificando ${global.sseClients.size} cliente(s) SSE`);
    
    global.sseClients.forEach((enviarEvento, clientId) => {
        try {
            enviarEvento(data);
        } catch (error) {
            console.error(`❌ Erro ao notificar cliente ${clientId}:`, error);
            global.sseClients.delete(clientId);
        }
    });
}

// Cron Job: Verificar contas a cada 2 horas
app.get('/api/cron/verificar-contas', async (req, res) => {
    try {
        console.log('⏰ Cron Job: Verificando contas vencendo...');
        console.log('📅 Data/Hora:', new Date().toLocaleString('pt-BR'));
        
        // Recarregar dados do banco
        await carregarDados();
        
        // Executar verificação de notificações
        if (emailConfigurado) {
            await verificarContasVencendo();
            console.log('✅ Verificação de contas concluída');
        } else {
            console.log('📧 E-mail não configurado - pulando notificações');
        }
        
        res.json({ 
            success: true, 
            message: 'Cron Job: Verificação de contas executada',
            timestamp: new Date().toISOString(),
            emailConfigurado: !!emailConfigurado,
            totalContas: contas.length
        });
    } catch (error) {
        console.log('❌ Erro no cron job de verificação:', error.message);
        res.status(500).json({ 
            error: 'Erro no cron job',
            message: error.message 
        });
    }
});

// Cron Job: Relatório diário às 8h
app.get('/api/cron/relatorio-diario', async (req, res) => {
    try {
        console.log('📊 Cron Job: Enviando relatório diário...');
        console.log('📅 Data/Hora:', new Date().toLocaleString('pt-BR'));
        
        if (emailConfigurado) {
            await enviarRelatorioCompleto(emailConfigurado);
            console.log('✅ Relatório diário enviado');
        } else {
            console.log('📧 E-mail não configurado - pulando relatório');
        }
        
        res.json({ 
            success: true, 
            message: 'Cron Job: Relatório diário executado',
            timestamp: new Date().toISOString(),
            emailConfigurado: !!emailConfigurado
        });
    } catch (error) {
        console.log('❌ Erro no cron job de relatório:', error.message);
        res.status(500).json({ 
            error: 'Erro no cron job',
            message: error.message 
        });
    }
});

// Cron Job: Keep-alive a cada 15 minutos
app.get('/api/cron/keep-alive', async (req, res) => {
    try {
        console.log('💓 Cron Job: Keep-alive executado');
        console.log('📅 Data/Hora:', new Date().toLocaleString('pt-BR'));
        
        // Recarregar dados do banco para manter sincronização
        await carregarDados();
        
        res.json({ 
            success: true, 
            message: 'Cron Job: Keep-alive executado',
            timestamp: new Date().toISOString(),
            totalContas: contas.length
        });
    } catch (error) {
        console.log('❌ Erro no cron job keep-alive:', error.message);
        res.status(500).json({ 
            error: 'Erro no cron job',
            message: error.message 
        });
    }
});

// Cron Job: Relatórios a cada 5 minutos (Vercel)
app.get('/api/cron/relatorios-5min', async (req, res) => {
    try {
        console.log('📊 Cron Job: Relatórios a cada 5 minutos executado');
        console.log('📅 Data/Hora:', new Date().toLocaleString('pt-BR'));
        
        // Recarregar dados do banco
        await carregarDados();
        
        // Enviar relatório se e-mail estiver configurado
        const resultado = await enviarRelatorioAgendado();
        
        res.json({ 
            success: true, 
            message: 'Cron Job: Relatórios executado',
            timestamp: new Date().toISOString(),
            totalContas: contas.length,
            relatorioEnviado: resultado.success,
            relatorioMessage: resultado.message
        });
    } catch (error) {
        console.log('❌ Erro no cron job de relatórios:', error.message);
        res.status(500).json({ 
            error: 'Erro no cron job',
            message: error.message 
        });
    }
});

// ===== SISTEMA DE AGENDAMENTO DE RELATÓRIOS (Vercel Compatível) =====

// Função para enviar relatório agendado
async function enviarRelatorioAgendado() {
    try {
        // Usar e-mail padrão se não estiver configurado
        const emailDestino = emailConfigurado || 'jamarestudante@gmail.com';
        
        const agora = new Date();
        console.log('📊 Enviando relatório agendado...');
        console.log('📅 Data/Hora:', agora.toLocaleString('pt-BR'));
        console.log('📧 E-mail de destino:', emailDestino);
        
        await enviarRelatorioCompleto(emailDestino);
        
        console.log('✅ Relatório agendado enviado com sucesso');
        return { 
            success: true, 
            message: 'Relatório enviado com sucesso',
            timestamp: agora.toISOString(),
            email: emailDestino
        };
        
    } catch (error) {
        console.log('❌ Erro ao enviar relatório agendado:', error.message);
        return { 
            success: false, 
            message: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Rota para enviar relatório manualmente (para teste)
app.post('/api/agendamento/enviar-manual', async (req, res) => {
    try {
        const resultado = await enviarRelatorioAgendado();
        
        res.json({
            success: resultado.success,
            message: resultado.message,
            timestamp: resultado.timestamp,
            emailConfigurado: !!emailConfigurado,
            email: emailConfigurado
        });
        
    } catch (error) {
        console.log('❌ Erro ao enviar relatório manual:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao enviar relatório',
            error: error.message
        });
    }
});

// Rota para verificar status do agendamento
app.get('/api/agendamento/status', async (req, res) => {
    try {
        const emailDestino = emailConfigurado || 'jamarestudante@gmail.com';
        
        res.json({
            success: true,
            emailConfigurado: !!emailDestino,
            email: emailDestino,
            emailPadrao: !emailConfigurado,
            proximoEnvio: 'A cada 5 minutos via Vercel Cron',
            intervalo: '5 minutos',
            plataforma: 'Vercel Cron Jobs',
            status: 'Ativo - Enviando relatórios automaticamente'
        });
        
    } catch (error) {
        console.log('❌ Erro ao verificar status:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar status',
            error: error.message
        });
    }
});

// Rota para configurar e-mail (Vercel compatível)
app.post('/api/configurar-email-agendamento', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: 'E-mail inválido'
            });
        }
        
        // Configurar e-mail
        emailConfigurado = email;
        
        // Salvar configuração
        await salvarDados();
        
        console.log('📧 E-mail configurado para relatórios:', email);
        
        res.json({
            success: true,
            message: 'E-mail configurado com sucesso. Relatórios serão enviados a cada 5 minutos via Vercel Cron.',
            email: email,
            agendamentoAtivo: true,
            proximoEnvio: 'A cada 5 minutos via Vercel Cron',
            intervalo: '5 minutos',
            plataforma: 'Vercel Cron Jobs'
        });
        
    } catch (error) {
        console.log('❌ Erro ao configurar e-mail:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao configurar e-mail',
            error: error.message
        });
    }
});

// Rota para controlar relatório a cada 1 minuto
app.post('/api/relatorio-1minuto', async (req, res) => {
    try {
        const { ativar, email } = req.body;
        
        if (ativar === undefined) {
            return res.status(400).json({ 
                success: false, 
                error: 'Parâmetro "ativar" é obrigatório (true/false)' 
            });
        }
        
        const emailDestino = email || emailConfigurado || 'jamarestudante@gmail.com';
        
        if (ativar) {
            // Executar relatório completo imediatamente
            await carregarDados();
            await enviarRelatorioCompleto(emailDestino);
            
            res.json({ 
                success: true, 
                message: 'Relatório completo executado com sucesso! Será executado a cada 1 minuto automaticamente.',
                email: emailDestino,
                intervalo: '1 minuto',
                proximaExecucao: 'Automática a cada 1 minuto',
                totalContas: contas.length
            });
        } else {
            res.json({ 
                success: true, 
                message: 'Relatório a cada 1 minuto desativado',
                email: emailDestino,
                intervalo: 'Desativado'
            });
        }
        
    } catch (error) {
        console.log('❌ Erro ao controlar relatório 1 minuto:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

// Rota para configurar e-mail com agendamento automático a cada 5 minutos
app.post('/api/configurar-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                error: 'E-mail é obrigatório' 
            });
        }
        
        // Configurar e-mail
        emailConfigurado = email;
        
        // Salvar configuração
        await salvarDados();
        
        // Enviar e-mail de confirmação
        const assunto = '✅ E-mail Configurado - Sistema Família Jamar';
        const conteudo = `
            <h2>✅ E-mail configurado com sucesso!</h2>
            <p>Olá! Seu e-mail foi configurado no Sistema Família Jamar.</p>
            <p>A partir de agora você receberá relatórios automáticos a cada 5 minutos neste e-mail.</p>
            <br>
            <p><strong>E-mail configurado:</strong> ${email}</p>
            <p><strong>Intervalo de relatórios:</strong> A cada 5 minutos</p>
            <p><strong>Plataforma:</strong> Vercel Cron Jobs</p>
            <br>
            <p>📱 Sistema Família Jamar</p>
        `;
        
        const sucesso = await enviarEmail(email, assunto, conteudo);
        
        if (sucesso) {
            // Enviar relatório completo se houver contas
            if (contas.length > 0) {
                await enviarRelatorioCompleto(email);
            }
            
            res.json({ 
                success: true, 
                message: 'E-mail configurado com sucesso! Relatórios serão enviados automaticamente a cada 5 minutos.',
                email: email,
                agendamentoAtivo: true,
                proximoEnvio: 'A cada 5 minutos via Vercel Cron',
                intervalo: '5 minutos',
                plataforma: 'Vercel Cron Jobs',
                totalContas: contas.length
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Erro ao enviar e-mail de confirmação.' 
            });
        }
    } catch (error) {
        console.log('❌ Erro ao configurar e-mail:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

// ===== ROTAS EXISTENTES =====

// Rota GET simples para UptimeRobot (dispara notificações)
app.get('/api/ping', async (req, res) => {
    try {
        console.log('🏓 Ping recebido do UptimeRobot');
        console.log('📅 Data/Hora:', new Date().toLocaleString('pt-BR'));
        
        // Executar verificação de notificações em background
        if (emailConfigurado) {
            console.log('📧 E-mail configurado - executando verificação');
            verificarContasVencendo().catch(error => {
                console.log('❌ Erro na verificação em background:', error.message);
            });
        } else {
            console.log('📧 E-mail não configurado - pulando verificação');
        }
        
        res.json({ 
            success: true, 
            message: 'Ping recebido - Sistema Família Jamar',
            timestamp: new Date().toISOString(),
            emailConfigurado: !!emailConfigurado,
            totalContas: contas.length
        });
    } catch (error) {
        console.log('❌ Erro no ping:', error.message);
        res.status(500).json({ 
            error: 'Erro interno',
            message: error.message 
        });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index-wix.html'));
});

// Inicializar sistema
async function inicializarSistema() {
    try {
        console.log('🚀 Inicializando Sistema Família Jamar...');
        
        // Tentar conectar ao MongoDB Atlas
        const mongoConectado = await conectarMongoDB();
        
        if (mongoConectado) {
            console.log('🗄️ Usando MongoDB Atlas como banco principal');
        } else {
            console.log('📁 Usando JSON local como banco principal');
        }
        
        // Carregar dados
        await carregarDados();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📱 Sistema Família Jamar online!`);
            console.log(`🌐 Acesse: http://localhost:${PORT}`);
            console.log('🔍 Verificando se dados foram carregados...');
            console.log('📊 Contas na memória:', contas.length);
            console.log('🆔 Próximo ID:', nextId);
            console.log('📧 Nova rota: POST /api/verificar-notificacoes');
            
            // Sistema de agendamento via Vercel Cron Jobs
            const emailDestino = emailConfigurado || 'jamarestudante@gmail.com';
            console.log('📧 E-mail configurado para relatórios:', emailDestino);
            console.log('⏰ Relatórios serão enviados a cada 5 minutos via Vercel Cron Jobs');
            console.log('📊 Sistema pronto para envio automático de relatórios!');
            
            // ===== SISTEMA DE INTERVALO LOCAL (setInterval) =====
            console.log('⏰ Iniciando sistema de intervalo local...');
            
            // Função para executar relatório a cada 5 minutos
            const executarRelatorioIntervalo = async () => {
                try {
                    console.log('📊 Executando relatório via setInterval...');
                    console.log('📅 Data/Hora:', new Date().toLocaleString('pt-BR'));
                    
                    // Recarregar dados do banco
                    await carregarDados();
                    
                    // Enviar relatório
                    const resultado = await enviarRelatorioAgendado();
                    
                    if (resultado.success) {
                        console.log('✅ Relatório enviado com sucesso via setInterval');
                        console.log('📧 Email:', resultado.email);
                    } else {
                        console.log('❌ Erro ao enviar relatório via setInterval:', resultado.message);
                    }
                    
                } catch (error) {
                    console.log('❌ Erro no setInterval:', error.message);
                }
            };
            
            // Função para executar relatório completo a cada 1 minuto
            const executarRelatorioCompletoIntervalo = async () => {
                try {
                    console.log('📊 Executando relatório completo a cada 1 minuto...');
                    console.log('📅 Data/Hora:', new Date().toLocaleString('pt-BR'));
                    
                    // Recarregar dados do banco
                    await carregarDados();
                    
                    // Verificar se há e-mail configurado
                    const emailDestino = emailConfigurado || 'jamarestudante@gmail.com';
                    
                    if (emailDestino && contas.length > 0) {
                        // Enviar relatório completo
                        await enviarRelatorioCompleto(emailDestino);
                        console.log('✅ Relatório completo enviado com sucesso a cada 1 minuto');
                        console.log('📧 Email:', emailDestino);
                        console.log('📊 Total de contas:', contas.length);
                    } else {
                        console.log('⚠️ E-mail não configurado ou sem contas - pulando relatório');
                    }
                    
                } catch (error) {
                    console.log('❌ Erro no relatório completo a cada 1 minuto:', error.message);
                }
            };
            
            // Executar imediatamente na primeira vez
            executarRelatorioIntervalo();
            executarRelatorioCompletoIntervalo();
            
            // Configurar para executar a cada 5 minutos (300.000 ms)
            const intervalo5Minutos = 5 * 60 * 1000; // 5 minutos em milissegundos
            setInterval(executarRelatorioIntervalo, intervalo5Minutos);
            
            // Configurar para executar a cada 1 minuto (60.000 ms)
            const intervalo1Minuto = 1 * 60 * 1000; // 1 minuto em milissegundos
            setInterval(executarRelatorioCompletoIntervalo, intervalo1Minuto);
            
            console.log('✅ Sistema de intervalo configurado para 5 minutos');
            console.log('✅ Sistema de relatório completo configurado para 1 minuto');
            console.log('⏰ Próxima execução em 1 minuto...');
        });
        
    } catch (error) {
        console.log('❌ Erro ao inicializar sistema:', error.message);
        process.exit(1);
    }
}

// Inicializar sistema
inicializarSistema();

module.exports = app;
