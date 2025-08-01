const { Historial, Asistencia, Estudiante, Usuario, Grupo, Asignatura, GrupoPeriodo } = require("../models");
const { validarExistencia } = require("../utils/validaciones/validarExistenciaModelo");
const { enviarCorreoConExcel } = require("./correoService");

async function consultarEstudiantesPorIdHistorial(id_historial_asistencia) {
  await validarExistencia(Historial, id_historial_asistencia, "El historial de asistencia");
  const asistencias = await Asistencia.findAll({
    where: { id_historial_asistencia },
    attributes: ['id_estudiante', 'hora', 'estado_asistencia'],
    include: [{
        model: Estudiante,
        attributes: [],
        include: [{
        model: Usuario,
        attributes: ['identificacion', 'nombres', 'apellidos']
        }]
    }],
    raw: true,
    nest: false
    });

    const asistenciasLimpias = asistencias.map(a => ({
      id_estudiante: a.id_estudiante,
      hora: a.hora,
      estado_asistencia: a.estado_asistencia,
      id_usuario: a["ESTUDIANTE.USUARIO.id_usuario"],
      identificacion: a["ESTUDIANTE.USUARIO.identificacion"],
      nombres: a["ESTUDIANTE.USUARIO.nombres"],
      apellidos: a["ESTUDIANTE.USUARIO.apellidos"]
    }));

  return {
    success: true,
    mensaje: "Estudiantes de la lista de asistencias consultados correctamente.",
    asistencias: asistenciasLimpias,
  };
}

//Validar semestre
async function consultarHistorialPorIdGrupo(id_grupo) {
  await validarExistencia(Grupo, id_grupo, "El grupo");
  const listas = await Historial.findAll({
    where: { id_grupo }
    });

  return {
    success: true,
    mensaje: "Listas de asistencia consultadas correctamente.",
    listas: listas,
  };
}

async function enviarHistorialPorCorreo(id_historial_asistencia, correo) {
  const historial = await validarExistencia(Historial, id_historial_asistencia, "El historial de asistencia");
  const semestre = await validarExistencia(GrupoPeriodo, historial.id_grupo_periodo, "El historial en el semestre");
  const docente = await validarExistencia(Usuario, semestre.id_docente, "El docente");
  const grupo = await validarExistencia(Grupo, historial.id_grupo, "El grupo");
  const asignatura = await validarExistencia(Asignatura, grupo.id_asignatura, "La asignatura");

  const estudiantesRaw = await Asistencia.findAll({
    where: { id_historial_asistencia },
    include: [{
      model: Estudiante,
      attributes: [],
      include: [{ model: Usuario }]
    }],
    raw: true,  
    nest: false  
  });

  const historialData = {
    fecha: historial.fecha,
    semestre: semestre.periodo,
    docente: docente.nombres + " " + docente.apellidos,
    tema: historial.tema,
    nombre_grupo: grupo.nombre,
    codigo_grupo: grupo.codigo,
    nombre_asignatura: asignatura.nombre,
    codigo_asignatura: asignatura.codigo    
  };

  const listaEstudiantes = estudiantesRaw.map(e => ({
    id_estudiante: e.id_estudiante,
    hora: e.hora,
    estado_asistencia: e.estado_asistencia,
    identificacion: e['ESTUDIANTE.USUARIO.identificacion'],
    nombres: e['ESTUDIANTE.USUARIO.nombres'],
    apellidos: e['ESTUDIANTE.USUARIO.apellidos'],
    correo: e['ESTUDIANTE.USUARIO.correo']
  }));

  const respuestaCorreo = await enviarCorreoConExcel(correo, {historial: historialData, lista: listaEstudiantes});

  return respuestaCorreo;
}

module.exports = {
  consultarEstudiantesPorIdHistorial,
  consultarHistorialPorIdGrupo,
  enviarHistorialPorCorreo
}