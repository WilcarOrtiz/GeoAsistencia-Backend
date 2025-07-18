// utils/modeloPorRol.js
const { Usuario, Docente, Estudiante, Rol } = require("../../models");
const { Op } = require("sequelize");

function obtenerModeloPorRol(rolNombre) {
  const modelos = {
    DOCENTE: Docente,
    ESTUDIANTE: Estudiante,
  };

  const modelo = modelos[rolNombre];
  if (!modelo) {
    throw new Error("Rol sin modelo asociado.");
  }

  return modelo;
}

async function existeUsuarioCorreoIdentificacion(
  correo,
  identificacion,
  id_usuario = null
) {
  const whereCondition = {
    [Op.or]: [{ correo }, { identificacion }],
  };

  // Si mandas id_usuario, excluye ese registro
  if (id_usuario) {
    whereCondition.id_usuario = { [Op.ne]: id_usuario };
  }

  const existente = await Usuario.findOne({ where: whereCondition });
  return !!existente; // true si existe otro usuario con ese correo o identificación
}

async function buscarRolPorNombre(nombreRol) {
  const rol = await Rol.findOne({
    where: { nombre: nombreRol.toUpperCase() },
  });
  return rol; // Devuelve el objeto Rol o null si no existe
}

async function encontrarRegistroEnModelo(Model, id) {
  const record = await Model.findByPk(id);
  return record || null; // Retorna null si no existe
}

module.exports = {
  obtenerModeloPorRol,
  existeUsuarioCorreoIdentificacion,
  buscarRolPorNombre,
  encontrarRegistroEnModelo,
};
