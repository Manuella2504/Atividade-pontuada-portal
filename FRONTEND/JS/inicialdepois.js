document.addEventListener('DOMContentLoaded', () => {
    // --- SELETORES DE ELEMENTOS ---
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats');
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    // --- 1. LÓGICA DO MENU LATERAL (SIDEBAR) ---

    /**
     * Alterna a visibilidade do menu lateral em dispositivos móveis.
     */
    window.toggleSidebarMobile = () => {
        sidebar.classList.toggle('show');
    };

    /**
     * Define o link ativo no menu de navegação.
     */
    const setActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop();
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            // A página 'iniciodepois.html' é a principal
            if (linkPage === 'iniciodepois.html') {
                link.classList.add('active');
            }
        });
    };

    /**
     * Carrega as informações do usuário (simulação de login).
     */
    const loadUserInfo = () => {
        const userNameElement = document.getElementById('sidebarUserName');
        const userAvatarElement = document.getElementById('userAvatar');
        const loggedInUserName = localStorage.getItem('userName');

        if (loggedInUserName) {
            userNameElement.textContent = loggedInUserName;
            userAvatarElement.textContent = loggedInUserName.charAt(0).toUpperCase();
        }
    };

    // --- 2. ANIMAÇÃO DE CONTAGEM NA SEÇÃO DE ESTATÍSTICAS ---

    /**
     * Anima um número de 0 até o valor final.
     * @param {HTMLElement} el - O elemento que contém o número.
     */
    const animateCountUp = (el) => {
        const targetValue = parseInt(el.textContent.replace('+', ''), 10);
        let currentValue = 0;
        const duration = 2000; // 2 segundos
        const increment = targetValue / (duration / 16); // Incremento por quadro (aprox. 60fps)

        const updateCount = () => {
            currentValue += increment;
            if (currentValue < targetValue) {
                el.textContent = Math.ceil(currentValue) + (el.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = targetValue + (el.textContent.includes('+') ? '+' : '');
            }
        };
        requestAnimationFrame(updateCount);
    };

    // Observador para iniciar a animação quando a seção fica visível
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(animateCountUp);
                // Para de observar depois que a animação foi iniciada uma vez
                observer.unobserve(statsSection);
            }
        });
    }, {
        threshold: 0.5 // Inicia quando 50% da seção estiver visível
    });

    // Inicia a observação da seção de estatísticas
    if(statsSection) {
        statsObserver.observe(statsSection);
    }


    // --- 3. ROLAGEM SUAVE PARA LINKS DE ÂNCORA ---

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Garante que é um link de âncora nesta página
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- INICIALIZAÇÃO ---
    setActiveLink();
    loadUserInfo();
});