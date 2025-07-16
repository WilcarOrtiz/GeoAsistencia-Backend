const grupoService = require("../services/grupoService");
const validarGrupo = require("../utils/validaciones/validarGrupo");

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
    if (error.message.includes('está')) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
  }
}

async function editarGrupo(req, res) {
  try {
    const { id_grupo } = req.params;
    if (!id_grupo) {
      return res.status(400).json("El id_grupo no debe ir vacio.");
    }
    const datos = req.body;
    const validaciones = validarGrupo(datos);
    if (validaciones.length > 0) {
        return res.status(400).json({error: validaciones});
    }
    const grupo = await grupoService.editarGrupo(id_grupo, datos);
    return res.status(200).json(grupo);
  } catch (error) {
    if (error.message.includes('está')) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
  }

}

async function eliminarGrupo(req, res) {
  try {
    const { id_grupo } = req.params;
    if (!id_grupo) {
      return res.status(400).json("El id_grupo no debe ir vacio.");
    }
    const grupoEliminado = await grupoService.eliminarGrupo(id_grupo);
    return res.status(200).json(grupoEliminado);
  } catch (error) {
    if (error.message.includes('está')) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
  }
}

async function consultarGrupoPorId(req, res) {
  try {
    const { id_grupo } = req.params;
    if (!id_grupo) {
      return res.status(400).json({error:"El id_grupo no debe ir vacio."});
    }
    const grupoConsultado = await grupoService.consultarGrupoPorId(id_grupo);
    return res.status(200).json(grupoConsultado);
  } catch (error) {
    if (error.message.includes('está')) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
  }
}

async function consultarGruposPorDocente(req, res) {
  try {
    const { id_docente, id_asignatura } = req.params;
    if (!id_docente) {
      return res.status(400).json({error:"El id_docente no debe ir vacio."});
    }
    if (!id_asignatura) {
      return res.status(400).json({error:"El id_asignatura no debe ir vacio."});
    }
    const gruposConsultados = await grupoService.consultarGruposPorDocente(id_asignatura, id_docente);
    return res.status(200).json(gruposConsultados);
  } catch (error) {
    if (error.message.includes('está')) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
  }
}

async function consultarGruposPorAsignatura(req, res) {
  try {
    const { id_asignatura } = req.params;
    if (!id_asignatura) {
      return res.status(400).json({error:"El id_asignatura no debe ir vacio."});
    }
    const gruposConsultados = await grupoService.consultarGruposPorAsignatura(id_asignatura);
    return res.status(200).json(gruposConsultados);
  } catch (error) {
    if (error.message.includes('está')) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
  }
}

module.exports = {
    crearGrupo,
    editarGrupo,
    eliminarGrupo,
    consultarGrupoPorId,
    consultarGruposPorDocente,
    consultarGruposPorAsignatura
}