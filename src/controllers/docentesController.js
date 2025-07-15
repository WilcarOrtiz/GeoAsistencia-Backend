const usuarioController = require("./userController");

async function registrarUsuarioDocente(req, res) {
  return usuarioController.registrarUsuario(req, res);
}

async function habilitarDeshabiliarDocente(req, res) {
  return usuarioController.cambiarEstadoUsuario(req, res);
}

async function crearDocenteMasivamente(req, res) {
  return usuarioController.crearUsuarioMasivamente(req, res);
}
module.exports = {
  registrarUsuarioDocente,
  habilitarDeshabiliarDocente,
  crearDocenteMasivamente,
};
