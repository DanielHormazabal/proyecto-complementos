// 1. EL REPOSITORIO DE OFERTAS (Hardcodeado como pidió el profe)
const ofertasLaborales = [
    {
        id: 1,
        cargo: "Desarrollador Web Frontend",
        postulantes: 3,
        descripcion: "Apoyo en la maquetación y diseño de interfaces institucionales usando HTML, CSS y JavaScript.",
        horario: "Part-time (20 horas semanales, flexible)",
        sueldo: "$450.000",
        empresa: "Dirección de TI Finis Terrae",
        bannerFade: "rgba(0, 148, 182, 0.1)"
    },
    {
        id: 2,
        cargo: "Analista Junior TI",
        postulantes: 1,
        descripcion: "Gestión de infraestructura local, soporte técnico a usuarios de la facultad y documentación de procesos.",
        horario: "Media jornada (Lunes a Viernes por la mañana)",
        sueldo: "$400.000",
        empresa: "Soporte Ingeniería",
        bannerFade: "rgba(51, 122, 183, 0.1)"
    },
    {
        id: 3,
        cargo: "Ayudante de Laboratorio Informática",
        postulantes: 0,
        descripcion: "Supervisión de laboratorios de computación, asistencia a alumnos en asignaturas de programación básica.",
        horario: "10 horas semanales (bloques asignados)",
        sueldo: "$150.000",
        empresa: "Facultad de Ingeniería",
        bannerFade: "rgba(0, 148, 182, 0.15)"
    }
];

// Arreglo volátil para guardar a qué ofertas se ha asignado el alumno
let misPostulaciones = [];

// Elementos de la interfaz (DOM)
const offersContent = document.querySelector('.offers-content');
const tabButtons = document.querySelectorAll('.tab-button');

// 2. FUNCIÓN PARA CARGAR Y RENDERIZAR LAS OFERTAS EN PANTALLA
function cargarOfertas(listaAFiltrar) {
    offersContent.innerHTML = ""; // Limpiamos el contenedor

    if (listaAFiltrar.length === 0) {
        offersContent.innerHTML = `<p style="text-align:center; padding:20px; color:#777;">No tienes postulaciones o asignaciones registradas aún.</p>`;
        return;
    }

    listaAFiltrar.forEach(oferta => {
        // Verificar si el alumno ya se asignó a esta oferta
        const yaPostulo = misPostulaciones.some(p => p.id === oferta.id);
        
        const cardHtml = `
            <article class="offer-card">
                <div class="company-logo">${oferta.empresa}</div>
                
                <div class="offer-details">
                    <h2 class="offer-title">${oferta.cargo} <span class="postulants-badge">(${oferta.postulantes} postulantes)</span></h2>
                    <p class="offer-description">${oferta.descripcion}</p>
                    <p class="offer-schedule"><strong>Horario:</strong> ${oferta.horario}</p>
                    <p class="offer-salary"><strong>Sueldo:</strong> ${oferta.sueldo}</p>
                    
                    ${yaPostulo 
                        ? `<button class="apply-button" style="background-color: #28a745; cursor: default;" disabled>¡Ya estás asignado!</button>`
                        : `<button class="apply-button" onclick="asignarOferta(${oferta.id})">Seleccionar Empresa</button>`
                    }
                </div>

                <div class="company-banner" style="background: linear-gradient(90deg, rgba(255,255,255,1) 0%, ${oferta.bannerFade} 100%);">
                    <span>Banner con fade institucional</span>
                </div>
            </article>
        `;
        offersContent.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// 3. ACCIÓN DE ASIGNACIÓN (El clic que pidió el profesor)
window.asignarOferta = function(id) {
    const ofertaSeleccionada = ofertasLaborales.find(o => o.id === id);
    
    if (ofertaSeleccionada) {
        ofertaSeleccionada.postulantes += 1; // Aumentamos dinámicamente los postulantes
        misPostulaciones.push(ofertaSeleccionada); // Lo guardamos en su lista
        
        alert(`¡Éxito! Te has asignado correctamente a la oferta: ${ofertaSeleccionada.cargo}`);
        cargarOfertas(ofertasLaborales); // Redibujamos la lista
    }
};

// 4. CONTROL DE LAS PESTAÑAS (VER OFERTAS VS MIS POSTULACIONES)
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Quitar clase activa a todos los botones
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Agregar al botón presionado
        button.classList.add('active');

        // Filtrar qué ver según el texto de la pestaña
        if (button.textContent.includes("VER OFERTAS DE TRABAJO")) {
            cargarOfertas(ofertasLaborales);
        } else if (button.textContent.includes("MIS POSTULACIONES")) {
            cargarOfertas(misPostulaciones);
        }
    });
});

// Inicializar la app mostrando todas las ofertas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarOfertas(ofertasLaborales);
});