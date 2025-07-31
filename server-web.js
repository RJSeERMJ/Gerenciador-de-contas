const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do SQLite
const DB_PATH = path.join(__dirname, 'database', 'contas.db');

let db = null;

// Função para inicializar banco SQLite
function inicializarBanco() {
    return new Promise((resolve, reject) => {
        console.log('🔄 Inicializando banco SQLite...');
        
        // Criar diretório se não existir
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.log('❌ Erro ao conectar ao SQLite:', err.message);
                reject(err);
                return;
            }
            
            console.log('✅ Conectado ao SQLite com sucesso');
            
            // Criar tabelas
            db.run(`
                CREATE TABLE IF NOT EXISTS contas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    descricao TEXT NOT NULL,
                    valor REAL NOT NULL,
                    dataVencimento TEXT NOT NULL,
                    categoria TEXT DEFAULT 'Outros',
                    tipo TEXT DEFAULT 'conta',
                    recorrente BOOLEAN DEFAULT 0,
                    paga BOOLEAN DEFAULT 0,
                    dataPagamento TEXT,
                    dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.log('❌ Erro ao criar tabela contas:', err.message);
                    reject(err);
                    return;
                }
                
                console.log('✅ Tabela contas criada/verificada');
                resolve();
            });
        });
    });
}

// Função para carregar contas do SQLite
function carregarContas() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM contas ORDER BY dataVencimento', (err, rows) => {
            if (err) {
                console.log('❌ Erro ao carregar contas:', err.message);
                reject(err);
                return;
            }
            
            console.log('✅ Contas carregadas:', rows.length);
            
            // Log detalhado das contas
            if (rows.length > 0) {
                console.log('📋 Detalhes das contas:');
                rows.forEach((conta, index) => {
                    console.log(`  ${index + 1}. ID: ${conta.id}, Descrição: ${conta.descricao}, Tipo: ${conta.tipo}, Paga: ${conta.paga}`);
                });
            }
            
            resolve(rows);
        });
    });
}

// Função para adicionar conta no SQLite
function adicionarConta(conta) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO contas (descricao, valor, dataVencimento, categoria, tipo, recorrente, paga)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(sql, [
            conta.descricao,
            conta.valor,
            conta.dataVencimento,
            conta.categoria || 'Outros',
            conta.tipo || 'conta',
            conta.recorrente ? 1 : 0,
            conta.paga ? 1 : 0
        ], function(err) {
            if (err) {
                console.log('❌ Erro ao adicionar conta:', err.message);
                reject(err);
                return;
            }
            
            console.log('✅ Conta adicionada com ID:', this.lastID);
            resolve({ ...conta, id: this.lastID });
        });
    });
}

// Função para atualizar conta no SQLite
function atualizarConta(id, dados) {
    return new Promise((resolve, reject) => {
        const campos = Object.keys(dados).map(key => `${key} = ?`).join(', ');
        const valores = Object.values(dados);
        valores.push(id);
        
        const sql = `UPDATE contas SET ${campos} WHERE id = ?`;
        
        db.run(sql, valores, function(err) {
            if (err) {
                console.log('❌ Erro ao atualizar conta:', err.message);
                reject(err);
                return;
            }
            
            console.log('✅ Conta atualizada');
            resolve();
        });
    });
}

// Função para deletar conta no SQLite
function deletarConta(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM contas WHERE id = ?', [id], function(err) {
            if (err) {
                console.log('❌ Erro ao deletar conta:', err.message);
                reject(err);
                return;
            }
            
            console.log('✅ Conta deletada');
            resolve();
        });
    });
}

// Função para marcar como paga no SQLite
function marcarComoPaga(id) {
    return new Promise((resolve, reject) => {
        const dataPagamento = new Date().toISOString();
        db.run(
            'UPDATE contas SET paga = 1, dataPagamento = ? WHERE id = ?',
            [dataPagamento, id],
            function(err) {
                if (err) {
                    console.log('❌ Erro ao marcar como paga:', err.message);
                    reject(err);
                    return;
                }
                
                console.log('✅ Conta marcada como paga');
                resolve();
            }
        );
    });
}



// Inicializar banco e iniciar servidor
inicializarBanco()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor SQL rodando na porta ${PORT}`);
            console.log(`📊 Banco de dados: ${DB_PATH}`);
        });
    })
    .catch(error => {
        console.log('❌ Erro ao inicializar banco:', error.message);
        process.exit(1);
    });

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
    
    // Consulta SQL para contas vencendo
    const contasVencendo = await new Promise((resolve, reject) => {
        db.all(`
            SELECT * FROM contas 
            WHERE paga = 0 
            AND dataVencimento BETWEEN ? AND ?
            ORDER BY dataVencimento
        `, [hoje.toISOString().split('T')[0], proximos3Dias.toISOString().split('T')[0]], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
    
    // Consulta SQL para contas vencidas
    const contasVencidas = await new Promise((resolve, reject) => {
        db.all(`
            SELECT * FROM contas 
            WHERE paga = 0 
            AND dataVencimento < ?
            ORDER BY dataVencimento
        `, [hoje.toISOString().split('T')[0]], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
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
                    <li><strong>${conta.descricao}</strong> - R$ ${conta.valor} - Vence: ${conta.dataVencimento}</li>
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
                    <li><strong>${conta.descricao}</strong> - R$ ${conta.valor} - Venceu: ${conta.dataVencimento}</li>
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
app.get('/api/contas', async (req, res) => {
    try {
        console.log('📋 GET /api/contas - Solicitado');
        const contas = await carregarContas();
        res.json(contas);
    } catch (error) {
        console.log('❌ Erro ao buscar contas:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/contas', async (req, res) => {
    try {
        console.log('➕ POST /api/contas - Nova conta sendo adicionada');
        console.log('📝 Dados recebidos:', req.body);
        
        const novaConta = await adicionarConta(req.body);
        res.json(novaConta);
    } catch (error) {
        console.log('❌ Erro ao adicionar conta:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/contas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await atualizarConta(id, req.body);
        res.json({ success: true });
    } catch (error) {
        console.log('❌ Erro ao atualizar conta:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/contas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deletarConta(id);
        res.json({ success: true });
    } catch (error) {
        console.log('❌ Erro ao deletar conta:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/contas/:id/pagar', async (req, res) => {
    try {
        console.log('💰 POST /api/contas/:id/pagar - Marcando conta como paga');
        const id = parseInt(req.params.id);
        console.log('🆔 ID da conta:', id);
        
        await marcarComoPaga(id);
        res.json({ success: true });
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
            const totalContas = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as total FROM contas', (err, row) => {
                    if (err) reject(err);
                    else resolve(row.total);
                });
            });
            
            if (totalContas > 0) {
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
        const hoje = new Date().toISOString().split('T')[0];
        
        // Buscar estatísticas do banco
        const stats = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN paga = 1 THEN 1 ELSE 0 END) as pagas,
                    SUM(CASE WHEN paga = 0 AND dataVencimento >= ? THEN 1 ELSE 0 END) as pendentes,
                    SUM(CASE WHEN paga = 0 AND dataVencimento < ? THEN 1 ELSE 0 END) as vencidas,
                    SUM(CASE WHEN paga = 1 THEN valor ELSE 0 END) as totalPago,
                    SUM(CASE WHEN paga = 0 AND dataVencimento >= ? THEN valor ELSE 0 END) as totalPendente,
                    SUM(CASE WHEN paga = 0 AND dataVencimento < ? THEN valor ELSE 0 END) as totalVencido
                FROM contas
            `, [hoje, hoje, hoje, hoje], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        // Buscar contas por categoria
        const contasPagas = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM contas WHERE paga = 1 ORDER BY dataPagamento DESC', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        const contasPendentes = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM contas WHERE paga = 0 AND dataVencimento >= ? ORDER BY dataVencimento', [hoje], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        const contasVencidas = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM contas WHERE paga = 0 AND dataVencimento < ? ORDER BY dataVencimento', [hoje], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        const assunto = '📊 Relatório Completo - Sistema Família Jamar';
        const conteudo = `
            <h2>📊 Relatório Completo de Contas</h2>
            <p>Olá! Aqui está o relatório completo de todas as suas contas:</p>
            <br>
            
            <h3>📈 Resumo Geral</h3>
            <ul>
                <li><strong>Total de contas:</strong> ${stats.total || 0}</li>
                <li><strong>Contas pagas:</strong> ${stats.pagas || 0}</li>
                <li><strong>Contas pendentes:</strong> ${stats.pendentes || 0}</li>
                <li><strong>Contas vencidas:</strong> ${stats.vencidas || 0}</li>
            </ul>
            <br>
            
            <h3>💰 Valores</h3>
            <ul>
                <li><strong>Total pago:</strong> R$ ${(stats.totalPago || 0).toFixed(2)}</li>
                <li><strong>Total pendente:</strong> R$ ${(stats.totalPendente || 0).toFixed(2)}</li>
                <li><strong>Total vencido:</strong> R$ ${(stats.totalVencido || 0).toFixed(2)}</li>
            </ul>
            <br>
            
            ${contasPendentes.length > 0 ? `
            <h3>⏰ Contas Pendentes</h3>
            <ul>
                ${contasPendentes.map(conta => `
                    <li><strong>${conta.descricao}</strong> - R$ ${conta.valor} - Vence: ${conta.dataVencimento} - ${conta.categoria}</li>
                `).join('')}
            </ul>
            <br>
            ` : ''}
            
            ${contasVencidas.length > 0 ? `
            <h3>🚨 Contas Vencidas</h3>
            <ul>
                ${contasVencidas.map(conta => `
                    <li><strong>${conta.descricao}</strong> - R$ ${conta.valor} - Venceu: ${conta.dataVencimento} - ${conta.categoria}</li>
                `).join('')}
            </ul>
            <br>
            ` : ''}
            
            ${contasPagas.length > 0 ? `
            <h3>✅ Contas Pagas</h3>
            <ul>
                ${contasPagas.map(conta => `
                    <li><strong>${conta.descricao}</strong> - R$ ${conta.valor} - Paga em: ${conta.dataPagamento || 'Data não registrada'} - ${conta.categoria}</li>
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
app.get('/api/estatisticas', async (req, res) => {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        
        const stats = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN paga = 0 AND dataVencimento >= ? THEN 1 ELSE 0 END) as pendentes,
                    SUM(CASE WHEN paga = 0 AND dataVencimento < ? THEN 1 ELSE 0 END) as vencidas,
                    SUM(CASE WHEN paga = 1 THEN 1 ELSE 0 END) as pagas,
                    SUM(CASE WHEN paga = 0 AND dataVencimento >= ? THEN valor ELSE 0 END) as totalPendente,
                    SUM(CASE WHEN paga = 0 AND dataVencimento < ? THEN valor ELSE 0 END) as totalVencido
                FROM contas
            `, [hoje, hoje, hoje, hoje], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        res.json({
            total: stats.total || 0,
            pendentes: stats.pendentes || 0,
            vencidas: stats.vencidas || 0,
            pagas: stats.pagas || 0,
            totalPendente: (stats.totalPendente || 0).toFixed(2),
            totalVencido: (stats.totalVencido || 0).toFixed(2)
        });
    } catch (error) {
        console.log('❌ Erro ao buscar estatísticas:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
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
    console.log('🔍 Verificando se dados foram carregados...');
    console.log('📊 Contas na memória:', contas.length);
    console.log('🆔 Próximo ID:', nextId);
});

module.exports = app; 