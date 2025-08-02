 let currentSection = '';
        let userData = {
            personalInfo: {
                name: '',
                title: '',
                email: '',
                phone: '',
                website: '',
                location: '',
                lattes: ''
            },
            languages: [],
            education: [],
            experience: []
        };
        
        function editSection(section) {
            currentSection = section;
            const modal = document.getElementById('editModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalForm = document.getElementById('modalForm');
            
            modal.style.display = 'block';
            
            switch(section) {
                case 'info-pessoais':
                    modalTitle.textContent = 'Editar Informações Pessoais';
                    modalForm.innerHTML = `
                        <div class="form-group">
                            <label>Nome Completo:</label>
                            <input type="text" id="nome" placeholder="Digite seu nome completo" value="${userData.personalInfo.name}">
                        </div>
                        <div class="form-group">
                            <label>Título/Cargo:</label>
                            <input type="text" id="titulo" placeholder="Ex: Doutor em Ciência da Computação | Pesquisador" value="${userData.personalInfo.title}">
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="email" placeholder="seu.email@exemplo.com" value="${userData.personalInfo.email}">
                        </div>
                        <div class="form-group">
                            <label>Telefone:</label>
                            <input type="text" id="telefone" placeholder="(11) 99999-9999" value="${userData.personalInfo.phone}">
                        </div>
                        <div class="form-group">
                            <label>Website:</label>
                            <input type="text" id="website" placeholder="www.seusite.com.br" value="${userData.personalInfo.website}">
                        </div>
                        <div class="form-group">
                            <label>Localização:</label>
                            <input type="text" id="localizacao" placeholder="Cidade, Estado" value="${userData.personalInfo.location}">
                        </div>
                        <div class="form-group">
                            <label>Link Lattes:</label>
                            <input type="text" id="lattes" placeholder="http://lattes.cnpq.br/seu-id" value="${userData.personalInfo.lattes}">
                        </div>
                    `;
                    break;
                    
                case 'idiomas':
                    modalTitle.textContent = 'Editar Idiomas';
                    modalForm.innerHTML = `
                        <div class="form-group">
                            <label>Idiomas atuais:</label>
                            <div id="current-languages" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; min-height: 60px;">
                                ${userData.languages.length > 0 ? 
                                    userData.languages.map((lang, index) => 
                                        `<span style="display: inline-block; background: #27ae60; color: white; padding: 5px 10px; margin: 2px; border-radius: 15px; font-size: 12px;">
                                            ${lang} <span onclick="removeLanguage(${index})" style="cursor: pointer; margin-left: 5px;">×</span>
                                        </span>`
                                    ).join('') 
                                    : '<span style="color: #7f8c8d; font-style: italic;">Nenhum idioma adicionado</span>'
                                }
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Adicionar idioma:</label>
                            <input type="text" id="novo-idioma" placeholder="Digite o idioma">
                            <button type="button" class="add-btn" onclick="adicionarIdioma()">Adicionar</button>
                        </div>
                    `;
                    break;
                    
                case 'formacao':
                    modalTitle.textContent = 'Editar Formação Acadêmica';
                    modalForm.innerHTML = `
                        <div class="form-group">
                            <label>Formações atuais:</label>
                            <div id="current-education" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; min-height: 60px;">
                                ${renderEducationList()}
                            </div>
                        </div>
                        <div style="border: 2px dashed #3498db; padding: 20px; border-radius: 8px; background: rgba(52, 152, 219, 0.05);">
                            <h4 style="margin-bottom: 15px; color: #2c3e50;">Adicionar Nova Formação:</h4>
                            <div class="form-group">
                                <label>Título:</label>
                                <input type="text" id="edu-titulo" placeholder="Ex: Doutorado em Ciência da Computação">
                            </div>
                            <div class="form-group">
                                <label>Instituição:</label>
                                <input type="text" id="edu-instituicao" placeholder="Ex: Universidade de São Paulo (USP)">
                            </div>
                            <div class="form-group">
                                <label>Período:</label>
                                <input type="text" id="edu-periodo" placeholder="Ex: 2015 - 2019">
                            </div>
                            <div class="form-group">
                                <label>Descrição (opcional):</label>
                                <textarea id="edu-descricao" rows="2" placeholder="Tese, área de concentração, etc."></textarea>
                            </div>
                            <button type="button" class="add-btn" onclick="adicionarFormacao()">Adicionar Formação</button>
                        </div>
                    `;
                    break;
                    
                case 'experiencia':
                    modalTitle.textContent = 'Editar Experiência Profissional';
                    modalForm.innerHTML = `
                        <div class="form-group">
                            <label>Experiências atuais:</label>
                            <div id="current-experience" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; min-height: 60px;">
                                ${renderExperienceList()}
                            </div>
                        </div>
                        <div style="border: 2px dashed #e74c3c; padding: 20px; border-radius: 8px; background: rgba(231, 76, 60, 0.05);">
                            <h4 style="margin-bottom: 15px; color: #2c3e50;">Adicionar Nova Experiência:</h4>
                            <div class="form-group">
                                <label>Cargo:</label>
                                <input type="text" id="exp-cargo" placeholder="Ex: Desenvolvedor Full Stack">
                            </div>
                            <div class="form-group">
                                <label>Empresa/Instituição:</label>
                                <input type="text" id="exp-empresa" placeholder="Ex: Tech Solutions Ltda.">
                            </div>
                            <div class="form-group">
                                <label>Período:</label>
                                <input type="text" id="exp-periodo" placeholder="Ex: 2020 - Presente">
                            </div>
                            <div class="form-group">
                                <label>Descrição:</label>
                                <textarea id="exp-descricao" rows="3" placeholder="Descreva suas responsabilidades e conquistas..."></textarea>
                            </div>
                            <button type="button" class="add-btn" onclick="adicionarExperiencia()">Adicionar Experiência</button>
                        </div>
                    `;
                    break;
                    
                default:
                    modalTitle.textContent = 'Editar ' + section;
                    modalForm.innerHTML = `
                        <div class="form-group">
                            <label>Esta seção precisa de implementação:</label>
                            <textarea rows="4" placeholder="Funcionalidade em desenvolvimento..."></textarea>
                        </div>
                    `;
            }
        }
        
        function saveChanges() {
            switch(currentSection) {
                case 'info-pessoais':
                    userData.personalInfo.name = document.getElementById('nome').value;
                    userData.personalInfo.title = document.getElementById('titulo').value;
                    userData.personalInfo.email = document.getElementById('email').value;
                    userData.personalInfo.phone = document.getElementById('telefone').value;
                    userData.personalInfo.website = document.getElementById('website').value;
                    userData.personalInfo.location = document.getElementById('localizacao').value;
                    userData.personalInfo.lattes = document.getElementById('lattes').value;
                    updatePersonalInfo();
                    break;
            }
            
            alert('Mudanças salvas com sucesso!');
            closeModal();
        }
        
        function updatePersonalInfo() {
            const { name, title, email, phone, website, location, lattes } = userData.personalInfo;
            
            // Atualizar header
            document.getElementById('userName').textContent = name || 'Seu Nome';
            document.getElementById('userTitle').textContent = title || 'Seu Título Profissional';
            document.getElementById('profilePhoto').textContent = name ? name.charAt(0).toUpperCase() : '+';
            
            // Atualizar informações de contato
            const contactInfo = document.getElementById('contactInfo');
            if (email || phone || website || location) {
                contactInfo.innerHTML = '';
                
                if (email) {
                    contactInfo.innerHTML += `
                        <div class="info-item">
                            <div class="info-icon">📧</div>
                            <span>${email}</span>
                        </div>`;
                }
                if (phone) {
                    contactInfo.innerHTML += `
                        <div class="info-item">
                            <div class="info-icon">📱</div>
                            <span>${phone}</span>
                        </div>`;
                }
                if (website) {
                    contactInfo.innerHTML += `
                        <div class="info-item">
                            <div class="info-icon">🌐</div>
                            <span>${website}</span>
                        </div>`;
                }
                if (location) {
                    contactInfo.innerHTML += `
                        <div class="info-item">
                            <div class="info-icon">📍</div>
                            <span>${location}</span>
                        </div>`;
                }
            } else {
                contactInfo.innerHTML = '<div class="empty-state">Clique no botão de editar para adicionar suas informações pessoais</div>';
            }
            
            // Atualizar link Lattes
            const lattesLink = document.getElementById('lattesLink');
            if (lattes) {
                lattesLink.href = lattes;
                lattesLink.style.display = 'block';
            } else {
                lattesLink.style.display = 'none';
            }
        }
        
        function updateLanguages() {
            const languagesArea = document.getElementById('languagesArea');
            if (userData.languages.length > 0) {
                languagesArea.innerHTML = userData.languages.map(lang => 
                    `<div class="info-item">
                        <div class="info-icon">🌐</div>
                        <span>${lang}</span>
                    </div>`
                ).join('');
            } else {
                languagesArea.innerHTML = '<div class="empty-state">Adicione os idiomas que você domina</div>';
            }
        }
        
        function updateEducation() {
            const educationArea = document.getElementById('educationArea');
            if (userData.education.length > 0) {
                educationArea.innerHTML = userData.education.map(edu => 
                    `<div class="education-item">
                        <div class="item-title">${edu.titulo}</div>
                        <div class="item-institution">${edu.instituicao}</div>
                        <div class="item-period">${edu.periodo}</div>
                        ${edu.descricao ? `<p>${edu.descricao}</p>` : ''}
                    </div>`
                ).join('');
            } else {
                educationArea.innerHTML = '<div class="empty-state">Adicione sua formação acadêmica</div>';
            }
        }
        
        function updateExperience() {
            const experienceArea = document.getElementById('experienceArea');
            if (userData.experience.length > 0) {
                experienceArea.innerHTML = userData.experience.map(exp => 
                    `<div class="experience-item">
                        <div class="item-title">${exp.cargo}</div>
                        <div class="item-institution">${exp.empresa}</div>
                        <div class="item-period">${exp.periodo}</div>
                        ${exp.descricao ? `<p>${exp.descricao}</p>` : ''}
                    </div>`
                ).join('');
            } else {
                experienceArea.innerHTML = '<div class="empty-state">Adicione sua experiência profissional</div>';
            }
        }
        
        function renderEducationList() {
            if (userData.education.length === 0) {
                return '<span style="color: #7f8c8d; font-style: italic;">Nenhuma formação adicionada</span>';
            }
            return userData.education.map((edu, index) => 
                `<div style="background: white; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #3498db;">
                    <strong>${edu.titulo}</strong> - ${edu.instituicao} (${edu.periodo})
                    <button onclick="removeEducation(${index})" style="float: right; background: #e74c3c; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;">×</button>
                </div>`
            ).join('');
        }
        
        function renderExperienceList() {
            if (userData.experience.length === 0) {
                return '<span style="color: #7f8c8d; font-style: italic;">Nenhuma experiência adicionada</span>';
            }
            return userData.experience.map((exp, index) => 
                `<div style="background: white; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #e74c3c;">
                    <strong>${exp.cargo}</strong> - ${exp.empresa} (${exp.periodo})
                    <button onclick="removeExperience(${index})" style="float: right; background: #e74c3c; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;">×</button>
                </div>`
            ).join('');
        }
        
        function adicionarIdioma() {
            const novoIdioma = document.getElementById('novo-idioma').value.trim();
            if (novoIdioma && !userData.languages.includes(novoIdioma)) {
                userData.languages.push(novoIdioma);
                document.getElementById('novo-idioma').value = '';
                document.getElementById('current-languages').innerHTML = 
                    userData.languages.map((lang, index) => 
                        `<span style="display: inline-block; background: #27ae60; color: white; padding: 5px 10px; margin: 2px; border-radius: 15px; font-size: 12px;">
                            ${lang} <span onclick="removeLanguage(${index})" style="cursor: pointer; margin-left: 5px;">×</span>
                        </span>`
                    ).join('');
                updateLanguages();
                document.getElementById('novo-idioma').focus();
            }
        }
        
        function removeLanguage(index) {
            userData.languages.splice(index, 1);
            document.getElementById('current-languages').innerHTML = 
                userData.languages.length > 0 ? 
                userData.languages.map((lang, index) => 
                    `<span style="display: inline-block; background: #27ae60; color: white; padding: 5px 10px; margin: 2px; border-radius: 15px; font-size: 12px;">
                        ${lang} <span onclick="removeLanguage(${index})" style="cursor: pointer; margin-left: 5px;">×</span>
                    </span>`
                ).join('') 
                : '<span style="color: #7f8c8d; font-style: italic;">Nenhum idioma adicionado</span>';
            updateLanguages();
        }
        
        function adicionarFormacao() {
            const titulo = document.getElementById('edu-titulo').value.trim();
            const instituicao = document.getElementById('edu-instituicao').value.trim();
            const periodo = document.getElementById('edu-periodo').value.trim();
            const descricao = document.getElementById('edu-descricao').value.trim();
            
            if (titulo && instituicao && periodo) {
                userData.education.push({ titulo, instituicao, periodo, descricao });
                document.getElementById('edu-titulo').value = '';
                document.getElementById('edu-instituicao').value = '';
                document.getElementById('edu-periodo').value = '';
                document.getElementById('edu-descricao').value = '';
                document.getElementById('current-education').innerHTML = renderEducationList();
                updateEducation();
                document.getElementById('edu-titulo').focus();
            } else {
                alert('Por favor, preencha pelo menos o título, instituição e período.');
            }
        }
        
        function removeEducation(index) {
            userData.education.splice(index, 1);
            document.getElementById('current-education').innerHTML = renderEducationList();
            updateEducation();
        }
        
        function adicionarExperiencia() {
            const cargo = document.getElementById('exp-cargo').value.trim();
            const empresa = document.getElementById('exp-empresa').value.trim();
            const periodo = document.getElementById('exp-periodo').value.trim();
            const descricao = document.getElementById('exp-descricao').value.trim();
            
            if (cargo && empresa && periodo) {
                userData.experience.push({ cargo, empresa, periodo, descricao });
                document.getElementById('exp-cargo').value = '';
                document.getElementById('exp-empresa').value = '';
                document.getElementById('exp-periodo').value = '';
                document.getElementById('exp-descricao').value = '';
                document.getElementById('current-experience').innerHTML = renderExperienceList();
                updateExperience();
                document.getElementById('exp-cargo').focus();
            } else {
                alert('Por favor, preencha pelo menos o cargo, empresa e período.');
            }
        }
        
        function removeExperience(index) {
            userData.experience.splice(index, 1);
            document.getElementById('current-experience').innerHTML = renderExperienceList();
            updateExperience();
        }
        
        function closeModal() {
            document.getElementById('editModal').style.display = 'none';
        }
        
        // Permitir adicionar com Enter
        document.addEventListener('keydown', function(event) {
            if (event.target.id === 'novo-idioma' && event.key === 'Enter') {
                event.preventDefault();
                adicionarIdioma();
            }
        });
        
        // Fechar modal ao clicar no X ou fora do modal
        document.querySelector('.close').onclick = closeModal;
        window.onclick = function(event) {
            const modal = document.getElementById('editModal');
            if (event.target == modal) {
                closeModal();
            }
        }
        
        // Função para carregar dados do banco (simular)
        function loadUserData(data) {
            userData = { ...userData, ...data };
            updatePersonalInfo();
            updateLanguages();
            updateEducation();
            updateExperience();
        }
        
        // Função para obter dados para salvar no banco
        function getUserData() {
            return userData;
        }
        
        // Exemplo de como usar com dados do banco:
        // loadUserData({
        //     personalInfo: {
        //         name: 'João Silva',
        //         title: 'Desenvolvedor Full Stack',
        //         email: 'joao@email.com'
        //     },
        //     languages: ['Português', 'Inglês']
   // });
