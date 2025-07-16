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
    res.status(201).json(grupo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
    crearGrupo,
}