// Sistema de Gerenciamento de Contas - Versão Online
// Usa APIs do servidor para persistência de dados

// Variáveis globais
let contas = [];
let emailConfigurado = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await carregarDados();
        definirDataMinima();
        atualizarDashboard();
        renderizarContas();
        configurarAtalhosTeclado();
        
        // Verificar se é primeira vez
        if (!localStorage.getItem('familiaJamarPrimeiraVez')) {
            mostrarMensagem('Bem-vindo ao Família Jamar! Agora seus dados são salvos no servidor e podem ser acessados de qualquer computador.', 'info');
            localStorage.setItem('familiaJamarPrimeiraVez', 'true');
        }
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        mostrarMensagem('Erro ao carregar dados. Recarregue a página.', 'error');
    }
});

// Funções de comunicação com o servidor
async function carregarDados() {
    try {
        console.log('🔄 Carregando dados do servidor...');
        
        // Carregar contas do servidor
        const response = await fetch('/api/contas');
        if (response.ok) {
            contas = await response.json();
            console.log('📋 Contas carregadas do servidor:', contas.length);
        } else {
            console.error('❌ Erro ao carregar contas:', response.status);
            contas = [];
        }
        
        // Carregar configuração de e-mail do localStorage (mantido local)
        const emailSalvo = localStorage.getItem('familiaJamarEmail');
        if (emailSalvo) {
            try {
                const dadosEmail = JSON.parse(emailSalvo);
                if (dadosEmail && typeof dadosEmail === 'object') {
                    emailConfigurado = dadosEmail;
                    console.log('📧 E-mail carregado:', emailConfigurado.email);
                } else {
                    emailConfigurado = null;
                }
            } catch (error) {
                console.error('❌ Erro ao parsear dados de e-mail:', error);
                emailConfigurado = null;
            }
        } else {
            emailConfigurado = null;
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        contas = [];
        emailConfigurado = null;
    }
}

// Funções do dashboard
function definirDataMinima() {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        
        const elementos = ['dataVencimento', 'editDataVencimento'];
        
        elementos.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.min = hoje;
            } else {
                console.warn(`⚠️ Elemento #${id} não encontrado`);
            }
        });
        
    } catch (error) {
        console.error('❌ Erro ao definir data mínima:', error);
    }
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
    
    // Se for a aba contas, renderizar as contas
    if (aba === 'contas') {
        renderizarContas();
    }
}

function atualizarDashboard() {
    try {
        const hoje = new Date();
        
        // Separar contas e receitas
        const contasDespesas = contas.filter(conta => conta.tipo === 'conta');
        const receitas = contas.filter(conta => conta.tipo === 'receita');
        
        // Calcular totais por tipo
        const contasPendentes = contasDespesas.filter(conta => !conta.paga);
        const contasVencidas = contasDespesas.filter(conta => !conta.paga && new Date(conta.dataVencimento) < hoje);
        const contasPagas = contasDespesas.filter(conta => conta.paga);
        
        const totalDespesasPendentes = contasPendentes.reduce((total, conta) => {
            const valor = parseFloat(conta.valor) || 0;
            return total + valor;
        }, 0);
        
        const totalReceitas = receitas.reduce((total, conta) => {
            const valor = parseFloat(conta.valor) || 0;
            return total + valor;
        }, 0);
        
        const saldo = totalReceitas - totalDespesasPendentes;
        
        // Atualizar elementos do dashboard com verificações de segurança
        const elementos = {
            'contasPendentes': contasPendentes.length,
            'contasVencidas': contasVencidas.length,
            'contasPagas': contasPagas.length,
            'totalPendente': formatarMoeda(saldo), // Agora mostra o saldo (receita - despesa)
            'totalReceitas': formatarMoeda(totalReceitas),
            'saldo': formatarMoeda(saldo)
        };
        
        Object.entries(elementos).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = valor;
            } else {
                console.warn(`⚠️ Elemento #${id} não encontrado no dashboard`);
            }
        });
        
    } catch (error) {
        console.error('❌ Erro ao atualizar dashboard:', error);
    }
}

// Função para atualizar gráficos
function atualizarGraficos() {
    const graficoCategoria = document.getElementById('graficoCategoria');
    
    // Estatísticas por categoria (separando contas e receitas)
    const categoriasContas = {};
    const categoriasReceitas = {};
    
    contas.forEach(conta => {
        if (conta.tipo === 'conta') {
            if (!categoriasContas[conta.categoria]) {
                categoriasContas[conta.categoria] = { count: 0, total: 0 };
            }
            categoriasContas[conta.categoria].count++;
            categoriasContas[conta.categoria].total += parseFloat(conta.valor);
        } else if (conta.tipo === 'receita') {
            if (!categoriasReceitas[conta.categoria]) {
                categoriasReceitas[conta.categoria] = { count: 0, total: 0 };
            }
            categoriasReceitas[conta.categoria].count++;
            categoriasReceitas[conta.categoria].total += parseFloat(conta.valor);
        }
    });
    
    // Cores para o gráfico
    const coresContas = [
        '#e53e3e', '#f56565', '#fc8181', '#fed7d7'  // Vermelhos para contas
    ];
    
    const coresReceitas = [
        '#3182ce', '#4299e1', '#63b3ed', '#90cdf4'  // Azuis para receitas
    ];
    
    // Função para desenhar gráfico de pizza
    function desenharGraficoPizza(canvas, dados, titulo, corBase) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 30;
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (Object.keys(dados).length === 0) {
            // Desenhar mensagem quando não há dados
            ctx.fillStyle = '#718096';
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Nenhum dado disponível', centerX, centerY);
            return;
        }
        
        // Calcular total
        const total = Object.values(dados).reduce((sum, item) => sum + item.total, 0);
        
        if (total === 0) {
            ctx.fillStyle = '#718096';
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Nenhum valor disponível', centerX, centerY);
            return;
        }
        
        // Escolher cores baseadas no tipo (receita = azul, conta = vermelho)
        const cores = titulo === 'Receitas' ? coresReceitas : coresContas;
        
        // Desenhar fatias do gráfico
        let currentAngle = 0;
        const entries = Object.entries(dados);
        
        entries.forEach(([categoria, item], index) => {
            const sliceAngle = (item.total / total) * 2 * Math.PI;
            const percentage = ((item.total / total) * 100).toFixed(1);
            
            // Desenhar fatia
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            
            // Cor da fatia
            const cor = cores[index % cores.length];
            ctx.fillStyle = cor;
            ctx.fill();
            
            // Borda da fatia
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Adicionar texto na fatia se for grande o suficiente
            if (sliceAngle > 0.3) { // Se a fatia for maior que ~17 graus
                const midAngle = currentAngle + sliceAngle / 2;
                const textRadius = radius * 0.7;
                const textX = centerX + Math.cos(midAngle) * textRadius;
                const textY = centerY + Math.sin(midAngle) * textRadius;
                
                // Sombra do texto
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.font = 'bold 11px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(percentage + '%', textX + 1, textY + 1);
                
                // Texto principal
                ctx.fillStyle = '#ffffff';
                ctx.fillText(percentage + '%', textX, textY);
            }
            
            currentAngle += sliceAngle;
        });
        
        // Desenhar total no centro
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(formatarMoeda(total), centerX, centerY + 5);
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText('Total', centerX, centerY + 20);
    }
    
    // Criar legenda simplificada
    function criarLegenda(dados, corBase) {
        const entries = Object.entries(dados);
        if (entries.length === 0) return '';
        
        const total = Object.values(dados).reduce((sum, item) => sum + item.total, 0);
        
        // Escolher cores baseadas na cor base (azul para receitas, vermelho para contas)
        const cores = corBase === '#3182ce' ? coresReceitas : coresContas;
        
        return entries.map(([categoria, item], index) => {
            const percentage = total > 0 ? ((item.total / total) * 100).toFixed(1) : '0.0';
            return `
                <div style="display: flex; align-items: center; margin: 5px 0; font-size: 11px; padding: 6px; background: rgba(255,255,255,0.9); border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="width: 10px; height: 10px; background: ${cores[index % cores.length]}; border-radius: 2px; margin-right: 8px;"></div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #2d3748; font-size: 11px;">${categoria}</div>
                        <div style="font-size: 9px; color: #718096;">${item.count} ${item.count === 1 ? 'item' : 'itens'}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: ${corBase}; font-weight: bold; font-size: 12px;">${formatarMoeda(item.total)}</div>
                        <div style="font-size: 9px; color: #718096;">${percentage}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Criar HTML simplificado para os gráficos
    const legendaContas = criarLegenda(categoriasContas, '#e53e3e');
            const legendaReceitas = criarLegenda(categoriasReceitas, '#3182ce');
    
    graficoCategoria.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
            <!-- Gráfico de Contas -->
            <div style="text-align: center; min-width: 280px;">
                <h4 style="color: #e53e3e; margin-bottom: 15px; font-size: 16px;">📊 Contas (Despesas)</h4>
                <canvas id="graficoPizzaContas" width="250" height="250" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); background: white; margin-bottom: 15px;"></canvas>
                <div style="max-width: 250px; margin: 0 auto;">
                    ${legendaContas || '<p style="color: #718096; font-style: italic; text-align: center; font-size: 12px;">Nenhuma conta cadastrada</p>'}
                </div>
            </div>
            
            <!-- Gráfico de Receitas -->
            <div style="text-align: center; min-width: 280px;">
                                    <h4 style="color: #3182ce; margin-bottom: 15px; font-size: 16px;">💰 Receitas</h4>
                <canvas id="graficoPizzaReceitas" width="250" height="250" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); background: white; margin-bottom: 15px;"></canvas>
                <div style="max-width: 250px; margin: 0 auto;">
                    ${legendaReceitas || '<p style="color: #718096; font-style: italic; text-align: center; font-size: 12px;">Nenhuma receita cadastrada</p>'}
                </div>
            </div>
        </div>
    `;
    
    // Desenhar os gráficos após criar os elementos canvas
    setTimeout(() => {
        const canvasContas = document.getElementById('graficoPizzaContas');
        const canvasReceitas = document.getElementById('graficoPizzaReceitas');
        
        if (canvasContas) {
            desenharGraficoPizza(canvasContas, categoriasContas, 'Contas', '#e53e3e');
        }
                        if (canvasReceitas) {
                    desenharGraficoPizza(canvasReceitas, categoriasReceitas, 'Receitas', '#3182ce');
                }
    }, 100);
}

function renderizarContas() {
    try {
        console.log('🔄 Renderizando contas...');
        console.log('📋 Total de contas:', contas.length);
        
        const listaContas = document.getElementById('listaContas');
        if (!listaContas) {
            console.error('❌ Elemento #listaContas não encontrado');
            return;
        }
        
        const filtroStatus = document.getElementById('filtroStatus')?.value || 'todas';
        const filtroCategoria = document.getElementById('filtroCategoria')?.value || '';
        const busca = document.getElementById('busca')?.value?.toLowerCase() || '';
        
        console.log('🔍 Filtros aplicados:', { filtroStatus, filtroCategoria, busca });
        
        let contasFiltradas = contas; // Mostrar todas as entradas (contas e receitas)
        
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
        
        console.log('📊 Contas após filtros:', contasFiltradas.length);
        
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
        
    } catch (error) {
        console.error('❌ Erro ao renderizar contas:', error);
        const listaContas = document.getElementById('listaContas');
        if (listaContas) {
            listaContas.innerHTML = `
                <div class="conta-item" style="text-align: center; padding: 40px; color: #ff6b6b;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                    <h3>Erro ao carregar contas</h3>
                    <p>Recarregue a página para tentar novamente</p>
                </div>
            `;
        }
    }
}

function criarCardConta(conta) {
    try {
        if (!conta || !conta.id || !conta.descricao) {
            return '<div class="conta-item error">Conta inválida</div>';
        }
        
        const hoje = new Date();
        const dataVencimento = new Date(conta.dataVencimento);
        const diasAteVencimento = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
        
        let statusClass = 'pendente';
        let statusIcon = 'fas fa-clock';
        let statusText = `Vence em ${diasAteVencimento} dias`;
        
        if (conta.paga === true) {
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
        
        // Determinar se é conta ou receita
        const isReceita = conta.tipo === 'receita';
        const tipoClass = isReceita ? 'receita' : 'conta';
        const tipoIcon = isReceita ? 'fas fa-plus-circle' : 'fas fa-minus-circle';
        const tipoText = isReceita ? 'Receita' : 'Conta';
        const valorClass = isReceita ? 'valor-positivo' : 'valor-negativo';
        
        return `
            <div class="conta-item ${statusClass} ${tipoClass}">
                <div class="conta-header">
                    <div class="conta-info">
                        <h3>
                            <i class="${tipoIcon}" style="color: ${isReceita ? '#3182ce' : '#e53e3e'}; margin-right: 8px;"></i>
                            ${conta.descricao}
                            <span class="tipo-badge">${tipoText}</span>
                        </h3>
                        <div class="conta-meta">
                            <span class="${valorClass}"><i class="fas fa-dollar-sign"></i> ${formatarMoeda(conta.valor || 0)}</span>
                            <span><i class="fas fa-tag"></i> ${conta.categoria || 'Sem categoria'}</span>
                            <span><i class="${statusIcon}"></i> ${statusText}</span>
                            ${conta.recorrente ? '<span><i class="fas fa-redo"></i> Recorrente</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="conta-actions">
                    ${conta.paga !== true && !isReceita ? `
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
        
    } catch (error) {
        return '<div class="conta-item error">Erro ao carregar conta</div>';
    }
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
    
    try {
        const formData = new FormData(event.target);
        const valor = parseFloat(formData.get('valor')) || 0;
        
        const novaConta = {
            descricao: formData.get('descricao'),
            valor: valor,
            dataVencimento: formData.get('dataVencimento'),
            categoria: formData.get('categoria'),
            tipo: formData.get('tipo'),
            recorrente: formData.get('recorrente') === 'on'
        };
        
        // Enviar para o servidor
        const response = await fetch('/api/contas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaConta)
        });
        
        if (response.ok) {
            const contaSalva = await response.json();
            contas.push(contaSalva);
            
            fecharModalNovaConta();
            atualizarDashboard();
            renderizarContas();
            
            mostrarMensagem('Conta adicionada com sucesso!', 'success');
            
            // Simular notificação por e-mail
            if (emailConfigurado) {
                simularNotificacaoEmail(contaSalva);
            }
        } else {
            throw new Error('Erro ao salvar conta no servidor');
        }
        
    } catch (error) {
        console.error('❌ Erro ao salvar conta:', error);
        mostrarMensagem('Erro ao salvar conta. Tente novamente.', 'error');
    }
}

async function editarConta(id) {
    const conta = contas.find(c => c.id === id);
    if (!conta) return;
    
    document.getElementById('editId').value = conta.id;
    document.getElementById('editDescricao').value = conta.descricao;
    document.getElementById('editValor').value = conta.valor || 0;
    document.getElementById('editDataVencimento').value = conta.dataVencimento;
    document.getElementById('editTipo').value = conta.tipo || 'conta';
    document.getElementById('editCategoria').value = conta.categoria;
    document.getElementById('editRecorrente').checked = conta.recorrente;
    
    document.getElementById('modalEditarConta').style.display = 'flex';
}

async function atualizarConta(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const id = parseInt(formData.get('id'));
        const valor = parseFloat(formData.get('valor')) || 0;
        
        const dadosAtualizados = {
            descricao: formData.get('descricao'),
            valor: valor,
            dataVencimento: formData.get('dataVencimento'),
            categoria: formData.get('categoria'),
            tipo: formData.get('tipo'),
            recorrente: formData.get('recorrente') === 'on'
        };
        
        // Enviar para o servidor
        const response = await fetch(`/api/contas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        });
        
        if (response.ok) {
            const contaAtualizada = await response.json();
            
            // Atualizar na lista local
            const contaIndex = contas.findIndex(c => c.id === id);
            if (contaIndex !== -1) {
                contas[contaIndex] = contaAtualizada;
            }
            
            fecharModalEditarConta();
            atualizarDashboard();
            renderizarContas();
            
            mostrarMensagem('Conta atualizada com sucesso!', 'success');
        } else {
            throw new Error('Erro ao atualizar conta no servidor');
        }
        
    } catch (error) {
        console.error('❌ Erro ao atualizar conta:', error);
        mostrarMensagem('Erro ao atualizar conta. Tente novamente.', 'error');
    }
}

async function deletarConta(id) {
    if (!confirm('Tem certeza que deseja deletar esta conta?')) return;
    
    try {
        // Enviar para o servidor
        const response = await fetch(`/api/contas/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Remover da lista local
            contas = contas.filter(c => c.id !== id);
            
            atualizarDashboard();
            renderizarContas();
            
            mostrarMensagem('Conta deletada com sucesso!', 'success');
        } else {
            throw new Error('Erro ao deletar conta no servidor');
        }
        
    } catch (error) {
        console.error('❌ Erro ao deletar conta:', error);
        mostrarMensagem('Erro ao deletar conta. Tente novamente.', 'error');
    }
}

async function marcarComoPaga(id) {
    try {
        // Verificações básicas
        if (!id || !Array.isArray(contas)) {
            mostrarMensagem('Erro: Dados inválidos', 'error');
            return;
        }
        
        // Encontrar a conta
        const contaIndex = contas.findIndex(c => c && c.id === id);
        if (contaIndex === -1) {
            mostrarMensagem('Conta não encontrada', 'error');
            return;
        }
        
        // Verificar se já está paga
        if (contas[contaIndex].paga === true) {
            mostrarMensagem('Esta conta já está marcada como paga!', 'info');
            return;
        }
        
        // Enviar para o servidor
        const response = await fetch(`/api/contas/${id}/pagar`, {
            method: 'PATCH'
        });
        
        if (response.ok) {
            const contaAtualizada = await response.json();
            
            // Atualizar na lista local
            contas[contaIndex] = contaAtualizada;
            
            atualizarDashboard();
            renderizarContas();
            
            mostrarMensagem('Conta marcada como paga com sucesso!', 'success');
        } else {
            throw new Error('Erro ao marcar conta como paga no servidor');
        }
        
    } catch (error) {
        console.error('❌ Erro ao marcar como paga:', error);
        mostrarMensagem('Erro ao processar pagamento. Tente novamente.', 'error');
    }
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
    
    try {
        // Enviar para o servidor
        const response = await fetch('/api/configurar-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            emailConfigurado = { email };
            // Salvar configuração de e-mail no localStorage (mantido local)
            localStorage.setItem('familiaJamarEmail', JSON.stringify(emailConfigurado));
            fecharModalConfigurarEmail();
            mostrarMensagem(data.message, 'success');
        } else {
            mostrarMensagem(data.error || 'Erro ao configurar e-mail', 'error');
        }
    } catch (error) {
        console.error('Erro ao configurar e-mail:', error);
        mostrarMensagem('Erro de conexão com o servidor', 'error');
    }
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
                
                // Nota: Importação agora é apenas local, não salva no servidor
                // Para salvar no servidor, seria necessário enviar cada conta individualmente
                atualizarDashboard();
                renderizarContas();
                
                mostrarMensagem(`Importação realizada com sucesso! ${contas.length} contas importadas. (Nota: Dados apenas locais)`, 'success');
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

// Funções de notificação (agora usando servidor real)
async function enviarEmailConfirmacao(email) {
    try {
        const response = await fetch('/api/testar-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ E-mail de confirmação enviado com sucesso');
        } else {
            console.error('❌ Erro ao enviar e-mail:', data.error);
        }
    } catch (error) {
        console.error('❌ Erro de conexão:', error);
    }
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