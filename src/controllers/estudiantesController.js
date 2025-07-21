const estudianteService = require("../services/estudiantesService");

async function obtenerEstudiantesNoAsignadosAGrupo(req, res) {
  try {
    const { id_asignatura } = req.params;
    const resultado =
      await estudianteService.obtenerEstudiantesNoAsignadosAGrupo(
        id_asignatura
      );
    res.status(200).json({
      success: true,
      message: resultado.mensaje,
      estudiantes: resultado.estudiantes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
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
    res.status(400).json({
      success: false,
      error: error.message,
    });
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
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = {
  obtenerEstudiantesNoAsignadosAGrupo,
  asignarGruposDeClase,
  consultarEstudiantesConSusGrupos,
};
