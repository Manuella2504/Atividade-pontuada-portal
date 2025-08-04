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
    const successMessage = document.getElementById("successMessage");

    // Desabilita o botão e mostra o estado de carregamento
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    // Coleta todos os dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        categoria: document.getElementById('categoria').value,
        assunto: document.getElementById('assunto').value,
        mensagem: document.getElementById('mensagem').value,
        rating: document.getElementById('rating').value,
    };

    // Envia os dados para a sua API no backend
    fetch('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            // Se não foi, lança um erro para ser pego pelo .catch()
            throw new Error('Falha no servidor. Tente novamente mais tarde.');
        }
        return response.json();
    })
    .then(data => {
        // Lida com a resposta de sucesso do servidor
        console.log(data.message); // Exibe "Feedback enviado com sucesso!" no console

        // Mostra a mensagem de sucesso na tela
        successMessage.style.display = "block";

        // Reseta o formulário
        feedbackForm.reset();

        // Reseta a avaliação com estrelas para o estado inicial
        const ratingInput = document.getElementById("rating");
        ratingInput.value = "0";
        // Supondo que você tenha uma função `updateStars` para atualizar a UI das estrelas
        if (typeof updateStars === 'function') {
            updateStars(0);
        }

        // Esconde a mensagem de sucesso após 5 segundos
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 5000);
    })
    .catch(error => {
        // Lida com erros de rede ou do servidor
        console.error('Erro ao enviar feedback:', error);
        alert(error.message);
    })
    .finally(() => {
        // Este bloco sempre será executado, independentemente de sucesso ou erro
        // Reabilita o botão e restaura o texto
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar Feedback";
    });
});

    // --- INICIALIZAÇÃO ---
    setActiveLink();
});