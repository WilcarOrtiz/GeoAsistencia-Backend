const { Historial, Asistencia, Estudiante, Usuario, Grupo} = require("../models");
const { validarExistencia } = require("../utils/validaciones/validarExistenciaModelo");

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

module.exports = {
  consultarEstudiantesPorIdHistorial,
  consultarHistorialPorIdGrupo
}