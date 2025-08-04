// FRONTEND/JS/shared.js
document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('supabase.session'));
    const isProtectedRoute = document.body.hasAttribute('data-protected-route');
    const isPublicRoute = document.body.hasAttribute('data-public-route');

    if (isProtectedRoute && !session) {
        window.location.href = 'login.html';
        return;
    }
    
    if (isPublicRoute && session) {
         window.location.href = 'perfil.html';
         return;
    }

    if (session) {
        // Popula sidebar
        fetchUserProfile(session);

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('supabase.session');
                window.location.href = 'login.html';
            });
        }
    }

    // Renderiza o header dinamicamente
    renderHeader(session);
});

async function fetchUserProfile(session) {
    try {
        const response = await fetch('http://localhost:3000/api/profile', {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const profile = await response.json();

        const userName = `${profile.primeiro_nome} ${profile.sobrenome}`;
        
        // Atualiza sidebar
        const sidebarUserName = document.getElementById('sidebarUserName');
        const userAvatar = document.getElementById('userAvatar');
        if(sidebarUserName) sidebarUserName.textContent = userName;
        if(userAvatar) userAvatar.textContent = profile.primeiro_nome.charAt(0);

    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
    }
}
// Cole a função renderHeader que você tem no seu telainicial.js aqui
// ...