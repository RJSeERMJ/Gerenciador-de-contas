// Sistema de Login - Família Jamar
// Versão Online

// URL do servidor
const SERVER_URL = 'https://familiajamar.vercel.app';

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loginText = document.getElementById('loginText');
const successText = document.getElementById('successText');
const errorText = document.getElementById('errorText');

// Verificar se já está logado
function verificarLogin() {
    const loginTime = localStorage.getItem('loginTime');
    const username = localStorage.getItem('username');
    
    if (loginTime && username) {
        const now = new Date().getTime();
        const loginTimeStamp = parseInt(loginTime);
        const hoursDiff = (now - loginTimeStamp) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            // Login ainda válido, redirecionar para o sistema
            window.location.href = '/sistema';
            return;
        } else {
            // Login expirado
            localStorage.removeItem('loginTime');
            localStorage.removeItem('username');
        }
    }
}

// Fazer login
async function fazerLogin(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const senha = document.getElementById('senha').value;
    
    if (!nome || !senha) {
        mostrarErro('Por favor, preencha todos os campos.');
        return;
    }
    
    try {
        // Desabilitar botão
        loginBtn.disabled = true;
        loginText.textContent = 'Entrando...';
        
        // Fazer requisição para o servidor
        const response = await fetch(`${SERVER_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, senha })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Login bem-sucedido
            mostrarSucesso('Login realizado com sucesso!');
            
            // Salvar dados de login
            localStorage.setItem('username', nome);
            localStorage.setItem('loginTime', new Date().getTime().toString());
            
            // Redirecionar após 1 segundo
            setTimeout(() => {
                window.location.href = '/sistema';
            }, 1000);
        } else {
            // Login falhou
            mostrarErro(data.error || 'Credenciais inválidas.');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        mostrarErro('Erro de conexão. Tente novamente.');
    } finally {
        // Reabilitar botão
        loginBtn.disabled = false;
        loginText.textContent = 'Entrar';
    }
}

// Mostrar mensagem de sucesso
function mostrarSucesso(mensagem) {
    successText.textContent = mensagem;
    successText.style.display = 'block';
    errorText.style.display = 'none';
    
    setTimeout(() => {
        successText.style.display = 'none';
    }, 3000);
}

// Mostrar mensagem de erro
function mostrarErro(mensagem) {
    errorText.textContent = mensagem;
    errorText.style.display = 'block';
    successText.style.display = 'none';
    
    setTimeout(() => {
        errorText.style.display = 'none';
    }, 5000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    verificarLogin();
    
    // Login com Enter
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fazerLogin(e);
        }
    });
});

// Form submit
loginForm.addEventListener('submit', fazerLogin); 