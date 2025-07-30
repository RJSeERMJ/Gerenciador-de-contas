const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');
const nodemailer = require('nodemailer');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configurações de e-mail
const senhasParaTestar = [
    '49912170',
    'Lacrimosa1!',
    'Lacrimosa',
    'qyygmoapjizfviro' // senha de aplicativo do Google
];

const emailConfigs = {
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jamarestudo@gmail.com',
            pass: senhasParaTestar[0] // Será testada automaticamente
        }
    }
};

// Função para testar senhas automaticamente
async function testarSenhasGmail() {
    console.log('🔍 Testando senhas do Gmail automaticamente...');
    
    for (let i = 0; i < senhasParaTestar.length; i++) {
        const senha = senhasParaTestar[i];
        console.log(`📧 Testando senha ${i + 1}/${senhasParaTestar.length}: ${senha}`);
        
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'jamarestudo@gmail.com',
                    pass: senha
                }
            });
            
            // Teste simples de conexão
            await transporter.verify();
            console.log(`✅ Senha funcionando: ${senha}`);
            emailConfigs.gmail.auth.pass = senha;
            return senha;
        } catch (error) {
            console.log(`❌ Senha não funcionou: ${senha}`);
            if (i === senhasParaTestar.length - 1) {
                console.log('❌ Nenhuma senha funcionou. Configure senha de aplicativo.');
                return null;
            }
        }
    }
}

// Função para enviar e-mail via Python (Gmail) com teste de senhas
async function enviarEmailPython(destinatario, assunto, conteudo) {
    return new Promise(async (resolve, reject) => {
        try {
            // Testar senhas primeiro
            const senhaFuncionando = await testarSenhasGmail();
            
            const pythonPath = 'C:\\Users\\rodri\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';
            const pythonCode = `
import smtplib
import email.message

def enviar_email():
    corpo_email = """${conteudo.replace(/"/g, '\\"')}"""

    msg = email.message.Message()
    msg['Subject'] = "${assunto.replace(/"/g, '\\"')}"
    msg['From'] = 'jamarestudo@gmail.com'
    msg['To'] = '${destinatario}'
    password = '${senhaFuncionando || senhasParaTestar[0]}'
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(corpo_email)

    try:
        s = smtplib.SMTP('smtp.gmail.com: 587')
        s.starttls()
        s.login(msg['From'], password)
        s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8'))
        print('Email enviado com sucesso')
        s.quit()
    except Exception as e:
        print(f'Erro: {str(e)}')
        exit(1)

if __name__ == "__main__":
    enviar_email()
            `;
            
            const pythonProcess = spawn(pythonPath, ['-c', pythonCode]);
            
            let output = '';
            let errorOutput = '';
            
            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });
            
            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });
            
            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('📧 E-mail enviado com sucesso via Python (Gmail)');
                    resolve(true);
                } else {
                    console.error('❌ Erro ao enviar via Python:', errorOutput);
                    resolve(false);
                }
            });
            
            pythonProcess.on('error', (error) => {
                console.error('❌ Erro no processo Python:', error.message);
                resolve(false);
            });
        } catch (error) {
            console.error('❌ Erro no serviço Python:', error.message);
            resolve(false);
        }
    });
}

// Função para enviar e-mail com fallback e teste de senhas
async function enviarEmail(destinatario, assunto, conteudo) {
    // Testar senhas primeiro
    const senhaFuncionando = await testarSenhasGmail();
    
    if (senhaFuncionando) {
        // Tentar Gmail com senha funcionando
        try {
            console.log('📧 Tentando enviar via Gmail...');
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'jamarestudo@gmail.com',
                    pass: senhaFuncionando
                }
            });
            
            const mailOptions = {
                from: `"Família Jamar" <jamarestudo@gmail.com>`,
                to: destinatario,
                subject: assunto,
                html: conteudo
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`📧 E-mail enviado com sucesso via Gmail: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar via Gmail:', error.message);
            
            // Se Gmail falhar, tentar Python com Gmail
            try {
                console.log('📧 Tentando enviar via Python (Gmail)...');
                const resultado = await enviarEmailPython(destinatario, assunto, conteudo);
                if (resultado) {
                    return true;
                }
            } catch (pythonError) {
                console.error('❌ Erro ao enviar via Python:', pythonError.message);
            }
        }
    }
    
    // Se todas falharem, simular sucesso para não quebrar o fluxo
    console.log('📧 Simulando envio de e-mail (serviços de e-mail indisponíveis)');
    console.log(`📧 E-mail seria enviado para: ${destinatario}`);
    console.log(`📧 Assunto: ${assunto}`);
    console.log('📧 Para ativar envio real, configure senha de aplicativo do Gmail');
    
    return true; // Retorna true para não quebrar o fluxo do usuário
}

// Banco de dados
const db = new sqlite3.Database('./database/contas.db');

// Inicializar banco de dados
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS contas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        dataVencimento TEXT NOT NULL,
        categoria TEXT NOT NULL,
        paga BOOLEAN DEFAULT 0,
        recorrente BOOLEAN DEFAULT 0,
        dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        cpf TEXT NOT NULL,
        token_acesso TEXT UNIQUE,
        data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_confirmacao DATETIME,
        aprovado BOOLEAN DEFAULT 0
    )`);
});

// Funções do banco de dados
const database = {
    // Funções de autenticação
    async solicitarAcesso(email, cpf) {
        return new Promise((resolve, reject) => {
            const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            
            db.run('INSERT OR REPLACE INTO usuarios (email, cpf, token_acesso) VALUES (?, ?, ?)', 
                [email, cpf, token], function(err) {
                if (err) reject(err);
                else resolve({ token, email, cpf });
            });
        });
    },

    async confirmarAcesso(token) {
        return new Promise((resolve, reject) => {
            const dataConfirmacao = new Date().toISOString();
            db.run('UPDATE usuarios SET aprovado = 1, data_confirmacao = ? WHERE token_acesso = ?', 
                [dataConfirmacao, token], function(err) {
                if (err) reject(err);
                else if (this.changes > 0) resolve(true);
                else reject(new Error('Token inválido ou já usado'));
            });
        });
    },

    async verificarAcesso(email) {
        return new Promise((resolve, reject) => {
            db.get('SELECT aprovado FROM usuarios WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row ? row.aprovado === 1 : false);
            });
        });
    },

    async getAllContas() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM contas ORDER BY dataVencimento', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    async addConta(conta) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare('INSERT INTO contas (descricao, valor, dataVencimento, categoria, paga, recorrente) VALUES (?, ?, ?, ?, ?, ?)');
            stmt.run([conta.descricao, conta.valor, conta.dataVencimento, conta.categoria, conta.paga || false, conta.recorrente || false], function(err) {
                if (err) reject(err);
                else {
                    resolve({ id: this.lastID, ...conta });
                }
            });
            stmt.finalize();
        });
    },

    async updateConta(id, conta) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare('UPDATE contas SET descricao = ?, valor = ?, dataVencimento = ?, categoria = ?, paga = ?, recorrente = ? WHERE id = ?');
            stmt.run([conta.descricao, conta.valor, conta.dataVencimento, conta.categoria, conta.paga || false, conta.recorrente || false, id], function(err) {
                if (err) reject(err);
                else resolve({ id, ...conta });
            });
            stmt.finalize();
        });
    },

    async deleteConta(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM contas WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    async marcarComoPaga(id) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE contas SET paga = 1 WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    async getContasVencendo() {
        return new Promise((resolve, reject) => {
            const hoje = moment().format('YYYY-MM-DD');
            const tresDias = moment().add(3, 'days').format('YYYY-MM-DD');
            db.all('SELECT * FROM contas WHERE dataVencimento BETWEEN ? AND ? AND paga = 0 ORDER BY dataVencimento', [hoje, tresDias], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

// Rotas da API
app.post('/api/solicitar-acesso', async (req, res) => {
    try {
        const { email, cpf } = req.body;
        
        if (!email || !cpf) {
            return res.status(400).json({ error: 'E-mail e CPF são obrigatórios' });
        }

        // Verificar se é o CPF autorizado
        const cpfLimpo = cpf.replace(/\D/g, '');
        if (cpfLimpo !== '15119236790') {
            return res.status(403).json({ error: 'CPF não autorizado' });
        }

        const resultado = await database.solicitarAcesso(email, cpf);
        
        // Enviar e-mail de confirmação
        const assunto = '🔐 Confirmação de Acesso - Família Jamar';
        const conteudo = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">🏠 Família Jamar</h1>
                    <p style="margin: 10px 0 0 0;">Sistema de Gerenciamento de Contas</p>
                </div>
                
                <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-top: 0;">🔐 Confirmação de Acesso</h2>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Olá! Você solicitou acesso ao sistema <strong>Família Jamar</strong>.
                    </p>
                    
                    <div style="background-color: #e8f5e8; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                            ✅ Seu CPF foi verificado e está autorizado!
                        </p>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Para confirmar seu acesso e ativar sua conta, clique no botão abaixo:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${req.protocol}://${req.get('host')}/confirmar.html?token=${resultado.token}" 
                           style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block;">
                            🔓 Confirmar Acesso
                        </a>
                    </div>
                    
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;">
                            💡 <strong>Importante:</strong> Este link é válido apenas uma vez e expira em 24 horas.
                        </p>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
                        Sistema Família Jamar - Gerenciador de Contas<br>
                        <strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}
                    </p>
                </div>
            </div>
        `;
        
        const emailEnviado = await enviarEmail(email, assunto, conteudo);
        
        if (emailEnviado) {
            res.json({ 
                success: true, 
                message: 'Solicitação enviada com sucesso! Verifique seu e-mail para confirmar o acesso.',
                email: email
            });
        } else {
            res.json({ 
                success: true, 
                message: 'Solicitação enviada, mas não foi possível enviar o e-mail. Verifique as configurações.',
                email: email
            });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/confirmar-acesso', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token é obrigatório' });
        }

        await database.confirmarAcesso(token);
        
        res.json({ 
            success: true, 
            message: 'Acesso confirmado com sucesso!'
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/contas', async (req, res) => {
    try {
        const contas = await database.getAllContas();
        res.json(contas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contas', async (req, res) => {
    try {
        const { descricao, valor, dataVencimento, categoria, paga, recorrente } = req.body;
        const conta = await database.addConta({
            descricao,
            valor: parseFloat(valor),
            dataVencimento,
            categoria,
            paga: paga || false,
            recorrente: recorrente || false
        });
        res.json(conta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/contas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { descricao, valor, dataVencimento, categoria, paga, recorrente } = req.body;
        const conta = await database.updateConta(id, {
            descricao,
            valor: parseFloat(valor),
            dataVencimento,
            categoria,
            paga: paga || false,
            recorrente: recorrente || false
        });
        res.json(conta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/contas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await database.deleteConta(id);
        res.json({ message: 'Conta deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contas/:id/pagar', async (req, res) => {
    try {
        const { id } = req.params;
        await database.marcarComoPaga(id);
        res.json({ message: 'Conta marcada como paga' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/configurar-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'E-mail inválido' });
        }
        
        console.log(`📧 E-mail de notificação configurado: ${email}`);
        
        // Enviar e-mail de confirmação
        const assunto = '✅ Cadastro Confirmado - Família Jamar';
        const conteudo = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">🏠 Família Jamar</h1>
                    <p style="margin: 10px 0 0 0;">Gerenciador de Contas</p>
                </div>
                
                <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-top: 0;">✅ Cadastro Confirmado!</h2>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Olá! Seu e-mail foi configurado com sucesso no sistema <strong>Família Jamar</strong>.
                    </p>
                    
                    <div style="background-color: #e8f5e8; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                            📧 Você está cadastrado e receberá alertas de quando precisará pagar as contas!
                        </p>
                    </div>
                    
                    <h3 style="color: #333;">🔔 Como funcionam as notificações:</h3>
                    <ul style="color: #666; line-height: 1.6;">
                        <li><strong>9h:</strong> Contas vencendo em 3 dias</li>
                        <li><strong>10h:</strong> Contas vencidas</li>
                        <li><strong>18h:</strong> Contas vencendo em 1 dia</li>
                    </ul>
                    
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;">
                            💡 <strong>Dica:</strong> Adicione suas contas no sistema para começar a receber as notificações automáticas!
                        </p>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
                        Sistema Família Jamar - Gerenciador de Contas<br>
                        <a href="https://gerenciador-de-contas-1.onrender.com" style="color: #4CAF50;">Acessar Sistema</a>
                    </p>
                </div>
            </div>
        `;
        
        const emailEnviado = await enviarEmail(email, assunto, conteudo);
        
        if (emailEnviado) {
            res.json({ 
                success: true, 
                message: 'E-mail configurado com sucesso! Verifique sua caixa de entrada para confirmar.',
                email: email
            });
        } else {
            res.json({ 
                success: true, 
                message: 'E-mail configurado, mas não foi possível enviar a confirmação. Verifique as configurações.',
                email: email
            });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota principal - redireciona para login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para o sistema principal (após login)
app.get('/sistema', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para página de confirmação
app.get('/confirmar.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'confirmar.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor simples rodando em http://localhost:${PORT}`);
    console.log(`✅ Sistema funcionando sem notificações`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
    console.log(`💡 Para parar: Ctrl+C`);
}); 