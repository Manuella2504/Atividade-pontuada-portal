document.addEventListener("DOMContentLoaded", () => {
    // --- SELETORES DE ELEMENTOS ---
    const sidebar = document.getElementById("sidebar");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    const workGrid = document.getElementById("workGrid");
    const modal = document.getElementById("modal");
    const workForm = document.getElementById("workForm");
    const imageInput = document.getElementById("imageInput");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    const imageModal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    // --- ESTADO DA APLICAÇÃO ---
    let worksData = [];
    let tempImageFiles = []; // Armazena prévias das imagens para o formulário

    // --- DADOS PADRÃO ---
    const defaultWorks = [
        {
            id: 1,
            title: "Projeto SABER (Sistema de Análise e Benefício Educacional em Relatórios)",
            date: "2024-07-15",
            images: [
                "https://i.ibb.co/1G7zBS2/Thumbnail.png",
                "https://i.ibb.co/H0X3yQJ/Design-sem-nome-5.png",
                "https://i.ibb.co/YBvGc1y/Apresenta-o-portf-lio-profissional-arquiteta-elegante-marsala-bege-1.png",
            ],
            description: "O projeto SABER é uma plataforma web inovadora que utiliza Inteligência Artificial para analisar relatórios pedagógicos, identificar padrões de desenvolvimento dos alunos e gerar insights valiosos para educadores. A ferramenta visa otimizar o tempo dos professores e personalizar o aprendizado, oferecendo um suporte tecnológico avançado para a gestão educacional."
        }
    ];

    // --- FUNÇÕES DE DADOS (localStorage) ---
    const loadWorks = () => {
        const data = localStorage.getItem('portfolioWorks');
        worksData = data ? JSON.parse(data) : defaultWorks;
    };

    const saveWorks = () => {
        localStorage.setItem('portfolioWorks', JSON.stringify(worksData));
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    const renderWorks = () => {
        workGrid.innerHTML = ""; // Limpa a galeria antes de renderizar
        if (worksData.length === 0) {
            workGrid.innerHTML = `<p class="empty-state">Nenhum projeto adicionado ainda. Clique no botão '+' para começar.</p>`;
            return;
        }
        worksData.forEach(work => {
            const workCard = document.createElement('div');
            workCard.className = 'work-card';
            workCard.dataset.id = work.id;

            const thumbnailsHTML = work.images.slice(1, 4).map((imgSrc, index) =>
                `<img src="${imgSrc}" alt="Thumbnail ${index + 1}" class="thumbnail-image" onclick="changeMainImage(event, '${imgSrc}')">`
            ).join('');

            workCard.innerHTML = `
                <div class="work-images">
                    <img src="${work.images[0]}" alt="${work.title}" class="main-image" onclick="openImageModal(event)">
                    <div class="image-thumbnails">${thumbnailsHTML}</div>
                </div>
                <div class="work-content">
                    <h3 class="work-title">${work.title}</h3>
                    <p class="work-date">${new Date(work.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                    <p class="work-description">${work.description}</p>
                </div>
            `;
            workGrid.appendChild(workCard);
        });
    };
    
    // --- LÓGICA DO MODAL (Adicionar Trabalho) ---
    window.openModal = () => modal.style.display = 'flex';
    window.closeModal = () => {
        modal.style.display = 'none';
        workForm.reset();
        imagePreviewContainer.innerHTML = '';
        tempImageFiles = [];
    };
    
    imageInput.addEventListener('change', (e) => {
        imagePreviewContainer.innerHTML = ''; // Limpa prévias antigas
        tempImageFiles = Array.from(e.target.files);
        
        tempImageFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const previewWrapper = document.createElement('div');
                previewWrapper.className = 'image-preview';
                previewWrapper.innerHTML = `
                    <img src="${event.target.result}" alt="Preview">
                    <button class="remove-image" onclick="removePreviewImage(event, ${index})">&times;</button>
                `;
                imagePreviewContainer.appendChild(previewWrapper);
            };
            reader.readAsDataURL(file);
        });
    });

    window.removePreviewImage = (e, index) => {
        e.preventDefault();
        tempImageFiles.splice(index, 1);
        // Re-renderiza as prévias
        imageInput.dispatchEvent(new Event('change'));
    };

    workForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newWork = {
            id: Date.now(),
            title: e.target.title.value,
            date: e.target.date.value,
            description: e.target.description.value,
            images: Array.from(imagePreviewContainer.querySelectorAll('img')).map(img => img.src)
        };

        if (newWork.images.length === 0) {
            alert("Por favor, adicione pelo menos uma imagem.");
            return;
        }

        worksData.unshift(newWork); // Adiciona no início da lista
        saveWorks();
        renderWorks();
        closeModal();
    });

    // --- LÓGICA DE INTERAÇÃO NA GALERIA ---
    window.changeMainImage = (e, newSrc) => {
        const card = e.target.closest('.work-card');
        card.querySelector('.main-image').src = newSrc;

        // Atualiza a classe 'active' nas miniaturas
        card.querySelectorAll('.thumbnail-image').forEach(thumb => {
            thumb.classList.toggle('active', thumb.src === newSrc);
        });
    };
    
    window.openImageModal = (e) => {
        modalImage.src = e.target.src;
        imageModal.style.display = 'flex';
    };

    window.closeImageModal = () => {
        imageModal.style.display = 'none';
    };

    // --- LÓGICA DA SIDEBAR ---
    const setActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop();
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add("active");
            }
        });
    };

    const loadUserInfo = () => {
        const userNameElement = document.getElementById('sidebarUserName');
        const userAvatarElement = document.getElementById('userAvatar');
        const loggedInUserName = localStorage.getItem('userName') || "Usuário";
        userNameElement.textContent = loggedInUserName;
        userAvatarElement.textContent = loggedInUserName.charAt(0).toUpperCase();
    };
    
    window.toggleSidebarMobile = () => sidebar.classList.toggle('show');

    // --- INICIALIZAÇÃO ---
    loadWorks();
    renderWorks();
    setActiveLink();
    loadUserInfo();
});