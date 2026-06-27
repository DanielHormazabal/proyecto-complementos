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

window.cambiarSeccionEmpresa = function(destino) {
    subTabActiva = destino;
    document.getElementById('btnTabGlobal').classList.toggle('active', destino === 'global');
    document.getElementById('btnTabMisOfertas').classList.toggle('active', destino === 'propias');
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
        listaOrdenada.unshift(miEmpresaLogueada);  // Forzamos nuestra empresa al principio de la lista

        listaOrdenada.forEach((nombreEmpresa, idx) => {
            const listado = ofertasGlobales.filter(o => o.empresa === nombreEmpresa);
            const asset = assetsFijos.find(a => a.empresa === nombreEmpresa) || { foto: "empty_user.png", banner: "" };
            const esMia = (nombreEmpresa === miEmpresaLogueada);

            mainBox.insertAdjacentHTML('beforeend', `
                <div style="background-color: white; border: 1px solid #dcdcdc; border-left: 5px solid ${esMia ? '#0094b6' : '#133253'}; border-radius: 6px; overflow: hidden; margin-bottom: 5px;">
                    <div onclick="toggleLocal(${idx})" class="offer-card" style="display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; cursor: pointer; margin: 0; border: none; box-shadow: none; border-bottom: 1px solid #e2e8f0;">
                        ${asset.banner ? `<div class="card-background-banner" style="background-image: url('images/empresas/${asset.banner}'); opacity: 0.65;"></div>` : ''}
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
                <div style="background-color: white; border: 1px solid #dcdcdc; border-left: 5px solid #0094b6; border-radius: 6px; overflow: hidden; margin-bottom: 5px;">
                    <div onclick="toggleLocal(${idx})" class="offer-card" style="display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; cursor: pointer; margin: 0; border: none; box-shadow: none; border-bottom: 1px solid #e2e8f0;">
                        ${assetPropio.banner ? `<div class="card-background-banner" style="background-image: url('images/empresas/${assetPropio.banner}'); opacity: 0.65;"></div>` : ''}
                        <div style="display: flex; align-items: center; gap: 15px; z-index: 2;">
                            <div style="background:#0094b6; color:white; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">💼</div>
                            <div>
                                <h3 style="margin: 0; color: #133253; font-size: 16px; font-weight: bold;">${o.cargo}</h3>
                                <span style="font-size: 12px; color: #4a5568; font-weight: bold;">Sueldo: $${o.sueldo} | Postulantes totales: ${detallePostulantes.length}</span>
                            </div>
                        </div>
                        <div style="z-index:10; display:flex; align-items:center; gap:10px;">
                            <button onclick="event.stopPropagation(); borrarId(${o.id});" style="background:#d9534f; color:white; border:none; padding:6px 12px; border-radius:4px; font-weight:bold; font-size:11px; cursor:pointer;">Eliminar</button>
                            <span id="flecha-${idx}" style="font-size: 16px; color: #133253; font-weight: bold;">▼</span>
                        </div>
                    </div>
                    <div id="sub-${idx}" style="display: none; padding: 15px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; flex-direction: column; gap: 10px;">
                        <h4 style="margin:0 0 5px 0; font-size:13px; color:#0094b6; text-transform:uppercase; font-weight:bold;">👥 Expedientes de Postulantes en Sistema:</h4>
                        ${filasPostulantesHtml}
                    </div>
                </div>
            `);
        });

        // Formulario incrustado para inyectar nuevas ofertas vacías
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
    if (confirm("¿Eliminar oferta definitivamente?")) {
        let list = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
        list = list.filter(o => o.id !== id);
        localStorage.setItem('ofertasLaborales', JSON.stringify(list));
        
        let post = JSON.parse(localStorage.getItem('misPostulaciones')) || [];
        post = post.filter(p => p.id !== id);
        localStorage.setItem('misPostulaciones', JSON.stringify(post));

        alert("Oferta removida.");
        renderizarVista();
    }
};

window.guardarIncrustada = function(e) {
    e.preventDefault();
    let list = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    const semilla = assetsFijos.find(a => a.empresa === miEmpresaLogueada) || {};

    const n = {
        id: Date.now(),
        empresa: miEmpresaLogueada,
        cargo: document.getElementById('c').value,
        horario: document.getElementById('h').value,
        sueldo: document.getElementById('s').value,
        descripcion: document.getElementById('d').value,
        postulantes: 0,
        postulantesDetalle: [],
        fotoEmpresa: semilla.foto || "empty_user.png",
        bannerEmpresa: semilla.banner || ""
    };

    list.push(n);
    localStorage.setItem('ofertasLaborales', JSON.stringify(list));
    alert("Oferta publicada con éxito.");
    renderizarVista();
};

window.abrirModalPerfil = function(ofertaId, alumnoRut) {
    let ofertasGlobales = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    const o = ofertasGlobales.find(item => item.id === ofertaId);
    if (!o) return;
    
    const p = o.postulantesDetalle.find(item => item.rut === alumnoRut);
    if (!p) return;

    const modalHtml = `
        <div id="modalPerfilFlotante" style="position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:99999;">
            <div style="background:white; width:360px; padding:20px; border-radius:8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-family: Arial, sans-serif; position:relative; text-align: center;">
                <img src="images/usuarios/${p.foto || 'userM1.png'}" alt="Foto Perfil" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; border: 2px solid #133253; background-color: #f1f5f9;">
                <h3 style="margin: 0 0 5px 0; color:#133253; font-size:18px; font-weight:bold;">${p.nombre}</h3>
                <p style="margin: 0 0 12px 0; font-size:12px; color:#555;"><strong>RUT:</strong> ${p.rut} <br> <strong>Carrera:</strong> ${p.carrera}</p>
                <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px; border-radius:4px; font-size:13px; color:#4a5568; line-height:1.4; margin-bottom:15px; max-height:100px; overflow-y:auto; text-align: left;">
                    ${p.bio}
                </div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <button onclick="responderPostulacion(${ofertaId}, '${alumnoRut}', 'Aceptado')" style="background:#28a745; color:white; border:none; padding:10px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:13px;">Aceptar</button>
                    <button onclick="responderPostulacion(${ofertaId}, '${alumnoRut}', 'Rechazado')" style="background:#dc3545; color:white; border:none; padding:10px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:13px;">Rechazar</button>
                    <button onclick="/* Operación no funcional simulada */" style="background:#6c757d; color:white; border:none; padding:10px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:13px;">DescargarCV</button>
                    <button onclick="cerrarModalPerfil()" style="background:none; border:none; color:#718096; text-decoration:underline; font-size:12px; cursor:pointer; margin-top:4px;">Cerrar Ventana</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.cerrarModalPerfil = function() {
    const modal = document.getElementById('modalPerfilFlotante');
    if (modal) modal.remove();
};

/**
 * responderPostulacion
 * Modifica el estado evaluativo del candidato.
 * CORRECCIÓN: Sincroniza limpiamente la propiedad interna .estado tanto en la lista global 
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
            misPostulaciones[postIdx].estado = estadoFinal; // CORRECCIÓN: Cambiado de estadoResolucion a estado
        }
    }

    // Guardado unificado y actualización reactiva de la interfaz
    localStorage.setItem('ofertasLaborales', JSON.stringify(ofertasGlobales));
    localStorage.setItem('misPostulaciones', JSON.stringify(misPostulaciones));
    
    cerrarModalPerfil();
    renderizarVista();
};

document.addEventListener('DOMContentLoaded', inicializar);