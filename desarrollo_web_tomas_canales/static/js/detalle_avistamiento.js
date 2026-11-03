document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-comentario");
    const lista = document.getElementById("lista-comentarios");
    const mensajeError = document.getElementById("errores-comentario");
    const inputNombre = document.getElementById("nombre");
    const inputTexto = document.getElementById("texto");

    const avistamientoId = form.dataset.avistamientoId;

    async function cargarComentarios() {
        try {
            const resp = await fetch(`/avistamiento/${avistamientoId}/comentarios`);
            if (!resp.ok) {
                lista.innerHTML = "<li>Error al cargar los comentarios.</li>";
                return;
            }

            const comentarios = await resp.json();
            lista.innerHTML = "";

            if (comentarios.length === 0) {
                lista.innerHTML = "<li><em>No hay comentarios registrados para este avistamiento.</em></li>";
                return;
            }

            comentarios.forEach(c => {
                const li = document.createElement("li");

                const strong = document.createElement("strong");
                strong.textContent = c.nombre;

                const small = document.createElement("small");
                small.textContent = ` (${c.fecha})`;

                const br = document.createElement("br");

                const spanTexto = document.createElement("span");
                spanTexto.textContent = c.texto;

                li.appendChild(strong);
                li.appendChild(small);
                li.appendChild(br);
                li.appendChild(spanTexto);

                lista.appendChild(li);
            });

        } catch (error) {
            lista.innerHTML = "<li>No se pudo conectar con el servidor.</li>";
        }
    }

    cargarComentarios();

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        mensajeError.textContent = "";

        const nombre = inputNombre.value.trim();
        const texto = inputTexto.value.trim();

        if (!nombre || nombre.length < 3 || nombre.length > 50) {
            mensajeError.textContent = "El nombre es obligatorio y debe tener entre 3 y 50 caracteres.";
            return;
        }

        if (!texto || texto.length < 5) {
            mensajeError.textContent = "El comentario es obligatorio y debe tener al menos 5 caracteres.";
            return;
        }

        try {
            const resp = await fetch(`/avistamiento/${avistamientoId}/comentarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre: nombre, texto: texto })
            });

            const data = await resp.json();

            if (!resp.ok || !data.success) {
                const errores = data.errores ? data.errores.join(" ") : "Error al procesar el comentario.";
                mensajeError.textContent = errores;
                return;
            }

            inputNombre.value = "";
            inputTexto.value = "";
            mensajeError.textContent = "";
            cargarComentarios();

        } catch (error) {
            mensajeError.textContent = "Error de red al intentar enviar el comentario.";
        }
    });
});
