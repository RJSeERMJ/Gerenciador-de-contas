// Sistema de Gerenciamento de Contas - Versão para Hospedagem Gratuita
// Usa localStorage para armazenamento local

// Variáveis globais
let contas = [];
let emailConfigurado = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    definirDataMinima();
    atualizarDashboard();
    renderizarContas();
    configurarAtalhosTeclado();
    
    // Verificar se é primeira vez
    if (!localStorage.getItem('familiaJamarPrimeiraVez')) {
        mostrarMensagem('Bem-vindo ao Família Jamar! Esta versão funciona sem servidor, usando armazenamento local do seu navegador.', 'info');
        localStorage.setItem('familiaJamarPrimeiraVez', 'true');
    }
});

// Funções de armazenamento local
function salvarDados() {
    localStorage.setItem('familiaJamarContas', JSON.stringify(contas));
    localStorage.setItem('familiaJamarEmail', JSON.stringify(emailConfigurado));
}

function carregarDados() {
    const contasSalvas = localStorage.getItem('familiaJamarContas');
    const emailSalvo = localStorage.getItem('familiaJamarEmail');
    
    if (contasSalvas) {
        contas = JSON.parse(contasSalvas);
    }
    
    if (emailSalvo) {
        emailConfigurado = JSON.parse(emailSalvo);
    }
}

// Funções do dashboard
function definirDataMinima() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataVencimento').min = hoje;
    document.getElementById('editDataVencimento').min = hoje;
}

// Funções de Navegação por Abas
function mostrarAba(aba) {
    // Esconder todas as abas
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remover classe active de todos os botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar aba selecionada
    document.getElementById(`aba-${aba}`).classList.add('active');
    
    // Adicionar classe active ao botão clicado
    event.target.classList.add('active');
    
    // Se for a aba dashboard, atualizar os gráficos
    if (aba === 'dashboard') {
        atualizarDashboard();
        atualizarGraficos();
    }
}

function atualizarDashboard() {
    const hoje = new Date();
    const contasPendentes = contas.filter(conta => !conta.paga);
    const contasVencidas = contas.filter(conta => !conta.paga && new Date(conta.dataVencimento) < hoje);
    const contasPagas = contas.filter(conta => conta.paga);
    const totalPendente = contasPendentes.reduce((total, conta) => total + parseFloat(conta.valor), 0);
    
    document.getElementById('contasPendentes').textContent = contasPendentes.length;
    document.getElementById('contasVencidas').textContent = contasVencidas.length;
    document.getElementById('contasPagas').textContent = contasPagas.length;
    document.getElementById('totalPendente').textContent = formatarMoeda(totalPendente);
}

// Função para atualizar gráficos
function atualizarGraficos() {
    // Aqui você pode adicionar lógica para criar gráficos reais
    // Por enquanto, vamos apenas mostrar informações básicas
    
    const graficoCategoria = document.getElementById('graficoCategoria');
    const graficoEvolucao = document.getElementById('graficoEvolucao');
    
    // Estatísticas por categoria
    const categorias = {};
    contas.forEach(conta => {
        if (!categorias[conta.categoria]) {
            categorias[conta.categoria] = { count: 0, total: 0 };
        }
        categorias[conta.categoria].count++;
        categorias[conta.categoria].total += parseFloat(conta.valor);
    });
    
    const categoriaHTML = Object.entries(categorias)
        .map(([categoria, dados]) => `
            <div style="margin: 10px 0; padding: 10px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                <strong>${categoria}</strong><br>
                Contas: ${dados.count} | Total: ${formatarMoeda(dados.total)}
            </div>
        `).join('');
    
    graficoCategoria.innerHTML = `
        <div style="text-align: left;">
            <h4 style="margin-bottom: 15px; color: #2d3748;">Distribuição por Categoria</h4>
            ${categoriaHTML || '<p style="color: #718096;">Nenhuma conta cadastrada</p>'}
        </div>
    `;
    
    // Estatísticas de evolução (últimos 6 meses)
    const hoje = new Date();
    const meses = [];
    for (let i = 5; i >= 0; i--) {
        const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        meses.push({
            mes: mes.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
            contas: contas.filter(conta => {
                const dataConta = new Date(conta.dataVencimento);
                return dataConta.getMonth() === mes.getMonth() && 
                       dataConta.getFullYear() === mes.getFullYear();
            }).length
        });
    }
    
    const evolucaoHTML = meses.map(item => `
        <div style="margin: 10px 0; padding: 10px; background: rgba(56, 161, 105, 0.1); border-radius: 8px;">
            <strong>${item.mes}</strong>: ${item.contas} contas
        </div>
    `).join('');
    
    graficoEvolucao.innerHTML = `
        <div style="text-align: left;">
            <h4 style="margin-bottom: 15px; color: #2d3748;">Evolução dos Últimos 6 Meses</h4>
            ${evolucaoHTML}
        </div>
    `;
}

function renderizarContas() {
    const listaContas = document.getElementById('listaContas');
    const filtroStatus = document.getElementById('filtroStatus').value;
    const filtroCategoria = document.getElementById('filtroCategoria').value;
    const busca = document.getElementById('busca').value.toLowerCase();
    
    let contasFiltradas = contas.filter(conta => conta.tipo === 'conta'); // Mostrar apenas contas
    
    // Filtrar por status
    if (filtroStatus === 'pendentes') {
        contasFiltradas = contasFiltradas.filter(conta => !conta.paga);
    } else if (filtroStatus === 'vencidas') {
        const hoje = new Date();
        contasFiltradas = contasFiltradas.filter(conta => !conta.paga && new Date(conta.dataVencimento) < hoje);
    } else if (filtroStatus === 'pagas') {
        contasFiltradas = contasFiltradas.filter(conta => conta.paga);
    }
    
    // Filtrar por categoria
    if (filtroCategoria) {
        contasFiltradas = contasFiltradas.filter(conta => conta.categoria === filtroCategoria);
    }
    
    // Filtrar por busca
    if (busca) {
        contasFiltradas = contasFiltradas.filter(conta => 
            conta.descricao.toLowerCase().includes(busca) ||
            conta.categoria.toLowerCase().includes(busca)
        );
    }
    
    // Ordenar por data de vencimento
    contasFiltradas.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
    
    if (contasFiltradas.length === 0) {
        listaContas.innerHTML = `
            <div class="conta-item" style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>Nenhuma conta encontrada</h3>
                <p>Adicione sua primeira conta clicando em "Nova Conta"</p>
            </div>
        `;
        return;
    }
    
    listaContas.innerHTML = contasFiltradas.map(conta => criarCardConta(conta)).join('');
}

function criarCardConta(conta) {
    const hoje = new Date();
    const dataVencimento = new Date(conta.dataVencimento);
    const diasAteVencimento = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
    
    let statusClass = 'pendente';
    let statusIcon = 'fas fa-clock';
    let statusText = `Vence em ${diasAteVencimento} dias`;
    
    if (conta.paga) {
        statusClass = 'paga';
        statusIcon = 'fas fa-check-circle';
        statusText = 'Paga';
    } else if (dataVencimento < hoje) {
        statusClass = 'vencida';
        statusIcon = 'fas fa-exclamation-triangle';
        statusText = `Vencida há ${Math.abs(diasAteVencimento)} dias`;
    } else if (diasAteVencimento <= 3) {
        statusClass = 'vencida';
        statusIcon = 'fas fa-exclamation-triangle';
        statusText = `Vence em ${diasAteVencimento} dias`;
    }
    
    return `
        <div class="conta-item ${statusClass}">
            <div class="conta-header">
                <div class="conta-info">
                    <h3>${conta.descricao}</h3>
                    <div class="conta-meta">
                        <span><i class="fas fa-tag"></i> ${conta.categoria}</span>
                        <span><i class="${statusIcon}"></i> ${statusText}</span>
                        ${conta.recorrente ? '<span><i class="fas fa-redo"></i> Recorrente</span>' : ''}
                    </div>
                </div>
            </div>
            <div class="conta-actions">
                ${!conta.paga ? `
                    <button class="btn btn-success" onclick="marcarComoPaga(${conta.id})">
                        <i class="fas fa-check"></i> Pagar
                    </button>
                ` : ''}
                <button class="btn btn-primary" onclick="editarConta(${conta.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deletarConta(${conta.id})">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            </div>
        </div>
    `;
}

// Funções para atualizar categorias baseado no tipo
function atualizarCategorias() {
    const tipo = document.getElementById('tipo').value;
    const categoriaSelect = document.getElementById('categoria');
    
    // Limpar opções atuais
    categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';
    
    if (tipo === 'conta') {
        // Categorias para contas
        const categoriasConta = ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros'];
        categoriasConta.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoriaSelect.appendChild(option);
        });
    } else if (tipo === 'receita') {
        // Categorias para receitas
        const categoriasReceita = ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Presentes', 'Outros'];
        categoriasReceita.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoriaSelect.appendChild(option);
        });
    }
}

function atualizarCategoriasEdit() {
    const tipo = document.getElementById('editTipo').value;
    const categoriaSelect = document.getElementById('editCategoria');
    
    // Limpar opções atuais
    categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';
    
    if (tipo === 'conta') {
        // Categorias para contas
        const categoriasConta = ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros'];
        categoriasConta.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoriaSelect.appendChild(option);
        });
    } else if (tipo === 'receita') {
        // Categorias para receitas
        const categoriasReceita = ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Presentes', 'Outros'];
        categoriasReceita.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoriaSelect.appendChild(option);
        });
    }
}

// Funções de filtro
function filtrarContas() {
    renderizarContas();
}

// Funções de CRUD
async function salvarConta(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const novaConta = {
        id: Date.now(),
        descricao: formData.get('descricao'),
        valor: 0, // Valor padrão já que removemos o campo
        dataVencimento: formData.get('dataVencimento'),
        categoria: formData.get('categoria'),
        tipo: formData.get('tipo'),
        paga: false,
        recorrente: formData.get('recorrente') === 'on',
        dataCriacao: new Date().toISOString()
    };
    
    contas.push(novaConta);
    salvarDados();
    
    fecharModalNovaConta();
    atualizarDashboard();
    renderizarContas();
    
    mostrarMensagem('Conta adicionada com sucesso!', 'success');
    
    // Simular notificação por e-mail
    if (emailConfigurado) {
        simularNotificacaoEmail(novaConta);
    }
}

async function editarConta(id) {
    const conta = contas.find(c => c.id === id);
    if (!conta) return;
    
    document.getElementById('editId').value = conta.id;
    document.getElementById('editDescricao').value = conta.descricao;
    document.getElementById('editDataVencimento').value = conta.dataVencimento;
    document.getElementById('editTipo').value = conta.tipo || 'conta';
    document.getElementById('editCategoria').value = conta.categoria;
    document.getElementById('editRecorrente').checked = conta.recorrente;
    
    document.getElementById('modalEditarConta').style.display = 'flex';
}

async function atualizarConta(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const id = parseInt(formData.get('id'));
    
    const contaIndex = contas.findIndex(c => c.id === id);
    if (contaIndex === -1) return;
    
    contas[contaIndex] = {
        ...contas[contaIndex],
        descricao: formData.get('descricao'),
        valor: 0, // Valor padrão já que removemos o campo
        dataVencimento: formData.get('dataVencimento'),
        categoria: formData.get('categoria'),
        tipo: formData.get('tipo'),
        recorrente: formData.get('recorrente') === 'on'
    };
    
    salvarDados();
    
    fecharModalEditarConta();
    atualizarDashboard();
    renderizarContas();
    
    mostrarMensagem('Conta atualizada com sucesso!', 'success');
}

async function deletarConta(id) {
    if (!confirm('Tem certeza que deseja deletar esta conta?')) return;
    
    contas = contas.filter(c => c.id !== id);
    salvarDados();
    
    atualizarDashboard();
    renderizarContas();
    
    mostrarMensagem('Conta deletada com sucesso!', 'success');
}

async function marcarComoPaga(id) {
    const contaIndex = contas.findIndex(c => c.id === id);
    if (contaIndex === -1) return;
    
    contas[contaIndex].paga = true;
    contas[contaIndex].dataPagamento = new Date().toISOString();
    
    salvarDados();
    
    atualizarDashboard();
    renderizarContas();
    
    mostrarMensagem('Conta marcada como paga!', 'success');
}

// Funções de modal
function abrirModalNovaConta() {
    document.getElementById('modalNovaConta').style.display = 'flex';
    document.getElementById('formNovaConta').reset();
}

function fecharModalNovaConta() {
    document.getElementById('modalNovaConta').style.display = 'none';
}

function fecharModalEditarConta() {
    document.getElementById('modalEditarConta').style.display = 'none';
}

function configurarEmail() {
    if (emailConfigurado) {
        document.getElementById('emailNotificacao').value = emailConfigurado.email;
    }
    document.getElementById('modalConfigurarEmail').style.display = 'flex';
}

function fecharModalConfigurarEmail() {
    document.getElementById('modalConfigurarEmail').style.display = 'none';
}

async function salvarConfiguracaoEmail(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('emailNotificacao');
    
    if (!email || !email.includes('@')) {
        mostrarMensagem('E-mail inválido!', 'error');
        return;
    }
    
    emailConfigurado = { email };
    salvarDados();
    
    fecharModalConfigurarEmail();
    
    // Simular envio de e-mail de confirmação
    simularEmailConfirmacao(email);
    
    mostrarMensagem('E-mail configurado com sucesso! Verifique sua caixa de entrada para confirmar.', 'success');
}

// Funções de exportação/importação
function exportarContas() {
    const dados = {
        contas: contas,
        email: emailConfigurado,
        dataExportacao: new Date().toISOString(),
        versao: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familia-jamar-contas-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostrarMensagem('Dados exportados com sucesso!', 'success');
}

function importarContas() {
    document.getElementById('importFile').click();
}

function processarImportacao(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            
            if (dados.contas && Array.isArray(dados.contas)) {
                contas = dados.contas;
                if (dados.email) {
                    emailConfigurado = dados.email;
                }
                
                salvarDados();
                atualizarDashboard();
                renderizarContas();
                
                mostrarMensagem(`Importação realizada com sucesso! ${contas.length} contas importadas.`, 'success');
            } else {
                mostrarMensagem('Arquivo inválido!', 'error');
            }
        } catch (error) {
            mostrarMensagem('Erro ao processar arquivo!', 'error');
        }
    };
    reader.readAsText(file);
    
    // Limpar input
    event.target.value = '';
}

// Funções de notificação simulada
function simularEmailConfirmacao(email) {
    console.log('📧 Simulando envio de e-mail de confirmação...');
    console.log(`📧 Para: ${email}`);
    console.log(`📧 Assunto: ✅ Cadastro Confirmado - Família Jamar`);
    console.log('📧 Conteúdo: Você está cadastrado e receberá alertas de quando precisará pagar as contas!');
    console.log('📧 Nota: Em uma versão com servidor, este e-mail seria enviado automaticamente.');
}

function simularNotificacaoEmail(conta) {
    console.log('📧 Simulando notificação de nova conta...');
    console.log(`📧 Para: ${emailConfigurado.email}`);
    console.log(`📧 Assunto: Nova conta adicionada - ${conta.descricao}`);
    console.log(`📧 Conteúdo: Nova conta "${conta.descricao}" adicionada com valor R$ ${conta.valor}`);
    console.log('📧 Nota: Em uma versão com servidor, este e-mail seria enviado automaticamente.');
}

// Funções utilitárias
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

function mostrarMensagem(texto, tipo) {
    // Remover mensagens anteriores
    const mensagensExistentes = document.querySelectorAll('.message');
    mensagensExistentes.forEach(msg => msg.remove());
    
    const mensagem = document.createElement('div');
    mensagem.className = `message ${tipo}`;
    mensagem.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${texto}
    `;
    
    document.body.appendChild(mensagem);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (mensagem.parentNode) {
            mensagem.remove();
        }
    }, 5000);
}

// Funções de atalhos de teclado
function configurarAtalhosTeclado() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + N - Nova Conta
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            abrirModalNovaConta();
        }
        
        // Ctrl + E - Exportar
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            exportarContas();
        }
        
        // F1 - Mostrar atalhos
        if (e.key === 'F1') {
            e.preventDefault();
            mostrarAtalhosTeclado();
        }
        
        // Esc - Fechar modais
        if (e.key === 'Escape') {
            fecharTodosModais();
        }
    });
}

function mostrarAtalhosTeclado() {
    const atalhos = `
        <h4>Atalhos de Teclado:</h4>
        <ul>
            <li><kbd>Ctrl + N</kbd> - Nova Conta</li>
            <li><kbd>Ctrl + E</kbd> - Exportar Dados</li>
            <li><kbd>F1</kbd> - Mostrar Atalhos</li>
            <li><kbd>Esc</kbd> - Fechar Modais</li>
        </ul>
    `;
    
    mostrarMensagem(atalhos, 'info');
}

function fecharTodosModais() {
    const modais = document.querySelectorAll('.modal');
    modais.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Verificação automática de contas vencendo (simulada)
setInterval(() => {
    const hoje = new Date();
    const contasVencendo = contas.filter(conta => {
        if (conta.paga) return false;
        
        const dataVencimento = new Date(conta.dataVencimento);
        const diasAteVencimento = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
        
        return diasAteVencimento <= 3 && diasAteVencimento >= 0;
    });
    
    if (contasVencendo.length > 0 && emailConfigurado) {
        console.log('🔔 Simulando verificação automática de contas vencendo...');
        console.log(`📧 ${contasVencendo.length} conta(s) vencendo em breve`);
        console.log('📧 Nota: Em uma versão com servidor, notificações seriam enviadas automaticamente.');
    }
}, 60000); // Verificar a cada minuto 