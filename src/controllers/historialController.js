const validarParametros = require("../utils/validaciones/validarParametros");
const historialService = require("../services/historialService");

async function consultarEstudiantesPorIdHistorial(req, res) {
  try {
    const { id_historial_asistencia } = req.params;
    if (!validarParametros(req, res, ["id_historial_asistencia"])) return;
    const estudiantes = await historialService.consultarEstudiantesPorIdHistorial(id_historial_asistencia);
    return res.status(200).json(estudiantes);
  } catch (error) {
     return manejarError(res, error);
  }
}

async function consultarHistorialPorIdGrupo(req, res) {
  try {
    const { id_grupo } = req.params;
    if (!validarParametros(req, res, ["id_grupo"])) return;
    const listas = await historialService.consultarHistorialPorIdGrupo(id_grupo);
    return res.status(200).json(listas);
  } catch (error) {
     return manejarError(res, error);
  }
}

module.exports = { 
  consultarEstudiantesPorIdHistorial,
  consultarHistorialPorIdGrupo
};