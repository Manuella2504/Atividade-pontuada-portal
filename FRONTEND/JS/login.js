document.addEventListener("DOMContentLoaded", () => {
    // --- SELETORES DE ELEMENTOS ---
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const btnText = document.getElementById("btnText");
    const alertContainer = document.getElementById("alertContainer");
    const forgotPasswordLink = document.getElementById('forgot');

    // --- FUNÇÕES AUXILIARES ---

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const showError = (inputElement, message) => {
        const errorDiv = document.getElementById(`${inputElement.id}Error`);
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }
    };

    const clearError = (inputElement) => {
        const errorDiv = document.getElementById(`${inputElement.id}Error`);
        inputElement.classList.remove('error');
        if (errorDiv) {
            errorDiv.classList.remove('show');
        }
    };
    
    const showAlert = (message, type = 'danger') => {
        alertContainer.innerHTML = `
            <div class="alert alert-${type}" role="alert">
                ${message}
            </div>
        `;
    };

    // --- VALIDAÇÃO DO FORMULÁRIO ---

    const validateForm = () => {
        let isValid = true;

        clearError(emailInput);
        clearError(passwordInput);

        if (emailInput.value.trim() === "") {
            showError(emailInput, "O campo e-mail é obrigatório.");
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, "Por favor, insira um e-mail válido.");
            isValid = false;
        } else {
            emailInput.classList.add('success');
        }

        if (passwordInput.value.trim() === "") {
            showError(passwordInput, "O campo senha é obrigatório.");
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            showError(passwordInput, "A senha deve ter pelo menos 6 caracteres.");
            isValid = false;
        } else {
            passwordInput.classList.add('success');
        }

        return isValid;
    };
    
    emailInput.addEventListener('input', () => clearError(emailInput));
    passwordInput.addEventListener('input', () => clearError(passwordInput));

    // --- LÓGICA DE SUBMISSÃO E LOGIN (CONECTADO AO BACKEND) ---

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alertContainer.innerHTML = '';

        if (!validateForm()) {
            return;
        }

        loginBtn.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        btnText.textContent = 'Entrando...';

        const loginData = {
            email: emailInput.value,
            password: passwordInput.value,
        };

        // Para depuração: verificar o que está sendo enviado
        console.log("Enviando para a API:", loginData);

        fetch('http://localhost:3000/api/login', { // CORRIGIDO: Porta 3001
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || 'Erro desconhecido no servidor'); });
            }
            return response.json();
        })
        .then(data => {
            showAlert('Login realizado com sucesso! Redirecionando...', 'success');
            
            localStorage.setItem('authToken', data.session.access_token);
            localStorage.setItem('userName', data.user.nome_completo);

            setTimeout(() => {
                window.location.href = 'iniciodepois.html';
            }, 1500);
        })
        .catch(error => {
            console.error('Erro de login:', error);
            showAlert(error.message || 'E-mail ou senha incorretos. Tente novamente.', 'danger');
            
            loginBtn.disabled = false;
            loadingSpinner.style.display = 'none';
            btnText.textContent = 'Entrar';
            passwordInput.value = "";
            passwordInput.classList.remove('success', 'error');
        });
    });
    
    // --- LINK "ESQUECEU A SENHA" ---
    
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Funcionalidade de recuperação de senha ainda não implementada.');
    });
});