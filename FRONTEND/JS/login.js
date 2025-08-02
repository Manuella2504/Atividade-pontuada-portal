
        class LoginValidator {
            constructor() {
                this.form = document.getElementById('loginForm');
                this.emailInput = document.getElementById('email');
                this.passwordInput = document.getElementById('password');
                this.loginBtn = document.getElementById('loginBtn');
                this.loadingSpinner = document.getElementById('loadingSpinner');
                this.btnText = document.getElementById('btnText');
                this.alertContainer = document.getElementById('alertContainer');
                
                this.init();
            }

            init() {
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
                this.emailInput.addEventListener('blur', () => this.validateEmail());
                this.passwordInput.addEventListener('blur', () => this.validatePassword());
                this.emailInput.addEventListener('input', () => this.clearFieldError('email'));
                this.passwordInput.addEventListener('input', () => this.clearFieldError('password'));
            }

            validateEmail() {
                const email = this.emailInput.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (!email) {
                    this.showFieldError('email', 'E-mail é obrigatório');
                    return false;
                }
                
                if (!emailRegex.test(email)) {
                    this.showFieldError('email', 'Digite um e-mail válido');
                    return false;
                }
                
                this.showFieldSuccess('email');
                return true;
            }

            validatePassword() {
                const password = this.passwordInput.value;
                
                if (!password) {
                    this.showFieldError('password', 'Senha é obrigatória');
                    return false;
                }
                
                if (password.length < 6) {
                    this.showFieldError('password', 'Senha deve ter pelo menos 6 caracteres');
                    return false;
                }
                
                this.showFieldSuccess('password');
                return true;
            }

            showFieldError(fieldName, message) {
                const input = document.getElementById(fieldName);
                const errorElement = document.getElementById(fieldName + 'Error');
                
                input.classList.remove('success');
                input.classList.add('error');
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }

            showFieldSuccess(fieldName) {
                const input = document.getElementById(fieldName);
                const errorElement = document.getElementById(fieldName + 'Error');
                
                input.classList.remove('error');
                input.classList.add('success');
                errorElement.classList.remove('show');
            }

            clearFieldError(fieldName) {
                const input = document.getElementById(fieldName);
                const errorElement = document.getElementById(fieldName + 'Error');
                
                input.classList.remove('error');
                errorElement.classList.remove('show');
            }

            showAlert(message, type = 'danger') {
                const alertHTML = `
                    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                        ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
                this.alertContainer.innerHTML = alertHTML;
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    const alert = this.alertContainer.querySelector('.alert');
                    if (alert) {
                        const bsAlert = new bootstrap.Alert(alert);
                        bsAlert.close();
                    }
                }, 5000);
            }

            setLoading(isLoading) {
                if (isLoading) {
                    this.loginBtn.disabled = true;
                    this.loadingSpinner.style.display = 'inline-block';
                    this.btnText.textContent = 'Entrando...';
                } else {
                    this.loginBtn.disabled = false;
                    this.loadingSpinner.style.display = 'none';
                    this.btnText.textContent = 'Entrar';
                }
            }

            async handleSubmit(e) {
                e.preventDefault();
                
                // Clear previous alerts
                this.alertContainer.innerHTML = '';
                
                const emailValid = this.validateEmail();
                const passwordValid = this.validatePassword();
                
                if (!emailValid || !passwordValid) {
                    this.showAlert('Por favor, corrija os erros nos campos destacados.');
                    return;
                }
                
                this.setLoading(true);
                
                try {
                    // Simular requisição de login
                    await this.simulateLogin();
                    
                    // Sucesso
                    this.showAlert('Login realizado com sucesso! Redirecionando...', 'success');
                    
                    // Simular redirecionamento após 2 segundos
                    setTimeout(() => {
                        // window.location.href = 'dashboard.html';
                        console.log('Redirecionando para o dashboard...');
                    }, 2000);
                    
                } catch (error) {
                    this.showAlert(error.message);
                } finally {
                    this.setLoading(false);
                }
            }

            async simulateLogin() {
                // Simular delay de rede
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const email = this.emailInput.value.trim();
                const password = this.passwordInput.value;
                
                // Simular validação no servidor
                if (email === 'admin@portal.com' && password === '123456') {
                    return { success: true };
                } else {
                    throw new Error('E-mail ou senha incorretos. Tente novamente.');
                }
            }
        }

        // Inicializar quando o DOM estiver carregado
        document.addEventListener('DOMContentLoaded', () => {
            new LoginValidator();
        });

        // Adicionar animação suave aos elementos
        document.addEventListener('DOMContentLoaded', () => {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Animar elementos da ilustração
            document.querySelectorAll('.illustration-container > *').forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = `all 0.6s ease ${index * 0.2}s`;
                observer.observe(el);
            });

            // Animar elementos do formulário
            document.querySelectorAll('.login-side > *').forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = `all 0.5s ease ${index * 0.1}s`;
                observer.observe(el);
            });
        });
