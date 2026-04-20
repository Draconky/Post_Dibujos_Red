const imagenes = [
    "Meili con casco.png",
    "Mini If Anastasia y Ben.png",
    "XLR8 con Betty.png"
];

const carpeta = "imagenes/";

let currentIndex = 0;
let currentViewMode = 'grid';

function generarTitulo(nombreArchivo) {
    return nombreArchivo
        .replace(/\.[^/.]+$/, "")
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());
}

function cargarGaleria() {
    const galleryContainer = document.getElementById('gallery');
    galleryContainer.innerHTML = '';

    if (imagenes.length === 0) {
        galleryContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-images fa-3x text-muted mb-3"></i>
                <p class="text-muted fs-5">No hay imágenes para mostrar en este momento.</p>
            </div>`;
        return;
    }

    imagenes.forEach((nombreArchivo, index) => {
        const titulo = generarTitulo(nombreArchivo);
        const col = document.createElement('div');

        col.className = `col-12 col-sm-6 col-md-4 col-lg-3 gallery-item`;
        col.style.animationDelay = `${index * 60}ms`;

        col.innerHTML = `
            <div class="gallery-card h-100 shadow-sm">
                <div class="position-relative overflow-hidden">
                    <img src="${carpeta}${nombreArchivo}" 
                         class="gallery-img img-fluid w-100" 
                         alt="${titulo}"
                         loading="lazy"
                         onerror="this.src='./Image-not-found.png'; this.onerror=null;">
                    <div class="image-overlay">
                        <button class="btn btn-light btn-sm view-btn">
                            <i class="fas fa-expand"></i> Ampliar
                        </button>
                    </div>
                </div>
                <div class="card-body p-3 text-center">
                    <h6 class="img-title mb-0">${titulo}</h6>
                    <small class="text-white-50">${nombreArchivo}</small>
                </div>
            </div>
        `;

        const imgElement = col.querySelector('img');
        const viewBtn = col.querySelector('.view-btn');

        const openModal = () => {
            currentIndex = index;
            mostrarImagenEnModal();
        };

        imgElement.addEventListener('click', openModal);
        viewBtn.addEventListener('click', openModal);

        galleryContainer.appendChild(col);
    });


    aplicarModoVista();
}

function mostrarImagenEnModal() {
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalCounter = document.getElementById('modalCounter');

    const nombreArchivo = imagenes[currentIndex];
    const titulo = generarTitulo(nombreArchivo);

    modalImage.src = `${carpeta}${nombreArchivo}`;
    modalTitle.textContent = titulo;
    modalCounter.textContent = `${currentIndex + 1} de ${imagenes.length}`;


    const btnDownload = document.getElementById('btn-download');
    btnDownload.onclick = () => {
        const link = document.createElement('a');
        link.href = `${carpeta}${nombreArchivo}`;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    modal.show();
}

function setupModalNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + imagenes.length) % imagenes.length;
        mostrarImagenEnModal();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % imagenes.length;
        mostrarImagenEnModal();
    });

    document.addEventListener('keydown', (e) => {
        const modalEl = document.getElementById('imageModal');
        if (modalEl.classList.contains('show')) {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + imagenes.length) % imagenes.length;
                mostrarImagenEnModal();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % imagenes.length;
                mostrarImagenEnModal();
            } else if (e.key === 'Escape') {
                bootstrap.Modal.getInstance(modalEl).hide();
            }
        }
    });
}

function aplicarModoVista() {
    const gallery = document.getElementById('gallery');
    const btnGrid = document.getElementById('btn-grid');
    const btnMasonry = document.getElementById('btn-masonry');

    if (currentViewMode === 'masonry') {
        gallery.classList.add('masonry');
        gallery.classList.remove('row', 'g-4');
        btnMasonry.classList.add('active');
        btnGrid.classList.remove('active');
    } else {
        gallery.classList.remove('masonry');
        gallery.classList.add('row', 'g-4');
        btnGrid.classList.add('active');
        btnMasonry.classList.remove('active');
    }
}

function setupViewButtons() {
    const btnGrid = document.getElementById('btn-grid');
    const btnMasonry = document.getElementById('btn-masonry');

    btnGrid.addEventListener('click', () => {
        currentViewMode = 'grid';
        aplicarModoVista();
    });

    btnMasonry.addEventListener('click', () => {
        currentViewMode = 'masonry';
        aplicarModoVista();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarGaleria();
    setupModalNavigation();
    setupViewButtons();


    const modalImage = document.getElementById('modalImage');
    modalImage.addEventListener('dblclick', () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
        if (modal) modal.hide();
    });
});