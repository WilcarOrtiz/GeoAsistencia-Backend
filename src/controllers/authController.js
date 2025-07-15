const authService = require("../services/AuthService");

async function RecuperarContraseña(req, res) {
  try {
    const { correo } = req.body;
    const resultado = await authService.RecuperarContraseña(correo);
    res.status(201).json({
      success: true,
      message: resultado.mensaje,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  RecuperarContraseña,
};
