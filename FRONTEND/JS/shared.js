// Atividade-pontuada-portal/FRONTEND/JS/shared.js

document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('supabase.session'));
    const body = document.body;
    const isProtectedRoute = body.hasAttribute('data-protected-route');
    const isPublicRoute = body.hasAttribute('data-public-route');

    if (isProtectedRoute && !session) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    if (isPublicRoute && session) {
        window.location.href = 'perfil.html';
        return;
    }

    renderHeader(session);

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('supabase.session');
            alert('Você foi desconectado.');
            window.location.href = 'login.html';
        });
    }
});

function renderHeader(session) {
    const headerContainer = document.querySelector('header.main-header');
    if (!headerContainer) return;

    const logoSrc = '../IMAGENS/Logo roxa.png';
    const currentPath = window.location.pathname.split('/').pop();

    let navLinks = '';

    if (session) {
        // Navegação para utilizador LOGADO
        navLinks = `
            <li class="nav-item">
                <a class="nav-link ${currentPath === 'perfil.html' ? 'active' : ''}" href="perfil.html">Meu Perfil</a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${currentPath === 'formulario.html' ? 'active' : ''}" href="formulario.html">Suporte</a>
            </li>
             <li class="nav-item">
                <a class="nav-link ${currentPath === 'quemsomos.html' ? 'active' : ''}" href="quemsomos.html">Quem Somos</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" id="logoutButton">Sair</a>
            </li>
        `;
    } else {
        // Navegação para utilizador DESLOGADO
        navLinks = `
            <li class="nav-item">
                <a class="nav-link ${currentPath === 'login.html' ? 'active' : ''}" href="login.html">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${currentPath === 'cadastro.html' ? 'active' : ''}" href="cadastro.html">Cadastre-se</a>
            </li>
             <li class="nav-item">
                <a class="nav-link ${currentPath === 'telainicial.html' ? 'active' : ''}" href="telainicial.html">Inicio</a>
            </li>
        `;
    }

    const headerHTML = `
        <nav class="navbar navbar-expand-lg bg-white shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand" href="${session ? 'perfil.html' : 'login.html'}">
                    <img src="${logoSrc}" alt="RocketLab Logo" style="height: 40px;">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        ${navLinks}
                    </ul>
                </div>
            </div>
        </nav>
    `;

    headerContainer.innerHTML = headerHTML;
}