// Função para formatar CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validar primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto < 2 ? 0 : resto;
    
    // Validar segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto < 2 ? 0 : resto;
    
    return parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2;
}

// Função para mostrar mensagem
function mostrarMensagem(texto, tipo) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = texto;
    messageDiv.className = `message ${tipo}`;
    messageDiv.style.display = 'block';
    
    // Esconder mensagem após 5 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Função para mostrar/esconder loading
function toggleLoading(mostrar) {
    const loading = document.getElementById('loading');
    const loginBtn = document.getElementById('loginBtn');
    
    if (mostrar) {
        loading.style.display = 'block';
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    } else {
        loading.style.display = 'none';
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Solicitar Acesso';
    }
}

// Função para validar e-mail
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para enviar solicitação de acesso
async function enviarSolicitacao(email, cpf) {
    try {
        const response = await fetch('/api/solicitar-acesso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                cpf: cpf
            })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarMensagem('✅ Solicitação enviada com sucesso! Verifique seu e-mail para confirmar o acesso.', 'success');
            
            // Limpar formulário
            document.getElementById('loginForm').reset();
        } else {
            mostrarMensagem(`❌ Erro: ${data.error}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao enviar solicitação:', error);
        mostrarMensagem('❌ Erro ao enviar solicitação. Tente novamente.', 'error');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('cpf');
    const loginForm = document.getElementById('loginForm');

    // Formatar CPF automaticamente
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            e.target.value = formatarCPF(value);
        }
    });

    // Submeter formulário
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const cpf = document.getElementById('cpf').value.trim();

        // Validações
        if (!email) {
            mostrarMensagem('❌ Por favor, informe seu e-mail.', 'error');
            return;
        }

        if (!validarEmail(email)) {
            mostrarMensagem('❌ Por favor, informe um e-mail válido.', 'error');
            return;
        }

        if (!cpf) {
            mostrarMensagem('❌ Por favor, informe seu CPF.', 'error');
            return;
        }

        if (!validarCPF(cpf)) {
            mostrarMensagem('❌ CPF inválido. Verifique os números informados.', 'error');
            return;
        }

        // Verificar se é o CPF autorizado
        const cpfLimpo = cpf.replace(/\D/g, '');
        if (cpfLimpo !== '15119236790') {
            mostrarMensagem('❌ CPF não autorizado. Apenas o CPF 151.192.367-90 tem acesso ao sistema.', 'error');
            return;
        }

        // Enviar solicitação
        toggleLoading(true);
        await enviarSolicitacao(email, cpf);
        toggleLoading(false);
    });

    // Focar no primeiro campo
    document.getElementById('email').focus();
}); 