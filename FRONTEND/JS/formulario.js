document.addEventListener("DOMContentLoaded", () => {
    // --- SELEÇÃO DE ELEMENTOS ---
    const sidebar = document.getElementById("sidebar");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    const feedbackForm = document.getElementById("feedbackForm");
    const stars = document.querySelectorAll(".star");
    const ratingInput = document.getElementById("rating");
    const ratingText = document.getElementById("rating-text");
    const successMessage = document.getElementById("successMessage"); // Elemento da mensagem de sucesso

    // Elementos do Modal de Confirmação
    const confirmationModal = document.getElementById("confirmationModal");
    const confirmSendBtn = document.getElementById("confirmSendBtn");
    const cancelSendBtn = document.getElementById("cancelSendBtn");

    // --- LÓGICA DA SIDEBAR ---

    /**
     * Define o link ativo no menu de navegação.
     */
    const setActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'formulario.html';
        navLinks.forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
            }
        });
    };

    /**
     * Carrega as informações do usuário na sidebar (simulação de login).
     */
    const loadUserInfo = () => {
        const userNameElement = document.getElementById('sidebarUserName');
        const userAvatarElement = document.getElementById('userAvatar');
        const loggedInUserName = localStorage.getItem('userName') || "Usuário";
        
        if(userNameElement && userAvatarElement) {
            userNameElement.textContent = loggedInUserName;
            userAvatarElement.textContent = loggedInUserName.charAt(0).toUpperCase();
        }
    };
    
    /**
     * Alterna a visibilidade da sidebar em dispositivos móveis.
     */
    window.toggleSidebarMobile = () => {
        sidebar.classList.toggle('show');
    };

    // --- LÓGICA DO FORMULÁRIO ---

    // Aplica a máscara de telefone usando jQuery Mask
    // (Verifica se jQuery está disponível)
    if (typeof $ !== 'undefined' && typeof $.fn.mask !== 'undefined') {
        $('#telefone').mask('(00) 00000-0000');
    }

    // Lógica para a avaliação por estrelas
    const ratingDescriptions = [
        "Clique nas estrelas para avaliar", "Ruim", "Regular", "Bom", "Muito Bom", "Excelente"
    ];

    const updateStars = (rating) => {
        stars.forEach(star => {
            star.classList.toggle("active", parseInt(star.dataset.rating) <= rating);
        });
        ratingText.textContent = ratingDescriptions[rating];
    };

    stars.forEach(star => {
        star.addEventListener("click", () => {
            const rating = parseInt(star.dataset.rating);
            ratingInput.value = rating;
            updateStars(rating);
        });
    });

    /**
     * Função principal para enviar os dados do formulário para o backend.
     */
    const sendFormData = () => {
        const submitBtn = feedbackForm.querySelector(".submit-btn");
        submitBtn.disabled = true;
        submitBtn.textContent = "A enviar...";

        const formData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            categoria: document.getElementById('categoria').value,
            assunto: document.getElementById('assunto').value,
            mensagem: document.getElementById('mensagem').value,
            rating: ratingInput.value,
        };

        fetch('http://localhost:3000/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                // Se o servidor retornar um erro, lança uma exceção
                throw new Error('Falha no servidor. Tente novamente mais tarde.');
            }
            return response.json();
        })
        .then(data => {
            // Exibe a mensagem de sucesso
            successMessage.style.display = "block"; 
            feedbackForm.reset();
            ratingInput.value = "0";
            updateStars(0);
            
            // Esconde a mensagem após 5 segundos
            setTimeout(() => { 
                successMessage.style.display = "none"; 
            }, 5000);
        })
        .catch(error => {
            console.error('Erro ao enviar feedback:', error);
            alert("Ocorreu um erro ao enviar seu feedback. " + error.message);
        })
        .finally(() => {
            // Reativa o botão de envio, independentemente do resultado
            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar Feedback";
            closeModal();
        });
    };
    
    // --- LÓGICA DO MODAL DE CONFIRMAÇÃO ---
    
    const openModal = () => confirmationModal.style.display = "block";
    const closeModal = () => confirmationModal.style.display = "none";

    // Abre o modal ao submeter o formulário
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        openModal();
    });

    // Fecha o modal ao clicar em "Cancelar"
    cancelSendBtn.addEventListener("click", closeModal);

    // Envia os dados e fecha o modal ao clicar em "Sim, Enviar"
    confirmSendBtn.addEventListener("click", sendFormData);

    // Fecha o modal se o utilizador clicar fora da caixa de diálogo
    window.addEventListener("click", (event) => {
        if (event.target == confirmationModal) {
            closeModal();
        }
    });

    // --- INICIALIZAÇÃO ---
    setActiveLink();
    loadUserInfo();
}); 