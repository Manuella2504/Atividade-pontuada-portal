// Atividade-pontuada-portal/FRONTEND/JS/perfil.js

const API_URL = 'http://localhost:3000/api';
let userData = {};
let currentSection = '';

const getSession = () => JSON.parse(localStorage.getItem('supabase.session'));

async function loadProfileData() {
    const sessionData = getSession();
    if (!sessionData) return;

    try {
        const response = await fetch(`${API_URL}/profile`, {
            headers: { 'Authorization': `Bearer ${sessionData.access_token}` }
        });
        if (!response.ok) throw new Error('Falha ao buscar dados.');
        userData = await response.json();
        renderProfile();
    } catch (error) {
        console.error('Erro:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProfileData);

function renderProfile() {
    const { personalInfo, languages, education, experience } = userData;
    const nomeCompleto = `${personalInfo.primeiro_nome || ''} ${personalInfo.sobrenome || ''}`.trim();
    
    document.getElementById('userName').textContent = nomeCompleto || 'Nome não preenchido';
    document.getElementById('userTitle').textContent = 'Pesquisador';
    document.getElementById('profilePhoto').textContent = nomeCompleto ? nomeCompleto.charAt(0).toUpperCase() : '+';

    const contactInfo = document.getElementById('contactInfo');
    contactInfo.innerHTML = (personalInfo.email || personalInfo.celular)
        ? `${personalInfo.email ? `<div class="info-item"><span>📧</span> ${personalInfo.email}</div>` : ''}
           ${personalInfo.celular ? `<div class="info-item"><span>📱</span> ${personalInfo.celular}</div>` : ''}`
        : '<div class="empty-state">Adicione suas informações.</div>';

    const educationArea = document.getElementById('educationArea');
    educationArea.innerHTML = education.length > 0
        ? education.map(edu => `<div class="education-item"><div class="item-title">${edu.curso}</div><div class="item-institution">${edu.instituicao}</div><div class="item-period">${edu.ano_inicio} - ${edu.ano_conclusao || 'Presente'}</div></div>`).join('')
        : '<div class="empty-state">Adicione sua formação acadêmica.</div>';

    const experienceArea = document.getElementById('experienceArea');
    experienceArea.innerHTML = experience.length > 0
        ? experience.map(exp => `<div class="experience-item"><div class="item-title">${exp.cargo}</div><div class="item-institution">${exp.instituicao}</div><div class="item-period">${exp.ano_inicio} - ${exp.ano_fim || 'Presente'}</div></div>`).join('')
        : '<div class="empty-state">Adicione sua experiência profissional.</div>';

    const languagesArea = document.getElementById('languagesArea');
    languagesArea.innerHTML = languages.length > 0
        ? languages.map(lang => `<div class="info-item"><span>🌐</span> ${lang.idioma} (Leitura: ${lang.le})</div>`).join('')
        : '<div class="empty-state">Adicione seus idiomas.</div>';
}

function editSection(section) {
    currentSection = section;
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalForm = document.getElementById('modalForm');

    modal.style.display = 'block';
    modalTitle.textContent = `Editar ${section.replace('-', ' ')}`;
    
    let formHTML = '';
    switch(section) {
        case 'info-pessoais': formHTML = getPersonalInfoForm(); break;
        case 'formacao': formHTML = getEditableListForm('formacao', userData.education, ['curso', 'instituicao', 'ano_inicio', 'ano_conclusao']); break;
        case 'experiencia': formHTML = getEditableListForm('experiencia', userData.experience, ['cargo', 'instituicao', 'ano_inicio', 'ano_fim']); break;
        case 'idiomas': formHTML = getEditableListForm('idiomas', userData.languages, ['idioma', 'le', 'fala', 'escreve']); break;
    }
    modalForm.innerHTML = formHTML;
}

function getPersonalInfoForm() {
    const { personalInfo } = userData;
    return `
        <div class="form-group"><label>Primeiro Nome:</label><input type="text" id="edit-primeiro_nome" value="${personalInfo.primeiro_nome || ''}"></div>
        <div class="form-group"><label>Sobrenome:</label><input type="text" id="edit-sobrenome" value="${personalInfo.sobrenome || ''}"></div>
        <div class="form-group"><label>Celular:</label><input type="text" id="edit-celular" value="${personalInfo.celular || ''}"></div>
    `;
}

function getEditableListForm(type, items, fields) {
    let listHTML = items.map(item => `
        <div class="editable-item">
            <span>${item[fields[0]]} - ${item[fields[1]]}</span>
            <button class="remove-btn" onclick="removeItem('${type}', '${item.id}')">×</button>
        </div>`).join('');

    let inputsHTML = fields.map(field => `
        <div class="form-group">
            <label>${field.replace('_', ' ')}:</label>
            <input type="text" id="add-${type}-${field}" placeholder="${field.includes('ano_') ? 'Deixe em branco se for atual' : ''}">
        </div>`).join('');

    return `<h4>Itens Atuais:</h4><div class="editable-list">${listHTML || '<p>Nenhum item.</p>'}</div><hr><h4>Adicionar Novo:</h4>${inputsHTML}<button class="add-btn" onclick="addItem('${type}', ${JSON.stringify(fields).replace(/"/g, "'")})">Adicionar</button>`;
}

async function saveChanges() {
    if (currentSection !== 'info-pessoais') {
        closeModal();
        return;
    }
    const payload = {
        primeiro_nome: document.getElementById('edit-primeiro_nome').value,
        sobrenome: document.getElementById('edit-sobrenome').value,
        celular: document.getElementById('edit-celular').value,
    };
    await apiCall('put', '/profile/info', payload);
    await loadProfileData();
    closeModal();
}

async function addItem(type, fields) {
    const payload = {}; // user_id será adicionado no backend
    fields.forEach(field => {
        payload[field] = document.getElementById(`add-${type}-${field}`).value;
    });

    // A 'tableName' agora é o próprio 'type'
    await apiCall('post', `/profile/${type}`, payload);
    await loadProfileData();
    editSection(type);
}

async function removeItem(type, id) {
    if (!confirm('Tem certeza?')) return;
    // A 'tableName' agora é o próprio 'type'
    await apiCall('delete', `/profile/${type}/${id}`);
    await loadProfileData();
    editSection(type);
}

async function apiCall(method, endpoint, body) {
    const sessionData = getSession();
    if (!sessionData) return;
    try {
        const response = await fetch(API_URL + endpoint, {
            method: method.toUpperCase(),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionData.access_token}` },
            body: body ? JSON.stringify(body) : undefined
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Falha na operação');
        }
        return await response.json();
    } catch (error) {
        alert(error.message);
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('close')) closeModal();
    if (event.target.classList.contains('modal')) closeModal();
});