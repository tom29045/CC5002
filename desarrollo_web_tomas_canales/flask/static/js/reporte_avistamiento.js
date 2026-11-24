document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registro");

    form.addEventListener("submit", (evento) => {
        const voluntario = document.getElementById("voluntario_id").value;
        const ave = document.getElementById("ave_id").value;
        const lugar = document.getElementById("lugar").value.trim();
        const diaHora = document.getElementById("dia_hora").value.trim();
        const evidencia = document.getElementById("evidencia");

        if (!voluntario) {
            alert("Debe seleccionar un voluntario.");
            evento.preventDefault();
            return;
        }

        if (!ave) {
            alert("Debe seleccionar una especie de ave.");
            evento.preventDefault();
            return;
        }

        if (!lugar || lugar.length < 3) {
            alert("Ingrese el lugar del avistamiento.");
            evento.preventDefault();
            return;
        }

        if (!diaHora) {
            alert("Ingrese la fecha y hora del avistamiento.");
            evento.preventDefault();
            return;
        }

        const diaHoraActual = new Date();
        const limite = new Date();
        limite.setFullYear(diaHoraActual.getFullYear() - 1);
        const fechaSeleccionada = new Date(diaHora);

        if (fechaSeleccionada > diaHoraActual) {
            alert("La fecha y hora del avistamiento no puede ser futura.");
            evento.preventDefault();
            return;
        }

        if (fechaSeleccionada < limite) {
            alert("La fecha del avistamiento no puede tener más de un año de antigüedad.");
            evento.preventDefault();
            return;
        }

        if (!evidencia.files || evidencia.files.length === 0) {
            alert("Ingrese una evidencia en foto o video.");
            evento.preventDefault();
            return;
        }

        const tiposArchivos = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "video/webm",
            "video/quicktime"
        ];
        const maxBytes = 50 * 1024 * 1024;

        for (let i = 0; i < evidencia.files.length; i++) {
            const archivo = evidencia.files[i];

            if (!tiposArchivos.includes(archivo.type)) {
                alert("Formato no válido. Solo se permiten archivos JPG, PNG, WEBP o videos MP4/WEBM/MOV.");
                evidencia.value = "";
                evento.preventDefault();
                return;
            }

            if (archivo.size > maxBytes) {
                alert("El archivo excede el tamaño permitido de 50 MB.");
                evidencia.value = "";
                evento.preventDefault();
                return;
            }
        }
    });
});
