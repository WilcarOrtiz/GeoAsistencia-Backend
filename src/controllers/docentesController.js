const docenteService = require("../services/docenteService");

async function docentesActivos(req, res) {
  try {
    const resultado = await docenteService.docentesActivos();
    res.status(200).json({
      success: true,
      message: resultado.mensaje,
      docentes: resultado.docentes,
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
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

async function consultarDocentesConSusGrupos(req, res) {
  try {
    const { id_docente } = req.query;
    const data = await docenteService.consultarDocentesConSusGrupos(
      id_docente || null
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = {
  docentesActivos,
  asignarGruposDeClase,
  consultarDocentesConSusGrupos,
};
