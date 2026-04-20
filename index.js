
const imagenes = [
    "Meili con casco.png",
    "Mini If Anastasia y Ben.png",
    "XLR8 con Betty.png"
];
const carpeta = "imagenes/";

function cargarGaleria() {
    const galleryContainer = document.getElementById('gallery');
    galleryContainer.innerHTML = '';

    if (imagenes.length === 0) {
        galleryContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted fs-5">No hay imágenes para mostrar.</p>
      </div>`;
        return;
    }

    imagenes.forEach((nombreArchivo, index) => {
        const titulo = nombreArchivo
            .replace(/\.[^/.]+$/, "")
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .replace(/\b\w/g, l => l.toUpperCase());

        const col = document.createElement('div');
        col.className = `col-12 col-sm-6 col-md-4 col-lg-3`;
        col.style.animationDelay = `${index * 80}ms`;

        col.innerHTML = `
      <div class="gallery-card h-100 shadow-sm">
        <img src="${carpeta}${nombreArchivo}" 
             class="gallery-img img-fluid w-100 rounded-top" 
             alt="${titulo}"
             onerror="this.src='./Image-not-found.png';">
        <div class="card-body p-3 text-center">
          <h6 class="img-title mb-0">${titulo}</h6>
        </div>
      </div>
    `;

        col.querySelector('img').addEventListener('click', () => {
            document.getElementById('modalImage').src = `${carpeta}${nombreArchivo}`;
            document.getElementById('modalTitle').textContent = titulo;
            new bootstrap.Modal(document.getElementById('imageModal')).show();
        });

        galleryContainer.appendChild(col);
    });
}

document.addEventListener('DOMContentLoaded', cargarGaleria);
