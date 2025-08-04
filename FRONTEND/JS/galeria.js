// Dados iniciais dos trabalhos
let works = [
    {
        title: "Revista ED. Cultural",
        date: "2024-07-15",
        description: "Desenvolvimento de uma revista sobre a trajetória educacional da população negra, desde o período abolicionista até a atualidade",
        images: [
            "../IMAGENS/2.png",
            "../IMAGENS/11.jpg"
        ]
    },
    {
        title: "Nova capa do livro O Cortiço",
        date: "2024-04-20",
        description: "Criação de uma nova capa para o livro 'O Cortiço' de Aluísio Azevedo, utilizando uma de suas personagens femininas, seja ela Rita Baiana ou a Bertoleza. Nós da Equipe Rocket decidimos por usar como centro da capa a Bertoleza destacando a história marcante da personagem.",
        images: [
            "../IMAGENS/5.JPG"
        ]
    },
    {
        title: "Animação 'De volta para o passado'",
        date: "2024-08-16",
        description: "Desenvolvimento de uma animação que fala sobre os processos e impactos da segunda revolução industrial no continente asiático e africano, e as novas tecnologias que surgiram nesse período.",
        images: [
            "../IMAGENS/6.JPG",
            "../IMAGENS/7.JPG",
            "../IMAGENS/4.JPG"
        ]
    },
    {
        title: "Maquete do SESI",
        date: "2024-08-16",
        description: "Desenvolvimento de uma maquete da escola SESI Djalma Pessoa, com foco na implementação de um semáforo inteligente para pessoas deficientes que se adapta ao fluxo de veículos e pedestres, melhorando a segurança e eficiência do tráfego.",
        images: [
            "../IMAGENS/8.JPG",
            "../IMAGENS/9.JPG",
            "../IMAGENS/12.JPG"
        ]
    },
    {
        title: "Documentário de matemática",
        date: "2024-09-07",
        description: "Confecção de um documentário que explora temas da matemática e da ODS 4, educação de qualidade.",
        images: [
            "../IMAGENS/13.PNG"
        ]
    },
    {
        title: "Filme '2A entre os mundos'",
        date: "2025-07-29",
        description: "Produção de um filme de ficção científica que explora temas de trabalho, tecnologia e sociedade em um futuro distópico",
        images: [
            "../IMAGENS/1.PNG"
        ]
    }
];

let selectedImages = [];

// Funções da sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = document.getElementById('toggleIcon');
    const body = document.body;
    
    sidebar.classList.toggle('collapsed');
    body.classList.toggle('sidebar-collapsed');
    
    if (sidebar.classList.contains('collapsed')) {
        toggleIcon.classList.remove('fa-bars');
        toggleIcon.classList.add('fa-chevron-right');
    } else {
        toggleIcon.classList.remove('fa-chevron-right');
        toggleIcon.classList.add('fa-bars');
    }
}

// Funções do modal
function openModal() {
    document.getElementById('modal').style.display = 'block';
    selectedImages = [];
    updateImagePreview();
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('workForm').reset();
    selectedImages = [];
    updateImagePreview();
}

function openImageModal(imageSrc) {
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('imageModal').style.display = 'block';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function changeMainImage(thumbnail, workImagesContainer) {
    const mainImage = workImagesContainer.querySelector('.main-image');
    const allThumbnails = workImagesContainer.querySelectorAll('.thumbnail-image');
    
    // Remove active class from all thumbnails
    allThumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    // Add active class to clicked thumbnail
    thumbnail.classList.add('active');
    
    // Change main image source
    mainImage.src = thumbnail.src;
    mainImage.alt = thumbnail.alt;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    return date.toLocaleDateString('pt-BR', options);
}

function renderWorks() {
    const workGrid = document.getElementById('workGrid');
    if (!workGrid) return;
    
    workGrid.innerHTML = '';

    // Ordenar trabalhos por data (mais recente primeiro)
    works.sort((a, b) => new Date(b.date) - new Date(a.date));

    works.forEach(work => {
        const workCard = document.createElement('div');
        workCard.className = 'work-card';
        
        let imagesHtml = '';
        if (work.images && work.images.length > 0) {
            const mainImage = work.images[0];
            const thumbnailElements = work.images.map((img, index) => 
                `<img src="${img}" alt="Imagem ${index + 1}" class="thumbnail-image ${index === 0 ? 'active' : ''}" onclick="changeMainImage(this, this.parentElement.parentElement)">`
            ).join('');
            
            imagesHtml = `
                <div class="work-images">
                    <img src="${mainImage}" alt="Imagem principal" class="main-image" onclick="openImageModal('${mainImage}')">
                    <div class="image-thumbnails">
                        ${thumbnailElements}
                    </div>
                </div>
            `;
        }
        
        workCard.innerHTML = `
            ${imagesHtml}
            <div class="work-content">
                <h3 class="work-title">${work.title}</h3>
                <div class="work-date">${formatDate(work.date)}</div>
                <p class="work-description">${work.description}</p>
            </div>
        `;
        workGrid.appendChild(workCard);
    });
}

function updateImagePreview() {
    const container = document.getElementById('imagePreviewContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    selectedImages.forEach((image, index) => {
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `
            <img src="${image}" alt="Preview">
            <button class="remove-image" onclick="removeImage(${index})">&times;</button>
        `;
        container.appendChild(preview);
    });
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    updateImagePreview();
}

// Event listeners
function initializeEventListeners() {
    // Image input event listener
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        selectedImages.push(e.target.result);
                        updateImagePreview();
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    // Form submission event listener
    const workForm = document.getElementById('workForm');
    if (workForm) {
        workForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('title').value;
            const date = document.getElementById('date').value;
            const description = document.getElementById('description').value;

            if (title && date && description) {
                works.push({
                    title: title,
                    date: date,
                    description: description,
                    images: [...selectedImages]
                });

                renderWorks();
                closeModal();
            }
        });
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        const imageModal = document.getElementById('imageModal');
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === imageModal) {
            closeImageModal();
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeImageModal();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    renderWorks();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeEventListeners();
        renderWorks();
    });
} else {
    initializeEventListeners();
    renderWorks();
}
