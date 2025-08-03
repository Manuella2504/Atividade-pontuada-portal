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
        // Adiciona validação quando o utilizador sai do campo
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            // Não mostra erro se estiver vazio, apenas no submit
            return false;
        }
        if (!emailRegex.test(email)) {
            this.showAlert('Formato de e-mail inválido.');
            return false;
        }
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        if (!password || password.length < 6) {
            // Não mostra erro se estiver vazio, apenas no submit
            return false;
        }
        return true;
    }

    showAlert(message, type = 'danger') {
        this.alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
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
        this.alertContainer.innerHTML = ''; // Limpa alertas anteriores

        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        // Validação final no momento do submit
        if (!email || !password) {
            this.showAlert('Por favor, preencha o e-mail e a senha.');
            return;
        }
        if (password.length < 6) {
            this.showAlert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (!this.validateEmail()) {
             this.showAlert('O formato do e-mail é inválido.');
             return;
        }

        this.setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'E-mail ou senha incorretos.');
            }

            this.showAlert('Login realizado com sucesso! A redirecionar...', 'success');
            localStorage.setItem('supabase.session', JSON.stringify(data.session));

            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 1500);

        } catch (error) {
            this.showAlert(error.message);
        } finally {
            this.setLoading(false);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginValidator();
});