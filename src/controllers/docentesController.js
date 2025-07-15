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

async function editarDocente(req, res) {
  return usuarioController.editarUsuario(req, res);
}

const listarDocentes = usuarioController.obtenerUsuariosPorRol("DOCENTE");

module.exports = {
  registrarUsuarioDocente,
  habilitarDeshabiliarDocente,
  crearDocenteMasivamente,
  editarDocente,
  listarDocentes,
};
