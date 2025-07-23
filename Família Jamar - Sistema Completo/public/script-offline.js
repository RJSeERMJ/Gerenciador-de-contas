// Sistema Família Jamar - Versão Offline
// Funciona completamente sem servidor usando localStorage

let contas = [];
let proximoId = 1;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarContas();
    definirDataMinima();
    atualizarDashboard();
    renderizarContas();
});

// Carregar contas do localStorage
function carregarContas() {
    const contasSalvas = localStorage.getItem('familiaJamar_contas');
    if (contasSalvas) {
        contas = JSON.parse(contasSalvas);
        // Encontrar o maior ID para definir o próximo
        if (contas.length > 0) {
            proximoId = Math.max(...contas.map(c => c.id)) + 1;
        }
    }
}

// Salvar contas no localStorage
function salvarContas() {
    localStorage.setItem('familiaJamar_contas', JSON.stringify(contas));
}

// Definir data mínima como hoje
function definirDataMinima() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataVencimento').min = hoje;
    document.getElementById('editDataVencimento').min = hoje;
}

// Atualizar dashboard
function atualizarDashboard() {
    const hoje = new Date();
    const contasPendentes = contas.filter(c => !c.paga && new Date(c.dataVencimento) >= hoje);
    const contasVencidas = contas.filter(c => !c.paga && new Date(c.dataVencimento) < hoje);
    const contasPagas = contas.filter(c => c.paga);
    const totalPendente = contasPendentes.reduce((sum, c) => sum + parseFloat(c.valor), 0) + 
                         contasVencidas.reduce((sum, c) => sum + parseFloat(c.valor), 0);

    document.getElementById('contasPendentes').textContent = contasPendentes.length;
    document.getElementById('contasVencidas').textContent = contasVencidas.length;
    document.getElementById('contasPagas').textContent = contasPagas.length;
    document.getElementById('totalPendente').textContent = formatarMoeda(totalPendente);
}

// Renderizar lista de contas
function renderizarContas() {
    const listaContas = document.getElementById('listaContas');
    listaContas.innerHTML = '';

    if (contas.length === 0) {
        listaContas.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>Nenhuma conta cadastrada</h3>
                <p>Clique em "Nova Conta" para começar a gerenciar suas contas.</p>
            </div>
        `;
        return;
    }

    contas.forEach(conta => {
        const card = criarCardConta(conta);
        listaContas.appendChild(card);
    });
}

// Criar card de conta
function criarCardConta(conta) {
    const hoje = new Date();
    const dataVencimento = new Date(conta.dataVencimento);
    const diasAteVencimento = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
    
    let status = 'pendente';
    let statusText = 'Pendente';
    let statusIcon = 'clock';
    
    if (conta.paga) {
        status = 'paga';
        statusText = 'Paga';
        statusIcon = 'check-circle';
    } else if (dataVencimento < hoje) {
        status = 'vencida';
        statusText = 'Vencida';
        statusIcon = 'exclamation-triangle';
    }

    const card = document.createElement('div');
    card.className = `conta-item ${status}`;
    card.innerHTML = `
        <div class="conta-header">
            <div class="conta-info">
                <h3>${conta.descricao}</h3>
                <div class="conta-meta">
                    <span><i class="fas fa-calendar"></i> ${formatarData(conta.dataVencimento)}</span>
                    <span><i class="fas fa-tag"></i> ${conta.categoria}</span>
                    ${conta.recorrente ? '<span><i class="fas fa-redo"></i> Recorrente</span>' : ''}
                    <span><i class="fas fa-${statusIcon}"></i> ${statusText}</span>
                    ${!conta.paga && diasAteVencimento !== 0 ? 
                        `<span><i class="fas fa-calendar-day"></i> ${diasAteVencimento > 0 ? `${diasAteVencimento} dias` : `${Math.abs(diasAteVencimento)} dias atrasado`}</span>` : ''
                    }
                </div>
            </div>
            <div class="conta-valor">
                R$ ${parseFloat(conta.valor).toFixed(2).replace('.', ',')}
            </div>
        </div>
        <div class="conta-actions">
            ${!conta.paga ? 
                `<button class="btn btn-success" onclick="marcarComoPaga(${conta.id})">
                    <i class="fas fa-check"></i> Marcar como Paga
                </button>` : ''
            }
            <button class="btn btn-outline" onclick="editarConta(${conta.id})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-danger" onclick="deletarConta(${conta.id})">
                <i class="fas fa-trash"></i> Deletar
            </button>
        </div>
    `;
    
    return card;
}

// Filtrar contas
function filtrarContas() {
    const filtroStatus = document.getElementById('filtroStatus').value;
    const filtroCategoria = document.getElementById('filtroCategoria').value;
    const busca = document.getElementById('busca').value.toLowerCase();
    
    const hoje = new Date();
    let contasFiltradas = contas.filter(conta => {
        // Filtro por status
        if (filtroStatus === 'pendentes' && (conta.paga || new Date(conta.dataVencimento) < hoje)) return false;
        if (filtroStatus === 'vencidas' && (conta.paga || new Date(conta.dataVencimento) >= hoje)) return false;
        if (filtroStatus === 'pagas' && !conta.paga) return false;
        
        // Filtro por categoria
        if (filtroCategoria && conta.categoria !== filtroCategoria) return false;
        
        // Filtro por busca
        if (busca && !conta.descricao.toLowerCase().includes(busca) && 
            !conta.categoria.toLowerCase().includes(busca)) return false;
        
        return true;
    });
    
    // Renderizar contas filtradas
    const listaContas = document.getElementById('listaContas');
    listaContas.innerHTML = '';
    
    if (contasFiltradas.length === 0) {
        listaContas.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>Nenhuma conta encontrada</h3>
                <p>Tente ajustar os filtros ou a busca.</p>
            </div>
        `;
        return;
    }
    
    contasFiltradas.forEach(conta => {
        const card = criarCardConta(conta);
        listaContas.appendChild(card);
    });
}

// Salvar nova conta
function salvarConta(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const novaConta = {
        id: proximoId++,
        descricao: formData.get('descricao'),
        valor: formData.get('valor'),
        dataVencimento: formData.get('dataVencimento'),
        categoria: formData.get('categoria'),
        recorrente: formData.get('recorrente') === 'on',
        paga: false,
        dataCriacao: new Date().toISOString()
    };
    
    contas.push(novaConta);
    salvarContas();
    atualizarDashboard();
    renderizarContas();
    fecharModalNovaConta();
    mostrarMensagem('Conta salva com sucesso!', 'success');
    
    // Limpar formulário
    event.target.reset();
}

// Editar conta
function editarConta(id) {
    const conta = contas.find(c => c.id === id);
    if (!conta) return;
    
    document.getElementById('editId').value = conta.id;
    document.getElementById('editDescricao').value = conta.descricao;
    document.getElementById('editValor').value = conta.valor;
    document.getElementById('editDataVencimento').value = conta.dataVencimento;
    document.getElementById('editCategoria').value = conta.categoria;
    document.getElementById('editRecorrente').checked = conta.recorrente;
    
    abrirModalEditarConta();
}

// Atualizar conta
function atualizarConta(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const id = parseInt(formData.get('id'));
    const contaIndex = contas.findIndex(c => c.id === id);
    
    if (contaIndex === -1) return;
    
    contas[contaIndex] = {
        ...contas[contaIndex],
        descricao: formData.get('descricao'),
        valor: formData.get('valor'),
        dataVencimento: formData.get('dataVencimento'),
        categoria: formData.get('categoria'),
        recorrente: formData.get('recorrente') === 'on'
    };
    
    salvarContas();
    atualizarDashboard();
    renderizarContas();
    fecharModalEditarConta();
    mostrarMensagem('Conta atualizada com sucesso!', 'success');
}

// Deletar conta
function deletarConta(id) {
    if (!confirm('Tem certeza que deseja deletar esta conta?')) return;
    
    contas = contas.filter(c => c.id !== id);
    salvarContas();
    atualizarDashboard();
    renderizarContas();
    mostrarMensagem('Conta deletada com sucesso!', 'success');
}

// Marcar como paga
function marcarComoPaga(id) {
    const contaIndex = contas.findIndex(c => c.id === id);
    if (contaIndex === -1) return;
    
    contas[contaIndex].paga = true;
    contas[contaIndex].dataPagamento = new Date().toISOString();
    
    salvarContas();
    atualizarDashboard();
    renderizarContas();
    mostrarMensagem('Conta marcada como paga!', 'success');
}

// Funções dos modais
function abrirModalNovaConta() {
    document.getElementById('modalNovaConta').style.display = 'block';
}

function fecharModalNovaConta() {
    document.getElementById('modalNovaConta').style.display = 'none';
}

function abrirModalEditarConta() {
    document.getElementById('modalEditarConta').style.display = 'block';
}

function fecharModalEditarConta() {
    document.getElementById('modalEditarConta').style.display = 'none';
}

// Exportar dados
function exportarDados() {
    const dados = {
        contas: contas,
        exportadoEm: new Date().toISOString(),
        versao: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familia-jamar-dados-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    mostrarMensagem('Dados exportados com sucesso!', 'success');
}

// Importar dados
function importarDados() {
    document.getElementById('importFile').click();
}

// Processar importação
function processarImportacao(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            if (dados.contas && Array.isArray(dados.contas)) {
                contas = dados.contas;
                // Recalcular próximo ID
                if (contas.length > 0) {
                    proximoId = Math.max(...contas.map(c => c.id)) + 1;
                }
                salvarContas();
                atualizarDashboard();
                renderizarContas();
                mostrarMensagem('Dados importados com sucesso!', 'success');
            } else {
                mostrarMensagem('Arquivo inválido!', 'error');
            }
        } catch (error) {
            mostrarMensagem('Erro ao importar arquivo!', 'error');
        }
    };
    reader.readAsText(file);
    
    // Limpar input
    event.target.value = '';
}

// Exportar CSV
function exportarContas() {
    if (contas.length === 0) {
        mostrarMensagem('Nenhuma conta para exportar!', 'error');
        return;
    }
    
    const headers = ['Descrição', 'Valor', 'Data de Vencimento', 'Categoria', 'Recorrente', 'Status'];
    const csvContent = [
        headers.join(','),
        ...contas.map(conta => [
            `"${conta.descricao}"`,
            conta.valor,
            conta.dataVencimento,
            `"${conta.categoria}"`,
            conta.recorrente ? 'Sim' : 'Não',
            conta.paga ? 'Paga' : (new Date(conta.dataVencimento) < new Date() ? 'Vencida' : 'Pendente')
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contas-familia-jamar-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    mostrarMensagem('Contas exportadas em CSV!', 'success');
}

// Funções utilitárias
function formatarMoeda(valor) {
    return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
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
    mensagem.textContent = texto;
    
    document.querySelector('.container').insertBefore(mensagem, document.querySelector('.dashboard'));
    
    setTimeout(() => {
        mensagem.remove();
    }, 5000);
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modais = document.querySelectorAll('.modal');
    modais.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Atalhos de teclado
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case 'n':
                event.preventDefault();
                abrirModalNovaConta();
                break;
            case 's':
                event.preventDefault();
                exportarDados();
                break;
            case 'i':
                event.preventDefault();
                importarDados();
                break;
        }
    }
    
    if (event.key === 'Escape') {
        const modais = document.querySelectorAll('.modal');
        modais.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

// Verificar contas vencendo (executar diariamente)
function verificarContasVencendo() {
    const hoje = new Date();
    const contasVencendo = contas.filter(conta => {
        if (conta.paga) return false;
        
        const dataVencimento = new Date(conta.dataVencimento);
        const diasAteVencimento = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
        
        return diasAteVencimento >= 0 && diasAteVencimento <= 3;
    });
    
    if (contasVencendo.length > 0) {
        const mensagem = `⚠️ Você tem ${contasVencendo.length} conta(s) vencendo em breve!\n\n` +
                        contasVencendo.map(c => `• ${c.descricao} - R$ ${c.valor} (${formatarData(c.dataVencimento)})`).join('\n');
        
        if (confirm(mensagem + '\n\nDeseja marcar alguma como paga?')) {
            // Aqui poderia abrir um modal para marcar como paga
            console.log('Usuário quer marcar contas como pagas');
        }
    }
}

// Executar verificação uma vez ao carregar
setTimeout(verificarContasVencendo, 2000); 