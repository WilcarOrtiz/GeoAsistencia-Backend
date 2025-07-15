const usuarioController = require("./userController");

async function registrarUsuarioEstudiante(req, res) {
  return usuarioController.registrarUsuario(req, res);
}

async function habilitarDeshabiliarEstudiante(req, res) {
  return usuarioController.cambiarEstadoUsuario(req, res);
}

async function crearEstudianteMasivamente(req, res) {
  return usuarioController.crearUsuarioMasivamente(req, res);
}
module.exports = {
  registrarUsuarioEstudiante,
  habilitarDeshabiliarEstudiante,
  crearEstudianteMasivamente,
};
