// Variáveis globais
let contas = [];
let contasFiltradas = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarContas();
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
        categorias[conta.categoria].total += conta.valor;
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

// Funções de renderização
function renderizarContas() {
    const container = document.getElementById('listaContas');
    
    if (contasFiltradas.length === 0) {
        container.innerHTML = `
            <div class="message info">
                <i class="fas fa-info-circle"></i>
                Nenhuma conta encontrada. Adicione sua primeira conta!
            </div>
        `;
        return;
    }

    container.innerHTML = contasFiltradas.map(conta => criarCardConta(conta)).join('');
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
        valor: 0, // Valor padrão já que removemos o campo
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
        valor: 0, // Valor padrão já que removemos o campo
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