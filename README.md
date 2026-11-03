# CC5002 - Desarrollo de Aplicaciones Web: Tarea 3
**Plataforma de Monitoreo - Unión de Ornitólogos de Chile**

> **Nota:** Este documento `README.md` fue redactado por **Gemini 3.8 Flash**.

---

## Descripción del Proyecto

Sistema web para el registro, monitoreo y visualización comunitaria de avistamientos de aves a lo largo de Chile. La aplicación permite registrar voluntarios, reportar avistamientos con respaldo multimedia (fotos y videos), consultar registros históricos paginados, interactuar mediante un sistema de comentarios asíncronos y visualizar métricas consolidadas mediante gráficos interactivos.

---

## Tecnologías y Bibliotecas Utilizadas

* **Backend:**
  * **Python 3** con microframework **Flask**.
  * **SQLAlchemy 2.0 (ORM):** Mapeo relacional de entidades (`DeclarativeBase`, `Mapped`, `mapped_column`) y consultas agregadas.
  * **PyMySQL:** Conector de base de datos para MySQL[span_5].
  * **filetype:** Inspección de cabeceras de bytes binarios (*magic numbers*) para validación de tipo MIME de evidencias multimedia
  * **hashlib:** Generación de nombres de archivo seguros mediante hashes SHA-256
* **Frontend:**
  * **HTML5 Semántico:** Cumplimiento estricto de estándares W3C sin uso de etiquetas genéricas (`<div>` ni `<span>`), empleando únicamente elementos con valor semántico (`<article>`, `<section>`, `<figure>`, `<figcaption>`, `<fieldset>`, `<legend>`, `<small>`, `<em>`, etc.)
  * **Vanilla JavaScript (ES6+):** Peticiones asíncronas con `fetch` y `async/await` para comentarios y datos de gráficos
  * **Simple.css:** Hoja de estilos minimalista para interfaz limpia y responsiva
  * **Highcharts (vía CDN):** Biblioteca externa utilizada para la renderización de gráficos interactivos (líneas, torta y columnas)

* **Base de Datos:**
  * **MySQL Server** (esquema `tarea2` con charset `utf8mb4`)

---

## Estructura del Repositorio

```text
desarrollo_web_tomas_canales/
├── app.py                     # Rutas del backend, endpoints API y renderizado Flask
├── db.py                      # Configuración de Engine/Session y modelos SQLAlchemy
├── validations.py             # Validaciones del servidor (voluntarios, reportes, comentarios)
├── sql
│   ├── tarea2.sql             # Esquema base (region, comuna, voluntario, ave, avistamiento, registro)
│   ├── region-comuna.sql      # Datos de regiones y comunas de Chile
│   ├── aves.sql               # Catálogo de aves chilenas
│   └── tabla-comentario.sql   # Esquema de la tabla comentario para Tarea 3
├── static/
│   ├── css/
│   │   └── simple.css         # Estilos globales
│   ├── js/
│   │   ├── detalle_avistamiento.js  # Lógica AJAX/Fetch para comentarios asíncronos
│   │   ├── estadisticas.js          # Configuración y renderizado con Highcharts
│   │   ├── registro_voluntarios.js  # Validaciones de voluntario en el cliente
│   │   └── reporte_avistamiento.js  # Validaciones de reporte y archivos en el cliente
│   └── uploads/               # Almacenamiento de fotos y videos subidos
├── templates/
│   ├── index.html                 # Portada principal
│   ├── registro_voluntario.html   # Formulario de registro de voluntarios
│   ├── reporte_avistamiento.html  # Formulario de reporte con carga de archivos
│   ├── listado.html               # Listado de avistamientos con paginación y miniaturas
│   ├── detalle_avistamiento.html  # Ficha del avistamiento con evidencias y comentarios
│   └── estadisticas.html          # Panel de gráficos interactivos
└── README.md
