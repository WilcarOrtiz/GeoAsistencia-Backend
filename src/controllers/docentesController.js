const usuarioController = require("./userController");
const docenteService = require("../services/docenteService");

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

async function docentesActivos(req, res) {
  try {
    const resultado = await docenteService.docentesActivos();
    res.status(200).json({
      success: true,
      message: resultado.mensaje,
      docentes: resultado.docentes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  registrarUsuarioDocente,
  habilitarDeshabiliarDocente,
  crearDocenteMasivamente,
  editarDocente,
  listarDocentes,
  docentesActivos,
};
