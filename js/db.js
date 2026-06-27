// ==========================================================================
// REPOSITORIO SEMILLA DE OFERTAS COMPARTIDO
// ==========================================================================
const ofertasSemilla = [
    {
        id: 1,
        cargo: "General Forestal",
        empresa: "Ciudad de Lunargenta",
        descripcion: "Se busca estratega para liderar a los Errantes. Excluyente dominio de arco y lealtad a la Fuente del Sol. No aceptamos Trolls Amani ni Caballeros de la Muerte.",
        horario: "Media Jornada (Flexible)",
        sueldo: "1.800.000",
        postulantes: 4, 
        fotoEmpresa: "silvermoon.png",
        bannerEmpresa: "silvermoon2.png" 
    },
    {
        id: 2,
        cargo: "Tecnosacerdote Iniciado",
        empresa: "Adeptus Mechanicus",
        descripcion: "Mantenimiento preventivo de espíritus de la máquina y aplicación de ungüentos sagrados a servidores locales. Conocimiento avanzado en binarismo místico.",
        horario: "Tiempo completo",
        sueldo: "500.000",
        postulantes: 8,
        fotoEmpresa: "adeptus.png", 
        bannerEmpresa: "adeptus2.png" 
    },
    {
        id: 3,
        cargo: "Especialista en Mitigación de Crisis",
        empresa: "Specialized Extracurricular Execution Squad (SEES)",
        descripcion: "Operaciones de patrullaje táctico estrictamente durante la Hora Oscura. Monitoreo de anomalías en la estructura del Tartarus.",
        horario: "Turno Nocturno Obligatorio",
        sueldo: "3.500.000",
        postulantes: 3,
        fotoEmpresa: "sees.png",
        bannerEmpresa: "sees2.png"
    },
    {
        id: 4,
        cargo: "Ingeniero en Logística y Desmantelamiento",
        empresa: "Union Aerospace Corporation (UAC)",
        descripcion: "Gestión de residuos biológicos y contención de brechas dimensionales en Phobos. Indispensable tolerancia a ambientes hostiles.",
        horario: "Disponibilidad completa",
        sueldo: "666.666",
        postulantes: 13,
        fotoEmpresa: "uac.png", 
        bannerEmpresa: "uac2.png"
    },
    {
        id: 5,
        cargo: "Asistente de Investigación y Cartografía de Tamriel",
        empresa: "Gremio de Magos de Cyrodiil",
        descripcion: "Apoyo en el cierre de Anclas Oscuras enviadas por Molag Bal. Clasificación de libros antiguos de Lore y transcripción de Pergaminos Antiguos.",
        horario: "Flexible",
        sueldo: "950.000",
        postulantes: 2,
        fotoEmpresa: "mage.png", 
        bannerEmpresa: "mage2.png"
    },
    {
        id: 6,
        cargo: "Guardián Horadrim Iniciado",
        empresa: "La Orden Horadrim",
        descripcion: "El trabajo incluye archivar tomos malditos, limpiar las letrinas de la cabaña, rastrear al Caminante y contener el avance de las hordas demoniácas.",
        horario: "24/7",
        sueldo: "150.000",
        postulantes: 0,
        fotoEmpresa: "horadrim.png",
        bannerEmpresa: "horadrim2.png"
    }
];

// ==========================================================================
// ASSETS FIJOS DE DISEÑO (LOGOS Y BANNERS)
// ==========================================================================
const assetsFijos = [
    { empresa: "Ciudad de Lunargenta", foto: "silvermoon.png", banner: "silvermoon2.png" },
    { empresa: "Adeptus Mechanicus", foto: "adeptus.png", banner: "adeptus2.png" },
    { empresa: "Specialized Extracurricular Execution Squad (SEES)", foto: "sees.png", banner: "sees2.png" },
    { empresa: "Union Aerospace Corporation (UAC)", foto: "uac.png", banner: "uac2.png" },
    { empresa: "Gremio de Magos de Cyrodiil", foto: "mage.png", banner: "mage2.png" },
    { empresa: "La Orden Horadrim", foto: "horadrim.png", banner: "horadrim2.png" }
];

// ==========================================================================
// FUNCIÓN DE VERIFICACIÓN Y AUTORREPARACIÓN
// ==========================================================================
function inicializarLocalStorage() {
    if (!localStorage.getItem('ofertasLaborales')) {
        localStorage.setItem('ofertasLaborales', JSON.stringify(ofertasSemilla));
    }
    if (!localStorage.getItem('misPostulaciones')) {
        localStorage.setItem('misPostulaciones', JSON.stringify([]));
    }
}