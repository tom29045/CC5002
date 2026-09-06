document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registro");

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const tipo = document.getElementById("tipo").value;
        const nombre = document.getElementById("nombre").value.trim();
        const DiaHora = document.getElementById("dia_hora").value.trim();
        const evidencia = document.getElementById("evidencia");
        const DiaHoraActual = new Date();
        const Limite = new Date();
        const FechaSeleccionada = new Date(DiaHora)
        Limite.setFullYear(DiaHoraActual.getFullYear() - 1)
        const regexSoloLetras = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/;
        const TiposArchivos = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "video/webm",
            "video/quicktime"
        ]
        const archivo = evidencia.files[0]

        if (!tipo || tipo === "") {
            alert("Ingrese tipo de ave.");
            return;
        }

        if (!nombre) {
            alert("Ingrese el nombre del ave.");
            return;
        }

        if (!regexSoloLetras.test(nombre)) {
            alert("Solo está permitido usar letras.");
            return;
        }

        if (FechaSeleccionada > DiaHoraActual) {
            alert("La fecha y hora del avistamiento no puede ser futura.");
            return;
        }

        if (FechaSeleccionada < Limite) {
            alert("La fecha del avistamiento no puede tener más de un año de antigüedad.");
            return;
        }

        if (!evidencia) {
            alert("Ingrese una evidencia en foto o video");
            return;
        }

        if (!TiposArchivos.includes(archivo.type)) {
            alert("Formato no valido. Solo se permiten archivos JPG, PNG, WEBP o videos MP4/WEBM/MOV.");
            evidencia.value = "";
            return;
        }

        const maxBytes = 50*1024*1024 //equivalente a 50 mb
        if (archivo.size > maxBytes) {
            alert("El archivo excede el tamaño permitido de 50 MB.");
            evidencia.value = "";
            return;
        }

        alert("Registro completado con exito!")
        window.location.href = "./listado.html"
    });
});