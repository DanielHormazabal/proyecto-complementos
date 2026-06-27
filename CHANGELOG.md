# Changelog

## [0.4.0] - 2026-06-27

### Añadido
- Implementación de lógica funcional en el Panel Corporativo: desarrollo del formulario para la publicación de nuevas vacantes laborales en tiempo real.
- Sistema de visualización de expedientes y postulantes simulados para las ofertas activas de cada empresa.
- Funcionalidad de eliminación definitiva de ofertas con persistencia y sincronización en el almacenamiento local.

### Modificado
- Reestructuración de la arquitectura del proyecto: migración del código monolítico hacia un modelo modular, distribuyendo la lógica en controladores independientes (`db.js`, `estudiante.js` y `empresa.js`).
- Reorganización del directorio de archivos mediante la segregación de recursos en carpetas dedicadas (`js/` y `css/`) para optimizar el mantenimiento del sistema.

## [0.3.0] - 2026-06-26

### Añadido
- Reestructuración de la plataforma en 3 archivos independientes: Portal de Acceso (`index.html`), Vista de Alumnos (`estudiante.html`) y Panel Corporativo (`empresa.html`).
- Falso sistema de inicio de sesión en el Home principal para seleccionar perfil de Alumno o Empresa y redirigir directamente.
- Interfaz interactiva tipo acordeón para agrupar y desplegar las ofertas de trabajo por cada empresa.
- Botón de control integrado para reiniciar el almacenamiento de `localStorage` y restaurar los datos iniciales.

## [0.2.0] - 2026-06-19

### Añadido
- Repositorio local hardcodeado en `script.js` con 6 ofertas laborales temáticas.
- Validaciones en JavaScript para asignar automáticamente `empty_user.png` si una empresa no registra un logotipo.

### Modificado
- Se mejoró la interfaz de usuario en `style.css`: logos de empresas ahora son circulares y centrados.
- El banner de la empresa se integró como fondo absoluto de la tarjeta, aplicando un degradado transparente para no afectar la legibilidad del texto.
- Limpieza en `index.html` eliminando las tarjetas estáticas de prueba para permitir la carga dinámica.
- El catálogo de ofertas ahora se mezcla en un orden aleatorio mediante código al iniciar la página.

## [0.1.0] - 2026-06-19
### Añadido
- Estructura base del panel de estudiante en `index.html`.
- Lógica en `script.js` para cargar ofertas desde un repositorio local hardcodeado.
- Sistema interactivo de pestañas para alternar entre "Ver Ofertas" y "Mis Postulaciones".