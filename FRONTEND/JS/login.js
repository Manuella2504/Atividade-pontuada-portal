   
        // Toggle senha
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
        });

        // Validação de email
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Função para mostrar mensagens
        function showMessage(message, type = 'error') {
            const errorMsg = document.getElementById('errorMessage');
            const successMsg = document.getElementById('successMessage');
            
            // Esconde todas as mensagens primeiro
            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';
            
            if (type === 'error') {
                errorMsg.textContent = message;
                errorMsg.style.display = 'block';
            } else {
                successMsg.textContent = message;
                successMsg.style.display = 'block';
            }

            // Auto-hide após 5 segundos
            setTimeout(() => {
                errorMsg.style.display = 'none';
                successMsg.style.display = 'none';
            }, 5000);
        }

        // Manipulação do formulário
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');

            // Validações
            if (!email) {
                showMessage('Por favor, digite seu e-mail.');
                document.getElementById('email').focus();
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('Por favor, digite um e-mail válido.');
                document.getElementById('email').focus();
                return;
            }

            if (!password) {
                showMessage('Por favor, digite sua senha.');
                document.getElementById('password').focus();
                return;
            }

            if (password.length < 6) {
                showMessage('A senha deve ter pelo menos 6 caracteres.');
                document.getElementById('password').focus();
                return;
            }

            // Simulação de login
            loginBtn.innerHTML = '<span class="loading"></span>Entrando...';
            loginBtn.disabled = true;

            setTimeout(() => {
                // Simula diferentes cenários de login
                const scenarios = ['success', 'invalid', 'error'];
                const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

                switch(scenario) {
                    case 'success':
                        showMessage('Login realizado com sucesso! Redirecionando...', 'success');
                        setTimeout(() => {
                            console.log('Redirecionando para dashboard...');
                            // window.location.href = '/dashboard';
                        }, 2000);
                        break;
                    
                    case 'invalid':
                        showMessage('E-mail ou senha incorretos. Tente novamente.');
                        break;
                    
                    case 'error':
                        showMessage('Erro no servidor. Tente novamente em alguns minutos.');
                        break;
                }

                // Restaura o botão
                loginBtn.innerHTML = 'Entrar';
                loginBtn.disabled = false;
            }, 2000);
        });

        // Navegação (simulação)
        document.querySelectorAll('.nav-menu a, .signup-link a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                console.log('Navegando para:', href);
                
                if (href === '#cadastro') {
                    showMessage('Redirecionando para página de cadastro...', 'success');
                } else if (href === '#inicio') {
                    showMessage('Redirecionando para página inicial...', 'success');
                }
            });
        });

        // Link "Esqueceu sua senha?"
        document.querySelector('.forgot-password a').addEventListener('click', function(e) {
            e.preventDefault();
            showMessage('Funcionalidade de recuperação de senha em desenvolvimento.', 'success');
        });

        // Efeito de foco automático no primeiro campo
        window.addEventListener('load', function() {
            document.getElementById('email').focus();
        });

        // Enter para submeter o formulário
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                document.getElementById('loginForm').dispatchEvent(new Event('submit'));
            }
        });