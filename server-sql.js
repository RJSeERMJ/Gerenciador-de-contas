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
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do SQLite
const DB_PATH = path.join(__dirname, 'database', 'contas.db');
let db = null;

// Função para inicializar banco de dados
function inicializarBanco() {
    return new Promise((resolve, reject) => {
        console.log('🔄 Inicializando banco SQLite...');
        
        // Criar diretório se não existir
        const dir = path.dirname(DB_PATH);
        if (!require('fs').existsSync(dir)) {
            require('fs').mkdirSync(dir, { recursive: true });
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

// Função para carregar contas
function carregarContas() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM contas ORDER BY dataVencimento', (err, rows) => {
            if (err) {
                console.log('❌ Erro ao carregar contas:', err.message);
                reject(err);
                return;
            }
            
            console.log('✅ Contas carregadas:', rows.length);
            resolve(rows);
        });
    });
}

// Função para adicionar conta
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

// Função para atualizar conta
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

// Função para deletar conta
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

// Função para marcar como paga
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

// Configurações de e-mail (mesmo do sistema original)
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
        
        const transporter = nodemailer.createTransporter(emailConfigs.gmail);
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
    if (!emailConfigurado) return;
    
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
    
    // Enviar notificações (mesmo código do sistema original)
    const hojeStr = hoje.toDateString();
    
    if (contasVencendo.length > 0 && ultimaNotificacao.vencendo !== hojeStr) {
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
    }
    
    if (contasVencidas.length > 0 && ultimaNotificacao.vencidas !== hojeStr) {
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
    }
}

// Verificar contas periodicamente
setInterval(verificarContasVencendo, 6 * 60 * 60 * 1000); // 6 horas

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
        const id = parseInt(req.params.id);
        await marcarComoPaga(id);
        res.json({ success: true });
    } catch (error) {
        console.log('❌ Erro ao marcar como paga:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

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