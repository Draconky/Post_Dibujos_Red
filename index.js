let imagenesData = [];
let currentIndex = 0;
let currentViewMode = 'grid';

const carpeta = "imagenes/";

function generarTituloFallback(nombreArchivo) {
    return nombreArchivo
        .replace(/\.[^/.]+$/, "")
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());
}

async function cargarDatosJSON() {
    try {
        const response = await fetch('sources/descripciones.json');
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.status}`);
        }
        const data = await response.json();

        imagenesData = data.filter(item =>
            item.estado_visible === true ||
            item.estado_visible === "true"
        );

        cargarGaleria();
    } catch (error) {
        console.error("No se pudo cargar el archivo descripciones.json:", error);

        const galleryContainer = document.getElementById('gallery');
        galleryContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <p class="text-muted fs-5">No se pudieron cargar las descripciones.<br>Verifique que el archivo sources/descripciones.json exista y sea accesible.</p>
            </div>`;
    }
}

function cargarGaleria() {
    const galleryContainer = document.getElementById('gallery');
    galleryContainer.innerHTML = '';

    if (imagenesData.length === 0) {
        galleryContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-images fa-3x text-muted mb-3"></i>
                <p class="text-muted fs-5">No hay imágenes visibles en este momento.</p>
            </div>`;
        return;
    }

    imagenesData.forEach((item, index) => {
        const titulo = item.titulo || generarTituloFallback(item.ruta);
        const rutaCompleta = `${carpeta}${item.ruta}`;

        const esRuta = item.ruta.toLowerCase().startsWith("ruta");

        const col = document.createElement('div');
        col.className = `col-12 col-sm-6 col-md-4 col-lg-3 gallery-item`;
        col.style.animationDelay = `${index * 60}ms`;

        col.innerHTML = `
            <div class="gallery-card h-100 shadow-sm">
                <div class="position-relative overflow-hidden ${esRuta ? 'ruta-bg' : ''}">
                    <img src="${rutaCompleta}" 
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
                    <small class="text-white-50">${item.ruta}</small>
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
    const modalElement = document.getElementById('imageModal');

    let oldInstance = bootstrap.Modal.getInstance(modalElement);
    if (oldInstance) oldInstance.dispose();

    const modal = new bootstrap.Modal(modalElement, {
        backdrop: true,
        keyboard: true
    });

    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalCounter = document.getElementById('modalCounter');

    const item = imagenesData[currentIndex];
    const titulo = item.titulo || generarTituloFallback(item.ruta);
    const descripcion = item.descripcion || "Sin descripción disponible.";
    const rutaCompleta = `${carpeta}${item.ruta}`;

    modalTitle.textContent = titulo;
    modalCounter.textContent = `${currentIndex + 1} de ${imagenesData.length}`;


    const modalBody = modalElement.querySelector('.modal-body');

    modalBody.innerHTML = `
        <div class="container-fluid">
            <div class="row g-0 align-items-center">

                <div class="col-lg-8 text-center bg-black p-2 position-relative">
                    <img id="modalImage"
                        src="${rutaCompleta}"
                        alt="${titulo}"
                        class="img-fluid w-100"
                        style="max-height:88vh; object-fit:contain;">

                    <button id="prevBtn"
                        class="nav-btn position-absolute start-0 top-50 translate-middle-y btn btn-dark rounded-circle ms-2">
                        <i class="fas fa-chevron-left"></i>
                    </button>

                    <button id="nextBtn"
                        class="nav-btn position-absolute end-0 top-50 translate-middle-y btn btn-dark rounded-circle me-2">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div class="col-lg-4 bg-dark text-white p-4">
                    <h5 class="fw-bold mb-3">${titulo}</h5>
                    <p class="mb-0 text-white text-justify" style="text-align:justify;">
                        ${descripcion}
                    </p>
                </div>

            </div>
        </div>
    `;


    document.getElementById('prevBtn').onclick = () => {
        currentIndex = (currentIndex - 1 + imagenesData.length) % imagenesData.length;
        mostrarImagenEnModal();
    };

    document.getElementById('nextBtn').onclick = () => {
        currentIndex = (currentIndex + 1) % imagenesData.length;
        mostrarImagenEnModal();
    };


    document.getElementById('modalImage').ondblclick = () => {
        modal.hide();
    };

    const btnDownload = document.getElementById('btn-download');

    btnDownload.onclick = () => {
        const link = document.createElement('a');
        link.href = rutaCompleta;
        link.download = item.ruta;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    modalElement.addEventListener('hidden.bs.modal', function limpiarModal() {
        modal.dispose();

        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');

        modalElement.removeEventListener('hidden.bs.modal', limpiarModal);
    });

    modal.show();
}

function setupModalNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + imagenesData.length) % imagenesData.length;
        mostrarImagenEnModal();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % imagenesData.length;
        mostrarImagenEnModal();
    });

    document.addEventListener('keydown', (e) => {
        const modalEl = document.getElementById('imageModal');
        if (modalEl.classList.contains('show')) {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + imagenesData.length) % imagenesData.length;
                mostrarImagenEnModal();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % imagenesData.length;
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
    cargarDatosJSON();
    setupModalNavigation();
    setupViewButtons();

    const modalImage = document.getElementById('modalImage');
    modalImage.addEventListener('dblclick', () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
        if (modal) modal.hide();
    });
});