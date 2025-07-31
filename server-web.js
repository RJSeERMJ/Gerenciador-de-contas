const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de persistência
const ARQUIVO_DADOS = path.join(__dirname, 'database', 'contas.json');
const ARQUIVO_CONFIG = path.join(__dirname, 'database', 'config.json');

let contas = [];
let nextId = 1;

// Função para carregar dados
function carregarDados() {
    try {
        console.log('🔄 Carregando dados...');
        
        // Criar diretório se não existir
        const dir = path.dirname(ARQUIVO_DADOS);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Carregar contas
        if (fs.existsSync(ARQUIVO_DADOS)) {
            const dadosContas = fs.readFileSync(ARQUIVO_DADOS, 'utf8');
            contas = JSON.parse(dadosContas);
            console.log('✅ Contas carregadas do arquivo:', contas.length);
        } else {
            contas = [];
            console.log('📝 Arquivo de contas não encontrado, inicializando vazio');
        }
        
        // Carregar configuração
        if (fs.existsSync(ARQUIVO_CONFIG)) {
            const dadosConfig = fs.readFileSync(ARQUIVO_CONFIG, 'utf8');
            const config = JSON.parse(dadosConfig);
            nextId = config.nextId || 1;
            console.log('✅ Configuração carregada do arquivo');
        } else {
            nextId = 1;
            console.log('📝 Arquivo de configuração não encontrado, inicializando com ID 1');
        }
        
        console.log('🆔 Próximo ID:', nextId);
        
        // Log detalhado das contas
        if (contas.length > 0) {
            console.log('📋 Detalhes das contas:');
            contas.forEach((conta, index) => {
                console.log(`  ${index + 1}. ID: ${conta.id}, Descrição: ${conta.descricao}, Tipo: ${conta.tipo}, Paga: ${conta.paga}`);
            });
        }
        
    } catch (error) {
        console.log('❌ Erro ao carregar dados:', error.message);
        contas = [];
        nextId = 1;
    }
}

// Função para salvar dados
function salvarDados() {
    try {
        console.log('💾 Salvando dados...');
        console.log('📊 Total de contas para salvar:', contas.length);
        console.log('🆔 Próximo ID:', nextId);
        
        // Criar diretório se não existir
        const dir = path.dirname(ARQUIVO_DADOS);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Salvar contas
        fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(contas, null, 2));
        
        // Salvar configuração
        const config = { nextId, ultimaAtualizacao: new Date().toISOString() };
        fs.writeFileSync(ARQUIVO_CONFIG, JSON.stringify(config, null, 2));
        
        console.log('✅ Dados salvos com sucesso');
        console.log('📁 Arquivo:', ARQUIVO_DADOS);
        
    } catch (error) {
        console.log('❌ Erro ao salvar dados:', error.message);
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

// Função para enviar e-mail
async function enviarEmail(destinatario, assunto, conteudo) {
    try {
        console.log('📧 Tentando enviar e-mail para:', destinatario);
        
        if (!process.env.EMAIL_PASSWORD) {
            console.log('❌ Senha de e-mail não configurada');
            return false;
        }
        
        const transporter = nodemailer.createTransport(emailConfigs.gmail);
        await transporter.verify();
        
        const result = await transporter.sendMail({
            from: 'jamarestudo@gmail.com',
            to: destinatario,
            subject: assunto,
            html: conteudo
        });
        
        console.log('✅ E-mail enviado com sucesso');
        return true;
    } catch (error) {
        console.log('❌ Erro ao enviar e-mail:', error.message);
        return false;
    }
}

// Sistema de notificações
let emailConfigurado = null;
let ultimaNotificacao = {};

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

// Verificar contas periodicamente
setInterval(verificarContasVencendo, 6 * 60 * 60 * 1000); // 6 horas

// Rotas da API
app.get('/api/contas', (req, res) => {
    console.log('📋 GET /api/contas - Solicitado');
    console.log('📊 Total de contas na memória:', contas.length);
    res.json(contas);
});

app.post('/api/contas', (req, res) => {
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
        salvarDados();
        
        res.json(novaConta);
    } catch (error) {
        console.log('❌ Erro ao adicionar conta:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/contas/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = contas.findIndex(conta => conta.id === id);
        
        if (index !== -1) {
            contas[index] = { ...contas[index], ...req.body };
            salvarDados();
            res.json(contas[index]);
        } else {
            res.status(404).json({ error: 'Conta não encontrada' });
        }
    } catch (error) {
        console.log('❌ Erro ao atualizar conta:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/contas/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = contas.findIndex(conta => conta.id === id);
        
        if (index !== -1) {
            contas.splice(index, 1);
            salvarDados();
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Conta não encontrada' });
        }
    } catch (error) {
        console.log('❌ Erro ao deletar conta:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/contas/:id/pagar', (req, res) => {
    try {
        console.log('💰 POST /api/contas/:id/pagar - Marcando conta como paga');
        const id = parseInt(req.params.id);
        
        const conta = contas.find(c => c.id === id);
        if (conta) {
            conta.paga = true;
            conta.dataPagamento = new Date().toISOString();
            salvarDados();
            res.json({ success: true });
        } else {
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

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index-wix.html'));
});

// Carregar dados ao iniciar
carregarDados();

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Sistema Família Jamar online!`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log('🔍 Verificando se dados foram carregados...');
    console.log('📊 Contas na memória:', contas.length);
    console.log('🆔 Próximo ID:', nextId);
});

module.exports = app; 