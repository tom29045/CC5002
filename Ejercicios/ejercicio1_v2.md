# Ejercicio 1 — CC5002

**Nombre**: [Tomás Canales]

---

## Pregunta 1: Lectura y análisis de código (6 puntos)

### 1.1 (3 puntos)

Considere el siguiente fragmento HTML:

```html
<main>
  <h1>Noticias del DCC</h1>
  <section>
    <article>
      <h2>Nuevo laboratorio de IA</h2>
      <time>10 de marzo, 2025</time>
      <p>
        El DCC inauguró un nuevo espacio dedicado a la investigación
        en inteligencia artificial generativa.
      </p>
      <nav><a href="/noticias/lab-ia">Leer más</a></nav>
    </article>
  </section>
</main>
```

Este código funciona y se ve correctamente en el navegador. Sin embargo, tiene problemas de **estructura semántica**: usa solo `<div>` para todo.

**a)** Reescriba este fragmento usando etiquetas HTML5 semánticas apropiadas (por ejemplo: `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<h1>`-`<h6>`, `<time>`, `<p>`, `<footer>`, etc.). No necesita agregar CSS ni cambiar el contenido textual.

**b)** En 2-3 oraciones, explique **por qué** su versión es mejor que la original, considerando que ambas se ven iguales en el navegador.

esta version es mejor que la anterior puesto a que el navegador entiende mejor que es cada cosa, debido a que al utilizar las etiquetas apropiadas permite hacer puntos de referencia para cada cosa y permite a quien la revise comprender que es lo que es cada cosa en el codigo

### 1.2 (3 puntos)

Considere el siguiente formulario:

```html
<form id="registro">
  <label>Nombre: <input type="text" id="nombre"></label>
  <label>Email: <input type="text" id="email"></label>
  <label>Edad: <input type="text" id="edad"></label>
  <button type="submit">Registrar</button>
</form>

<script>
document.getElementById("registro").addEventListener("submit", function(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const edad = document.getElementById("edad").value;

    if (nombre === "") {
        alert("Complete el nombre");
        return;
    }
    if (!email.includes("@")) {
        alert("Email inválido");
        return;
    }
    if (edad < 1 || edad > 120) {
        alert("Edad inválida");
        return;
    }
    alert("Registro exitoso: " + nombre);
});
</script>
```

Identifique **tres problemas o debilidades** en este código (pueden ser de HTML, de la validación JavaScript, o de usabilidad). Para cada uno, explique brevemente **qué problema causa** y **cómo lo solucionaría**.

*Pista: piense en qué valores podría ingresar un usuario que pasen la validación pero no deberían, y en qué atributos HTML mejorarían la experiencia.*

Problema/Debilidad 1 Al ingresar la edad se pueden ingresar palabras, por lo que pasa la validacion escribiendo cualquier edad, por lo que deberiamos setear el parametro edad como un int en lugar de un any
Problema/Debilidad 2 al ingresar el email se puede ingresar "juanitoperez@" lo cual no es un email valido, para solucionarlo se debería agregar una restriccion que sea @dominio.tld donde el dominio debe ser cualquiera valido, ejemplo @dcc.uchile.cl, esto se puede hacer via verificacion html o usando regex
Problema/Debilidad 3 en el nombre se puede agregar "   " como nombre, lo cual no es un nombre valido, se puede solucionar usando restingiendo los espacios usando .trim()
 
## Pregunta 2: Implementación guiada (6 puntos)
 
Se desea crear una mini-aplicación para que miembros del DCC registren actividades extracurriculares que realizan. Se entrega el archivo `actividades.html` que contiene la estructura y estilos de la página. **No puede modificar el archivo HTML.**
 
Usted debe crear un archivo `actividades.js` en la misma carpeta que el HTML. El archivo HTML ya incluye `<script src="actividades.js"></script>` al final del `<body>`, por lo que al abrir `actividades.html` en el navegador se cargará automáticamente su código.
 
Para probar su implementación, abra `actividades.html` directamente en el navegador. Debe entregar únicamente el archivo `actividades.js`.
 
**Entregables de la Pregunta 2:**
- Archivo `actividades.js` (implementación)
- Respuestas escritas a las preguntas 2.2 (en el documento de respuestas)
 
### 2.1 (4 puntos)
 
Implemente el JavaScript necesario para que el formulario funcione correctamente. Su código debe:
 
1. **Validar** los tres campos al enviar el formulario:
   - Nombre: no vacío y al menos 3 caracteres.
   - Tipo: debe haberse seleccionado una opción (no el placeholder).
   - Horas: número entre 1 y 40 (inclusive).
2. **Mostrar mensajes de error** usando las clases CSS ya definidas: agregue la clase `visible` al `<span>` de error correspondiente cuando un campo sea inválido, y remuévala cuando sea válido.
3. Si todos los campos son válidos, **agregar la actividad** a `#lista-actividades` como un nuevo elemento con la estructura:
   ```html
   <div class="actividad-item">
     <span class="tipo">DEPORTIVA</span>
     <span class="nombre">Fútbol</span>
     <span> — 3 hrs/semana</span>
   </div>
   ```
4. **Actualizar el contador** en `#total-actividades`.
5. **Limpiar** el formulario después de agregar exitosamente.
 
### 2.2 (2 puntos)
 
Responda brevemente las siguientes preguntas sobre su implementación:
 
**a)** ¿Por qué usamos `event.preventDefault()` en el listener del formulario? ¿Qué pasaría si no lo usáramos?
 
**b)** En su código, ¿qué método usó para agregar la actividad a la lista: `innerHTML` o `createElement`/`appendChild`? Mencione una ventaja y una desventaja del método que eligió.
 
**c)** Si un usuario intenta ingresar `<script>alert("hacked")</script>` como nombre de actividad y usted usó `innerHTML`, ¿qué podría ocurrir? ¿Cómo se puede prevenir?

## Rúbrica resumida
 
| Criterio | Puntos |
|----------|--------|
| 1.1a — Reescritura con HTML semántico | 2 |
| 1.1b — Justificación | 1 |
| 1.2 — Identificar 3 problemas con explicación | 3 |
| 2.1 — Implementación JS funcional | 4 |
| 2.2a — Pregunta preventDefault | 0.5 |
| 2.2b — Pregunta innerHTML vs createElement | 0.75 |
| 2.2c — Pregunta XSS | 0.75 |
| **Total** | **12** |