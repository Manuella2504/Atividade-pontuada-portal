document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTOS GLOBAIS ---
    const sidebar = document.getElementById("sidebar");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    const modal = document.getElementById("editModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalForm = document.getElementById("modalForm");
    const closeModalBtn = document.querySelector(".modal .close");

    // --- VARIÁVEIS DE ESTADO ---
    let profileData = {}; // Começa vazio, será preenchido pela API

    // --- DADOS PADRÃO (USADOS COMO FALLBACK) ---
    const defaultData = {
        infoPessoais: {
            nome: "Usuário",
            titulo: "Estudante",
            foto: "U",
            email: "email@exemplo.com",
            telefone: "(00) 00000-0000",
            localizacao: "Cidade, Estado",
            lattes: ""
        },
        idiomas: [],
        formacao: [],
        experiencia: []
    };

    // --- FUNÇÕES DE DADOS (AGORA COM API) ---
    const loadProfileData = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Nenhum token encontrado. Redirecionando para login.");
            window.location.href = 'login.html'; // Redireciona se não estiver logado
            return;
        }

        fetch('http://localhost:3000/api/profile', { // Lembre-se da porta 3001
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
                throw new Error('Sessão inválida ou expirada.');
            }
            return res.json();
        })
        .then(data => {
            // Preenche nosso objeto profileData com os dados da API
            profileData.infoPessoais = {
                nome: data.nome_completo || defaultData.infoPessoais.nome,
                titulo: data.titulo || defaultData.infoPessoais.titulo,
                foto: (data.nome_completo || 'U').charAt(0).toUpperCase(),
                email: data.email || defaultData.infoPessoais.email,
                telefone: data.telefone || defaultData.infoPessoais.telefone,
                localizacao: data.localizacao || defaultData.infoPessoais.localizacao,
                lattes: data.lattes || defaultData.infoPessoais.lattes,
            };
            // OBS: As seções de idiomas, formação, etc. precisam ser adicionadas ao seu banco de dados
            // Por enquanto, elas começarão vazias.
            profileData.idiomas = data.idiomas || [];
            profileData.formacao = data.formacao || [];
            profileData.experiencia = data.experiencia || [];

            renderAll();
        })
        .catch(error => {
            console.error('Erro ao buscar perfil:', error);
            // Em caso de erro, usa os dados padrão para não quebrar a página
            profileData = JSON.parse(JSON.stringify(defaultData));
            renderAll();
        });
    };

    const saveChanges = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            return;
        }

        // Coleta os dados do formulário do modal
        const updatedData = {
            nome_completo: document.getElementById('edit-nome').value,
            titulo: document.getElementById('edit-titulo').value,
            email: document.getElementById('edit-email').value,
            telefone: document.getElementById('edit-telefone').value,
            localizacao: document.getElementById('edit-localizacao').value,
            lattes: document.getElementById('edit-lattes').value,
        };
        // Aqui você adicionaria a lógica para salvar idiomas, formação, etc.

        fetch('http://localhost:3000/api/profile', { // Porta 3001
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(`Erro ao salvar: ${data.error}`);
            } else {
                console.log("Perfil atualizado:", data);
                // Atualiza o nome de usuário na sidebar se ele foi alterado
                localStorage.setItem('userName', data.nome_completo);
                loadProfileData(); // Recarrega os dados para mostrar as atualizações
                closeModal();
            }
        })
        .catch(error => {
            console.error("Erro ao salvar perfil:", error);
            alert("Não foi possível salvar as alterações. Verifique sua conexão.");
        });
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO (Exibir dados na página) ---
    // (O resto do seu código de renderização continua aqui, sem alterações)
    const renderAll = () => {
        renderInfoPessoais();
        renderIdiomas();
        renderFormacao();
        renderExperiencia();
        loadSidebarUserInfo();
    };

    const renderInfoPessoais = () => {
        const info = profileData.infoPessoais;
        document.getElementById("profilePhoto").textContent = info.foto;
        document.getElementById("userName").textContent = info.nome;
        document.getElementById("userTitle").textContent = info.titulo;

        const contactInfo = document.getElementById("contactInfo");
        contactInfo.innerHTML = `
            <div class="info-item"><div class="info-icon"><i class="fas fa-envelope"></i></div> ${info.email}</div>
            <div class="info-item"><div class="info-icon"><i class="fas fa-phone"></i></div> ${info.telefone}</div>
            <div class="info-item"><div class="info-icon"><i class="fas fa-map-marker-alt"></i></div> ${info.localizacao}</div>
        `;

        const lattesLink = document.getElementById("lattesLink");
        if (info.lattes) {
            lattesLink.href = info.lattes;
            lattesLink.style.display = 'block';
        } else {
            lattesLink.style.display = 'none';
        }
    };

    const renderIdiomas = () => {
        const container = document.getElementById("languagesArea");
        if (!profileData.idiomas || profileData.idiomas.length === 0) {
            container.innerHTML = `<div class="empty-state">Adicione os idiomas que você domina</div>`;
            return;
        }
        container.innerHTML = profileData.idiomas.map(lang => `
            <div class="info-item">${lang.idioma} - <strong>${lang.nivel}</strong></div>
        `).join('');
    };

    const renderFormacao = () => {
        const container = document.getElementById("educationArea");
        if (!profileData.formacao || profileData.formacao.length === 0) {
            container.innerHTML = `<div class="empty-state">Adicione sua formação acadêmica</div>`;
            return;
        }
        container.innerHTML = profileData.formacao.map(edu => `
            <div class="education-item">
                <div class="item-title">${edu.curso}</div>
                <div class="item-institution">${edu.instituicao}</div>
                <div class="item-period">${edu.inicio} - ${edu.fim}</div>
            </div>
        `).join('');
    };

    const renderExperiencia = () => {
        const container = document.getElementById("experienceArea");
        if (!profileData.experiencia || profileData.experiencia.length === 0) {
            container.innerHTML = `<div class="empty-state">Adicione sua experiência profissional</div>`;
            return;
        }
        container.innerHTML = profileData.experiencia.map(exp => `
            <div class="experience-item">
                <div class="item-title">${exp.cargo}</div>
                <div class="item-institution">${exp.empresa}</div>
                <div class="item-period">${exp.inicio} - ${exp.fim}</div>
                <p>${exp.descricao}</p>
            </div>
        `).join('');
    };
    
    // --- LÓGICA DO MODAL DE EDIÇÃO ---
    // (A lógica do modal continua a mesma, mas agora chamará a nova saveChanges)
    window.openModal = () => { modal.style.display = 'block'; };
    window.closeModal = () => { modal.style.display = 'none'; modalForm.innerHTML = ''; };
    closeModalBtn.onclick = closeModal;
    window.onclick = (event) => { if (event.target == modal) closeModal(); };

    window.editSection = (sectionName) => {
        // ... (seu código para preencher o modal)
        // Este código pode permanecer o mesmo, pois ele lê de 'profileData'
        // Apenas um exemplo para a seção de informações pessoais:
        const info = profileData.infoPessoais;
        let formHtml = `
            <div class="form-group"><label>Nome Completo</label><input type="text" id="edit-nome" value="${info.nome}"></div>
            <div class="form-group"><label>Título (Ex: Estudante de...)</label><input type="text" id="edit-titulo" value="${info.titulo}"></div>
            <div class="form-group"><label>E-mail</label><input type="email" id="edit-email" value="${info.email}"></div>
            <div class="form-group"><label>Telefone</label><input type="tel" id="edit-telefone" value="${info.telefone}"></div>
            <div class="form-group"><label>Localização</label><input type="text" id="edit-localizacao" value="${info.localizacao}"></div>
            <div class="form-group"><label>Link do Currículo Lattes</label><input type="url" id="edit-lattes" value="${info.lattes}"></div>
        `;
        modalForm.innerHTML = formHtml;
        modalTitle.textContent = 'Editar Informações Pessoais';
        openModal();
    };

    // Atribui a função de salvar ao botão do modal
    const saveBtn = document.querySelector(".save-btn");
    if(saveBtn) saveBtn.onclick = saveChanges;

    // --- LÓGICA DA SIDEBAR ---
    const setActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop();
        navLinks.forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
            }
        });
    };

    const loadSidebarUserInfo = () => {
        const userNameElement = document.getElementById('sidebarUserName');
        const userAvatarElement = document.getElementById('userAvatar');
        const loggedInUserName = localStorage.getItem('userName') || "Usuário";
        
        userNameElement.textContent = loggedInUserName;
        userAvatarElement.textContent = loggedInUserName.charAt(0).toUpperCase();
    };

    // --- INICIALIZAÇÃO ---
    loadProfileData(); // Ponto de partida principal
    setActiveLink();
});