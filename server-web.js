const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta Família Jamar
app.use(express.static(path.join(__dirname, 'Família Jamar - Sistema Completo', 'public')));

// Armazenamento em memória (para Vercel)
let contas = [];
let nextId = 1;

// Configurações de e-mail
const emailConfigs = {
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jamarestudo@gmail.com', // E-mail que ENVIA as notificações
            pass: process.env.EMAIL_PASSWORD || 'sua_senha_aqui'
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
        
        const transporter = nodemailer.createTransporter(emailConfigs.gmail);
        
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

// Rotas da API
app.get('/api/contas', (req, res) => {
    res.json(contas);
});

app.post('/api/contas', (req, res) => {
    const novaConta = {
        id: nextId++,
        descricao: req.body.descricao,
        valor: req.body.valor,
        dataVencimento: req.body.dataVencimento,
        categoria: req.body.categoria || 'Outros',
        recorrente: req.body.recorrente || false,
        paga: false,
        dataCriacao: new Date().toISOString()
    };
    
    contas.push(novaConta);
    res.json(novaConta);
});

app.put('/api/contas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = contas.findIndex(conta => conta.id === id);
    
    if (index !== -1) {
        contas[index] = { ...contas[index], ...req.body };
        res.json(contas[index]);
    } else {
        res.status(404).json({ error: 'Conta não encontrada' });
    }
});

app.delete('/api/contas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = contas.findIndex(conta => conta.id === id);
    
    if (index !== -1) {
        contas.splice(index, 1);
        res.json({ message: 'Conta deletada com sucesso' });
    } else {
        res.status(404).json({ error: 'Conta não encontrada' });
    }
});

app.patch('/api/contas/:id/pagar', (req, res) => {
    const id = parseInt(req.params.id);
    const conta = contas.find(c => c.id === id);
    
    if (conta) {
        conta.paga = true;
        conta.dataPagamento = new Date().toISOString();
        res.json(conta);
    } else {
        res.status(404).json({ error: 'Conta não encontrada' });
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
    const { email } = req.body;
    
    try {
        // Enviar e-mail de teste para confirmar
        const assunto = 'Confirmação - Sistema Família Jamar';
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
                message: 'E-mail configurado com sucesso! Verifique sua caixa de entrada.' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Erro ao enviar e-mail de confirmação. Verifique a configuração do servidor.' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor: ' + error.message 
        });
    }
});

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

// Rota principal - usar o index.html da Família Jamar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Família Jamar - Sistema Completo', 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Sistema Família Jamar online!`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});

module.exports = app; 