document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTOS GLOBAIS ---
    const sidebar = document.getElementById("sidebar");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    const modal = document.getElementById("editModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalForm = document.getElementById("modalForm");
    const closeModalBtn = document.querySelector(".modal .close");

    // --- VARIÁVEIS DE ESTADO ---
    let profileData = {};
    let currentEditingSection = null;

    // --- DADOS PADRÃO (USADOS SE NENHUM DADO FOR ENCONTRADO) ---
    const defaultData = {
        infoPessoais: {
            nome: "Usuário Teste",
            titulo: "Estudante de Engenharia de Software",
            foto: "U",
            email: "usuario@rocketlab.com",
            telefone: "(71) 99999-9999",
            localizacao: "Salvador, Bahia",
            lattes: "http://lattes.cnpq.br/exemplo"
        },
        idiomas: [
            { id: 1, idioma: "Português", nivel: "Nativo" },
            { id: 2, idioma: "Inglês", nivel: "Avançado" }
        ],
        formacao: [
            { id: 1, curso: "Análise e Desenvolvimento de Sistemas", instituicao: "Universidade Federal da Bahia", inicio: "2022", fim: "2025" }
        ],
        experiencia: [
            { id: 1, cargo: "Estagiário de Desenvolvimento Front-End", empresa: "RocketLab", inicio: "2024", fim: "Atual", descricao: "Desenvolvimento e manutenção de interfaces de usuário para projetos acadêmicos inovadores." }
        ]
    };

    // --- FUNÇÕES DE DADOS (localStorage) ---
    const loadProfileData = () => {
        const data = localStorage.getItem('userProfileData');
        profileData = data ? JSON.parse(data) : JSON.parse(JSON.stringify(defaultData)); // Usa dados padrão se não houver salvos
    };

    const saveProfileData = () => {
        localStorage.setItem('userProfileData', JSON.stringify(profileData));
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO (Exibir dados na página) ---
    const renderAll = () => {
        renderInfoPessoais();
        renderIdiomas();
        renderFormacao();
        renderExperiencia();
        loadSidebarUserInfo(); // Atualiza também a sidebar
    };
    
    const renderInfoPessoais = () => {
        const info = profileData.infoPessoais;
        document.getElementById("profilePhoto").textContent = info.foto || info.nome.charAt(0).toUpperCase();
        document.getElementById("userName").textContent = info.nome;
        document.getElementById("userTitle").textContent = info.titulo;
        
        const contactInfo = document.getElementById("contactInfo");
        contactInfo.innerHTML = `
            <div class="info-item"><div class="info-icon"><i class="fas fa-envelope"></i></div> ${info.email}</div>
            <div class="info-item"><div class="info-icon"><i class="fas fa-phone"></i></div> ${info.telefone}</div>
            <div class="info-item"><div class="info-icon"><i class="fas fa-map-marker-alt"></i></div> ${info.localizacao}</div>
        `;

        const lattesLink = document.getElementById("lattesLink");
        if(info.lattes) {
            lattesLink.href = info.lattes;
            lattesLink.style.display = 'block';
        } else {
            lattesLink.style.display = 'none';
        }
    };

    const renderIdiomas = () => {
        const container = document.getElementById("languagesArea");
        if (profileData.idiomas.length === 0) {
            container.innerHTML = `<div class="empty-state">Adicione os idiomas que você domina</div>`;
            return;
        }
        container.innerHTML = profileData.idiomas.map(lang => `
            <div class="info-item">${lang.idioma} - <strong>${lang.nivel}</strong></div>
        `).join('');
    };

    const renderFormacao = () => {
        const container = document.getElementById("educationArea");
        if (profileData.formacao.length === 0) {
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
        if (profileData.experiencia.length === 0) {
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
    window.openModal = () => { modal.style.display = 'block'; };
    window.closeModal = () => { modal.style.display = 'none'; modalForm.innerHTML = ''; };
    closeModalBtn.onclick = closeModal;
    window.onclick = (event) => { if (event.target == modal) closeModal(); };

    window.editSection = (sectionName) => {
        currentEditingSection = sectionName;
        modalTitle.textContent = `Editar ${sectionName.replace('-', ' ')}`;
        let formHtml = '';

        switch (sectionName) {
            case 'info-pessoais':
                const info = profileData.infoPessoais;
                formHtml = `
                    <div class="form-group"><label>Nome Completo</label><input type="text" id="edit-nome" value="${info.nome}"></div>
                    <div class="form-group"><label>Título (Ex: Estudante de...)</label><input type="text" id="edit-titulo" value="${info.titulo}"></div>
                    <div class="form-group"><label>E-mail</label><input type="email" id="edit-email" value="${info.email}"></div>
                    <div class="form-group"><label>Telefone</label><input type="tel" id="edit-telefone" value="${info.telefone}"></div>
                    <div class="form-group"><label>Localização</label><input type="text" id="edit-localizacao" value="${info.localizacao}"></div>
                    <div class="form-group"><label>Link do Currículo Lattes</label><input type="url" id="edit-lattes" value="${info.lattes}"></div>
                `;
                break;
            case 'idiomas':
                 formHtml = profileData.idiomas.map((lang, index) => `
                    <div class="item-form" data-index="${index}">
                        <input type="text" value="${lang.idioma}" placeholder="Idioma">
                        <input type="text" value="${lang.nivel}" placeholder="Nível">
                        <button onclick="removeItem('idiomas', ${index})">&times;</button>
                    </div>
                `).join('') + '<button class="add-btn" onclick="addItem(\'idiomas\')">+ Adicionar Idioma</button>';
                break;
            case 'formacao':
                 formHtml = profileData.formacao.map((edu, index) => `
                    <div class="item-form" data-index="${index}">
                         <input type="text" value="${edu.curso}" placeholder="Curso">
                         <input type="text" value="${edu.instituicao}" placeholder="Instituição">
                         <input type="text" value="${edu.inicio}" placeholder="Ano de Início">
                         <input type="text" value="${edu.fim}" placeholder="Ano de Conclusão">
                         <button onclick="removeItem('formacao', ${index})">&times;</button>
                    </div>
                `).join('') + '<button class="add-btn" onclick="addItem(\'formacao\')">+ Adicionar Formação</button>';
                break;
            case 'experiencia':
                formHtml = profileData.experiencia.map((exp, index) => `
                    <div class="item-form" data-index="${index}">
                        <input type="text" value="${exp.cargo}" placeholder="Cargo">
                        <input type="text" value="${exp.empresa}" placeholder="Empresa">
                        <input type="text" value="${exp.inicio}" placeholder="Início">
                        <input type="text" value="${exp.fim}" placeholder="Fim">
                        <textarea placeholder="Descrição">${exp.descricao}</textarea>
                        <button onclick="removeItem('experiencia', ${index})">&times;</button>
                    </div>
                `).join('') + '<button class="add-btn" onclick="addItem(\'experiencia\')">+ Adicionar Experiência</button>';
                break;
        }
        modalForm.innerHTML = formHtml;
        openModal();
    };

    window.saveChanges = () => {
        switch (currentEditingSection) {
            case 'info-pessoais':
                profileData.infoPessoais = {
                    nome: document.getElementById('edit-nome').value,
                    titulo: document.getElementById('edit-titulo').value,
                    foto: document.getElementById('edit-nome').value.charAt(0).toUpperCase(),
                    email: document.getElementById('edit-email').value,
                    telefone: document.getElementById('edit-telefone').value,
                    localizacao: document.getElementById('edit-localizacao').value,
                    lattes: document.getElementById('edit-lattes').value,
                };
                break;
            // Para seções com múltiplos itens
            default:
                const items = [];
                const itemForms = modalForm.querySelectorAll('.item-form');
                itemForms.forEach(form => {
                    const inputs = form.querySelectorAll('input, textarea');
                    let itemData = {};
                    if(currentEditingSection === 'idiomas') itemData = {idioma: inputs[0].value, nivel: inputs[1].value};
                    if(currentEditingSection === 'formacao') itemData = {curso: inputs[0].value, instituicao: inputs[1].value, inicio: inputs[2].value, fim: inputs[3].value};
                    if(currentEditingSection === 'experiencia') itemData = {cargo: inputs[0].value, empresa: inputs[1].value, inicio: inputs[2].value, fim: inputs[3].value, descricao: inputs[4].value};
                    items.push(itemData);
                });
                profileData[currentEditingSection] = items;
                break;
        }

        saveProfileData();
        renderAll();
        closeModal();
    };
    
    // Funções para adicionar/remover itens dinamicamente no modal (precisam estar no escopo global)
    window.addItem = (section) => { /* lógica para adicionar campos vazios no modal */ };
    window.removeItem = (section, index) => { /* lógica para remover um item e re-renderizar o form do modal */ };


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
        const loggedInUserName = localStorage.getItem('userName') || profileData.infoPessoais.nome;

        if (loggedInUserName) {
            userNameElement.textContent = loggedInUserName;
            userAvatarElement.textContent = loggedInUserName.charAt(0).toUpperCase();
        }
    };

    window.toggleSidebarMobile = () => {
        sidebar.classList.toggle('show');
    };

    // --- INICIALIZAÇÃO ---
    loadProfileData();
    renderAll();
    setActiveLink();
});