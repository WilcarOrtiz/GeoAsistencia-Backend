const grupoService = require("../services/grupoService");
const validarGrupo = require("../utils/validarGrupo");

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
    return res.status(400).json({ error: error.message });
  }
}

async function editarGrupo(req, res) {
  try {
    const { id_grupo } = req.params;
    const datos = req.body;
    const validaciones = validarGrupo(datos);
    if (validaciones.length > 0) {
        return res.status(400).json({error: validaciones});
    }
    const grupo = await grupoService.editarGrupo(id_grupo, datos);
    return res.status(200).json(grupo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

}

module.exports = {
    crearGrupo,
    editarGrupo
}