document.addEventListener("DOMContentLoaded", () => {
  // --- VARIÁVEIS GLOBAIS ---
  let currentStep = 1;
  const totalSteps = 6;
  const steps = document.querySelectorAll(".step");
  const formSteps = document.querySelectorAll(".form-container");
  const progressLine = document.getElementById("progressLine");

  // --- ELEMENTOS DOS FORMULÁRIOS ---
  const forms = {
    form1: document.getElementById("form1"),
    form2: document.getElementById("form2"),
    form3: document.getElementById("form3"),
    form4: document.getElementById("form4"),
    form5: document.getElementById("form5"),
    form6: document.getElementById("form6"),
  };

  const inputs = {
    email: document.getElementById("email"),
    confirmEmail: document.getElementById("confirmEmail"),
    senha: document.getElementById("senha"),
    confirmSenha: document.getElementById("confirmSenha"),
    cpf: document.getElementById("cpf"),
    cep: document.getElementById("cep"),
    nomeSocialRadios: document.querySelectorAll('input[name="nomeSocial"]'),
    campoNomeSocial: document.getElementById("campoNomeSocial"),
    nomeSocialInput: document.getElementById("nomeSocialInput"),
    atuacaoRadios: document.querySelectorAll('input[name="atuacao"]'),
    atuacaoFields: document.getElementById("atuacaoFields"),
    tipoEnderecoRadios: document.querySelectorAll('input[name="tipoEndereco"]'),
    avisoEndereco: document.getElementById("avisoEndereco"),
  };

  /**
   * Atualiza a barra de progresso visual (linha e círculos).
   */
  const updateProgress = () => {
    steps.forEach((step, index) => {
      const stepNumber = index + 1;
      if (stepNumber < currentStep) {
        step.classList.add("completed");
        step.classList.remove("active", "inactive");
      } else if (stepNumber === currentStep) {
        step.classList.add("active");
        step.classList.remove("completed", "inactive");
      } else {
        step.classList.add("inactive");
        step.classList.remove("completed", "active");
      }
    });

    const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = `${progressWidth}%`;
  };

  /**
   * Mostra a etapa do formulário especificada e esconde as outras.
   * @param {number} stepNumber -
   */
  const showStep = (stepNumber) => {
    formSteps.forEach((formStep) => formStep.classList.add("hidden"));
    const activeStep = document.getElementById(`step${stepNumber}`);
    if (activeStep) {
      activeStep.classList.remove("hidden");
    }
    currentStep = stepNumber;
    updateProgress();
    window.scrollTo(0, 0); 
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      showStep(currentStep + 1);
    }
  };

  window.previousStep = () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  };

  /**
   * Alterna a visibilidade da senha em um campo de input.
   * @param {string} inputId - O ID do campo de senha.
   */
  window.togglePassword = (inputId) => {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    if (input.type === "password") {
      input.type = "text";

      icon.innerHTML = `<path d="M12 7c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5m0-2C8.13 5 5 8.13 5 12s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>`;
    } else {
      input.type = "password";
      icon.innerHTML = `<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>`;
    }
  };

  const showError = (input, message) => {
    const errorDiv = document.getElementById(`${input.id}Error`);
    if (errorDiv) {
      errorDiv.innerText = message;
      errorDiv.style.display = "block";
    }
    input.classList.add("error");
  };

  const hideError = (input) => {
    const errorDiv = document.getElementById(`${input.id}Error`);
    if (errorDiv) {
      errorDiv.style.display = "none";
    }
    input.classList.remove("error");
    input.classList.add("success");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
    };

    for (const key in requirements) {
      const li = document.getElementById(key);
      if (li) {
        li.classList.toggle("valid", requirements[key]);
        li.classList.toggle("invalid", !requirements[key]);
      }
    }

    return Object.values(requirements).every(Boolean);
  };

  const validateStep1 = () => {
    let isValid = true;

    if (!validateEmail(inputs.email.value)) {
      showError(inputs.email, "Por favor, digite um e-mail válido");
      isValid = false;
    } else {
      hideError(inputs.email);
    }
    if (inputs.email.value !== inputs.confirmEmail.value) {
      showError(inputs.confirmEmail, "Os e-mails não coincidem");
      isValid = false;
    } else {
      hideError(inputs.confirmEmail);
    }
    if (!validatePassword(inputs.senha.value)) {
      showError(inputs.senha, "A senha não atende aos requisitos.");
      isValid = false;
    } else {
      hideError(inputs.senha);
    }
    if (inputs.senha.value !== inputs.confirmSenha.value) {
      showError(inputs.confirmSenha, "As senhas não coincidem");
      isValid = false;
    } else {
      hideError(inputs.confirmSenha);
    }
    return isValid;
  };

  const formatCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
  };

  const formatCEP = (cep) => {
    cep = cep.replace(/\D/g, "");
    cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");
    return cep;
  };

  const fetchAddress = async (cep) => {
    const cepDigits = cep.replace(/\D/g, "");
    if (cepDigits.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
        const data = await response.json();
        if (!data.erro) {
          document.getElementById("endereco").value = data.logradouro;
          document.getElementById("bairro").value = data.bairro;
          document.getElementById("cidade").value = data.localidade;
          document.getElementById("estado").value = data.uf;
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  inputs.senha.addEventListener("input", () => validatePassword(inputs.senha.value));
  inputs.cpf.addEventListener("input", () => {
    inputs.cpf.value = formatCPF(inputs.cpf.value);
  });
  inputs.cep.addEventListener("input", () => {
    inputs.cep.value = formatCEP(inputs.cep.value);
  });
  inputs.cep.addEventListener("blur", () => fetchAddress(inputs.cep.value));

  inputs.nomeSocialRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const show = document.getElementById("nomeSocialSim").checked;
        inputs.campoNomeSocial.classList.toggle("hidden", !show);
        inputs.nomeSocialInput.required = show;
    });
  });

  inputs.atuacaoRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const show = document.getElementById("atuacaoSim").checked;
        inputs.atuacaoFields.classList.toggle("hidden", !show);
    });
  });
  
  inputs.tipoEnderecoRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
      if (event.target.value === 'residencial') {
        inputs.avisoEndereco.textContent = 'O endereço residencial não será divulgado publicamente.';
      } else {
        inputs.avisoEndereco.textContent = 'O endereço profissional poderá ser divulgado publicamente.';
      }
    });
  });


  forms.form1.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateStep1()) {
      nextStep();
    }
  });

  forms.form2.addEventListener("submit", (e) => {
    e.preventDefault();
    nextStep();
  });

  forms.form3.addEventListener("submit", (e) => {
    e.preventDefault();
    nextStep();
  });

  forms.form4.addEventListener("submit", (e) => {
    e.preventDefault();
    nextStep();
  });

  forms.form5.addEventListener("submit", (e) => {
    e.preventDefault();
    nextStep();
  });

  forms.form6.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("step6").classList.add("hidden");
    document.getElementById("successModal").classList.remove("hidden");
  });

  showStep(1);
});