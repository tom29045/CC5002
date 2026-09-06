document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-registro");

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const celular = document.getElementById("celular").value.trim();
        const region = document.getElementById("region").value;
        const comuna = document.getElementById("comuna").value.trim();
        const direccion = document.getElementById("calle").value.trim();
        const num_calle = document.getElementById("numero").value.trim();
        
        if(!nombre) {
            alert("Ingrese un nombre valido");
            return;
        }
        if (nombre.length < 2) {
            alert("El nombre debe ser mayor a 2 letras");
        }
        const regexSoloLetrasCapitalizadas = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*(?:\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*)*$/;
        if (!regexSoloLetrasCapitalizadas.test(nombre)) {
            alert("El nombre solo puede contener letras y espacios (sin números ni símbolos) o no está capitalizado (ejemplo ana maria en lugar de Ana Maria).");
            return;
        }
        if (!email) {
            alert("Ingrese correo electronico");
            return;
        }
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexEmail.test(email)) {
            alert("Ingrese un correo electronico valido.");
            return;
        }
        if (!celular) {
            alert("Ingrese numero de celular, del estilo '+56912345678' o '912345678'.");
            return;
        }
        const regexCelular = /^(\+56)?9\d{8}$/;
        if(!regexCelular.test(celular)) {
            alert("Ingrese un numero valido")
            return;
        }
        if (!region || region ==="") {
            alert("Por favor, seleccione una región de la lista.")
        }
        if (!comuna) {
            alert("Por favor, ingrese una comuna.")
        }
        if (direccion !== "") {
            const regexSoloLetras = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/;

            if (!regexSoloLetras.test(direccion)) {
                alert("La dirección solo puede contener letras.");
                return;
            }
        }
        if (num_calle !== "") {
            const regexSoloNumeros = /^[0-9\s]+$/;
            
            if (!regexSoloNumeros.test(num_calle)) {
                alert("El numero de calle solo puede contener numeros");
                return;
            }
        }

        window.location.href = "./reporte_avistamiento.html";
    });
});