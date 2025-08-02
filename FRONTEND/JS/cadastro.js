 let currentStep = 1;
        const totalSteps = 6;

        // Função para alternar visibilidade da senha
        function togglePassword(fieldId) {
            const field = document.getElementById(fieldId);
            const icon = field.nextElementSibling;
            
            if (field.type === 'password') {
                field.type = 'text';
                icon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><path d="m21 21-16-16"/>`;
            } else {
                field.type = 'password';
                icon.innerHTML = `<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>`;
            }
        }

        // Função para verificar requisitos da senha
        function checkPasswordRequirements(password) {
            const requirements = {
                minLength: password.length >= 8,
                hasLowercase: /[a-z]/.test(password),
                hasUppercase: /[A-Z]/.test(password),
                hasNumber: /\d/.test(password)
            };

            // Atualizar visual dos requisitos
            document.getElementById('minLength').className = requirements.minLength ? 'valid' : 'invalid';
            document.getElementById('hasLowercase').className = requirements.hasLowercase ? 'valid' : 'invalid';
            document.getElementById('hasUppercase').className = requirements.hasUppercase ? 'valid' : 'invalid';
            document.getElementById('hasNumber').className = requirements.hasNumber ? 'valid' : 'invalid';

            return Object.values(requirements).every(req => req);
        }

        // Event listener para verificar senha em tempo real
        document.getElementById('senha').addEventListener('input', function(e) {
            checkPasswordRequirements(e.target.value);
        });

        // Validação de e-mail
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // Validação de CPF
        function validateCPF(cpf) {
            cpf = cpf.replace(/[^\d]+/g, '');
            if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
            
            cpf = cpf.split('').map(el => +el);
            const rest = (count) => (cpf.slice(0, count-12)
                .reduce((soma, el, index) => (soma + el * (count-index)), 0)*10) % 11 % 10;
            return rest(10) === cpf[9] && rest(11) === cpf[10];
        }

        // Validação de CEP
        function validateCEP(cep) {
            const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;
            return cepRegex.test(cep);
        }

        // Função para mostrar erro
        function showError(fieldId, message) {
            const field = document.getElementById(fieldId);
            const errorDiv = document.getElementById(fieldId + 'Error');
            
            if (field && errorDiv) {
                field.classList.add('error');
                field.classList.remove('success');
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            }
        }

        // Função para mostrar sucesso
        function showSuccess(fieldId) {
            const field = document.getElementById(fieldId);
            const errorDiv = document.getElementById(fieldId + 'Error');
            
            if (field && errorDiv) {
                field.classList.add('success');
                field.classList.remove('error');
                errorDiv.style.display = 'none';
            }
        }

        // Mostrar/ocultar campo de nome social
        document.getElementById('nomeSocialSim').addEventListener('change', function() {
            document.getElementById('campoNomeSocial').classList.remove('hidden');
        });
        document.getElementById('nomeSocialNao').addEventListener('change', function() {
            document.getElementById('campoNomeSocial').classList.add('hidden');
        });

        // Atualizar barra de progresso
        function updateProgress() {
            const progressLine = document.getElementById('progressLine');
            const steps = document.querySelectorAll('.step');
            
            // Atualizar classes dos steps
            steps.forEach((step, index) => {
                const stepNumber = index + 1;
                if (stepNumber < currentStep) {
                    step.classList.remove('active', 'inactive');
                    step.classList.add('completed');
                } else if (stepNumber === currentStep) {
                    step.classList.remove('completed', 'inactive');
                    step.classList.add('active');
                } else {
                    step.classList.remove('completed', 'active');
                    step.classList.add('inactive');
                }
            });

            // Atualizar largura da linha de progresso
            const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
            progressLine.style.width = progressWidth + '%';
        }

        // Função para ir para o próximo step
        function nextStep() {
            if (currentStep < totalSteps) {
                document.getElementById(`step${currentStep}`).classList.add('hidden');
                currentStep++;
                document.getElementById(`step${currentStep}`).classList.remove('hidden');
                updateProgress();
                window.scrollTo(0, 0);
            }
        }

        // Função para voltar ao step anterior
        function previousStep() {
            if (currentStep > 1) {
                document.getElementById(`step${currentStep}`).classList.add('hidden');
                currentStep--;
                document.getElementById(`step${currentStep}`).classList.remove('hidden');
                updateProgress();
                window.scrollTo(0, 0);
            }
        }

        // Função para mostrar modal de sucesso
        function showSuccessModal() {
            document.getElementById(`step${currentStep}`).classList.add('hidden');
            document.getElementById('successModal').classList.remove('hidden');
        }

        // Validação do formulário 1
        document.getElementById('form1').addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            // Validar país
            const pais = document.getElementById('pais').value;
            if (!pais) {
                showError('pais', 'Por favor, selecione o país');
                isValid = false;
            } else {
                showSuccess('pais');
            }

            // Validar e-mail
            const email = document.getElementById('email').value;
            if (!email) {
                showError('email', 'Por favor, digite seu e-mail');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('email', 'Por favor, digite um e-mail válido');
                isValid = false;
            } else {
                showSuccess('email');
            }

            // Validar confirmação de e-mail
            const confirmEmail = document.getElementById('confirmEmail').value;
            if (!confirmEmail) {
                showError('confirmEmail', 'Por favor, confirme seu e-mail');
                isValid = false;
            } else if (email !== confirmEmail) {
                showError('confirmEmail', 'Os e-mails não coincidem');
                isValid = false;
            } else {
                showSuccess('confirmEmail');
            }

            // Validar senha
            const senha = document.getElementById('senha').value;
            if (!senha) {
                showError('senha', 'Por favor, crie uma senha');
                isValid = false;
            } else if (!checkPasswordRequirements(senha)) {
                showError('senha', 'A senha não atende aos requisitos');
                isValid = false;
            } else {
                showSuccess('senha');
            }

            // Validar confirmação de senha
            const confirmSenha = document.getElementById('confirmSenha').value;
            if (!confirmSenha) {
                showError('confirmSenha', 'Por favor, confirme sua senha');
                isValid = false;
            } else if (senha !== confirmSenha) {
                showError('confirmSenha', 'As senhas não coincidem');
                isValid = false;
            } else {
                showSuccess('confirmSenha');
            }

            if (isValid) {
                nextStep();
            }
        });

        // Validação do formulário 2
        document.getElementById('form2').addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            // Validar primeiro nome
            const primeiroNome = document.getElementById('primeiroNome').value.trim();
            if (!primeiroNome) {
                showError('primeiroNome', 'Por favor, digite seu primeiro nome');
                isValid = false;
            } else if (primeiroNome.length < 2) {
                showError('primeiroNome', 'O primeiro nome deve ter pelo menos 2 caracteres');
                isValid = false;
            } else {
                showSuccess('primeiroNome');
            }

            // Validar sobrenome
            const sobrenome = document.getElementById('sobrenome').value.trim();
            if (!sobrenome) {
                showError('sobrenome', 'Por favor, digite seu sobrenome');
                isValid = false;
            } else if (sobrenome.length < 2) {
                showError('sobrenome', 'O sobrenome deve ter pelo menos 2 caracteres');
                isValid = false;
            } else {
                showSuccess('sobrenome');
            }

            // Validar data de nascimento
            const dataNascimento = document.getElementById('dataNascimento').value;
            if (!dataNascimento) {
                showError('dataNascimento', 'Por favor, informe sua data de nascimento');
                isValid = false;
            } else {
                const hoje = new Date();
                const nascimento = new Date(dataNascimento);
                const idade = hoje.getFullYear() - nascimento.getFullYear();
                
                if (idade < 18 || idade > 100) {
                    showError('dataNascimento', 'Idade deve estar entre 18 e 100 anos');
                    isValid = false;
                } else {
                    showSuccess('dataNascimento');
                }
            }

            // Validar país de nascimento
            const paisNascimento = document.getElementById('paisNascimento').value;
            if (!paisNascimento) {
                showError('paisNascimento', 'Por favor, selecione o país de nascimento');
                isValid = false;
            } else {
                showSuccess('paisNascimento');
            }

            // Validar CPF
            const cpf = document.getElementById('cpf').value.replace(/[^\d]/g, '');
            if (!cpf) {
                showError('cpf', 'Por favor, digite seu CPF');
                isValid = false;
            } else if (!validateCPF(cpf)) {
                showError('cpf', 'Por favor, digite um CPF válido');
                isValid = false;
            } else {
                showSuccess('cpf');
            }

            // Validar nome social se optar por usar
            const nomeSocialSim = document.getElementById('nomeSocialSim').checked;
            const nomeSocialInput = document.getElementById('nomeSocialInput').value.trim();
            if (nomeSocialSim && nomeSocialInput.length < 2) {
                e.preventDefault();
                document.getElementById('nomeSocialInput').classList.add('error');
                document.getElementById('nomeSocialInputError').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('nomeSocialInput').classList.remove('error');
                document.getElementById('nomeSocialInputError').style.display = 'none';
            }

            if (isValid) {
                nextStep();
            }
        });

        // Validação do formulário 3
        document.getElementById('form3').addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            

            // Validar país
            const paisEndereco = document.getElementById('paisEndereco').value;
            if (!paisEndereco) {
                showError('paisEndereco', 'Por favor, selecione o país');
                isValid = false;
            } else {
                showSuccess('paisEndereco');
            }

            // Validar CEP
            const cep = document.getElementById('cep').value;
            if (!cep) {
                showError('cep', 'Por favor, digite o CEP');
                isValid = false;
            } else if (!validateCEP(cep)) {
                showError('cep', 'Por favor, digite um CEP válido (formato: 00000-000)');
                isValid = false;
            } else {
                showSuccess('cep');
            }

            // Validar endereço
            const endereco = document.getElementById('endereco').value.trim();
            if (!endereco) {
                showError('endereco', 'Por favor, digite o endereço');
                isValid = false;
            } else if (endereco.length < 5) {
                showError('endereco', 'O endereço deve ter pelo menos 5 caracteres');
                isValid = false;
            } else {
                showSuccess('endereco');
            }

            // Validar bairro
            const bairro = document.getElementById('bairro').value.trim();
            if (!bairro) {
                showError('bairro', 'Por favor, digite o bairro');
                isValid = false;
            } else {
                showSuccess('bairro');
            }

            // Validar cidade
            const cidade = document.getElementById('cidade').value.trim();
            if (!cidade) {
                showError('cidade', 'Por favor, digite a cidade');
                isValid = false;
            } else {
                showSuccess('cidade');
            }

            // Validar estado
            const estado = document.getElementById('estado').value;
            if (!estado) {
                showError('estado', 'Por favor, selecione o estado');
                isValid = false;
            } else {
                showSuccess('estado');
            }

            if (isValid) {
                nextStep();
            }
        });

        // Validação dos formulários 4, 5 e 6
        document.getElementById('form4').addEventListener('submit', function(e) {
            e.preventDefault();
            nextStep();
        });

        document.getElementById('form5').addEventListener('submit', function(e) {
            e.preventDefault();
            nextStep();
        });

        document.getElementById('form6').addEventListener('submit', function(e) {
            e.preventDefault();
            // Simular envio dos dados
            setTimeout(() => {
                showSuccessModal();
            }, 1000);
        });

        // Event listeners para mostrar/ocultar campos de atuação profissional
        document.querySelectorAll('input[name="atuacao"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const atuacaoFields = document.getElementById('atuacaoFields');
                if (this.value === 'sim') {
                    atuacaoFields.classList.remove('hidden');
                } else {
                    atuacaoFields.classList.add('hidden');
                }
            });
        });

        // Aviso dinâmico para tipo de endereço
        document.getElementById('residencial').addEventListener('change', function() {
            document.getElementById('avisoEndereco').textContent = 'O endereço residencial não será divulgado publicamente.';
        });
        document.getElementById('profissional').addEventListener('change', function() {
            document.getElementById('avisoEndereco').textContent = 'O endereço profissional será divulgado publicamente no currículo.';
        });

        // Formatação automática de campos
        document.getElementById('cpf').addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });

        document.getElementById('cep').addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });

        // Formatação de telefone
        function formatPhone(input) {
            let value = input.value.replace(/[^\d]/g, '');
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
            input.value = value;
        }

        if (document.getElementById('telefone')) {
            document.getElementById('telefone').addEventListener('input', function(e) {
                formatPhone(e.target);
            });
        }

        if (document.getElementById('celular')) {
            document.getElementById('celular').addEventListener('input', function(e) {
                formatPhone(e.target);
            });
        }

        // Busca automática de endereço por CEP
        document.getElementById('cep').addEventListener('blur', function(e) {
            const cep = e.target.value.replace(/[^\d]/g, '');
            if (cep.length === 8) {
                // Mostrar loading
                e.target.style.background = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23794C9E\' stroke-width=\'2\'%3E%3Cpath d=\'M21 12a9 9 0 11-6.219-8.56\'/%3E%3C/svg%3E") no-repeat right 10px center';
                e.target.style.backgroundSize = '20px 20px';
                
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        e.target.style.background = 'white';
                        if (!data.erro) {
                            document.getElementById('endereco').value = data.logradouro || '';
                            document.getElementById('bairro').value = data.bairro || '';
                            document.getElementById('cidade').value = data.localidade || '';
                            
                            // Buscar o estado no select
                            const estadoSelect = document.getElementById('estado');
                            for (let option of estadoSelect.options) {
                                if (option.value === data.uf) {
                                    estadoSelect.value = data.uf;
                                    break;
                                }
                            }
                        } else {
                            alert('CEP não encontrado. Por favor, preencha os dados manualmente.');
                        }
                    })
                    .catch(error => {
                        e.target.style.background = 'white';
                        console.log('Erro ao buscar CEP:', error);
                    });
            }
        });

        // Validação em tempo real dos campos principais
        document.getElementById('email').addEventListener('blur', function(e) {
            const email = e.target.value;
            if (email && !validateEmail(email)) {
                showError('email', 'Formato de e-mail inválido');
            } else if (email) {
                showSuccess('email');
            }
        });

        document.getElementById('confirmEmail').addEventListener('blur', function(e) {
            const email = document.getElementById('email').value;
            const confirmEmail = e.target.value;
            if (confirmEmail && email !== confirmEmail) {
                showError('confirmEmail', 'Os e-mails não coincidem');
            } else if (confirmEmail && email === confirmEmail) {
                showSuccess('confirmEmail');
            }
        });

        document.getElementById('cpf').addEventListener('blur', function(e) {
            const cpf = e.target.value.replace(/[^\d]/g, '');
            if (cpf && !validateCPF(cpf)) {
                showError('cpf', 'CPF inválido');
            } else if (cpf) {
                showSuccess('cpf');
            }
        });

        // Navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey) {
                if (e.key === 'ArrowRight' && currentStep < totalSteps) {
                    e.preventDefault();
                    // Validar formulário atual antes de avançar
                    const currentForm = document.getElementById(`form${currentStep}`);
                    if (currentForm) {
                        currentForm.dispatchEvent(new Event('submit'));
                    }
                } else if (e.key === 'ArrowLeft' && currentStep > 1) {
                    e.preventDefault();
                    previousStep();
                }
            }
        });

        // Inicialização
        function init() {
            updateProgress();
            
            // Focar no primeiro campo do primeiro formulário
            const firstInput = document.querySelector('#step1 input, #step1 select');
            if (firstInput) {
                firstInput.focus();
            }
        }

        // Executar quando a página carregar
        document.addEventListener('DOMContentLoaded', init);

        // Melhorar acessibilidade
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // Adicionar tooltips informativos
        const tooltips = {
            'cpf': 'Digite apenas os números do CPF',
            'cep': 'Digite o CEP no formato 00000-000',
            'senha': 'Mínimo 8 caracteres com letra maiúscula, minúscula e número'
        };

        Object.keys(tooltips).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.title = tooltips[fieldId];
            }
        });

        console.log('Portal de Cadastro Acadêmico carregado com sucesso!');
