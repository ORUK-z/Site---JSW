/**
 * js/main.js
 * Lógica principal da aplicação.
 */

// Garante que o script execute apenas após o carregamento completo do DOM.
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeSchedulingForm();
    updateUserNav(); // <-- Adicione esta chamada
});

/**
 * Inicializa a funcionalidade de toggle para o menu mobile.
 */
function initializeMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    } else {
        console.error("Elementos do menu mobile não foram encontrados.");
    }
}

/**
 * Inicializa a funcionalidade de submissão do formulário de agendamento.
 */
function initializeSchedulingForm() {
    const scheduleForm = document.getElementById('schedule-form');
    const successMessage = document.getElementById('form-success-message');

    if (scheduleForm && successMessage) {
        scheduleForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Previne o envio real do formulário.

            // Oculta o formulário e exibe a mensagem de sucesso.
            scheduleForm.style.display = 'none';
            successMessage.classList.remove('hidden');

            // Reseta e reexibe o formulário após 5 segundos.
            setTimeout(() => {
                scheduleForm.reset();
                scheduleForm.style.display = 'block';
                successMessage.classList.add('hidden');
            }, 5000);
        });
    } else {
        console.error("Elementos do formulário de agendamento não foram encontrados.");
    }
}

// --- Nova função para atualizar a barra de navegação ---
async function updateUserNav() {
    const loginLink = document.getElementById('login-link');
    const userInfoDiv = document.getElementById('user-info');
    const userGreetingSpan = document.getElementById('user-greeting');

    try {
        const response = await fetch('/api/user');
        const user = await response.json();

        if (user) {
            // Usuário está logado
            loginLink.classList.add('hidden'); // Esconde o ícone de login
            
            userGreetingSpan.textContent = `Olá, ${user.nome}`; // Exibe a saudação
            userInfoDiv.classList.remove('hidden'); // Mostra a div do usuário
            userInfoDiv.classList.add('flex'); // Garante que os itens fiquem alinhados
        } else {
            // Usuário não está logado, mantenha o estado padrão
            loginLink.classList.remove('hidden');

            userInfoDiv.classList.add('hidden');
            userInfoDiv.classList.remove('flex');
        }
    } catch (error) {
        console.error('Erro ao buscar status do usuário:', error);
    }
}