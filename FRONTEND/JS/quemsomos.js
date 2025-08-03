
        // Remover todos os efeitos de animação
        function addComment() {
            const name = document.getElementById('comment-name').value;
            const email = document.getElementById('comment-email').value;
            const text = document.getElementById('comment-text').value;

            if (!name || !text) {
                alert('Por favor, preencha pelo menos o nome e o comentário.');
                return;
            }

            const commentsList = document.getElementById('comments-list');
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            
            const now = new Date();
            const dateStr = now.toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });

            newComment.innerHTML = `
                <div class="comment-author">${name}</div>
                <div class="comment-date">${dateStr}</div>
                <div class="comment-text">${text}</div>
            `;

            commentsList.insertBefore(newComment, commentsList.firstChild);

            // Limpar formulário
            document.getElementById('comment-name').value = '';
            document.getElementById('comment-email').value = '';
            document.getElementById('comment-text').value = '';
        }

        function addProject() {
            const author = document.getElementById('project-author').value;
            const title = document.getElementById('project-title').value;
            const description = document.getElementById('project-description').value;
            const contact = document.getElementById('project-contact').value;

            if (!author || !title || !description) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            const projectsList = document.getElementById('projects-list');
            const newProject = document.createElement('div');
            newProject.className = 'project';

            newProject.innerHTML = `
                <div class="project-title">${title}</div>
                <div class="project-author">Por: ${author}</div>
                <div class="project-description">${description}</div>
                ${contact ? `<div style="margin-top: 10px; color: #2c3e50; font-weight: bold; font-size: 16px;">Contato: ${contact}</div>` : ''}
            `;

            projectsList.insertBefore(newProject, projectsList.firstChild);

            // Limpar formulário
            document.getElementById('project-author').value = '';
            document.getElementById('project-title').value = '';
            document.getElementById('project-description').value = '';
            document.getElementById('project-contact').value = '';
        }

        // Remover efeitos de input
        document.addEventListener('DOMContentLoaded', function() {
            // Página carregada
        });

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const toggleIcon = document.getElementById('toggleIcon');
            const body = document.body;
            
            sidebar.classList.toggle('collapsed');
            body.classList.toggle('sidebar-collapsed');
            
            if (sidebar.classList.contains('collapsed')) {
                toggleIcon.classList.remove('fa-chevron-left');
                toggleIcon.classList.add('fa-chevron-right');
            } else {
                toggleIcon.classList.remove('fa-chevron-right');
                toggleIcon.classList.add('fa-chevron-left');
            }
        }

        function addComment() {
            const name = document.getElementById('comment-name').value;
            const email = document.getElementById('comment-email').value;
            const text = document.getElementById('comment-text').value;
            
            if (name && email && text) {
                const commentsList = document.getElementById('comments-list');
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                
                const now = new Date();
                const dateStr = now.toLocaleDateString('pt-BR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                });
                
                newComment.innerHTML = `
                    <div class="comment-author">${name}</div>
                    <div class="comment-date">${dateStr}</div>
                    <div class="comment-text">${text}</div>
                `;
                
                commentsList.insertBefore(newComment, commentsList.firstChild);
                
                // Limpar formulário
                document.getElementById('comment-name').value = '';
                document.getElementById('comment-email').value = '';
                document.getElementById('comment-text').value = '';
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        }

        function addProject() {
            const author = document.getElementById('project-author').value;
            const title = document.getElementById('project-title').value;
            const description = document.getElementById('project-description').value;
            const contact = document.getElementById('project-contact').value;
            
            if (author && title && description) {
                const projectsList = document.getElementById('projects-list');
                const newProject = document.createElement('div');
                newProject.className = 'project';
                
                newProject.innerHTML = `
                    <div class="project-title">${title}</div>
                    <div class="project-author">Por: ${author}</div>
                    <div class="project-description">${description}</div>
                    ${contact ? `<div class="project-contact">Contato: ${contact}</div>` : ''}
                `;
                
                projectsList.insertBefore(newProject, projectsList.firstChild);
                
                // Limpar formulário
                document.getElementById('project-author').value = '';
                document.getElementById('project-title').value = '';
                document.getElementById('project-description').value = '';
                document.getElementById('project-contact').value = '';
            } else {
                alert('Por favor, preencha os campos obrigatórios.');
            }
        }
   
