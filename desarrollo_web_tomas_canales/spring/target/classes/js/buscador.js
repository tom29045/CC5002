const input = document.getElementById("q");
const form = document.getElementById("form-buscador");
const tabla = document.getElementById("tabla");
const cuerpo = document.getElementById("resultados");
const mensaje = document.getElementById("mensaje");

let temporizador = null;
let ultimaPeticion = 0;

form.addEventListener("submit", (e) => e.preventDefault());

input.addEventListener("input", () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(buscar, 300);
});

function escaparHtml(texto) {
    const mapa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(texto).replace(/[&<>"']/g, (c) => mapa[c]);
}

function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Escapa el HTML y envuelve las coincidencias en <mark>
function resaltar(texto, q) {
    const seguro = escaparHtml(texto);
    if (!q) return seguro;
    const re = new RegExp(escaparRegex(escaparHtml(q)), "gi");
    return seguro.replace(re, (m) => "<mark>" + m + "</mark>");
}

function formatearPromedio(p) {
    return p === null || p === undefined ? "-" : Number(p).toFixed(1);
}

async function buscar() {
    const q = input.value.trim();
    const numero = ++ultimaPeticion;

    if (q === "") {
        cuerpo.innerHTML = "";
        tabla.hidden = true;
        mensaje.textContent = "";
        return;
    }

    try {
        const resp = await fetch("/api/buscar?q=" + encodeURIComponent(q));
        if (!resp.ok) throw new Error("Error " + resp.status);
        const datos = await resp.json();
        if (numero !== ultimaPeticion) return; // llego una respuesta mas nueva
        mostrar(datos, q);
    } catch (err) {
        mensaje.textContent = "No se pudo realizar la búsqueda. Intenta de nuevo.";
    }
}

function mostrar(datos, q) {
    cuerpo.innerHTML = "";
    if (datos.length === 0) {
        tabla.hidden = true;
        mensaje.textContent = "No se encontraron avistamientos para \"" + q + "\".";
        return;
    }
    mensaje.textContent = datos.length + " resultado(s).";
    tabla.hidden = false;

    for (const d of datos) {
        const fila = document.createElement("tr");
        fila.innerHTML =
            "<td>" + resaltar(d.voluntario, q) + "</td>" +
            "<td>" + escaparHtml(d.dia) + "</td>" +
            "<td>" + resaltar(d.ave, q) + "</td>" +
            "<td>" + resaltar(d.comuna, q) + "</td>" +
            '<td class="nota">' + formatearPromedio(d.promedio) + "</td>" +
            '<td class="evaluar"><button type="button">Evaluar</button></td>';

        fila.querySelector("button").addEventListener("click", () => pedirNota(fila, d.id));
        cuerpo.appendChild(fila);
    }
}

function pedirNota(fila, id) {
    const celda = fila.querySelector(".evaluar");
    const select = document.createElement("select");
    select.setAttribute("aria-label", "Nota del 1 al 7");

    const vacio = document.createElement("option");
    vacio.value = "";
    vacio.textContent = "Elige nota";
    select.appendChild(vacio);

    for (let n = 1; n <= 7; n++) {
        const op = document.createElement("option");
        op.value = String(n);
        op.textContent = String(n);
        select.appendChild(op);
    }

    select.addEventListener("change", () => enviarNota(fila, id, select));
    celda.innerHTML = "";
    celda.appendChild(select);
}

async function enviarNota(fila, id, select) {
    const nota = Number(select.value);
    // Validacion en cliente (el servidor tambien valida)
    if (!Number.isInteger(nota) || nota < 1 || nota > 7) return;

    select.disabled = true;
    try {
        const resp = await fetch("/api/avistamientos/" + id + "/nota", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nota: nota })
        });
        const datos = await resp.json();
        if (!resp.ok) throw new Error(datos.error || "Error " + resp.status);

        fila.querySelector(".nota").textContent = formatearPromedio(datos.promedio);
        const celda = fila.querySelector(".evaluar");
        celda.innerHTML = '<button type="button">Evaluar</button>';
        celda.querySelector("button").addEventListener("click", () => pedirNota(fila, id));
    } catch (err) {
        mensaje.textContent = "No se pudo guardar la nota: " + err.message;
        select.disabled = false;
    }
}