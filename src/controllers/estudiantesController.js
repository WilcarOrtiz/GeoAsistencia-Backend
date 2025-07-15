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

async function editarEstudiante(req, res) {
  return usuarioController.editarUsuario(req, res);
}

const listarEstudiantes = usuarioController.obtenerUsuariosPorRol("ESTUDIANTE");

module.exports = {
  registrarUsuarioEstudiante,
  habilitarDeshabiliarEstudiante,
  crearEstudianteMasivamente,
  editarEstudiante,
  listarEstudiantes,
};
