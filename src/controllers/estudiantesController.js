const estudianteService = require("../services/estudiantesService");
const manejarError = require("../utils/handlers/manejadorError");

async function obtenerEstudiantesNoAsignadosAGrupo(req, res) {
  try {
    const { id_asignatura } = req.params;
    const resultado =
      await estudianteService.obtenerEstudiantesNoAsignadosAGrupo(
        id_asignatura
      );
    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function asignarGruposDeClase(req, res) {
  try {
    const { id_estudiante } = req.params;
    const { grupos } = req.body;

    if (!Array.isArray(grupos) || grupos.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Debe enviar un array de IDs de grupos.",
      });
    }

    const resultado = await estudianteService.asignarGruposDeClase(
      id_estudiante,
      grupos
    );
    res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function consultarEstudiantesConSusGrupos(req, res) {
  try {
    const { id_estudiante } = req.query;
    const data = await estudianteService.consultarEstudiantesConSusGrupos(
      id_estudiante || null
    );
    res.status(200).json(data);
  } catch (error) {
    return manejarError(res, error);
  }
}

module.exports = {
  obtenerEstudiantesNoAsignadosAGrupo,
  asignarGruposDeClase,
  consultarEstudiantesConSusGrupos,
};
