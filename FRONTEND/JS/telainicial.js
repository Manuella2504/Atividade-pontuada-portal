 // =============== CARROSSEL ===============
        let currentSlide = 0;
        const totalSlides = 3;
        const carouselTrack = document.getElementById('carouselTrack');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        function updateCarousel() {
            const translateX = -currentSlide * 25;
            carouselTrack.style.transform = `translateX(${translateX}%)`;
            
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        // Event listeners para navegação
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Event listeners para indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });

        // Auto-play do carrossel
        setInterval(nextSlide, 6000);

        // =============== SMOOTH SCROLLING ===============
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // =============== ANIMAÇÕES DE ENTRADA ===============
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .step-card, .portfolio-feature, .team-member').forEach(el => {
            observer.observe(el);
        });

        // =============== CONTADOR DE ESTATÍSTICAS ===============
        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 30);
        }

        // Trigger counter animation when hero card is visible
        const heroCardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    const targets = [127, 8, 15];
                    statNumbers.forEach((el, index) => {
                        animateCounter(el, targets[index]);
                    });
                    heroCardObserver.unobserve(entry.target);
                }
            });
        });

        const heroCard = document.querySelector('.hero-card');
        if (heroCard) {
            heroCardObserver.observe(heroCard);
        }

        // =============== MENU MOBILE ===============
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                const nav = document.querySelector('nav');
                const navLinks = document.querySelector('.nav-links');
                
                if (!document.querySelector('.mobile-menu-btn')) {
                    const menuButton = document.createElement('button');
                    menuButton.innerHTML = '☰';
                    menuButton.className = 'mobile-menu-btn';
                    menuButton.style.cssText = `
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        color: var(--text-dark);
                        cursor: pointer;
                        display: block;
                    `;
                    
                    menuButton.addEventListener('click', () => {
                        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                        navLinks.style.flexDirection = 'column';
                        navLinks.style.position = 'absolute';
                        navLinks.style.top = '100%';
                        navLinks.style.left = '0';
                        navLinks.style.right = '0';
                        navLinks.style.background = 'white';
                        navLinks.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                        navLinks.style.padding = '1rem';
                        navLinks.style.borderRadius = '0 0 20px 20px';
                        navLinks.style.zIndex = '999';
                    });
                    
                    nav.appendChild(menuButton);
                }
            }
        });

        // Trigger resize event on load
        window.dispatchEvent(new Event('resize'));