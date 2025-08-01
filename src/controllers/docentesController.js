const docenteService = require("../services/docenteService");
const manejarError = require("../utils/handlers/manejadorError");

async function docentesActivos(req, res) {
  try {
    const resultado = await docenteService.docentesActivos();
    res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function asignarGruposDeClase(req, res) {
  try {
    const { id_docente } = req.params;
    const { grupos } = req.body;

    if (!Array.isArray(grupos) || grupos.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Debe enviar un array de IDs de grupos.",
      });
    }

    const resultado = await docenteService.asignarGruposADocente(
      id_docente,
      grupos
    );
    res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function consultarDocentesConSusGrupos(req, res) {
  try {
    const { periodo } = req.params;
    const { id_docente } = req.query;
    const data = await docenteService.consultarDocentesConSusGrupos(
      id_docente || null,
      periodo || null
    );

    res.status(200).json(data);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function obtenerMiPerfil(req, res) {
  try {
    const id_docente = req.user.uid;
    const data = await docenteService.consultarDocentesConSusGrupos(
      id_docente || null,
      null
    );

    res.status(200).json(data);
  } catch (error) {
    return manejarError(res, error);
  }
}

module.exports = {
  docentesActivos,
  asignarGruposDeClase,
  consultarDocentesConSusGrupos,
  obtenerMiPerfil,
};
