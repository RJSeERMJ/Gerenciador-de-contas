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
            'totalPendente': formatarMoeda(saldo), // Saldo total (receita - despesa)
            'totalReceitas': formatarMoeda(totalReceitas)
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
    
    // Paleta de cores dinâmicas para categorias
    const paletaCores = [
        '#e53e3e', // Vermelho
        '#3182ce', // Azul
        '#38a169', // Verde
        '#d69e2e', // Amarelo
        '#805ad5', // Roxo
        '#dd6b20', // Laranja
        '#319795', // Teal
        '#e53e3e', // Rosa
        '#2d3748', // Cinza escuro
        '#4a5568', // Cinza médio
        '#718096', // Cinza claro
        '#a0aec0', // Cinza muito claro
        '#f56565', // Vermelho claro
        '#4299e1', // Azul claro
        '#48bb78', // Verde claro
        '#ed8936', // Laranja claro
        '#9f7aea', // Roxo claro
        '#38b2ac', // Teal claro
        '#ed64a6', // Rosa claro
        '#667eea'  // Índigo
    ];
    
    // Função para gerar cor baseada na categoria
    function obterCorCategoria(categoria, tipo) {
        // Hash simples para gerar índice consistente baseado na categoria
        let hash = 0;
        for (let i = 0; i < categoria.length; i++) {
            const char = categoria.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        const index = Math.abs(hash) % paletaCores.length;
        let cor = paletaCores[index];
        
        // Para receitas, usar tons mais claros da mesma cor
        if (tipo === 'receita') {
            // Converter para HSL e aumentar luminosidade
            const hex = cor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            // Aumentar luminosidade para receitas
            const fatorClareamento = 0.3;
            const rNovo = Math.min(255, r + (255 - r) * fatorClareamento);
            const gNovo = Math.min(255, g + (255 - g) * fatorClareamento);
            const bNovo = Math.min(255, b + (255 - b) * fatorClareamento);
            
            cor = `#${Math.round(rNovo).toString(16).padStart(2, '0')}${Math.round(gNovo).toString(16).padStart(2, '0')}${Math.round(bNovo).toString(16).padStart(2, '0')}`;
        }
        
        return cor;
    }
    
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
            
            // Cor da fatia baseada na categoria
            const tipo = titulo === 'Receitas' ? 'receita' : 'conta';
            const cor = obterCorCategoria(categoria, tipo);
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
        
        // Não desenhar mais o total no centro - será mostrado na legenda
    }
    
    // Criar legenda com total
    function criarLegenda(dados, corBase) {
        const entries = Object.entries(dados);
        if (entries.length === 0) return '';
        
        const total = Object.values(dados).reduce((sum, item) => sum + item.total, 0);
        const tipo = corBase === '#3182ce' ? 'receita' : 'conta';
        
        // Cabeçalho com total
        const header = `
            <div style="background: ${corBase}; color: white; padding: 8px 12px; border-radius: 6px 6px 0 0; margin-bottom: 8px; font-weight: bold; font-size: 13px; text-align: center;">
                Total Geral: ${formatarMoeda(total)}
            </div>
        `;
        
        const items = entries.map(([categoria, item], index) => {
            const percentage = total > 0 ? ((item.total / total) * 100).toFixed(1) : '0.0';
            const corCategoria = obterCorCategoria(categoria, tipo);
            
            return `
                <div style="display: flex; align-items: center; margin: 4px 0; font-size: 11px; padding: 6px 8px; background: rgba(255,255,255,0.95); border-radius: 4px; border-left: 3px solid ${corCategoria};">
                    <div style="width: 8px; height: 8px; background: ${corCategoria}; border-radius: 50%; margin-right: 8px;"></div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: bold; color: #2d3748; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${categoria}</div>
                        <div style="font-size: 9px; color: #718096;">${item.count} ${item.count === 1 ? 'item' : 'itens'}</div>
                    </div>
                    <div style="text-align: right; margin-left: 8px;">
                        <div style="color: ${corCategoria}; font-weight: bold; font-size: 11px;">${formatarMoeda(item.total)}</div>
                        <div style="font-size: 9px; color: #718096;">${percentage}%</div>
                    </div>
                </div>
            `;
        }).join('');
        
        return header + items;
    }
    
    // Criar HTML com layout lado a lado
    const legendaContas = criarLegenda(categoriasContas, '#e53e3e');
    const legendaReceitas = criarLegenda(categoriasReceitas, '#3182ce');
    
    graficoCategoria.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
            <!-- Gráfico de Contas -->
            <div style="display: flex; align-items: flex-start; gap: 20px; min-width: 400px;">
                <div style="text-align: center;">
                    <h4 style="color: #e53e3e; margin-bottom: 15px; font-size: 16px;">📊 Contas (Despesas)</h4>
                    <canvas id="graficoPizzaContas" width="200" height="200" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); background: white;"></canvas>
                </div>
                <div style="min-width: 180px; max-width: 200px;">
                    ${legendaContas || '<p style="color: #718096; font-style: italic; text-align: center; font-size: 12px;">Nenhuma conta cadastrada</p>'}
                </div>
            </div>
            
            <!-- Gráfico de Receitas -->
            <div style="display: flex; align-items: flex-start; gap: 20px; min-width: 400px;">
                <div style="text-align: center;">
                    <h4 style="color: #3182ce; margin-bottom: 15px; font-size: 16px;">💰 Receitas</h4>
                    <canvas id="graficoPizzaReceitas" width="200" height="200" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); background: white;"></canvas>
                </div>
                <div style="min-width: 180px; max-width: 200px;">
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

// Funções de exportação/importação CSV
function exportarContas() {
    // Cabeçalho do CSV
    const headers = ['ID', 'Descrição', 'Valor', 'Data de Vencimento', 'Categoria', 'Tipo', 'Recorrente', 'Paga', 'Data de Criação', 'Data de Pagamento'];
    
    // Converter contas para CSV
    const csvContent = [
        headers.join(','),
        ...contas.map(conta => [
            conta.id,
            `"${conta.descricao.replace(/"/g, '""')}"`, // Escapar aspas duplas
            conta.valor || 0,
            conta.dataVencimento || '',
            `"${conta.categoria || 'Outros'}"`,
            conta.tipo || 'conta',
            conta.recorrente ? 'Sim' : 'Não',
            conta.paga ? 'Sim' : 'Não',
            conta.dataCriacao || '',
            conta.dataPagamento || ''
        ].join(','))
    ].join('\n');
    
    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familia-jamar-contas-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostrarMensagem('Dados exportados em CSV com sucesso!', 'success');
}

function baixarModeloCSV() {
    // Cabeçalho do CSV modelo
    const headers = ['ID', 'Descrição', 'Valor', 'Data de Vencimento', 'Categoria', 'Tipo', 'Recorrente', 'Paga', 'Data de Criação', 'Data de Pagamento'];
    
    // Dados de exemplo
    const exemplos = [
        ['1', 'Conta de Luz', '150.00', '2024-01-15', 'Energia', 'conta', 'Sim', 'Não', '2024-01-01', ''],
        ['2', 'Salário', '3000.00', '2024-01-05', 'Trabalho', 'receita', 'Sim', 'Sim', '2024-01-01', '2024-01-05'],
        ['3', 'Internet', '89.90', '2024-01-20', 'Serviços', 'conta', 'Sim', 'Não', '2024-01-01', ''],
        ['4', 'Freelance', '500.00', '2024-01-10', 'Trabalho', 'receita', 'Não', 'Sim', '2024-01-01', '2024-01-10']
    ];
    
    // Criar conteúdo CSV
    const csvContent = [
        headers.join(','),
        ...exemplos.map(row => row.join(','))
    ].join('\n');
    
    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo-contas-familia-jamar.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostrarMensagem('Arquivo modelo baixado com sucesso!', 'success');
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
            const csvContent = e.target.result;
            const linhas = csvContent.split('\n');
            
            if (linhas.length < 2) {
                mostrarMensagem('Arquivo CSV inválido! Deve ter pelo menos cabeçalho e uma linha de dados.', 'error');
                return;
            }
            
            // Verificar cabeçalho
            const headers = linhas[0].split(',').map(h => h.trim());
            const expectedHeaders = ['ID', 'Descrição', 'Valor', 'Data de Vencimento', 'Categoria', 'Tipo', 'Recorrente', 'Paga', 'Data de Criação', 'Data de Pagamento'];
            
            if (!expectedHeaders.every(header => headers.includes(header))) {
                mostrarMensagem('Formato de CSV inválido! Use o arquivo modelo como referência.', 'error');
                return;
            }
            
            // Processar linhas de dados
            const novasContas = [];
            for (let i = 1; i < linhas.length; i++) {
                const linha = linhas[i].trim();
                if (!linha) continue; // Pular linhas vazias
                
                // Parsear CSV considerando aspas
                const valores = parseCSVLine(linha);
                
                if (valores.length >= 8) {
                    const conta = {
                        id: parseInt(valores[0]) || Date.now() + i,
                        descricao: valores[1].replace(/^"|"$/g, ''), // Remover aspas
                        valor: parseFloat(valores[2]) || 0,
                        dataVencimento: valores[3] || '',
                        categoria: valores[4].replace(/^"|"$/g, '') || 'Outros',
                        tipo: valores[5] || 'conta',
                        recorrente: valores[6].toLowerCase() === 'sim',
                        paga: valores[7].toLowerCase() === 'sim',
                        dataCriacao: valores[8] || new Date().toISOString(),
                        dataPagamento: valores[9] || ''
                    };
                    
                    novasContas.push(conta);
                }
            }
            
            if (novasContas.length > 0) {
                // Adicionar contas ao servidor
                importarContasParaServidor(novasContas);
            } else {
                mostrarMensagem('Nenhuma conta válida encontrada no arquivo!', 'error');
            }
            
        } catch (error) {
            console.error('Erro ao processar CSV:', error);
            mostrarMensagem('Erro ao processar arquivo CSV! Verifique o formato.', 'error');
        }
    };
    reader.readAsText(file);
    
    // Limpar input
    event.target.value = '';
}

// Função para parsear linha CSV considerando aspas
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Função para importar contas para o servidor
async function importarContasParaServidor(novasContas) {
    try {
        let sucessos = 0;
        let erros = 0;
        
        for (const conta of novasContas) {
            try {
                const response = await fetch('/api/contas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        descricao: conta.descricao,
                        valor: conta.valor,
                        dataVencimento: conta.dataVencimento,
                        categoria: conta.categoria,
                        tipo: conta.tipo,
                        recorrente: conta.recorrente
                    })
                });
                
                if (response.ok) {
                    const contaSalva = await response.json();
                    contas.push(contaSalva);
                    sucessos++;
                } else {
                    erros++;
                }
            } catch (error) {
                console.error('Erro ao importar conta:', error);
                erros++;
            }
        }
        
        // Atualizar interface
        atualizarDashboard();
        renderizarContas();
        
        if (sucessos > 0) {
            mostrarMensagem(`Importação concluída! ${sucessos} contas importadas com sucesso${erros > 0 ? `, ${erros} erros` : ''}.`, 'success');
        } else {
            mostrarMensagem('Nenhuma conta foi importada. Verifique o formato do arquivo.', 'error');
        }
        
    } catch (error) {
        console.error('Erro na importação:', error);
        mostrarMensagem('Erro durante a importação. Tente novamente.', 'error');
    }
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