document.addEventListener("DOMContentLoaded", () => {
    // --- SELETORES DE ELEMENTOS ---
    const sidebar = document.getElementById("sidebar");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    const feedbackForm = document.getElementById("feedbackForm");
    const successMessage = document.getElementById("successMessage");
    const stars = document.querySelectorAll(".star");
    const ratingInput = document.getElementById("rating");
    const ratingText = document.getElementById("rating-text");

    // --- 1. LÓGICA DO MENU LATERAL (SIDEBAR) ---

    /**
     * Alterna a visibilidade da sidebar em telas mobile.
     */
    window.toggleSidebarMobile = () => {
        sidebar.classList.toggle("show");
    };

    /**
     * Define o link ativo no menu de navegação.
     */
    const setActiveLink = () => {
        const currentPage = window.location.href;
        navLinks.forEach(link => {
            if (currentPage.includes(link.getAttribute("href"))) {
                link.classList.add("active");
            }
        });
    };

    // --- 2. MÁSCARA DE TELEFONE (com JQuery Mask) ---
    // A biblioteca já está no HTML, então podemos usá-la.
    $(document).ready(function(){
        $('#telefone').mask('(00) 00000-0000');
    });


    // --- 3. LÓGICA DA AVALIAÇÃO COM ESTRELAS ---

    const ratingDescriptions = [
        "Clique nas estrelas para avaliar", // 0 estrelas
        "Ruim",   // 1 estrela
        "Regular",// 2 estrelas
        "Bom",    // 3 estrelas
        "Muito Bom", // 4 estrelas
        "Excelente" // 5 estrelas
    ];

    /**
     * Atualiza a aparência das estrelas com base em uma avaliação.
     * @param {number} rating - A avaliação de 0 a 5.
     */
    const updateStars = (rating) => {
        stars.forEach(star => {
            if (parseInt(star.dataset.rating) <= rating) {
                star.classList.add("active");
            } else {
                star.classList.remove("active");
            }
        });
        ratingText.textContent = ratingDescriptions[rating];
    };

    // Adiciona eventos de clique para cada estrela
    stars.forEach(star => {
        star.addEventListener("click", () => {
            const rating = parseInt(star.dataset.rating);
            ratingInput.value = rating;
            updateStars(rating);
        });

        // Efeito de hover
        star.addEventListener("mouseover", () => {
            const hoverRating = parseInt(star.dataset.rating);
            stars.forEach(s => {
                s.style.color = parseInt(s.dataset.rating) <= hoverRating ? '#FFD700' : '#d1d5db';
            });
        });
    });

    // Reseta o hover quando o mouse sai do container de estrelas
    document.querySelector('.rating-container').addEventListener("mouseleave", () => {
        const currentRating = parseInt(ratingInput.value) || 0;
        updateStars(currentRating); // Volta para a seleção clicada
    });


    // --- 4. LÓGICA DE SUBMISSÃO DO FORMULÁRIO ---

    feedbackForm.addEventListener("submit", (e) => {
        // Previne o comportamento padrão de recarregar a página
        e.preventDefault();

        const submitBtn = e.target.querySelector(".submit-btn");

        // Simula o envio desabilitando o botão
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";

        // Simula um tempo de espera de 2 segundos para o "envio"
        setTimeout(() => {
            // Mostra a mensagem de sucesso
            successMessage.style.display = "block";

            // Reseta o formulário
            feedbackForm.reset();

            // Reseta a avaliação com estrelas para o estado inicial
            ratingInput.value = "0";
            updateStars(0);

            // Reabilita o botão
            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar Feedback";

            // Esconde a mensagem de sucesso após 5 segundos
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 5000);

        }, 2000);
    });

    // --- INICIALIZAÇÃO ---
    setActiveLink();
});