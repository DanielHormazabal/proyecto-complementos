# Finis Trabaja - Portal Universitario de Vinculación Laboral (`v1.0.0`)

Este proyecto consiste en un prototipo funcional a escala de una plataforma web local para la gestión de ofertas laborales, vinculación estudiantil y administración corporativa. Está desarrollado utilizando tecnologías estándar de la plataforma web nativa (Vanilla Architecture) y estructurado específicamente como material de estudio para comprender la persistencia en el cliente, la sincronización de estados y la manipulación dinámica del DOM.

---

## 🛠️ Arquitectura y Tecnologías

El sistema destaca por no depender de frameworks externos, implementando patrones de diseño de software mediante:

- **HTML5 Semántico:** Estructuras modulares y optimizadas para evitar el parpadeo de contenido no estilizado (FOUC).
- **CSS3 Consolidado:** Diseño adaptativo, grillas (`Grid Layout`) y Flexbox, centralizados en una única hoja de estilos para una limpia separación de responsabilidades.
- **Vanilla JavaScript (ES6+):** Programación orientada a eventos, delegación de selectores y funciones asíncronas simuladas en el entorno global.
- **Web Storage API (Persistencia):** Uso estratégico de `LocalStorage` (como base de datos global relacional simulada) y `SessionStorage` (para el control de estados de sesión del navegador).

---

## 🧭 Flujo de Ejecución del Programa

```text
[ index.html ] ──► Selecciona Perfil
                     │
                     ├──► Alumno  ──► [ estudiante.html ] (Catálogo al azar / Mis Postulaciones)
                     └──► Empresa ──► [ empresa.html ]    (Filtra por sesión corporativa)
```

### 1. Inicialización y Carga de Datos (`index.html`)

Al abrir `index.html`, el navegador procesa la interfaz de acceso.

El motor de datos (`db.js`) se ejecuta en segundo plano: verifica si existen las claves en el `LocalStorage`.

Si el almacenamiento está vacío, realiza una **hidratación inicial (Seeding):** distribuye de forma aleatoria a 9 candidatos ficticios (`userFX.png` / `userMX.png`) entre las ofertas de trabajo existentes.

> **Regla de Negocio Crítica:** La alumna protagonista, **Elena Rostova**, es excluida automáticamente de este pool inicial para evitar registros duplicados desincronizados si decide postular de forma manual.

### 2. Flujo del Módulo de Estudiantes (`estudiante.html`)

- **Autenticación Simulada:** El portal asume de forma directa la sesión activa de Elena Rostova. Su información de perfil, bio y avatar se cargan de inmediato.
- **Pestaña "Ver Ofertas de Trabajo":** JavaScript lee el repositorio global y despliega en formato de acordeón las vacantes agrupadas por empresa. El catálogo aplica un ordenamiento aleatorio sutil al iniciar para dinamizar la experiencia de usuario.
- **Mecánica de Postulación:** Al hacer clic en "Postular", el sistema inyecta el perfil de Elena en el detalle interno de la oferta en `ofertasLaborales` e inserta una tupla relacional compacta (`id`, `estado: "En Revisión"`) dentro del array `misPostulaciones`. La oferta desaparece del catálogo disponible de inmediato.
- **Pestaña "Mis Postulaciones":** Renderiza exclusivamente las ofertas a las que el estudiante ha aplicado, vinculando en tiempo real el estado de resolución dictado por las empresas.

### 3. Flujo del Panel de Empresas (`empresa.html`)

- Al pulsar "Gestionar Empresa" en el inicio, se almacena el nombre de la compañía en el `SessionStorage` de la ventana actual.
- **Pestaña "Explorador Global":** Permite visualizar un panorama general de todas las vacantes del ecosistema institucional, posicionando siempre la empresa con la sesión activa en el primer lugar de la lista.
- **Pestaña "Mis Ofertas (Gestión)":** Despliega las ofertas pertenecientes de manera exclusiva a la firma corporativa activa.
- **Evaluación de Candidatos:** Al hacer clic en "Perfil", se genera un modal flotante dinámico con el expediente del postulante. Al presionar **Aceptar** o **Rechazar**, JavaScript actualiza de manera coordinada el estado del alumno tanto en la oferta general como en la tabla intermedia de postulaciones del estudiante, logrando una sincronización reactiva inmediata.
- **Publicación en Tiempo Real:** Cuenta con un formulario en blanco que genera identificadores únicos basados en marcas de tiempo (`Date.now()`) para inyectar nuevas ofertas operativas al ecosistema de forma instantánea.

---

## 📂 Estructura del Modelo de Datos Simulado (`LocalStorage`)

### `ofertasLaborales` — Array de Objetos

```json
[
  {
    "id": 1,
    "cargo": "Cargo Vacante",
    "empresa": "Nombre Empresa",
    "descripcion": "Detalles del requerimiento...",
    "horario": "Jornada laboral",
    "sueldo": "Monto numerario",
    "postulantesDetalle": [
      {
        "rut": "12345678-9",
        "nombre": "Elena Rostova",
        "carrera": "Carrera del Alumno",
        "bio": "Descripción...",
        "foto": "prota.png",
        "estado": "En Revisión"
      }
    ]
  }
]
```

### `misPostulaciones` — Array de Relaciones

Funciona como una tabla pivot intermedia para optimizar el rendimiento de lectura del estudiante:

```json
[
  {
    "id": 1,
    "estado": "Aceptado"
  }
]
```

---

## 📋 Historial de Versiones

El registro detallado de los cambios arquitectónicos, correcciones de inconsistencias y las hojas de ruta de cada ciclo de desarrollo se encuentran disponibles en [CHANGELOG.md](./CHANGELOG.md).