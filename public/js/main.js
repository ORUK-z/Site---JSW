/**
 * js/main.js
 * Lógica principal da aplicação.
 */

// Garante que o script execute apenas após o carregamento completo do DOM.
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeSchedulingForm();
    updateUserNav();
    updateAppointmentHistory(); // Carrega o histórico de agendamentos
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
        scheduleForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                name: scheduleForm.querySelector('#name').value,
                address: scheduleForm.querySelector('#address').value,
                serviceType: scheduleForm.querySelector('#service-type').value,
                date: scheduleForm.querySelector('#date').value
            };

            try {
                const response = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const data = await response.json();
                    // Oculta o formulário e exibe a mensagem de sucesso.
                    scheduleForm.style.display = 'none';
                    successMessage.classList.remove('hidden');

                    // Atualiza o histórico de agendamentos
                    updateAppointmentHistory();

                    // Reseta e reexibe o formulário após 5 segundos.
                    setTimeout(() => {
                        scheduleForm.reset();
                        scheduleForm.style.display = 'block';
                        successMessage.classList.add('hidden');
                    }, 5000);
                } else {
                    throw new Error('Erro ao agendar serviço');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao agendar o serviço. Por favor, tente novamente.');
            }
        });
    } else {
        console.error("Elementos do formulário de agendamento não foram encontrados.");
    }
}

async function updateAppointmentHistory() {
    try {
        const response = await fetch('/api/appointments/history', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        if (response.ok) {
            const appointments = await response.json();
            const historyContainer = document.getElementById('appointment-history');
            
            if (historyContainer) {
                historyContainer.innerHTML = '';
                appointments.forEach(appointment => {
                    const appointmentItem = document.createElement('div');
                    appointmentItem.className = 'bg-white p-4 rounded-lg shadow-md mb-4';
                    appointmentItem.innerHTML = `
                        <h3 class="text-lg font-semibold mb-2">${appointment.serviceType}</h3>
                        <p class="text-gray-600 mb-2">Data: ${new Date(appointment.date).toLocaleDateString('pt-BR', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                        <p class="text-gray-600">Status: ${appointment.status}</p>
                    `;
                    historyContainer.appendChild(appointmentItem);
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
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