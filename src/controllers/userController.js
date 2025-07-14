const userService = require("../services/userService");

async function registrarUsuario(req, res) {
  try {
    const datos = req.body;

    const resultado = await userService.crearUsuario(datos);

    res.status(201).json({
      success: true,
      message: resultado.mensaje,
      idUsuario: resultado.idUsuario,
      rol: resultado.rol,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  registrarUsuario,
};
