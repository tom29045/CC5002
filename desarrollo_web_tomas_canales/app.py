import os
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for
from sqlalchemy import select, desc
from db import Get_Session, Region, Comuna, Voluntario, Ave, Avistamiento, Registro
from validations import validar_formulario, validar_region_y_comuna
from math import ceil
import filetype
from werkzeug.utils import secure_filename
import hashlib


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    session = Get_Session()
    # Portada: últimos 2 avistamientos agregados
    stmt = select(Avistamiento).order_by(desc(Avistamiento.id)).limit(2)
    ultimos = session.scalars(stmt).all()
    session.close()
    return render_template('index.html', ultimos=ultimos)

@app.route('/registro-voluntario', methods=['GET', 'POST'])
def registro_voluntario():
    session = Get_Session()
    errores = []
    mensaje_exito = None
    voluntario_creado_id = None
    datos = {}

    if request.method == 'POST':
        datos = {
            'nombre': request.form.get('nombre', '').strip(),
            'email': request.form.get('email', '').strip(),
            'celular': request.form.get('celular', '').strip(),
            'region': request.form.get('region', '').strip(),
            'comuna': request.form.get('comuna', '').strip()
        }

        errores = validar_formulario(datos['nombre'], datos['email'], datos['celular'])

        error_zona = validar_region_y_comuna(session, datos['region'], datos['comuna'], Comuna)
        if error_zona:
            errores.append(error_zona)

        if not errores:
            try:
                nuevo_voluntario = Voluntario(
                    nombre=datos['nombre'],
                    email=datos['email'],
                    telefono=datos['celular'],
                    comuna_id=int(datos['comuna']),
                    fecha_registro=datetime.now()
                )
                session.add(nuevo_voluntario)
                session.commit()
                voluntario_creado_id = nuevo_voluntario.id
                mensaje_exito = f"Voluntario(a) {nuevo_voluntario.nombre} registrado con éxito."
            except Exception as e:
                session.rollback()
                app.logger.error(f"Error al guardar voluntario: {e}")
                errores.append("Error al registrar en la base de datos.")

    regiones = session.scalars(select(Region).order_by(Region.id)).all()
    comunas = session.scalars(select(Comuna).order_by(Comuna.nombre)).all()
    session.close()

    return render_template(
        'registro_voluntarios.html',
        regiones=regiones,
        comunas=comunas,
        errores=errores,
        mensaje_exito=mensaje_exito,
        voluntario_creado_id=voluntario_creado_id,
        datos=datos
    )

@app.route('/reporte-avistamiento', methods=['GET', 'POST'])
def reporte_avistamiento():
    session = Get_Session()
    errores = []
    datos = {}
    voluntario_seleccionado = request.args.get('voluntario_id', '')

    aves = session.query(Ave).order_by(Ave.nombre).all()
    voluntarios = session.query(Voluntario).order_by(Voluntario.nombre).all()

    if request.method == 'POST':
        voluntario_id = request.form.get('voluntario_id', '').strip()
        ave_id = request.form.get('ave_id', '').strip()
        lugar = request.form.get('lugar', '').strip()
        dia_hora = request.form.get('dia_hora', '').strip()
        descripcion = request.form.get('descripcion', '').strip()
        archivos = request.files.getlist('evidencia')

        datos = {
            'voluntario_id': voluntario_id,
            'ave_id': ave_id,
            'lugar': lugar,
            'dia_hora': dia_hora,
            'descripcion': descripcion
        }

        if not voluntario_id or not session.get(Voluntario, voluntario_id):
            errores.append("Debe seleccionar un voluntario válido.")

        if not ave_id or not session.get(Ave, ave_id):
            errores.append("Debe seleccionar un ave válida del catálogo.")

        if not lugar or len(lugar) < 3:
            errores.append("El lugar del avistamiento es obligatorio.")

        if not dia_hora:
            errores.append("Debe ingresar la fecha y hora del avistamiento.")
        else:
            try:
                fecha_dt = datetime.fromisoformat(dia_hora)
                if fecha_dt > datetime.now():
                    errores.append("La fecha y hora no pueden ser futuras.")
            except ValueError:
                errores.append("El formato de fecha y hora no es válido.")

        archivos_validos = [f for f in archivos if f.filename != '']
        if len(archivos_validos) == 0:
            errores.append("Debe adjuntar al menos una foto o video como evidencia.")

        tipos_permitidos = {
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/quicktime',
            'video/webm'
        }
        for f in archivos_validos:
            encabezado = f.read(2048)
            f.seek(0)
            kind = filetype.guess(encabezado)

            if kind is None or kind.mime not in tipos_permitidos:
                errores.append(f"El archivo '{f.filename}' no es una imagen o video válido.")

        if errores:
            html = render_template(
                'reporte_avistamiento.html',
                errores=errores,
                datos=datos,
                voluntarios=voluntarios,
                aves=aves,
                voluntario_seleccionado=voluntario_id
            )
            session.close()
            return html

        try:
            nuevo_avistamiento = Avistamiento(
                voluntario_id=int(voluntario_id),
                ave_id=int(ave_id),
                fecha_hora=datetime.fromisoformat(dia_hora),
                lugar=lugar,
                descripcion=descripcion if descripcion else None
            )
            session.add(nuevo_avistamiento)
            session.flush()

            carpeta_destino = app.config['UPLOAD_FOLDER']
            os.makedirs(carpeta_destino, exist_ok=True)

            for f in archivos_validos:
                nombre_seguro = secure_filename(f.filename)
                extension = os.path.splitext(nombre_seguro)[1].lower()
                hash_nombre = hashlib.sha256(f"{datetime.now().timestamp()}_{nombre_seguro}".encode()).hexdigest()
                nombre_archivo_final = f"{hash_nombre}{extension}"
                ruta_completa = os.path.join(carpeta_destino, nombre_archivo_final)

                f.save(ruta_completa)

                archivo_bd = Registro(
                    avistamiento_id=nuevo_avistamiento.id,
                    ruta_archivo=f"uploads/{nombre_archivo_final}",
                    nombre_archivo=nombre_archivo_final
                )
                session.add(archivo_bd)

            session.commit()
            session.close()
            return redirect(url_for('listado_avistamientos'))

        except Exception as e:
            session.rollback()
            errores.append(f"Error al procesar el reporte: {str(e)}")
            html = render_template(
                'reporte_avistamiento.html',
                errores=errores,
                datos=datos,
                voluntarios=voluntarios,
                aves=aves,
                voluntario_seleccionado=voluntario_id
            )
            session.close()
            return html

    html = render_template(
        'reporte_avistamiento.html',
        errores=errores,
        datos=datos,
        voluntarios=voluntarios,
        aves=aves,
        voluntario_seleccionado=voluntario_seleccionado
    )
    session.close()
    return html


import math
from sqlalchemy.orm import joinedload

@app.route('/listado-avistamientos')
def listado_avistamientos():
    session = Get_Session()
    
    page = request.args.get('page', 1, type=int)
    por_pagina = 5
    offset = (page - 1) * por_pagina

    total_registros = session.query(func.count(Avistamiento.id)).scalar() or 0
    total_paginas = math.ceil(total_registros / por_pagina) if total_registros > 0 else 1

    avistamientos = session.query(Avistamiento)\
        .options(
            joinedload(Avistamiento.ave),
            joinedload(Avistamiento.voluntario),
            joinedload(Avistamiento.registros)
        )\
        .order_by(Avistamiento.fecha_hora.desc())\
        .limit(por_pagina)\
        .offset(offset)\
        .all()

    html = render_template(
        'listado.html',
        avistamientos=avistamientos,
        page=page,
        total_paginas=total_paginas
    )
    
    session.close()
    return html


@app.route('/avistamiento/<int:id>')
def detalle_avistamiento(id):
    return f"Detalle del avistamiento #{id}"

from sqlalchemy import func, desc

@app.route('/estadisticas')
def estadisticas():
    session = Get_Session()

    total_avistamientos = session.query(func.count(Avistamiento.id)).scalar() or 0
    total_voluntarios = session.query(func.count(Voluntario.id)).scalar() or 0

    especie_top = session.query(
        Ave.nombre,
        func.count(Avistamiento.id).label('total')
    ).join(Avistamiento, Ave.id == Avistamiento.ave_id)\
     .group_by(Ave.id, Ave.nombre)\
     .order_by(desc('total'))\
     .first()

    conteo_aves = session.query(
        Ave.nombre,
        func.count(Avistamiento.id).label('cantidad')
    ).join(Avistamiento, Ave.id == Avistamiento.ave_id)\
     .group_by(Ave.id, Ave.nombre)\
     .order_by(desc('cantidad'))\
     .all()

    stats_aves = []
    for nombre, cantidad in conteo_aves:
        porcentaje = round((cantidad / total_avistamientos * 100), 1) if total_avistamientos > 0 else 0
        stats_aves.append({
            'nombre': nombre,
            'cantidad': cantidad,
            'porcentaje': porcentaje
        })

    conteo_regiones = session.query(
        Region.nombre,
        func.count(Avistamiento.id).label('cantidad')
    ).join(Voluntario, Avistamiento.voluntario_id == Voluntario.id)\
     .join(Comuna, Voluntario.comuna_id == Comuna.id)\
     .join(Region, Comuna.region_id == Region.id)\
     .group_by(Region.id, Region.nombre)\
     .order_by(desc('cantidad'))\
     .all()

    session.close()

    return render_template(
        'estadisticas.html',
        total_avistamientos=total_avistamientos,
        total_voluntarios=total_voluntarios,
        especie_top=especie_top,
        stats_aves=stats_aves,
        conteo_regiones=conteo_regiones
    )



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
