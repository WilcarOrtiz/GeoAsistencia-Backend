const usuarioController = require("./userController");
const estudianteService = require("../services/estudiantesService");

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

async function obtenerEstudiantesNoAsignadosAGrupo(req, res) {
  try {
    const { id_asignatura } = req.params;
    const resultado =
      await estudianteService.obtenerEstudiantesNoAsignadosAGrupo(
        id_asignatura
      );
    res.status(200).json({
      success: true,
      message: resultado.mensaje,
      estudiantes: resultado.estudiantes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  registrarUsuarioEstudiante,
  habilitarDeshabiliarEstudiante,
  crearEstudianteMasivamente,
  editarEstudiante,
  listarEstudiantes,
  obtenerEstudiantesNoAsignadosAGrupo,
};
