import re
from datetime import datetime
import filetype

REGEX_NOMBRE = re.compile(r"^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*(?:\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*)*$")
REGEX_EMAIL= re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
REGEX_NUMERO = re.compile(r"^(\+56)?9\d{8}$")

ARCHIVOS_VALIDOS = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime"
]

MAX_BYTES = 50*1024*1024

def validar_formulario(nombre, email, celular):
    errores = []

    if not nombre or not REGEX_NOMBRE.match(nombre.strip()) or len(nombre) > 255:
        errores.append("El nombre no tiene el formato valido")
    
    if not email or len(email) > 80 or not REGEX_EMAIL.match(email.strip()):
        errores.append("El correo electronico no tiene el formato valido")

    if not celular or len(celular) > 15 or not REGEX_NUMERO.match(celular.strip()):
        errores.append("El numero celular no tiene el formato valido")

    return errores

def validar_region_y_comuna(session, region_id, comuna_id, Comuna):
    if not region_id or not comuna_id:
        return "Debe seleccionar una región y una comuna."

    try:
        r_id = int(region_id)
        c_id = int(comuna_id)
        comuna_bd = session.get(Comuna, c_id)

        if not comuna_bd:
            return "La comuna seleccionada no existe."
        if comuna_bd.region_id != r_id:
            return "La comuna no pertenece a la región seleccionada."
    except (ValueError, TypeError):
        return "Los datos de región o comuna no son válidos."

    return None

def validar_avistamiento(session, voluntario_id, ave_id, fecha_hora_str, lugar, descripcion, archivos, Voluntario, Ave):
    errores = []

    try:
        v_id = int(voluntario_id)
        if not session.get(Voluntario, v_id):
            errores.append("El voluntario seleccionado no existe.")
    except (ValueError, TypeError):
        errores.append("Debe seleccionar un voluntario válido.")

    try:
        a_id = int(ave_id)
        if not session.get(Ave, a_id):
            errores.append("El ave seleccionada no existe en el catálogo.")
    except (ValueError, TypeError):
        errores.append("Debe seleccionar una especie de ave.")

    lug = lugar.strip() if lugar else ""
    if not lug:
        errores.append("Debe ingresar el lugar del avistamiento.")
    elif len(lug) > 200:
        errores.append("El lugar no puede superar los 200 caracteres.")

    desc = descripcion.strip() if descripcion else ""
    if desc and len(desc) > 500:
        errores.append("La descripción no puede superar los 500 caracteres.")

    if not fecha_hora_str:
        errores.append("Debe ingresar la fecha y hora del avistamiento.")
    else:
        try:
            fecha_sel = datetime.fromisoformat(fecha_hora_str)
            ahora = datetime.now()
            limite_pasado = ahora.replace(year=ahora.year - 1)

            if fecha_sel > ahora:
                errores.append("La fecha y hora del avistamiento no puede ser futura.")
            elif fecha_sel < limite_pasado:
                errores.append("La fecha del avistamiento no puede tener más de un año de antigüedad.")
        except ValueError:
            errores.append("Formato de fecha y hora inválido.")

    archivos_validos = [f for f in archivos if f and f.filename != ""]
    if not archivos_validos:
        errores.append("Debe adjuntar al menos una evidencia (foto o video).")
    else:
        for file in archivos_validos:
            head = file.read(2048)
            file.seek(0)
            kind = filetype.guess(head)

            if kind is None or kind.mime not in TIPOS_PERMITIDOS:
                errores.append(f"El archivo '{file.filename}' no tiene un formato válido.")

            file.seek(0, 2)
            tamano = file.tell()
            file.seek(0)
            if tamano > MAX_BYTES:
                errores.append(f"El archivo '{file.filename}' supera los 50 MB permitidos.")

    return errores