const usuarioController = require("./userController");

async function registrarUsuarioEstudiante(req, res) {
  return usuarioController.registrarUsuario(req, res);
}

module.exports = {
  registrarUsuarioEstudiante,
};
