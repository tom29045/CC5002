document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-registro");
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");

    const todasLasComunas = Array.from(comunaSelect.querySelectorAll("option[data-region]"));

    function actualizarComunas() {
        const regionId = regionSelect.value;
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

        if (!regionId) {
            comunaSelect.disabled = true;
            return;
        }

        const comunasFiltradas = todasLasComunas.filter(
            opt => opt.getAttribute("data-region") === regionId
        );

        comunasFiltradas.forEach(opt => comunaSelect.appendChild(opt.cloneNode(true)));
        comunaSelect.disabled = false;
    }

    regionSelect.addEventListener("change", actualizarComunas);

    if (regionSelect.value) {
        actualizarComunas();
    }

    form.addEventListener("submit", (evento) => {
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const celular = document.getElementById("celular").value.trim();
        const region = regionSelect.value;
        const comuna = comunaSelect.value;

        if (!nombre) {
            alert("Ingrese un nombre valido");
            evento.preventDefault();
            return;
        }

        if (nombre.length < 2) {
            alert("El nombre debe ser mayor a 2 letras");
            evento.preventDefault();
            return;
        }

        const regexSoloLetrasCapitalizadas = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*(?:\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*)*$/;
        if (!regexSoloLetrasCapitalizadas.test(nombre)) {
            alert("El nombre solo puede contener letras y espacios (sin números ni símbolos) o no está capitalizado (ejemplo ana maria en lugar de Ana Maria).");
            evento.preventDefault();
            return;
        }

        if (!email) {
            alert("Ingrese correo electronico");
            evento.preventDefault();
            return;
        }

        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexEmail.test(email)) {
            alert("Ingrese un correo electronico valido.");
            evento.preventDefault();
            return;
        }

        if (!celular) {
            alert("Ingrese numero de celular, del estilo '+56912345678' o '912345678'.");
            evento.preventDefault();
            return;
        }

        const regexCelular = /^(\+56)?9\d{8}$/;
        if (!regexCelular.test(celular)) {
            alert("Ingrese un numero valido");
            evento.preventDefault();
            return;
        }

        if (!region || region === "") {
            alert("Por favor, seleccione una región de la lista.");
            evento.preventDefault();
            return;
        }

        if (!comuna || comuna === "") {
            alert("Por favor, ingrese una comuna.");
            evento.preventDefault();
            return;
        }
    });
});
