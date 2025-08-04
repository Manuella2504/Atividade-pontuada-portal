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

    /**
     * Valida se um e-mail possui um formato válido.
     * @param {string} email O e-mail a ser validado.
     * @returns {boolean}
     */
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    /**
     * Mostra uma mensagem de erro para um campo do formulário.
     * @param {HTMLInputElement} inputElement - O elemento input.
     * @param {string} message - A mensagem de erro.
     */
    const showError = (inputElement, message) => {
        const errorDiv = document.getElementById(`${inputElement.id}Error`);
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }
    };

    /**
     * Limpa a mensagem de erro de um campo.
     * @param {HTMLInputElement} inputElement - O elemento input.
     */
    const clearError = (inputElement) => {
        const errorDiv = document.getElementById(`${inputElement.id}Error`);
        inputElement.classList.remove('error');
        if (errorDiv) {
            errorDiv.classList.remove('show');
        }
    };
    
    /**
     * Mostra um alerta (Bootstrap) no topo do formulário.
     * @param {string} message - A mensagem do alerta.
     * @param {string} type - O tipo do alerta ('success', 'danger', 'warning').
     */
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

        // Limpa erros anteriores
        clearError(emailInput);
        clearError(passwordInput);

        // Validação do E-mail
        if (emailInput.value.trim() === "") {
            showError(emailInput, "O campo e-mail é obrigatório.");
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, "Por favor, insira um e-mail válido.");
            isValid = false;
        } else {
            emailInput.classList.add('success');
        }

        // Validação da Senha
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
    
    // Limpa erros em tempo real enquanto o usuário digita
    emailInput.addEventListener('input', () => clearError(emailInput));
    passwordInput.addEventListener('input', () => clearError(passwordInput));


    // --- LÓGICA DE SUBMISSÃO E LOGIN ---

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alertContainer.innerHTML = ''; // Limpa alertas antigos

        if (!validateForm()) {
            return;
        }

        // Ativa o estado de carregamento do botão
        loginBtn.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        btnText.textContent = 'Entrando...';

        // Simula uma chamada de API com 2 segundos de atraso
        setTimeout(() => {
            // DADOS FICTÍCIOS PARA SIMULAÇÃO
            const dummyEmail = "usuario@rocketlab.com";
            const dummyPassword = "password123";
            const dummyUserName = "Usuário Teste";

            if (emailInput.value === dummyEmail && passwordInput.value === dummyPassword) {
                showAlert('Login realizado com sucesso! Redirecionando...', 'success');
                
                localStorage.setItem('userName', dummyUserName);

                setTimeout(() => {
                    window.location.href = 'iniciodepois.html';
                }, 1500);

            } else {
                // FALHA NO LOGIN
                showAlert('E-mail ou senha incorretos. Por favor, tente novamente.', 'danger');
                
                // Reseta o botão para o estado normal
                loginBtn.disabled = false;
                loadingSpinner.style.display = 'none';
                btnText.textContent = 'Entrar';
                passwordInput.value = ""; // Limpa a senha por segurança
                passwordInput.classList.remove('success', 'error');
            }

        }, 2000);
    });
    
    // --- LINK "ESQUECEU A SENHA" ---
    
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Funcionalidade de recuperação de senha ainda não implementada.');
    });

});