/**
 * DB.JS - CAPA DE DATOS SIMULADA
 * Este archivo actúa como el motor de persistencia del lado del cliente (Client-Side Storage).
 * Utiliza LocalStorage para emular una base de datos relacional y persistir la información
 * entre recargas de página y navegaciones.
 */

// Repositorio semilla estático (Simula los registros iniciales de una tabla 'ofertas')
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

// Mapeo estático de assets visuales por empresa
const assetsFijos = [
    { empresa: "Ciudad de Lunargenta", foto: "silvermoon.png", banner: "silvermoon2.png" },
    { empresa: "Adeptus Mechanicus", foto: "adeptus.png", banner: "adeptus2.png" },
    { empresa: "Specialized Extracurricular Execution Squad (SEES)", foto: "sees.png", banner: "sees2.png" },
    { empresa: "Union Aerospace Corporation (UAC)", foto: "uac.png", banner: "uac2.png" },
    { empresa: "Gremio de Magos de Cyrodiil", foto: "mage.png", banner: "mage2.png" },
    { empresa: "La Orden Horadrim", foto: "horadrim.png", banner: "horadrim2.png" }
];

// Pool de alumnos de prueba (Simula la tabla 'alumnos')
const alumnosPrueba = [
    { rut: "12345678-9", nombre: "Elena Rostova", carrera: "Ingeniería Civil Informática", bio: "Estudiante destacada e impulsora del proyecto. Apasionada por el desarrollo web front-end, interfaces interactivas y la arquitectura de sistemas escalables en la nube.", foto: "prota.png" },
    { rut: "11223344-5", nombre: "Constanza Vega", carrera: "Ingeniería Civil Informática", bio: "Especialista en ciberseguridad, análisis forense digital y auditorías de código preventivas.", foto: "userF1.png" },
    { rut: "22334455-6", nombre: "Ignacio Toledo", carrera: "Ingeniería en Computación", bio: "Desarrollador mobile nativo con fuerte interés en algoritmos de optimización distribuidos.", foto: "userM1.png" },
    { rut: "33445566-7", nombre: "Camila Sanhueza", carrera: "Ingeniería Civil Informática", bio: "Entusiasta de la ciencia de datos, machine learning y el procesamiento de lenguaje natural.", foto: "userF2.png" },
    { rut: "44556677-8", nombre: "Felipe Oyarzún", carrera: "Ingeniería en Computación", bio: "Administrador de sistemas enfocado en la cultura DevOps e infraestructura como código (IaC).", foto: "userM2.png" },
    { rut: "55667788-9", nombre: "Valentina Henríquez", carrera: "Ciencia de Datos", bio: "Enfocada en el modelamiento predictivo estadístico y análisis estratégico de Big Data corporativo.", foto: "userF3.png" },
    { rut: "66778899-0", nombre: "Matías Carrasco", carrera: "Ingeniería Civil Informática", bio: "Desarrollador backend con amplio dominio en arquitecturas de microservicios y APIs RESTful.", foto: "userM3.png" },
    { rut: "77889900-1", nombre: "Javiera Muñoz", carrera: "Ingeniería en Computación", bio: "Diseñadora de interfaces de usuario (UI/UX) enfocada en prototipado rápido y testeo de usabilidad.", foto: "userF4.png" },
    { rut: "88990011-2", pointer: "Gonzalo Pinto", nombre: "Gonzalo Pinto", carrera: "Ciencia de Datos", bio: "Estudiante de último año enfocado en analítica predictiva y automatización inteligente de flujos.", foto: "userM4.png" },
    { rut: "99001122-3", nombre: "Francisca Soto", carrera: "Ingeniería Civil Informática", bio: "Interesada en el desarrollo de simulaciones en tiempo real, física computacional y videojuegos.", foto: "userF5.png" }
];

/**
 * inicializarLocalStorage
 * Verifica la existencia de las claves de almacenamiento. Si no existen, realiza la hidratación
 * inicial (seeding) distribuyendo alumnos al azar sin incluir a la alumna protagonista (Elena).
 */
function inicializarLocalStorage() {
    if (!localStorage.getItem('ofertasLaborales')) {
        // Excluimos explícitamente a Elena Rostova del pool de asignación aleatoria inicial
        const alumnosDisponiblesParaAzar = alumnosPrueba.filter(alumno => alumno.rut !== "12345678-9");

        const ofertasModificadas = ofertasSemilla.map(oferta => {
            const postulantesAsignados = [];
            if (oferta.postulantes > 0) {
                // Algoritmo de ordenamiento aleatorio sutil (Fisher-Yates simplificado mediante .sort)
                const copiaAlumnos = [...alumnosDisponiblesParaAzar].sort(() => Math.random() - 0.5);
                
                // Determinamos cuántos alumnos meter en la vacante sin desbordar el pool
                const limite = Math.min(oferta.postulantes, copiaAlumnos.length);
                for (let i = 0; i < limite; i++) {
                    postulantesAsignados.push({
                        rut: copiaAlumnos[i].rut,
                        nombre: copiaAlumnos[i].nombre,
                        carrera: copiaAlumnos[i].carrera,
                        bio: copiaAlumnos[i].bio,
                        foto: copiaAlumnos[i].foto,
                        estado: "En Revisión" // CORRECCIÓN INTERNA: Estandarizado a "estado"
                    });
                }
            }
            return {
                ...oferta,
                postulantesDetalle: postulantesAsignados
            };
        });
        localStorage.setItem('ofertasLaborales', JSON.stringify(ofertasModificadas));
    }
    
    // Inicializamos la tabla intermedia de postulaciones de Elena como un array de relaciones { id, estado }
    if (!localStorage.getItem('misPostulaciones')) {
        localStorage.setItem('misPostulaciones', JSON.stringify([]));
    }
}

// Se autoejecuta la inicialización apenas se procesa el script
inicializarLocalStorage();