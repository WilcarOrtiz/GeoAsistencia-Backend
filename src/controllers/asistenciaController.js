const asistenciaService = require("../services/asistenciaService");
const manejarError  = require("../utils/handlers/manejadorError");

async function registrarAsistencia(req, res) {
  try {
    const { id_grupo } = req.body;
    const id_estudiante = req.user.uid;
    console.log("ID del estudiante:", id_estudiante);
    console.log("ID del grupo:", id_grupo);
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
    const { id_grupo, id_estudiante } = req.body;
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

module.exports = {
  registrarAsistencia,
  cambiarEstadoAsistencia,
  validarUbicacion,
};
