# Sistema de Avistamiento de Aves - Unión de Ornitólogos de Chile
**Curso:** CC5002 - Desarrollo de Aplicaciones Web  
**Evaluación:** Tarea 1  
**Autor:** Tomás Canales  
**Repositorio:** CC5002  
**Rama:** Tarea-1

---

## 1. Descripción del Proyecto

Prototipo web desarrollado para la **Unión de Ornitólogos de Chile**, cuyo objetivo es permitir la recolección, reporte y visualización de avistamientos de aves a lo largo del país para monitorear el impacto del cambio climático en la fauna local.

El sistema está construido íntegramente del lado del cliente utilizando **HTML5**, **CSS3** y **JavaScript**, sin dependencias de servidores web ni bases de datos activas en esta etapa de prototipado.

---

## 2. Decisiones de diseño e implementación

### 2.1. Semántica HTML
Se evitó el uso de etiquetas innecesarias, utilizando en su lugar elementos semánticos estándar de HTML5 como `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, entre otros.

El uso de la etiqueta semántica `<progress>` es para representar barras de proporción porcentual por tipo de ave, en lugar de usar librerías externas para hacer gráficos.

Se usó `<fieldset>` para agrupar los campos en los formularios y se vinculó de manera explícita cada `<label>` con su respectivo `<input>` mediante el atributo `for`.

### 2.2. Uso CSS
Para esta aplicación web se usó la plantilla **simple.css**, desarrollado por Kev Quirk, obtenido directamente desde su repositorio original: https://github.com/kevquirk/simple.css. 

Se utilizó el enfoque *classless* para CSS, evitando el uso de clases en HTML para que el código sea más legible y fácil de editar, adaptándose a dispositivos móviles y admitiendo modo oscuro.

### 2.3. Verificación vía JavaScript
Para las validaciones de los formularios se usó JavaScript, para no permitir que se ingresen atributos vacíos y asegurar sus respectivas restricciones:

* Nombres capitalizados.
* Número de celular en formato internacional (`+569xxxxxxxx`) o local (`9xxxxxxxx`).
* Correo electrónico en su formato ideal (`usuario@dominio.tld`).
* Validación de campos numéricos.
* Límite temporal de hasta 1 año antes del presente día y bloqueo de registros con fecha futura.
* Formatos de archivo permitidos con un máximo de 52.438.800 bytes (50 MB).

## 3. Validación de Estándares W3C
Se verificó que los 5 archivos HTML y `simple.css` cumplieran con los estándares W3C.

## 4. Instrucciones de acceso y cambio de rama

Para clonar el repositorio y situarse en la rama de esta entrega, ejecuta los siguientes comandos en tu terminal:

```bash
# 1. Clonar el repositorio (omite este paso si ya lo tienes)
git clone <URL_DEL_REPOSITORIO>

# 2. Entrar al directorio del proyecto
cd <NOMBRE_DEL_REPOSITORIO>

# 3. Descargar las ramas remotas actualizadas
git fetch origin

# 4. Cambiar a la rama Tarea-1
git checkout Tarea-1

