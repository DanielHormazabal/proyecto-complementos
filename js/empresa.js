/**
 * EMPRESA.JS - PANEL CORPORATIVO ADMINISTRATIVO
 * Gestionar la publicación de vacantes propias, visualización global del mercado laboral
 * y el procesamiento evaluativo (Aceptar/Rechazar) de expedientes de estudiantes.
 */

// Recupera la sesión actual compartida a través de SessionStorage
const miEmpresaLogueada = sessionStorage.getItem('empresaLogueada') || "Ciudad de Lunargenta";
let subTabActiva = "global";

function inicializar() {
    document.getElementById('nombreEmpresaSidebar').textContent = miEmpresaLogueada;
    document.getElementById('tituloEmpresaHeader').textContent = `Portal Corporativo - ${miEmpresaLogueada}`;
    
    const avatarContenedor = document.getElementById('empresaAvatar');
    if (avatarContenedor) {
        const assetEmpresa = assetsFijos.find(a => a.empresa === miEmpresaLogueada) || { foto: "empty_user.png" };
        
        avatarContenedor.innerHTML = `
            <img src="images/empresas/${assetEmpresa.foto}" 
                 alt="Logo Empresa" 
                 style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;">
        `;
        avatarContenedor.style.padding = "0";
        avatarContenedor.style.overflow = "hidden";
        avatarContenedor.style.background = "#fff";
    }

    renderizarVista();
}

window.cambiarSeccionEmpresa = function(seccion) {
    subTabActiva = seccion;
    
    const btnGlobal = document.getElementById('btnTabGlobal');
    const btnPropias = document.getElementById('btnTabMisOfertas');
    
    if (subTabActiva === "global") {
        btnGlobal.classList.add('active');
        btnPropias.classList.remove('active');
    } else {
        btnGlobal.classList.remove('active');
        btnPropias.classList.add('active');
    }
    
    renderizarVista();
};

function renderizarVista() {
    const mainBox = document.getElementById('contenedorEmpresaDinamico');
    let ofertasGlobales = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    
    if (!mainBox) return;
    mainBox.innerHTML = "";

    if (subTabActiva === "global") {
        // --- PESTAÑA: EXPLORADOR GLOBAL ---
        const empresasUnicas = [...new Set(ofertasGlobales.map(o => o.empresa))];
        const listaOrdenada = empresasUnicas.filter(e => e !== miEmpresaLogueada);
        listaOrdenada.unshift(miEmpresaLogueada);

        listaOrdenada.forEach((nombreEmpresa, idx) => {
            const listado = ofertasGlobales.filter(o => o.empresa === nombreEmpresa);
            const asset = assetsFijos.find(a => a.empresa === nombreEmpresa) || { foto: "empty_user.png", banner: "" };
            const esMia = (nombreEmpresa === miEmpresaLogueada);

            mainBox.insertAdjacentHTML('beforeend', `
                <div style="background-color: white; border: 1px solid #dcdcdc; border-left: 5px solid ${esMia ? '#0094b6' : '#133253'}; border-radius: 6px; overflow: hidden; margin-bottom: 5px;">
                    <div onclick="toggleLocal(${idx})" class="offer-card" style="display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; cursor: pointer; margin: 0; border: none; box-shadow: none; border-bottom: 1px solid #e2e8f0;">
                        ${asset.banner ? `<div class="card-background-banner" style="background-image: url('images/empresas/${asset.banner}');"></div>` : ''}
                        <div style="display: flex; align-items: center; gap: 15px; z-index: 2;">
                            <img src="images/empresas/${asset.foto}" alt="Logo" style="width: 55px; height: 55px; border-radius: 50%; object-fit: cover; border: 2px solid #133253; background-color:#fff;">
                            <div>
                                <h3 style="margin: 0; color: #133253; font-size: 17px; font-weight: bold;">${nombreEmpresa} ${esMia ? '<span style="font-size:11px; background:#0094b6; color:white; padding:2px 6px; border-radius:4px; margin-left:5px;">Tu Perfil</span>' : ''}</h3>
                                <span style="font-size: 12px; color: #0094b6; font-weight: bold; background-color: #e6f4f8; padding: 2px 8px; border-radius: 10px; display: inline-block; margin-top: 4px;">Ofertas activas: ${listado.length}</span>
                            </div>
                        </div>
                        <span id="flecha-${idx}" style="font-size: 18px; color: #133253; font-weight: bold; transition: transform 0.2s; z-index: 2;">▼</span>
                    </div>
                    <div id="sub-${idx}" style="display: none; padding: 15px; background-color: #fff; flex-direction: column; gap: 12px;">
                        ${listado.map(o => `
                            <div style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; border-radius: 4px;">
                                <h4 style="margin: 0 0 4px 0; color: #133253; font-size: 15px; font-weight: 600;">${o.cargo}</h4>
                                <p style="margin: 4px 0; font-size: 13px; color: #4a5568;">${o.descripcion}</p>
                                <div style="font-size: 12px; color: #718096; display: flex; gap: 15px; margin-top: 6px;">
                                    <span><strong>Horario:</strong> ${o.horario} | <strong>Sueldo:</strong> $${o.sueldo}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `);
        });

    } else {
        // --- PESTAÑA: MIS OFERTAS (GESTIÓN VUT) ---
        const misOfertas = ofertasGlobales.filter(o => o.empresa === miEmpresaLogueada);
        const assetPropio = assetsFijos.find(a => a.empresa === miEmpresaLogueada) || { foto: "empty_user.png", banner: "" };

        misOfertas.forEach((o, idx) => {
            const detallePostulantes = o.postulantesDetalle || [];
            let filasPostulantesHtml = "";
            
            if (detallePostulantes.length > 0) {
                detallePostulantes.forEach((p) => {
                    let badgeStyle = "background:#e6f4f8; color:#0094b6;";
                    if (p.estado === "Aceptado") badgeStyle = "background:#d4edda; color:#155724;";
                    if (p.estado === "Rechazado") badgeStyle = "background:#f8d7da; color:#721c24;";

                    filasPostulantesHtml += `
                        <div style="padding: 10px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <img src="images/usuarios/${p.foto || 'userM1.png'}" alt="Avatar" style="width: 40px; height: 40px; min-width: 40px; min-height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #133253; background-color: #f1f5f9;">
                                <div>
                                    <strong style="color:#133253;">Candidato: ${p.nombre}</strong>
                                    <div style="color:#666; font-size:12px;">RUT: ${p.rut} | Carrera: ${p.carrera}</div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="${badgeStyle} font-size:11px; padding:3px 8px; border-radius:4px; font-weight:bold;">${p.estado}</span>
                                <button onclick="event.stopPropagation(); abrirModalPerfil(${o.id}, '${p.rut}')" style="background:#133253; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;">Perfil</button>
                            </div>
                        </div>
                    `;
                });
            } else {
                filasPostulantesHtml = "<p style='color:#777; font-size:13px; margin:0;'>No se registran postulantes para esta vacante aún.</p>";
            }

            mainBox.insertAdjacentHTML('beforeend', `
                <div id="contenedor-oferta-vut-${o.id}" style="background-color: white; border: 1px solid #dcdcdc; border-left: 5px solid #0094b6; border-radius: 6px; overflow: hidden; margin-bottom: 5px;">
                    <div onclick="toggleLocal(${idx})" class="offer-card" style="display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; cursor: pointer; margin: 0; border: none; box-shadow: none; border-bottom: 1px solid #e2e8f0;">
                        ${assetPropio.banner ? `<div class="card-background-banner" style="background-image: url('images/empresas/${assetPropio.banner}');"></div>` : ''}
                        <div style="display: flex; align-items: center; gap: 15px; z-index: 2;">
                            <div style="background:#0094b6; color:white; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">💼</div>
                            <div>
                                <h3 style="margin: 0; color: #133253; font-size: 16px; font-weight: bold;">${o.cargo}</h3>
                                <span style="font-size: 12px; color: #4a5568; font-weight: bold;">Sueldo: $${o.sueldo} | Postulantes totales: ${detallePostulantes.length}</span>
                            </div>
                        </div>
                        <div style="z-index:10; display:flex; align-items:center; gap:10px;">
                            <button onclick="event.stopPropagation(); borrarId(${o.id});" style="background:#d9534f; color:white; border:none; padding:6px 12px; border-radius:4px; font-weight:bold; font-size:11px; cursor:pointer;">Eliminar</button>
                            <span id="flecha-${idx}" style="font-size: 16px; color: #133253; font-weight: bold; transform: rotate(0deg);">▼</span>
                        </div>
                    </div>
                    <div id="sub-${idx}" data-ofertaid="${o.id}" class="vut-acordeon-content" style="display: none; padding: 15px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; flex-direction: column; gap: 10px;">
                        <h4 style="margin:0 0 5px 0; font-size:13px; color:#0094b6; text-transform:uppercase; font-weight:bold;">👥 Expedientes de Postulantes en Sistema:</h4>
                        ${filasPostulantesHtml}
                    </div>
                </div>
            `);
        });

        // Formulario incrustado de inserción
        mainBox.insertAdjacentHTML('beforeend', `
            <div style="padding: 15px; border: 2px dashed #0094b6; background-color: #f0f9ff; border-radius: 6px; margin-top: 5px;">
                <h4 style="margin: 0 0 10px 0; color: #0094b6; font-size: 14px; font-weight: bold; text-transform: uppercase; text-align: center;">✨ Formulario de Oferta en Blanco</h4>
                <form id="formIncrustado" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;" onsubmit="guardarIncrustada(event)">
                    <div style="grid-column: span 2;"><input type="text" id="c" placeholder="Nombre de la Vacante..." required style="width:97%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
                    <div><input type="text" id="h" placeholder="Horario..." required style="width:94%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
                    <div><input type="text" id="s" placeholder="Sueldo..." required style="width:94%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
                    <div style="grid-column: span 2;"><textarea id="d" placeholder="Descripción de requerimientos..." rows="2" required style="width:97%; padding:8px; border:1px solid #ccc; border-radius:4px; resize:none;"></textarea></div>
                    <div style="grid-column: span 2; text-align: right;"><button type="submit" style="background:#0094b6; color:white; border:none; padding:10px 20px; font-weight:bold; border-radius:4px; cursor:pointer;">🚀 Publicar Vacante</button></div>
                </form>
            </div>
        `);
    }
}

window.toggleLocal = function(idx) {
    const box = document.getElementById(`sub-${idx}`);
    const fl = document.getElementById(`flecha-${idx}`);
    if (box.style.display === "none") {
        box.style.display = "flex";
        if(fl) fl.style.transform = "rotate(180deg)";
    } else {
        box.style.display = "none";
        if(fl) fl.style.transform = "rotate(0deg)";
    }
};

window.borrarId = function(id) {
    let actuales = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    actuales = actuales.filter(o => o.id !== id);
    localStorage.setItem('ofertasLaborales', JSON.stringify(actuales));
    renderizarVista();
};

window.guardarIncrustada = function(e) {
    e.preventDefault();
    const cargoVal = document.getElementById('c').value;
    const horVal = document.getElementById('h').value;
    const suelVal = document.getElementById('s').value;
    const descVal = document.getElementById('d').value;

    let actuales = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    const nuevoId = actuales.length > 0 ? Math.max(...actuales.map(o => o.id)) + 1 : 1;

    const nuevaOferta = {
        id: nuevoId,
        cargo: cargoVal,
        empresa: miEmpresaLogueada,
        descripcion: descVal,
        horario: horVal,
        sueldo: suelVal,
        postulantes: 0,
        postulantesDetalle: []
    };

    actuales.push(nuevaOferta);
    localStorage.setItem('ofertasLaborales', JSON.stringify(actuales));
    renderizarVista();
};

/**
 * SISTEMA MODAL INTERACTIVO DE EVALUACIÓN
 */
let modalOfertaIdActual = null;
let modalAlumnoRutActual = null;

window.abrirModalPerfil = function(ofertaId, alumnoRut) {
    modalOfertaIdActual = ofertaId;
    modalAlumnoRutActual = alumnoRut;

    let ofertasGlobales = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    const oferta = ofertasGlobales.find(o => o.id === ofertaId);
    if (!oferta) return;

    const postulante = oferta.postulantesDetalle.find(p => p.rut === alumnoRut);
    if (!postulante) return;

    // Inyección estructural del contenedor modal al final del body
    document.body.insertAdjacentHTML('beforeend', `
        <div id="modalFondoEvaluacion" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: fadeModal 0.2s ease-out;">
                <div style="background: #133253; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin:0; font-size:16px; font-weight:bold;">Expediente de Postulación</h3>
                    <button onclick="cerrarModalEval()" style="background:none; border:none; color:white; font-size:20px; cursor:pointer; font-weight:bold;">&times;</button>
                </div>
                <div style="padding: 20px; display: flex; flex-direction: column; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
                        <img src="images/usuarios/${postulante.foto || 'userM1.png'}" style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover; border: 2px solid #133253;">
                        <div>
                            <h4 style="margin:0 0 4px 0; color:#133253; font-size:16px;">${postulante.nombre}</h4>
                            <p style="margin:2px 0; font-size:13px; color:#4a5568;"><strong>RUT:</strong> ${postulante.rut}</p>
                            <p style="margin:2px 0; font-size:13px; color:#0094b6;"><strong>Carrera:</strong> ${postulante.carrera}</p>
                        </div>
                    </div>
                    <div>
                        <h5 style="margin:0 0 6px 0; font-size:12px; color:#a0aec0; letter-spacing:1px; text-transform:uppercase;">Declaración de Objetivos / Bio</h5>
                        <p style="margin:0; font-size:13px; color:#4a5568; line-height:1.5; background:#f8fafc; padding:10px; border-radius:4px; border:1px solid #e2e8f0;">
                            ${postulante.bio || 'El estudiante no ha registrado una biografía complementaria de presentación en su perfil.'}
                        </p>
                    </div>
                    <div style="margin-top: 10px; padding: 10px; background: #e6f4f8; border-radius: 4px; font-size: 12px; color: #133253;">
                        <strong>Estado actual en sistema:</strong> ${postulante.estado}
                    </div>
                </div>
                <div style="background: #f8fafc; padding: 15px 20px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0;">
                    <button onclick="responderPostulacion(${ofertaId}, '${alumnoRut}', 'Rechazado')" style="background:#d9534f; color:white; border:none; padding:8px 16px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:13px;">Rechazar</button>
                    <button onclick="responderPostulacion(${ofertaId}, '${alumnoRut}', 'Aceptado')" style="background:#28a745; color:white; border:none; padding:8px 16px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:13px;">Aceptar</button>
                </div>
            </div>
        </div>
    `);
};

window.cerrarModalEval = function() {
    const modal = document.getElementById('modalFondoEvaluacion');
    if (modal) modal.remove();
    modalOfertaIdActual = null;
    modalAlumnoRutActual = null;
};

/**
 * Procesa la evaluación (Aceptar/Rechazar) impactando tanto en la lista global 
 * de ofertas como en la lista de postulaciones relacionales del estudiante de forma unificada.
 */
window.responderPostulacion = function(ofertaId, alumnoRut, estadoFinal) {
    let ofertasGlobales = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    let misPostulaciones = JSON.parse(localStorage.getItem('misPostulaciones')) || [];

    // 1. Actualizar el estado en el listado general de la empresa
    const oIdx = ofertasGlobales.findIndex(o => o.id === ofertaId);
    if (oIdx !== -1) {
        const pIdx = ofertasGlobales[oIdx].postulantesDetalle.findIndex(p => p.rut === alumnoRut);
        if (pIdx !== -1) {
            ofertasGlobales[oIdx].postulantesDetalle[pIdx].estado = estadoFinal;
        }
    }

    // 2. Si el alumno modificado es Elena Rostova, sincronizamos su tabla intermedia relacional
    if (alumnoRut === "12345678-9") {
        const postIdx = misPostulaciones.findIndex(p => p.id === ofertaId);
        if (postIdx !== -1) {
            misPostulaciones[postIdx].estado = estadoFinal; 
        }
    }

    // Guardado unificado y actualización reactiva de la interfaz
    localStorage.setItem('ofertasLaborales', JSON.stringify(ofertasGlobales));
    localStorage.setItem('misPostulaciones', JSON.stringify(misPostulaciones));
    
    cerrarModalEval();
    renderizarVista();

    // Lógica inmediata de reapertura: busca el elemento que tenía ese ID y le simula clic al header del acordeón
    const todosLosContenidos = document.querySelectorAll('.vut-acordeon-content');
    todosLosContenidos.forEach((elemento) => {
        if (parseInt(elemento.getAttribute('data-ofertaid')) === ofertaId) {
            const componentePadre = elemento.parentElement;
            if (componentePadre) {
                const cabeceraAcordeon = componentePadre.querySelector('.offer-card');
                if (cabeceraAcordeon) {
                    cabeceraAcordeon.click();
                }
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', inicializar);