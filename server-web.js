const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment');
const { createClient } = require('@supabase/supabase-js');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true
});

// Configurações
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Supabase Client
let supabase = null;
let isConnected = false;

async function conectarSupabase() {
    try {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.log('⚠️ Variáveis do Supabase não configuradas');
            return false;
        }

        console.log('🔄 Conectando ao Supabase...');
        console.log('🔗 URL:', SUPABASE_URL);
        console.log('🔑 Key configurada:', SUPABASE_ANON_KEY ? '✅ Sim' : '❌ Não');

        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: false
            }
        });

        // Testar conexão
        const { data, error } = await supabase
            .from('contas')
            .select('id')
            .limit(1);

        if (error) {
            console.error('❌ Erro ao conectar ao Supabase:', error);
            return false;
        }

        console.log('✅ Conectado ao Supabase com sucesso');
        isConnected = true;
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao Supabase:', error);
        return false;
    }
}

// Carregar dados do Supabase
async function carregarDados() {
    try {
        console.log('🔄 Iniciando carregamento de dados...');
        
        if (!isConnected) {
            console.log('⚠️ Supabase não conectado, usando dados vazios');
            return { contas: [], status: { database: 'offline', totalContas: 0 } };
        }

        const { data, error } = await supabase
            .from('contas')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('❌ Erro ao carregar dados:', error);
            return { contas: [], status: { database: 'error', totalContas: 0 } };
        }

        console.log(`📋 Dados carregados do Supabase: ${data.length} contas`);
        
        // Calcular próximo ID
        const nextId = data.length > 0 ? Math.max(...data.map(c => c.id)) + 1 : 1;
        console.log(`🆔 Próximo ID: ${nextId}`);

        return { 
            contas: data || [], 
            status: { 
                database: 'online', 
                totalContas: data.length,
                nextId: nextId
            } 
        };
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        return { contas: [], status: { database: 'error', totalContas: 0 } };
    }
}

// Salvar dados no Supabase
async function salvarDados(contas) {
    try {
        if (!isConnected) {
            console.log('⚠️ Supabase não conectado, não foi possível salvar');
            return false;
        }

        const { error } = await supabase
            .from('contas')
            .upsert(contas, { onConflict: 'id' });

        if (error) {
            console.error('❌ Erro ao salvar dados:', error);
            return false;
        }

        console.log('✅ Dados salvos no Supabase com sucesso');
        return true;
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
        return false;
    }
}

// Notificar clientes via WebSocket
function notificarClientes(evento, dados) {
    try {
        io.emit(evento, dados);
        console.log(`📡 Evento emitido: ${evento}`);
    } catch (error) {
        console.error(`❌ Erro ao emitir evento ${evento}:`, error);
    }
}

// Rotas da API
app.get('/api/contas', async (req, res) => {
    try {
        const dados = await carregarDados();
        res.json(dados);
    } catch (error) {
        console.error('❌ Erro na rota GET /api/contas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/contas', async (req, res) => {
    try {
        const { descricao, valor, dataVencimento, categoria, tipo, recorrente } = req.body;
        
        if (!descricao || !valor || !dataVencimento) {
            return res.status(400).json({ 
                success: false, 
                error: 'Dados obrigatórios não fornecidos' 
            });
        }

        const dados = await carregarDados();
        const nextId = dados.status.nextId || 1;
        
        const novaConta = {
            id: nextId,
            descricao: descricao.trim(),
            valor: parseFloat(valor),
            dataVencimento,
            categoria: categoria || 'Outros',
            tipo: tipo || 'conta',
            recorrente: recorrente || false,
            paga: false,
            dataCriacao: new Date().toISOString()
        };

        if (isConnected) {
            const { data, error } = await supabase
                .from('contas')
                .insert([novaConta])
                .select();

            if (error) {
                console.error('❌ Erro ao inserir conta:', error);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Erro ao salvar conta' 
                });
            }

            const contaSalva = data[0];
            notificarClientes('conta_added', contaSalva);
            
            res.json({ 
                success: true, 
                conta: contaSalva,
                status: { database: 'online', totalContas: dados.contas.length + 1 }
            });
        } else {
            res.status(503).json({ 
                success: false, 
                error: 'Sistema offline - tente novamente' 
            });
        }
    } catch (error) {
        console.error('❌ Erro na rota POST /api/contas:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.put('/api/contas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { descricao, valor, dataVencimento, categoria, tipo, recorrente } = req.body;
        
        if (!descricao || !valor || !dataVencimento) {
            return res.status(400).json({ 
                success: false, 
                error: 'Dados obrigatórios não fornecidos' 
            });
        }

        const contaAtualizada = {
            id,
            descricao: descricao.trim(),
            valor: parseFloat(valor),
            dataVencimento,
            categoria: categoria || 'Outros',
            tipo: tipo || 'conta',
            recorrente: recorrente || false
        };

        if (isConnected) {
            const { data, error } = await supabase
                .from('contas')
                .update(contaAtualizada)
                .eq('id', id)
                .select();

            if (error) {
                console.error('❌ Erro ao atualizar conta:', error);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Erro ao atualizar conta' 
                });
            }

            const contaSalva = data[0];
            notificarClientes('conta_updated', contaSalva);
            
            res.json({ 
                success: true, 
                conta: contaSalva,
                status: { database: 'online' }
            });
        } else {
            res.status(503).json({ 
                success: false, 
                error: 'Sistema offline - tente novamente' 
            });
        }
    } catch (error) {
        console.error('❌ Erro na rota PUT /api/contas/:id:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.delete('/api/contas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isConnected) {
            const { error } = await supabase
                .from('contas')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('❌ Erro ao deletar conta:', error);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Erro ao deletar conta' 
                });
            }

            notificarClientes('conta_deleted', { id });
            
            res.json({ 
                success: true, 
                status: { database: 'online' }
            });
        } else {
            res.status(503).json({ 
                success: false, 
                error: 'Sistema offline - tente novamente' 
            });
        }
    } catch (error) {
        console.error('❌ Erro na rota DELETE /api/contas/:id:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.patch('/api/contas/:id/pagar', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { paga } = req.body;

        if (isConnected) {
            const { data, error } = await supabase
                .from('contas')
                .update({ 
                    paga: paga,
                    dataPagamento: paga ? new Date().toISOString() : null
                })
                .eq('id', id)
                .select();

            if (error) {
                console.error('❌ Erro ao marcar conta como paga:', error);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Erro ao atualizar status' 
                });
            }

            const contaSalva = data[0];
            notificarClientes('conta_paid', contaSalva);
            
            res.json({ 
                success: true, 
                conta: contaSalva,
                status: { database: 'online' }
            });
        } else {
            res.status(503).json({ 
                success: false, 
                error: 'Sistema offline - tente novamente' 
            });
        }
    } catch (error) {
        console.error('❌ Erro na rota PATCH /api/contas/:id/pagar:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Rota de login
app.post('/api/login', (req, res) => {
    const { nome, senha } = req.body;
    
    // Login simples (pode ser melhorado)
    if (nome === 'admin' && senha === '123456') {
        res.json({ success: true, message: 'Login realizado com sucesso' });
    } else {
        res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }
});

// Rotas estáticas
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index-wix.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// WebSocket
io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);
    console.log(`👥 Total de clientes conectados: ${io.engine.clientsCount}`);

    // Enviar status inicial
    socket.emit('connection_status', { 
        database: isConnected ? 'online' : 'offline',
        totalContas: 0
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });

    socket.on('error', (error) => {
        console.error(`❌ Erro no WebSocket:`, error);
    });
});

// Configuração de e-mail
let transporter = null;

if (EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'familiajamar@gmail.com',
            pass: EMAIL_PASSWORD
        }
    });
}

// Função para enviar e-mail
async function enviarEmail(destinatario, assunto, conteudo) {
    if (!transporter) {
        console.log('⚠️ Transporter de e-mail não configurado');
        return false;
    }

    try {
        const info = await transporter.sendMail({
            from: 'familiajamar@gmail.com',
            to: destinatario,
            subject: assunto,
            html: conteudo
        });

        console.log('📧 E-mail enviado:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Erro ao enviar e-mail:', error);
        return false;
    }
}

// Tarefa agendada para notificações
cron.schedule('0 9 * * *', async () => {
    try {
        if (!isConnected) {
            console.log('⚠️ Supabase não conectado, pulando notificação');
            return;
        }

        const hoje = moment().format('YYYY-MM-DD');
        const { data: contasVencendo, error } = await supabase
            .from('contas')
            .select('*')
            .eq('dataVencimento', hoje)
            .eq('paga', false);

        if (error) {
            console.error('❌ Erro ao buscar contas vencendo:', error);
            return;
        }

        if (contasVencendo && contasVencendo.length > 0) {
            console.log(`📧 Enviando notificação para ${contasVencendo.length} contas vencendo`);
            
            // Aqui você pode configurar o e-mail de destino
            const emailDestino = 'familiajamar@gmail.com';
            
            const conteudo = `
                <h2>Contas Vencendo Hoje</h2>
                <ul>
                    ${contasVencendo.map(conta => `
                        <li>${conta.descricao} - R$ ${conta.valor.toFixed(2)}</li>
                    `).join('')}
                </ul>
            `;

            await enviarEmail(emailDestino, 'Contas Vencendo Hoje', conteudo);
        }
    } catch (error) {
        console.error('❌ Erro na tarefa agendada:', error);
    }
});

// Inicialização
async function inicializar() {
    console.log('🚀 Iniciando Sistema Família Jamar - Versão Online');
    
    // Conectar ao Supabase
    await conectarSupabase();
    
    // Carregar dados iniciais
    const dados = await carregarDados();
    console.log(`📋 Sistema inicializado com ${dados.contas.length} contas`);
    
    // Iniciar servidor
    server.listen(PORT, () => {
        console.log(`🌐 Servidor rodando na porta ${PORT}`);
        console.log(`🌐 Acesse: https://familiajamar.vercel.app`);
    });
}

inicializar().catch(console.error); 