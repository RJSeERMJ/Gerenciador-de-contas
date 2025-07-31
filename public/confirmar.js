// Função para mostrar mensagem de erro
function mostrarErro(mensagem) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const confirmMessage = document.querySelector('.confirm-message');
    const confirmIcon = document.getElementById('confirmIcon');
    
    errorText.textContent = mensagem;
    errorDiv.style.display = 'block';
    confirmMessage.style.display = 'none';
    confirmIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
    confirmIcon.style.color = '#dc3545';
}

// Função para mostrar mensagem de sucesso
function mostrarSucesso(mensagem) {
    const successDiv = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    
    successText.textContent = mensagem;
    successDiv.style.display = 'block';
}

// Função para mostrar/esconder loading
function toggleLoading(mostrar) {
    const loading = document.getElementById('loading');
    const accessBtn = document.getElementById('accessBtn');
    
    if (mostrar) {
        loading.style.display = 'block';
        accessBtn.style.display = 'none';
    } else {
        loading.style.display = 'none';
        accessBtn.style.display = 'inline-block';
    }
}

// Função para obter parâmetros da URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Função para confirmar acesso
async function confirmarAcesso(token) {
    try {
        const response = await fetch('/api/confirmar-acesso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token
            })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarSucesso('Acesso confirmado com sucesso! Você será redirecionado para o sistema.');
            
            // Aguardar 2 segundos e redirecionar
            setTimeout(() => {
                window.location.href = '/sistema';
            }, 2000);
        } else {
            mostrarErro(data.error || 'Erro ao confirmar acesso');
        }
    } catch (error) {
        console.error('Erro ao confirmar acesso:', error);
        mostrarErro('Erro ao confirmar acesso. Tente novamente.');
    }
}

// Event listener quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    const token = getUrlParameter('token');
    
    if (!token) {
        mostrarErro('Token de acesso não encontrado. Verifique o link enviado por e-mail.');
        return;
    }

    // Confirmar acesso automaticamente
    toggleLoading(true);
    confirmarAcesso(token).finally(() => {
        toggleLoading(false);
    });
}); 