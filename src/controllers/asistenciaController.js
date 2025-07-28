const asistenciaService = require("../services/asistenciaService");
const manejarError = require("../utils/handlers/manejadorError");

async function registrarAsistencia(req, res) {
  try {
    const { id_grupo } = req.body;
    const id_estudiante = req.user.uid;
    const resultado = await asistenciaService.registrarAsistencia(
      id_grupo,
      id_estudiante
    );
    res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function cambiarEstadoAsistencia(req, res) {
  try {
    const { id_grupo, id_estudiante } = req.params;
    const resultado = await asistenciaService.cambiarEstadoAsistencia(
      id_grupo,
      id_estudiante
    );
    res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function validarUbicacion(req, res) {
  try {
    const { latitud, longitud } = req.body;

    const resultado = await asistenciaService.validarUbicacion(
      latitud,
      longitud
    );
    res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function crearAsistenciaManualmente(req, res) {
  try {
    const { id_grupo, identificacion } = req.body;
    const resultado = await asistenciaService.generarAsistenciaManualmente(
      id_grupo,
      identificacion
    );
    res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function obtenerAsistenciaPorEstudianteYGrupo(req, res) {
  try {
    const { id_estudiante, id_grupo } = req.params;
    const resultado =
      await asistenciaService.obtenerAsistenciaPorEstudianteYGrupo(
        id_estudiante,
        id_grupo
      );
    res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

module.exports = {
  registrarAsistencia,
  cambiarEstadoAsistencia,
  validarUbicacion,
  crearAsistenciaManualmente,
  obtenerAsistenciaPorEstudianteYGrupo,
};
