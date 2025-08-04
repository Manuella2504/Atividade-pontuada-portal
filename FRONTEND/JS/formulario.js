// Sistema de avaliação por estrelas
        const stars = document.querySelectorAll('.star');
        const ratingInput = document.getElementById('rating');
        const ratingText = document.getElementById('rating-text');
        
        const ratingTexts = {
            1: 'Muito Insatisfeito',
            2: 'Insatisfeito',
            3: 'Neutro',
            4: 'Satisfeito',
            5: 'Muito Satisfeito'
        };

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const rating = index + 1;
                ratingInput.value = rating;
                ratingText.textContent = ratingTexts[rating];
                
                // Atualiza as estrelas visuais
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });

            star.addEventListener('mouseenter', () => {
                const rating = index + 1;
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.style.color = '#FFD700';
                    } else {
                        s.style.color = '#d1d5db';
                    }
                });
            });
        });

        // Reset das estrelas quando o mouse sai
        document.querySelector('.rating-container').addEventListener('mouseleave', () => {
            const currentRating = parseInt(ratingInput.value);
            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.style.color = '#FFD700';
                } else {
                    s.style.color = '#d1d5db';
                }
            });
        });

        // Formatação do telefone
        document.getElementById('telefone').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });

        // Manipulação do formulário
        // FRONTEND/JS/formulario.js

// ... (mantenha o código das estrelas e da máscara de telefone) ...

// Substitua a função de submit do formulário por esta:
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        categoria: document.getElementById('categoria').value,
        assunto: document.getElementById('assunto').value,
        mensagem: document.getElementById('mensagem').value,
        rating: document.getElementById('rating').value
    };

    if (!formData.nome || !formData.email || !formData.categoria || !formData.assunto || !formData.mensagem) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (formData.rating === '0') {
        alert('Por favor, forneça uma avaliação clicando nas estrelas.');
        return;
    }

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    fetch('http://localhost:3000/api/auth/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('feedbackForm').reset();
        
        // Reset das estrelas
        ratingInput.value = '0';
        ratingText.textContent = 'Clique nas estrelas para avaliar';
        stars.forEach(s => s.classList.remove('active'));

        setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
        }, 5000);
    })
    .catch(error => {
        alert(`Erro ao enviar formulário: ${error.message}`);
    })
    .finally(() => {
        submitBtn.textContent = 'Enviar Feedback';
        submitBtn.disabled = false;
    });
});

        // Função para alternar sidebar
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const toggleIcon = document.getElementById('toggleIcon');
            
            sidebar.classList.toggle('collapsed');
            
            if (window.innerWidth > 768) {
                // Desktop behavior
                if (sidebar.classList.contains('collapsed')) {
                    if (toggleIcon) toggleIcon.className = 'fas fa-chevron-right';
                } else {
                    if (toggleIcon) toggleIcon.className = 'fas fa-chevron-left';
                }
            } else {
                // Mobile behavior
                sidebar.classList.toggle('show');
            }
        }

        // Handle window resize
        window.addEventListener('resize', function() {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
            }
        });

        // Add active state to nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.querySelector('.mobile-toggle');
            
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !mobileToggle.contains(e.target) && 
                sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        });