// Aseguramos que la BD local exista
inicializarLocalStorage();

// Elementos de la interfaz (DOM)
const offersContent = document.querySelector('.offers-content');
const tabButtons = document.querySelectorAll('.tab-button');

let ofertasLaborales = JSON.parse(localStorage.getItem('ofertasLaborales'));
let misPostulaciones = JSON.parse(localStorage.getItem('misPostulaciones'));

// RENDERIZAR PANEL ESTUDIANTE
function renderizarOfertas() {
    if (!offersContent) return;
    offersContent.innerHTML = "";

    const tabActiva = document.querySelector('.tab-button.active');
    const modoVerOfertas = tabActiva ? tabActiva.textContent.includes("VER OFERTAS DE TRABAJO") : true;

    if (modoVerOfertas) {
        // --- MODO CATÁLOGO ALUMNO (Ordenamiento dinámico al azar) ---
        const ofertasDisponibles = ofertasLaborales.filter(o => !misPostulaciones.some(p => p.id === o.id));
        
        // REGLA: Mezclamos de manera visual únicamente para los alumnos
        const copiaDesordenada = [...ofertasDisponibles].sort(() => Math.random() - 0.5);
        const empresasConOfertas = [...new Set(copiaDesordenada.map(o => o.empresa))];

        if (empresasConOfertas.length === 0) {
            offersContent.innerHTML = `<p style="text-align:center; padding:20px; color:#777;">No quedan ofertas disponibles en el sistema.</p>`;
            return;
        }

        empresasConOfertas.forEach((nombreEmpresa, index) => {
            const listaOfertasEmpresa = ofertasDisponibles.filter(o => o.empresa === nombreEmpresa);
            const cantidad = listaOfertasEmpresa.length;
            
            const ofertaOrigen = ofertasSemilla.find(s => s.empresa === nombreEmpresa) || listaOfertasEmpresa[0];
            const foto = ofertaOrigen.fotoEmpresa ? ofertaOrigen.fotoEmpresa : "empty_user.png";
            const banner = ofertaOrigen.bannerEmpresa ? ofertaOrigen.bannerEmpresa : "";

            const empresaHtml = `
                <div style="background-color: white; border: 1px solid #dcdcdc; border-left: 5px solid #133253; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.04); margin-bottom: 8px;">
                    <div onclick="toggleEmpresa(${index})" class="offer-card" style="display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; cursor: pointer; margin: 0; border: none; border-radius: 0; box-shadow: none; border-bottom: 1px solid #e2e8f0;">
                        ${banner !== "" ? `<div class="card-background-banner" style="background-image: url('images/${banner}'); opacity: 0.65;"></div>` : ''}
                        <div style="display: flex; align-items: center; gap: 15px; z-index: 2;">
                            <img src="images/${foto}" alt="Logo" style="width: 55px; height: 55px; border-radius: 50%; object-fit: cover; border: 2px solid #133253; background-color: #fff;">
                            <div>
                                <h3 style="margin: 0; color: #133253; font-size: 17px; font-weight: bold;">${nombreEmpresa}</h3>
                                <span style="font-size: 12px; color: #0094b6; font-weight: bold; background-color: #e6f4f8; padding: 2px 8px; border-radius: 10px; display: inline-block; margin-top: 4px;">Ofertas disponibles: ${cantidad}</span>
                            </div>
                        </div>
                        <span id="flecha-${index}" style="font-size: 18px; color: #133253; font-weight: bold; transition: transform 0.2s; z-index: 2;">▼</span>
                    </div>
                    <div id="sublista-${index}" style="display: none; padding: 15px; background-color: #fff; flex-direction: column; gap: 12px;">
                        ${listaOfertasEmpresa.map(oferta => `
                            <div style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                                <div style="max-width: 80%;">
                                    <h4 style="margin: 0 0 4px 0; color: #133253; font-size: 15px; font-weight: 600;">${oferta.cargo}</h4>
                                    <p style="margin: 4px 0; font-size: 13px; color: #4a5568; line-height: 1.4;">${oferta.descripcion}</p>
                                    <div style="font-size: 12px; color: #718096; display: flex; gap: 15px; margin-top: 6px;">
                                        <span><strong>Sueldo:</strong> $${oferta.sueldo}</span>
                                        <span><strong>Postulantes:</strong> ${oferta.postulantes}</span>
                                    </div>
                                </div>
                                <div>
                                    <button onclick="asignarOferta(${oferta.id})" class="apply-button" style="margin-top:0;">Postular</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            offersContent.insertAdjacentHTML('beforeend', empresaHtml);
        });

    } else {
        // --- MODO MIS POSTULACIONES ---
        if (misPostulaciones.length === 0) {
            offersContent.innerHTML = `<p style="text-align:center; padding:20px; color:#777;">Aún no has postulado a ninguna oferta.</p>`;
            return;
        }
        misPostulaciones.forEach(oferta => {
            const oOrigen = ofertasSemilla.find(s => s.empresa === oferta.empresa) || oferta;
            const img = oOrigen.fotoEmpresa ? oOrigen.fotoEmpresa : "empty_user.png";
            const banner = oOrigen.bannerEmpresa ? oOrigen.bannerEmpresa : "";

            const cardHtml = `
                <article class="offer-card">
                    ${banner ? `<div class="card-background-banner" style="background-image: url('images/${banner}'); opacity: 0.65;"></div>` : ''}
                    <div class="company-logo-container">
                        <img src="images/${img}" alt="Logo" class="company-circular-logo">
                        <div class="company-name-label">${oferta.empresa}</div>
                    </div>
                    <div class="offer-details">
                        <h2 class="offer-title">${oferta.cargo}</h2>
                        <p class="offer-description">${oferta.descripcion}</p>
                        <p class="offer-info-line"><strong>Sueldo:</strong> $${oferta.sueldo} | <strong>Total Postulantes:</strong> ${oferta.postulantes}</p>
                        <button class="apply-button btn-success" disabled>Postulado con Éxito</button>
                    </div>
                </article>
            `;
            offersContent.insertAdjacentHTML('beforeend', cardHtml);
        });
    }
}

window.toggleEmpresa = function(index) {
    const sublista = document.getElementById(`sublista-${index}`);
    const flecha = document.getElementById(`flecha-${index}`);
    if (sublista.style.display === "none") {
        sublista.style.display = "flex";
        flecha.style.transform = "rotate(180deg)";
    } else {
        sublista.style.display = "none";
        flecha.style.transform = "rotate(0deg)";
    }
};

window.asignarOferta = function(id) {
    // Re-leemos para evitar desfases de información entre paneles
    ofertasLaborales = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    misPostulaciones = JSON.parse(localStorage.getItem('misPostulaciones')) || [];

    const index = ofertasLaborales.findIndex(o => o.id === id);
    if (index !== -1) {
        ofertasLaborales[index].postulantes += 1;
        misPostulaciones.push(ofertasLaborales[index]);
        
        localStorage.setItem('ofertasLaborales', JSON.stringify(ofertasLaborales));
        localStorage.setItem('misPostulaciones', JSON.stringify(misPostulaciones));
        
        alert(`¡Postulación Exitosa! Tus antecedentes han sido enviados.`);
        renderizarOfertas();
    }
};

if (tabButtons && tabButtons.length > 0 && !window.location.href.includes('empresa.html')) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderizarOfertas();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarOfertas();
});