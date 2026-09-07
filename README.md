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

## 2. Decisiones de diseño e implementacion

### 2.1 Semantica HTML

Se evitó el uso de etiquetas <div> innecesarias, utilizando en su lugar elementos semanticos estandar de HTML5 como <header>, <body>, <main>, <form>, <nav>, <section>, <h1>-<h6>, <article>, <legend>, <fieldset>, <legend>, entre otros.

El uso de la etiqueta semantica <meter> es para representar barras de proporcion porcentual por tipo de ave, en lugar de usar librerías externas para hacer graficos

Se usó <fieldset> agrupar los campos en los formularios y se vinculó de manera explicita cada <label> con su respectivo <input> o <select> mediante el atributo for

---

### 2.2 Uso CSS

Para esta aplicación web se usó la plantilla simple.css, desarrollado por Kev Quirk, obtenido directamente desde su repositorio original https://github.com/kevquirk/simple.css

Se utilizó el enfoque classless para CSS, así evitando el uso de clases en HTML y que el codigo sea más legible y facil de editar para actualizaciones, así tambien adaptandose para el uso en dispositivos moviles y admitiendo el modo oscuro

---

### 2.3 Verificacion via JavaScript

Para las validaciones de los formularios se usó javascript, para no permitir que se ingresen atributos vacios y que tambien tengan sus respectivas restricciones, por ejemplo los nombres capitalizados, el numero de celular al estilo internacional (+569xxxxxxxx) o local (9xxxxxxxx), el correo electronico en su formato ideal (usuario@dominio.tld) que los campos numericos sean los correctos, limite temporal de hasta 1 año antes del presente día y que no pueden registrarse aves en el futuro y los formatos permitidos con un maximo de 52.438.800 bytes (es decir 50 megabytes)

---

## 3 Validacion de Estandares W3C

Se verificó que los 5 archivos HTML y simple.css cumplieran con los estandares W3C
