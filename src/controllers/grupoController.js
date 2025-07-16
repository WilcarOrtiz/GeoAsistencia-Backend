const grupoService = require("../services/grupoService");
const validarGrupo = require("../utils/validaciones/validarGrupo");
const validarParametros = require("../utils/validaciones/validarParametros");
const manejarError = require("../utils/handlers/manejadorError");

async function crearGrupo(req, res) {
  try {
    const datos = req.body;
    const validaciones = validarGrupo(datos);
    if (validaciones.length > 0) {
        return res.status(400).json({error: validaciones});
    }
    const grupo = await grupoService.crearGrupo(datos);
    return res.status(201).json(grupo);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function editarGrupo(req, res) {
  try {
    const { id_grupo } = req.params;
    if (!validarParametros(req, res, ["id_grupo"])) return;
    const datos = req.body;
    const validaciones = validarGrupo(datos);
    if (validaciones.length > 0) {
        return res.status(400).json({error: validaciones});
    }
    const grupo = await grupoService.editarGrupo(id_grupo, datos);
    return res.status(200).json(grupo);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function eliminarGrupo(req, res) {
  try {
    const { id_grupo } = req.params;
    if (!validarParametros(req, res, ["id_grupo"])) return;
    const grupoEliminado = await grupoService.eliminarGrupo(id_grupo);
    return res.status(200).json(grupoEliminado);
  } catch (error) {
     return manejarError(res, error);
  }
}

async function consultarGrupoPorId(req, res) {
  try {
    const { id_grupo } = req.params;
    if (!validarParametros(req, res, ["id_grupo"])) return;
    const grupoConsultado = await grupoService.consultarGrupoPorId(id_grupo);
    return res.status(200).json(grupoConsultado);
  } catch (error) {
     return manejarError(res, error);
  }
}

async function consultarGruposPorDocente(req, res) {
  try {
    const { id_docente, id_asignatura } = req.params;
    if (!validarParametros(req, res, ["id_docente", "id_asignatura"])) return;
    const gruposConsultados = await grupoService.consultarGruposPorDocente(id_asignatura, id_docente);
    return res.status(200).json(gruposConsultados);
  } catch (error) {
     return manejarError(res, error);
  }
}

async function consultarGruposPorAsignatura(req, res) {
  try {
    const { id_asignatura } = req.params;
    if (!validarParametros(req, res, ["id_asignatura"])) return;
    const gruposConsultados = await grupoService.consultarGruposPorAsignatura(id_asignatura);
    return res.status(200).json(gruposConsultados);
  } catch (error) {
     return manejarError(res, error);
  }
}

async function consultarGruposPorEstudiante(req, res) {
  try {
    const { id_estudiante, id_asignatura } = req.params;
    if (!validarParametros(req, res, ["id_estudiante", "id_asignatura"])) return;
    const gruposConsultados = await grupoService.consultarGruposPorEstudiante(id_asignatura, id_estudiante);
    return res.status(200).json(gruposConsultados);
  } catch (error) {
     return manejarError(res, error);
  }
}

module.exports = {
    crearGrupo,
    editarGrupo,
    eliminarGrupo,
    consultarGrupoPorId,
    consultarGruposPorDocente,
    consultarGruposPorAsignatura,
    consultarGruposPorEstudiante
}