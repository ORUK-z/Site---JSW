/**
 * js/main.js
 * Lógica principal da aplicação.
 */

// Garante que o script execute apenas após o carregamento completo do DOM.
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeSchedulingForm();
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