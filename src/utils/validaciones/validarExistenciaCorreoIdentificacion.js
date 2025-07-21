// utils/modeloPorRol.js
const { Usuario } = require("../../models");
const { Op } = require("sequelize");

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

module.exports = {
  existeUsuarioCorreoIdentificacion,
};
