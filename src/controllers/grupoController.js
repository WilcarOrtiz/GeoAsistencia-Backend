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

async function eliminarEstudianteDeGrupo(req, res) {
  try {
    const { id_grupo, id_estudiante } = req.params;
    if (!validarParametros(req, res, ["id_grupo","id_estudiante"])) return;
    const estudianteEliminadoGrupo = await grupoService.eliminarEstudianteDeGrupo(id_grupo, id_estudiante);
    return res.status(200).json(estudianteEliminadoGrupo);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function trasladarEstudianteDeGrupo(req, res) {
  try {
    const { id_grupo, id_estudiante, id_nuevo_grupo  } = req.params;
    if (!validarParametros(req, res, ["id_grupo","id_estudiante","id_nuevo_grupo"])) return;
    const estudianteTrasladoGrupo = await grupoService.trasladarEstudianteDeGrupo(id_grupo, id_estudiante, id_nuevo_grupo);
    return res.status(200).json(estudianteTrasladoGrupo);
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

async function consultarEstudiantesPorId(req, res) {
  try {
    const { id_grupo } = req.params;
    if (!validarParametros(req, res, ["id_grupo"])) return;
    const estudiantesConsultados = await grupoService.consultarEstudiantesPorId(id_grupo);
    return res.status(200).json(estudiantesConsultados);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function iniciarLlamadoLista(req, res) {
  try {
    const { id_grupo } = req.params;
    const { tema } = req.body;
    if (!validarParametros(req, res, ["id_grupo"])) return;
    const historialCreado = await grupoService.iniciarLlamadoLista(id_grupo, tema);
    return res.status(201).json(historialCreado);
  } catch (error) {
    return manejarError(res, error);
  }
 
}

async function detenerLlamadoLista(req, res) {
  try {
    const { id_grupo } = req.params;
    if (!validarParametros(req, res, ["id_grupo"])) return;
    const historialCerrado = await grupoService.detenerLlamadoLista(id_grupo);
    return res.status(200).json(historialCerrado);
  } catch (error) {
    return manejarError(res, error);
  }
 
}

async function cancelarLlamadoLista(req, res) {
  try {
    const { id_grupo } = req.params;
    if (!validarParametros(req, res, ["id_grupo"])) return;
    const historialCancelado = await grupoService.cancelarLlamadoLista(id_grupo);
    return res.status(200).json(historialCancelado);
  } catch (error) {
    return manejarError(res, error);
  }
}

module.exports = {
    crearGrupo,
    editarGrupo,
    eliminarGrupo,
    eliminarEstudianteDeGrupo,
    trasladarEstudianteDeGrupo,
    consultarGrupoPorId,
    consultarGruposPorDocente,
    consultarGruposPorAsignatura,
    consultarGruposPorEstudiante,
    consultarEstudiantesPorId,
    iniciarLlamadoLista,
    detenerLlamadoLista,
    cancelarLlamadoLista
}