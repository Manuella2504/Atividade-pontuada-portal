function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const toggleIcon = document.getElementById('toggleIcon');
            
            if (window.innerWidth > 768) {
                // Desktop behavior
                sidebar.classList.toggle('collapsed');
                
                if (sidebar.classList.contains('collapsed')) {
                    toggleIcon.className = 'fas fa-chevron-right';
                } else {
                    toggleIcon.className = 'fas fa-chevron-left';
                }
            } else {
                // Mobile behavior
                sidebar.classList.toggle('show');
                
                // Update mobile toggle icon
                const mobileToggle = document.querySelector('.mobile-toggle i');
                if (sidebar.classList.contains('show')) {
                    mobileToggle.className = 'fas fa-times';
                } else {
                    mobileToggle.className = 'fas fa-bars';
                }
            }
        }

        // Handle window resize
        window.addEventListener('resize', function() {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.querySelector('.mobile-toggle i');
            
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
                mobileToggle.className = 'fas fa-bars';
            } else {
                sidebar.classList.remove('collapsed');
                document.getElementById('toggleIcon').className = 'fas fa-chevron-left';
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
                
                // Close sidebar on mobile after clicking
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('sidebar');
                    const mobileToggle = document.querySelector('.mobile-toggle i');
                    sidebar.classList.remove('show');
                    mobileToggle.className = 'fas fa-bars';
                }
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.querySelector('.mobile-toggle');
            const sidebarToggle = document.querySelector('.sidebar-toggle');
            
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('show') &&
                !sidebar.contains(e.target) && 
                !mobileToggle.contains(e.target) &&
                !sidebarToggle.contains(e.target)) {
                
                sidebar.classList.remove('show');
                document.querySelector('.mobile-toggle i').className = 'fas fa-bars';
            }
        });

        // Animação de entrada dos eventos
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 300);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observar todos os cards de eventos
        document.addEventListener('DOMContentLoaded', function() {
            const eventCards = document.querySelectorAll('.event-card');
            eventCards.forEach(card => {
                observer.observe(card);
            });
        });