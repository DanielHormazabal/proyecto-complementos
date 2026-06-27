/**
 * ESTUDIANTE.JS - PORTAL DE ALUMNOS
 * Controla la lógica de visualización del catálogo de ofertas, filtrado por tabs 
 * y el mecanismo para realizar postulaciones desde la perspectiva de Elena Rostova.
 */

const offersContent = document.querySelector('.offers-content');
const tabButtons = document.querySelectorAll('.tab-button');

/**
 * inicializarPerfilEstudiante
 * Modifica directamente los elementos del DOM de la barra lateral para inyectar los datos
 * de la alumna activa (Elena Rostova), asegurando la consistencia de la simulación.
 */
function inicializarPerfilEstudiante() {
    const sidebarAvatar = document.getElementById('avatarEstudianteSidebar');
    if (sidebarAvatar) {
        sidebarAvatar.innerHTML = `
            <img src="images/usuarios/prota.png" 
                 alt="Elena Rostova" 
                 style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;">
        `; // CORRECCIÓN: Eliminados los estilos redundantes del script inline a través de propiedades directas
        sidebarAvatar.style.padding = "0";
        sidebarAvatar.style.overflow = "hidden";
        sidebarAvatar.style.background = "#fff";
    }

    const userNameLabel = document.getElementById('nombreEstudianteSidebar');
    if (userNameLabel) userNameLabel.textContent = "Elena Rostova";
    
    const userBioLabel = document.getElementById('bioEstudianteSidebar');
    if (userBioLabel) {
        userBioLabel.textContent = "Estudiante destacada e impulsora del proyecto. Apasionada por el desarrollo web front-end, interfaces interactivas y la arquitectura de sistemas escalables en la nube.";
    }
}

/**
 * renderizarOfertas
 * Orquestador principal de la UI. Lee el estado de LocalStorage y decide si pintar 
 * las empresas disponibles (Catálogo) o las postulaciones ya realizadas.
 */
function renderizarOfertas() {
    if (!offersContent) return;
    offersContent.innerHTML = "";

    const tabActiva = document.querySelector('.tab-button.active');
    const modoVerOfertas = tabActiva ? tabActiva.textContent.includes("VER OFERTAS DE TRABAJO") : true;

    // Lectura fresca del estado actual en el LocalStorage
    const ofertasLaborales = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    const misPostulaciones = JSON.parse(localStorage.getItem('misPostulaciones')) || [];

    if (modoVerOfertas) {
        // --- MODO CATÁLOGO ---
        // Filtramos las ofertas a las que Elena NO ha postulado aún
        const ofertasDisponibles = ofertasLaborales.filter(o => !misPostulaciones.some(p => p.id === o.id));
        
        if (ofertasDisponibles.length === 0) {
            offersContent.innerHTML = `<p style="text-align:center; padding:20px; color:#777;">No quedan ofertas disponibles en el sistema.</p>`;
            return;
        }

        // Agrupación por empresa para generar los acordeones contenedores
        const empresasConOfertas = [...new Set(ofertasDisponibles.map(o => o.empresa))];

        empresasConOfertas.forEach((nombreEmpresa, index) => {
            const listaOfertasEmpresa = ofertasDisponibles.filter(o => o.empresa === nombreEmpresa);
            const cantidad = listaOfertasEmpresa.length;
            
            const ofertaOrigen = ofertasSemilla.find(s => s.empresa === nombreEmpresa) || listaOfertasEmpresa[0];
            const foto = ofertaOrigen.fotoEmpresa || "empty_user.png";
            const banner = ofertaOrigen.bannerEmpresa || "";

            const empresaHtml = `
                <div style="background-color: white; border: 1px solid #dcdcdc; border-left: 5px solid #133253; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.04); margin-bottom: 8px;">
                    <div onclick="toggleEmpresa(${index})" class="offer-card" style="display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; cursor: pointer; margin: 0; border: none; border-radius: 0; box-shadow: none; border-bottom: 1px solid #e2e8f0;">
                        ${banner ? `<div class="card-background-banner" style="background-image: url('images/empresas/${banner}'); opacity: 0.65;"></div>` : ''}
                        <div style="display: flex; align-items: center; gap: 15px; z-index: 2;">
                            <img src="images/empresas/${foto}" alt="Logo" style="width: 55px; height: 55px; border-radius: 50%; object-fit: cover; border: 2px solid #133253; background-color: #fff;">
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
                                        <span><strong>Postulantes:</strong> ${(oferta.postulantesDetalle || []).length}</span>
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

        misPostulaciones.forEach(registroPostulacion => {
            // Buscamos la información en tiempo real de la oferta basándonos en el ID de la postulación
            const ofertaReal = ofertasLaborales.find(o => o.id === registroPostulacion.id);
            if (!ofertaReal) return; // Salvaguarda en caso de que la empresa haya borrado la vacante

            const oOrigen = ofertasSemilla.find(s => s.empresa === ofertaReal.empresa) || ofertaReal;
            const img = oOrigen.fotoEmpresa || "empty_user.png";
            const banner = oOrigen.bannerEmpresa || "";

            // CORRECCIÓN INTERNA: Evaluación unificada usando .estado en lugar de estadoResolucion
            let textoBoton = "Postulado con Éxito";
            let claseEstiloAdicional = "btn-success";

            if (registroPostulacion.estado === "Aceptado") {
                textoBoton = "Postulación aceptada";
                claseEstiloAdicional = "btn-success";
            } else if (registroPostulacion.estado === "Rechazado") {
                textoBoton = "Postulación rechazada";
                claseEstiloAdicional = "btn-danger";
            }

            const cardHtml = `
                <article class="offer-card">
                    ${banner ? `<div class="card-background-banner" style="background-image: url('images/empresas/${banner}'); opacity: 0.65;"></div>` : ''}
                    <div class="company-logo-container">
                        <img src="images/empresas/${img}" alt="Logo" class="company-circular-logo">
                        <div class="company-name-label">${ofertaReal.empresa}</div>
                    </div>
                    <div class="offer-details">
                        <h2 class="offer-title">${ofertaReal.cargo}</h2>
                        <p class="offer-description">${ofertaReal.descripcion}</p>
                        <p class="offer-info-line"><strong>Sueldo:</strong> $${ofertaReal.sueldo} | <strong>Total Postulantes:</strong> ${(ofertaReal.postulantesDetalle || []).length}</p>
                        <button class="apply-button ${claseEstiloAdicional}" disabled>${textoBoton}</button>
                    </div>
                </article>
            `;
            offersContent.insertAdjacentHTML('beforeend', cardHtml);
        });
    }
}

// Control de apertura/cierre (Aviso de Acordeón)
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

/**
 * asignarOferta
 * Registra la postulación del alumno. Modifica el array global de ofertas inyectando a Elena,
 * y añade la referencia relacional limpia en 'misPostulaciones'.
 */
window.asignarOferta = function(id) {
    const ofertasLaborales = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    const misPostulaciones = JSON.parse(localStorage.getItem('misPostulaciones')) || [];

    const index = ofertasLaborales.findIndex(o => o.id === id);
    if (index !== -1) {
        if (!ofertasLaborales[index].postulantesDetalle) {
            ofertasLaborales[index].postulantesDetalle = [];
        }

        // Estructura de datos completa de Elena Rostova para el panel corporativo
        const protaDefecto = {
            rut: "12345678-9",
            nombre: "Elena Rostova",
            carrera: "Ingeniería Civil Informática",
            bio: "Estudiante destacada e impulsora del proyecto. Apasionada por el desarrollo web front-end, interfaces interactivas y la arquitectura de sistemas escalables en la nube.",
            foto: "prota.png",
            estado: "En Revisión" // CORRECCIÓN: Unificado
        };

        // Mutamos la base de datos general de ofertas
        ofertasLaborales[index].postulantesDetalle.push(protaDefecto);
        ofertasLaborales[index].postulantes += 1;
        
        // CORRECCIÓN OPTIMIZADA: En 'misPostulaciones' guardamos solo una tupla identificadora/estado relacional
        misPostulaciones.push({
            id: id,
            estado: "En Revisión"
        });
        
        // Guardado coordinado en LocalStorage
        localStorage.setItem('ofertasLaborales', JSON.stringify(ofertasLaborales));
        localStorage.setItem('misPostulaciones', JSON.stringify(misPostulaciones));
        
        alert(`¡Postulación Exitosa! Tus antecedentes han sido enviados.`);
        renderizarOfertas();
    }
};

// Delegación de eventos para las pestañas de navegación
if (tabButtons && tabButtons.length > 0) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderizarOfertas();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    inicializarPerfilEstudiante();
    renderizarOfertas();
});