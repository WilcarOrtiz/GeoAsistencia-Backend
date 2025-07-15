const usuarioController = require("./userController");

async function registrarUsuarioDocente(req, res) {
  return usuarioController.registrarUsuario(req, res);
}

module.exports = {
  registrarUsuarioDocente,
};
