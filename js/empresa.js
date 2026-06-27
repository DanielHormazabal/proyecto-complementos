// Aseguramos que la BD local exista
inicializarLocalStorage();

const miEmpresaLogueada = sessionStorage.getItem('empresaLogueada') || "Ciudad de Lunargenta";
let subTabActiva = "global";

function inicializar() {
    document.getElementById('nombreEmpresaSidebar').textContent = miEmpresaLogueada;
    document.getElementById('tituloEmpresaHeader').textContent = `Portal Corporativo - ${miEmpresaLogueada}`;
    document.getElementById('empresaAvatar').textContent = miEmpresaLogueada.substring(0,2).toUpperCase();
    renderizarVista();
}

function cambiarSeccionEmpresa(destino) {
    subTabActiva = destino;
    document.getElementById('btnTabGlobal').classList.toggle('active', destino === 'global');
    document.getElementById('btnTabMisOfertas').classList.toggle('active', destino === 'propias');
    renderizarVista();
}

function renderizarVista() {
    const mainBox = document.getElementById('contenedorEmpresaDinamico');
    let ofertasGlobales = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    
    if (!mainBox) return;
    mainBox.innerHTML = "";

    if (subTabActiva === "global") {
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
                        ${asset.banner ? `<div class="card-background-banner" style="background-image: url('images/${asset.banner}'); opacity: 0.65;"></div>` : ''}
                        <div style="display: flex; align-items: center; gap: 15px; z-index: 2;">
                            <img src="images/${asset.foto}" alt="Logo" style="width: 55px; height: 55px; border-radius: 50%; object-fit: cover; border: 2px solid #133253; background-color:#fff;">
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
        // === PESTAÑA 2: MIS OFERTAS ===
        const misOfertas = ofertasGlobales.filter(o => o.empresa === miEmpresaLogueada);
        const assetPropio = assetsFijos.find(a => a.empresa === miEmpresaLogueada) || { foto: "empty_user.png", banner: "" };

        misOfertas.forEach((o, idx) => {
            const totalPostulantes = o.postulantes;
            let filasPostulantesHtml = "";
            if (totalPostulantes > 0) {
                for (let i = 0; i < totalPostulantes; i++) {
                    filasPostulantesHtml += `
                        <div style="padding: 10px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                            <div>
                                <strong style="color:#133253;">Candidato: Daniel Hormazábal</strong>
                                <div style="color:#666; font-size:12px;">RUT: 12345678-9 | Carrera: Ingeniería Civil Informática</div>
                            </div>
                            <span style="background:#e6f4f8; color:#0094b6; font-size:11px; padding:3px 8px; border-radius:4px; font-weight:bold;">En Revisión</span>
                        </div>
                    `;
                }
            } else {
                filasPostulantesHtml = "<p style='color:#777; font-size:13px; margin:0;'>No se registran postulantes para esta vacante aún.</p>";
            }

            mainBox.insertAdjacentHTML('beforeend', `
                <div style="background-color: white; border: 1px solid #dcdcdc; border-left: 5px solid #0094b6; border-radius: 6px; overflow: hidden; margin-bottom: 5px;">
                    <div onclick="toggleLocal(${idx})" class="offer-card" style="display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; cursor: pointer; margin: 0; border: none; box-shadow: none; border-bottom: 1px solid #e2e8f0;">
                        ${assetPropio.banner ? `<div class="card-background-banner" style="background-image: url('images/${assetPropio.banner}'); opacity: 0.65;"></div>` : ''}
                        <div style="display: flex; align-items: center; gap: 15px; z-index: 2;">
                            <div style="background:#0094b6; color:white; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">💼</div>
                            <div>
                                <h3 style="margin: 0; color: #133253; font-size: 16px; font-weight: bold;">${o.cargo}</h3>
                                <span style="font-size: 12px; color: #4a5568; font-weight: bold;">Sueldo: $${o.sueldo} | Postulantes totales: ${totalPostulantes}</span>
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
        fotoEmpresa: semilla.foto || "empty_user.png",
        bannerEmpresa: semilla.banner || ""
    };

    list.push(n);
    localStorage.setItem('ofertasLaborales', JSON.stringify(list));
    alert("Oferta publicada con éxito.");
    renderizarVista();
};

document.addEventListener('DOMContentLoaded', inicializar);