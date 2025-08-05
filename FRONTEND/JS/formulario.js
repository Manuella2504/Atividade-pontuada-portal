document.addEventListener("DOMContentLoaded", () => {
    // --- SELETORES DE ELEMENTOS ---
    const sidebar = document.getElementById("sidebar");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    const feedbackForm = document.getElementById("feedbackForm");
    const successMessage = document.getElementById("successMessage");
    const stars = document.querySelectorAll(".star");
    const ratingInput = document.getElementById("rating");
    const ratingText = document.getElementById("rating-text");

    // Elementos do Modal de Confirmação
    const confirmationModal = document.getElementById("confirmationModal");
    const confirmSendBtn = document.getElementById("confirmSendBtn");
    const cancelSendBtn = document.getElementById("cancelSendBtn");

    // --- 1. LÓGICA DO MENU LATERAL (SIDEBAR) ---
    const setActiveLink = () => {
        const currentPage = window.location.href;
        navLinks.forEach(link => {
            if (currentPage.includes(link.getAttribute("href"))) {
                link.classList.add("active");
            }
        });
    };

    // --- 2. MÁSCARA DE TELEFONE ---
    // (Lembre-se de que isso depende do jQuery e da biblioteca Mask)
    if (typeof $ !== 'undefined') {
        $('#telefone').mask('(00) 00000-0000');
    }

    // --- 3. LÓGICA DA AVALIAÇÃO COM ESTRELAS (FUNÇÃO CORRIGIDA) ---
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

    // --- 4. FUNÇÃO PARA ENVIAR OS DADOS DO FORMULÁRIO ---
    const sendFormData = () => {
        const submitBtn = feedbackForm.querySelector(".submit-btn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";

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
            if (!response.ok) throw new Error('Falha no servidor.');
            return response.json();
        })
        .then(data => {
            successMessage.style.display = "block";
            feedbackForm.reset();
            ratingInput.value = "0";
            updateStars(0);
            setTimeout(() => { successMessage.style.display = "none"; }, 5000);
        })
        .catch(error => {
            console.error('Erro ao enviar feedback:', error);
            alert(error.message);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar Feedback";
        });
    };

    // --- 5. LÓGICA DE SUBMISSÃO E MODAL ---
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        confirmationModal.style.display = "block";
    });

    cancelSendBtn.addEventListener("click", () => {
        confirmationModal.style.display = "none";
    });

    confirmSendBtn.addEventListener("click", () => {
        confirmationModal.style.display = "none";
        sendFormData();
    });

    window.addEventListener("click", (event) => {
        if (event.target == confirmationModal) {
            confirmationModal.style.display = "none";
        }
    });

    // --- INICIALIZAÇÃO ---
    setActiveLink();
});