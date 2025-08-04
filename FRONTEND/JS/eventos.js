document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const eventCards = document.querySelectorAll(".event-card");
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");

  // --- 1. FUNCIONALIDADE DO MENU LATERAL (SIDEBAR) ---

  /**
   * Alterna a visibilidade do menu lateral em dispositivos móveis.
   * Esta função é chamada pelo `onclick` no botão do HTML.
   */
  window.toggleSidebarMobile = () => {
    sidebar.classList.toggle("show");
  };

  /**
   * Opcional: Adiciona uma função para colapsar/expandir a sidebar no desktop
   * (caso você adicione um botão de toggle para desktop no futuro).
   *
   * Exemplo de botão no HTML:
   * <button class="sidebar-toggle" onclick="toggleSidebarDesktop()">
   * <i class="fas fa-chevron-left"></i>
   * </button>
   */
  window.toggleSidebarDesktop = () => {
    sidebar.classList.toggle("collapsed");
  };

  // --- 2. ANIMAÇÃO DOS CARDS AO ROLAR (SCROLL) ---

  // Verifica se a API de IntersectionObserver é suportada pelo navegador
  if ("IntersectionObserver" in window) {
    const cardObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // Quando o card entra na tela
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            // Para a observação do card depois que a animação acontece uma vez
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.1, // A animação começa quando 10% do card está visível
      }
    );

    // Observa cada um dos cards de evento
    eventCards.forEach((card) => {
      cardObserver.observe(card);
    });
  } else {
    // Se o navegador não suportar, apenas mostra os cards sem animação
    eventCards.forEach((card) => {
      card.classList.add("animate");
    });
  }

  // --- 3. MARCAR O LINK ATIVO NO MENU ---

  const currentPage = window.location.href;

  navLinks.forEach((link) => {
    // Verifica se o href do link está contido na URL da página atual
    if (currentPage.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    }
  });

  // --- BÔNUS: ATUALIZAR NOME DO USUÁRIO (SIMULAÇÃO DE LOGIN) ---

  const userNameElement = document.getElementById("sidebarUserName");
  const userAvatarElement = document.getElementById("userAvatar");

  // Tenta pegar o nome do usuário do armazenamento local
  const loggedInUserName = localStorage.getItem("userName");

  if (loggedInUserName) {
    userNameElement.textContent = loggedInUserName;
    userAvatarElement.textContent = loggedInUserName.charAt(0).toUpperCase();
  }
});