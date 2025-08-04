document.addEventListener("DOMContentLoaded", () => {
    // --- SELETORES DE ELEMENTOS ---
    const sidebar = document.getElementById("sidebar");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    
    // Elementos da seção de comentários
    const commentNameInput = document.getElementById("comment-name");
    const commentTextInput = document.getElementById("comment-text");
    const commentsList = document.getElementById("comments-list");

    // Elementos da seção de projetos
    const projectAuthorInput = document.getElementById("project-author");
    const projectTitleInput = document.getElementById("project-title");
    const projectDescriptionInput = document.getElementById("project-description");
    const projectContactInput = document.getElementById("project-contact");

    // --- LÓGICA DA SIDEBAR ---

    window.toggleSidebarMobile = () => {
        sidebar.classList.toggle('show');
    };

    const setActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'quemsomos.html';
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
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

    // --- LÓGICA DE COMENTÁRIOS ---

    const loadComments = () => {
        const comments = JSON.parse(localStorage.getItem('communityComments')) || [];
        // Se não houver comentários salvos, não faz nada (mantém os do HTML)
        if (comments.length > 0) {
            renderComments(comments);
        }
    };

    const saveComments = (comments) => {
        localStorage.setItem('communityComments', JSON.stringify(comments));
    };

    const renderComments = (comments) => {
        commentsList.innerHTML = ''; // Limpa a lista atual
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-author">${comment.author}</div>
                <div class="comment-date">${comment.date}</div>
                <div class="comment-text">${comment.text}</div>
            `;
            commentsList.prepend(commentElement); // Adiciona o novo comentário no topo
        });
    };
    
    window.addComment = () => {
        const name = commentNameInput.value.trim();
        const text = commentTextInput.value.trim();

        if (!name || !text) {
            alert("Por favor, preencha seu nome e comentário.");
            return;
        }

        const newComment = {
            author: name,
            text: text,
            date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
        };

        const existingComments = JSON.parse(localStorage.getItem('communityComments')) || [];
        existingComments.push(newComment);
        
        saveComments(existingComments);
        renderComments(existingComments);

        // Limpa o formulário
        commentNameInput.value = '';
        commentTextInput.value = '';
        document.getElementById('comment-email').value = ''; // Limpa email também
    };

    // --- LÓGICA DE COMPARTILHAMENTO DE PROJETOS ---
    
    window.addProject = () => {
        const author = projectAuthorInput.value.trim();
        const title = projectTitleInput.value.trim();
        const description = projectDescriptionInput.value.trim();

        if (!author || !title || !description) {
            alert("Por favor, preencha todos os campos obrigatórios do projeto.");
            return;
        }
        
        const newProject = {
            author: author,
            title: title,
            description: description,
            contact: projectContactInput.value.trim()
        };
        
        // Salva no localStorage (não será exibido na página, conforme HTML)
        const existingProjects = JSON.parse(localStorage.getItem('sharedProjects')) || [];
        existingProjects.push(newProject);
        localStorage.setItem('sharedProjects', JSON.stringify(existingProjects));

        alert('Obrigado por compartilhar seu projeto conosco!');

        // Limpa o formulário
        projectAuthorInput.value = '';
        projectTitleInput.value = '';
        projectDescriptionInput.value = '';
        projectContactInput.value = '';
    };


    // --- INICIALIZAÇÃO ---
    setActiveLink();
    loadUserInfo();
    loadComments();
});