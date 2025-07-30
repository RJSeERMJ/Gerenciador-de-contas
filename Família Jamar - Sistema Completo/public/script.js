// Variáveis globais
let contas = [];
let contasFiltradas = [];
let receitas = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarContas();
    carregarReceitas();
    definirDataMinima();
    detectarAplicacaoDesktop();
    configurarAtalhosTeclado();
});

// Funções de carregamento
async function carregarContas() {
    try {
        const response = await fetch('/api/contas');
        contas = await response.json();
        contasFiltradas = [...contas];
        atualizarDashboard();
        renderizarContas();
    } catch (error) {
        mostrarMensagem('Erro ao carregar contas: ' + error.message, 'error');
    }
}

function definirDataMinima() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataVencimento').min = hoje;
    document.getElementById('editDataVencimento').min = hoje;
}

// Funções do Dashboard
function atualizarDashboard() {
    const hoje = new Date();
    const contasPendentes = contas.filter(conta => !conta.paga && new Date(conta.dataVencimento) >= hoje);
    const contasVencidas = contas.filter(conta => !conta.paga && new Date(conta.dataVencimento) < hoje);
    const contasPagas = contas.filter(conta => conta.paga);
    const totalPendente = contasPendentes.reduce((total, conta) => total + conta.valor, 0);

    document.getElementById('contasPendentes').textContent = contasPendentes.length;
    document.getElementById('contasVencidas').textContent = contasVencidas.length;
    document.getElementById('contasPagas').textContent = contasPagas.length;
    document.getElementById('totalPendente').textContent = formatarMoeda(totalPendente);
}

// Funções de renderização
function renderizarContas() {
    const container = document.getElementById('listaContas');
    
    let html = '';
    
    // Seção de Receitas
    if (receitas.length > 0) {
        html += `
            <div class="section-header">
                <h3><i class="fas fa-plus-circle"></i> Receitas</h3>
                <button class="btn btn-primary btn-sm" onclick="abrirModalReceita()">
                    <i class="fas fa-plus"></i> Nova Receita
                </button>
            </div>
            <div class="receitas-preview">
                ${receitas.slice(0, 3).map(receita => criarCardReceitaPreview(receita)).join('')}
                ${receitas.length > 3 ? `
                    <div class="ver-mais-receitas">
                        <button class="btn btn-outline" onclick="mostrarAba('dashboard')">
                            Ver todas as ${receitas.length} receitas
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Seção de Contas
    html += `
        <div class="section-header">
            <h3><i class="fas fa-list"></i> Contas</h3>
        </div>
    `;
    
    if (contasFiltradas.length === 0) {
        html += `
            <div class="message info">
                <i class="fas fa-info-circle"></i>
                Nenhuma conta encontrada. Adicione sua primeira conta!
            </div>
        `;
    } else {
        html += contasFiltradas.map(conta => criarCardConta(conta)).join('');
    }

    container.innerHTML = html;
}

function criarCardReceitaPreview(receita) {
    return `
        <div class="receita-preview-item">
            <div class="receita-preview-header">
                <div class="receita-preview-info">
                    <h4>${receita.descricao}</h4>
                    <div class="receita-preview-meta">
                        <span><i class="fas fa-calendar"></i> ${formatarData(receita.data)}</span>
                        <span><i class="fas fa-tag"></i> ${receita.categoria}</span>
                        ${receita.recorrente ? '<span><i class="fas fa-redo"></i> Recorrente</span>' : ''}
                    </div>
                </div>
                <div class="receita-preview-valor">${formatarMoeda(receita.valor)}</div>
            </div>
            <div class="receita-preview-actions">
                <button class="btn btn-outline btn-sm" onclick="editarReceita(${receita.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="deletarReceita(${receita.id})">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            </div>
        </div>
    `;
}

function criarCardConta(conta) {
    const hoje = new Date();
    const dataVencimento = new Date(conta.dataVencimento);
    const status = conta.paga ? 'paga' : 
                   dataVencimento < hoje ? 'vencida' : 'pendente';
    
    const statusText = conta.paga ? 'Paga' : 
                      dataVencimento < hoje ? 'Vencida' : 'Pendente';
    
    const statusIcon = conta.paga ? 'fas fa-check-circle' : 
                      dataVencimento < hoje ? 'fas fa-exclamation-triangle' : 'fas fa-clock';
    
    const statusColor = conta.paga ? '#38a169' : 
                       dataVencimento < hoje ? '#e53e3e' : '#f6ad55';

    return `
        <div class="conta-item ${status}" data-id="${conta.id}">
            <div class="conta-header">
                <div class="conta-info">
                    <h3>${conta.descricao}</h3>
                    <div class="conta-meta">
                        <span><i class="fas fa-calendar"></i> ${formatarData(conta.dataVencimento)}</span>
                        <span><i class="fas fa-tag"></i> ${conta.categoria}</span>
                        ${conta.recorrente ? '<span><i class="fas fa-redo"></i> Recorrente</span>' : ''}
                        <span style="color: ${statusColor}">
                            <i class="${statusIcon}"></i> ${statusText}
                        </span>
                    </div>
                </div>
                <div class="conta-valor">
                    ${formatarMoeda(conta.valor)}
                </div>
            </div>
            <div class="conta-actions">
                ${!conta.paga ? `
                    <button class="btn btn-success" onclick="marcarComoPaga(${conta.id})">
                        <i class="fas fa-check"></i> Marcar como Paga
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="editarConta(${conta.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deletarConta(${conta.id})">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            </div>
        </div>
    `;
}

// Funções de filtro
function filtrarContas() {
    const filtroStatus = document.getElementById('filtroStatus').value;
    const filtroCategoria = document.getElementById('filtroCategoria').value;
    const busca = document.getElementById('busca').value.toLowerCase();

    contasFiltradas = contas.filter(conta => {
        // Filtro por status
        const hoje = new Date();
        const dataVencimento = new Date(conta.dataVencimento);
        const status = conta.paga ? 'pagas' : 
                      dataVencimento < hoje ? 'vencidas' : 'pendentes';
        
        if (filtroStatus !== 'todas' && status !== filtroStatus) {
            return false;
        }

        // Filtro por categoria
        if (filtroCategoria && conta.categoria !== filtroCategoria) {
            return false;
        }

        // Filtro por busca
        if (busca && !conta.descricao.toLowerCase().includes(busca) && 
            !conta.categoria.toLowerCase().includes(busca)) {
            return false;
        }

        return true;
    });

    renderizarContas();
}

// Funções de CRUD
async function salvarConta(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const conta = {
        descricao: formData.get('descricao'),
        valor: parseFloat(formData.get('valor')),
        dataVencimento: formData.get('dataVencimento'),
        categoria: formData.get('categoria'),
        recorrente: formData.has('recorrente')
    };

    try {
        const response = await fetch('/api/contas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(conta)
        });

        if (response.ok) {
            mostrarMensagem('Conta criada com sucesso!', 'success');
            fecharModalNovaConta();
            await carregarContas();
            filtrarContas();
        } else {
            throw new Error('Erro ao criar conta');
        }
    } catch (error) {
        mostrarMensagem('Erro ao criar conta: ' + error.message, 'error');
    }
}

async function editarConta(id) {
    const conta = contas.find(c => c.id === id);
    if (!conta) return;

    // Preencher formulário
    document.getElementById('editId').value = conta.id;
    document.getElementById('editDescricao').value = conta.descricao;
    document.getElementById('editValor').value = conta.valor;
    document.getElementById('editDataVencimento').value = conta.dataVencimento;
    document.getElementById('editCategoria').value = conta.categoria;
    document.getElementById('editRecorrente').checked = conta.recorrente;

    abrirModalEditarConta();
}

async function atualizarConta(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const id = formData.get('id');
    const conta = {
        descricao: formData.get('descricao'),
        valor: parseFloat(formData.get('valor')),
        dataVencimento: formData.get('dataVencimento'),
        categoria: formData.get('categoria'),
        recorrente: formData.has('recorrente'),
        paga: contas.find(c => c.id == id)?.paga || false
    };

    try {
        const response = await fetch(`/api/contas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(conta)
        });

        if (response.ok) {
            mostrarMensagem('Conta atualizada com sucesso!', 'success');
            fecharModalEditarConta();
            await carregarContas();
            filtrarContas();
        } else {
            throw new Error('Erro ao atualizar conta');
        }
    } catch (error) {
        mostrarMensagem('Erro ao atualizar conta: ' + error.message, 'error');
    }
}

async function deletarConta(id) {
    if (!confirm('Tem certeza que deseja deletar esta conta?')) {
        return;
    }

    try {
        const response = await fetch(`/api/contas/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            mostrarMensagem('Conta deletada com sucesso!', 'success');
            await carregarContas();
            filtrarContas();
        } else {
            throw new Error('Erro ao deletar conta');
        }
    } catch (error) {
        mostrarMensagem('Erro ao deletar conta: ' + error.message, 'error');
    }
}

async function marcarComoPaga(id) {
    try {
        const response = await fetch(`/api/contas/${id}/pagar`, {
            method: 'POST'
        });

        if (response.ok) {
            mostrarMensagem('Conta marcada como paga!', 'success');
            await carregarContas();
            filtrarContas();
        } else {
            throw new Error('Erro ao marcar conta como paga');
        }
    } catch (error) {
        mostrarMensagem('Erro ao marcar conta como paga: ' + error.message, 'error');
    }
}

// Funções de modal
function abrirModalNovaConta() {
    document.getElementById('modalNovaConta').style.display = 'block';
    document.getElementById('formNovaConta').reset();
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

function configurarEmail() {
    document.getElementById('modalConfigurarEmail').style.display = 'block';
    // Carregar e-mail atual se existir
    const emailAtual = localStorage.getItem('emailNotificacao');
    if (emailAtual) {
        document.getElementById('emailNotificacao').value = emailAtual;
    }
}

function fecharModalConfigurarEmail() {
    document.getElementById('modalConfigurarEmail').style.display = 'none';
}

async function salvarConfiguracaoEmail(event) {
    event.preventDefault();
    
    const email = document.getElementById('emailNotificacao').value;
    
    try {
        // Salvar no localStorage
        localStorage.setItem('emailNotificacao', email);
        
        // Salvar no servidor
        const response = await fetch('/api/configurar-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                mostrarMensagem('✅ E-mail configurado com sucesso! Verifique sua caixa de entrada para confirmar o cadastro.', 'success');
                fecharModalConfigurarEmail();
            } else {
                throw new Error(data.error || 'Erro desconhecido');
            }
        } else {
            throw new Error('Erro ao salvar configuração');
        }
    } catch (error) {
        mostrarMensagem('❌ Erro ao configurar e-mail: ' + error.message, 'error');
    }
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

    // Criar nova mensagem
    const mensagem = document.createElement('div');
    mensagem.className = `message ${tipo}`;
    mensagem.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${texto}
    `;

    // Inserir no início do container
    const container = document.querySelector('.container');
    container.insertBefore(mensagem, container.firstChild);

    // Remover após 5 segundos
    setTimeout(() => {
        mensagem.remove();
    }, 5000);
}

function exportarContas() {
    const csvContent = [
        ['Descrição', 'Valor', 'Data de Vencimento', 'Categoria', 'Status', 'Recorrente'],
        ...contas.map(conta => {
            const hoje = new Date();
            const dataVencimento = new Date(conta.dataVencimento);
            const status = conta.paga ? 'Paga' : 
                          dataVencimento < hoje ? 'Vencida' : 'Pendente';
            
            return [
                conta.descricao,
                formatarMoeda(conta.valor),
                formatarData(conta.dataVencimento),
                conta.categoria,
                status,
                conta.recorrente ? 'Sim' : 'Não'
            ];
        })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Funções para aplicação desktop
function detectarAplicacaoDesktop() {
    if (window.desktopUtils && window.desktopUtils.isDesktopApp) {
        const desktopInfo = document.getElementById('desktopInfo');
        if (desktopInfo) {
            desktopInfo.style.display = 'block';
        }
        
        // Mostrar notificação de boas-vindas
        setTimeout(() => {
            if (window.desktopUtils.showDesktopNotification) {
                window.desktopUtils.showDesktopNotification(
                    'Gerenciador de Contas',
                    'Aplicação iniciada com sucesso!'
                );
            }
        }, 2000);
    }
}

function configurarAtalhosTeclado() {
    document.addEventListener('keydown', function(event) {
        // Ctrl+N: Nova conta
        if (event.ctrlKey && event.key === 'n') {
            event.preventDefault();
            abrirModalNovaConta();
        }
        
        // Ctrl+E: Exportar
        if (event.ctrlKey && event.key === 'e') {
            event.preventDefault();
            exportarContas();
        }
        
        // F1: Mostrar atalhos
        if (event.key === 'F1') {
            event.preventDefault();
            mostrarAtalhosTeclado();
        }
        
        // Esc: Fechar modais
        if (event.key === 'Escape') {
            fecharTodosModais();
        }
    });
}

function mostrarAtalhosTeclado() {
    // Remover atalhos existentes
    const existing = document.querySelector('.keyboard-shortcuts');
    if (existing) {
        existing.remove();
    }
    
    const shortcuts = document.createElement('div');
    shortcuts.className = 'keyboard-shortcuts';
    shortcuts.innerHTML = `
        <h4>📋 Atalhos de Teclado</h4>
        <ul>
            <li><kbd>Ctrl</kbd> + <kbd>N</kbd> - Nova Conta</li>
            <li><kbd>Ctrl</kbd> + <kbd>E</kbd> - Exportar Contas</li>
            <li><kbd>F1</kbd> - Mostrar Atalhos</li>
            <li><kbd>Esc</kbd> - Fechar Modais</li>
        </ul>
    `;
    
    document.body.appendChild(shortcuts);
    
    // Mostrar com animação
    setTimeout(() => {
        shortcuts.classList.add('show');
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
        shortcuts.classList.remove('show');
        setTimeout(() => {
            shortcuts.remove();
        }, 300);
    }, 5000);
}

function fecharTodosModais() {
    const modais = document.querySelectorAll('.modal');
    modais.forEach(modal => {
        modal.style.display = 'none';
    });
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

// ================= DASHBOARD E RECEITAS =================

// Carregar receitas do localStorage
function carregarReceitas() {
    const receitasSalvas = localStorage.getItem('receitas');
    receitas = receitasSalvas ? JSON.parse(receitasSalvas) : [];
    renderizarReceitas();
    atualizarResumoFinanceiro();
    atualizarGraficos();
}

// Salvar receitas no localStorage
function salvarReceitasLocal() {
    localStorage.setItem('receitas', JSON.stringify(receitas));
}

// Abrir modal de nova receita
function abrirModalReceita() {
    document.getElementById('modalNovaReceita').style.display = 'block';
    document.getElementById('formNovaReceita').reset();
}

// Fechar modal de nova receita
function fecharModalNovaReceita() {
    document.getElementById('modalNovaReceita').style.display = 'none';
}

// Salvar receita
function salvarReceita(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const receita = {
        id: Date.now(),
        descricao: formData.get('descricao'),
        valor: parseFloat(formData.get('valor')),
        data: formData.get('data'),
        categoria: formData.get('categoria'),
        recorrente: formData.has('recorrente')
    };
    receitas.push(receita);
    salvarReceitasLocal();
    fecharModalNovaReceita();
    renderizarReceitas();
    renderizarContas(); // Atualizar também a primeira tela
    atualizarResumoFinanceiro();
    atualizarGraficos();
    mostrarMensagem('Receita adicionada com sucesso!', 'success');
}

// Renderizar lista de receitas
function renderizarReceitas() {
    const container = document.getElementById('listaReceitas');
    if (!container) return;
    if (receitas.length === 0) {
        container.innerHTML = `<div class="message info"><i class="fas fa-info-circle"></i> Nenhuma receita cadastrada.</div>`;
        return;
    }
    container.innerHTML = receitas.map(receita => criarCardReceita(receita)).join('');
}

function criarCardReceita(receita) {
    return `
        <div class="receita-item">
            <div class="receita-header">
                <div class="receita-info">
                    <h4>${receita.descricao}</h4>
                    <div class="receita-meta">
                        <span><i class="fas fa-calendar"></i> ${formatarData(receita.data)}</span>
                        <span><i class="fas fa-tag"></i> ${receita.categoria}</span>
                        ${receita.recorrente ? '<span><i class="fas fa-redo"></i> Recorrente</span>' : ''}
                    </div>
                </div>
                <div class="receita-valor">${formatarMoeda(receita.valor)}</div>
            </div>
            <div class="receita-actions">
                <button class="btn btn-outline btn-sm" onclick="editarReceita(${receita.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="deletarReceita(${receita.id})">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            </div>
        </div>
    `;
}

function editarReceita(id) {
    const receita = receitas.find(r => r.id === id);
    if (!receita) return;

    document.getElementById('editReceitaId').value = receita.id;
    document.getElementById('editReceitaDescricao').value = receita.descricao;
    document.getElementById('editReceitaValor').value = receita.valor;
    document.getElementById('editReceitaData').value = receita.data;
    document.getElementById('editReceitaCategoria').value = receita.categoria;
    document.getElementById('editReceitaRecorrente').checked = receita.recorrente;

    abrirModalEditarReceita();
}

function atualizarReceita(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const id = parseInt(formData.get('id'));
    
    const receitaIndex = receitas.findIndex(r => r.id === id);
    if (receitaIndex === -1) {
        mostrarMensagem('Receita não encontrada!', 'error');
        return;
    }

    const receita = {
        id: id,
        descricao: formData.get('descricao'),
        valor: parseFloat(formData.get('valor')),
        data: formData.get('data'),
        categoria: formData.get('categoria'),
        recorrente: formData.has('recorrente')
    };

    receitas[receitaIndex] = receita;
    salvarReceitasLocal();
    fecharModalEditarReceita();
    renderizarReceitas();
    renderizarContas(); // Atualizar também a primeira tela
    atualizarResumoFinanceiro();
    atualizarGraficos();
    mostrarMensagem('Receita atualizada com sucesso!', 'success');
}

function deletarReceita(id) {
    if (!confirm('Tem certeza que deseja deletar esta receita?')) {
        return;
    }

    const receitaIndex = receitas.findIndex(r => r.id === id);
    if (receitaIndex === -1) {
        mostrarMensagem('Receita não encontrada!', 'error');
        return;
    }

    receitas.splice(receitaIndex, 1);
    salvarReceitasLocal();
    renderizarReceitas();
    renderizarContas(); // Atualizar também a primeira tela
    atualizarResumoFinanceiro();
    atualizarGraficos();
    mostrarMensagem('Receita deletada com sucesso!', 'success');
}

function abrirModalEditarReceita() {
    document.getElementById('modalEditarReceita').style.display = 'block';
}

function fecharModalEditarReceita() {
    document.getElementById('modalEditarReceita').style.display = 'none';
}

// Alternar abas
function mostrarAba(aba) {
    // Botões
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (aba === 'contas') {
        document.querySelector('.tab-btn[onclick*="contas"]').classList.add('active');
        document.querySelector('.contas-container').style.display = '';
        document.querySelector('.filters').style.display = '';
        document.getElementById('dashboard-stats').style.display = '';
        document.getElementById('dashboard-tab').style.display = 'none';
    } else {
        document.querySelector('.tab-btn[onclick*="dashboard"]').classList.add('active');
        document.querySelector('.contas-container').style.display = 'none';
        document.querySelector('.filters').style.display = 'none';
        document.getElementById('dashboard-stats').style.display = 'none';
        document.getElementById('dashboard-tab').style.display = '';
        atualizarResumoFinanceiro();
        atualizarGraficos();
    }
}

// Atualizar resumo financeiro
function atualizarResumoFinanceiro() {
    const totalCustos = contas.reduce((total, c) => total + (c.valor || 0), 0);
    const totalReceitas = receitas.reduce((total, r) => total + (r.valor || 0), 0);
    const saldo = totalReceitas - totalCustos;
    if (document.getElementById('totalCustos'))
        document.getElementById('totalCustos').textContent = formatarMoeda(totalCustos);
    if (document.getElementById('totalReceitas'))
        document.getElementById('totalReceitas').textContent = formatarMoeda(totalReceitas);
    if (document.getElementById('saldo'))
        document.getElementById('saldo').textContent = formatarMoeda(saldo);
}

// ================= GRÁFICOS =================
let graficoPizza = null;
let graficoBarras = null;

function atualizarGraficos() {
    // Custos por categoria
    const categorias = {};
    contas.forEach(conta => {
        if (!conta.paga) { // Só contas não pagas
            categorias[conta.categoria] = (categorias[conta.categoria] || 0) + (conta.valor || 0);
        }
    });
    const labels = Object.keys(categorias);
    const data = Object.values(categorias);
    // Cores para as categorias
    const cores = [
        '#667eea', '#764ba2', '#f6ad55', '#e53e3e', '#38a169', '#3182ce', '#ecc94b', '#ed8936', '#319795', '#d53f8c'
    ];
    // Gráfico de Pizza
    const ctxPizza = document.getElementById('graficoPizza').getContext('2d');
    if (graficoPizza) graficoPizza.destroy();
    graficoPizza = new Chart(ctxPizza, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: cores.slice(0, labels.length),
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    // Gráfico de Barras
    const ctxBarras = document.getElementById('graficoBarras').getContext('2d');
    if (graficoBarras) graficoBarras.destroy();
    graficoBarras = new Chart(ctxBarras, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Custos por Categoria',
                data: data,
                backgroundColor: cores.slice(0, labels.length),
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Inicialização das receitas e dashboard
window.addEventListener('DOMContentLoaded', function() {
    carregarReceitas();
    // Garantir que a aba inicial é 'contas'
    mostrarAba('contas');
}); 