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

  // Excluye el usuario actual (para edición)
  if (id_usuario) {
    whereCondition.id_usuario = { [Op.ne]: id_usuario };
  }

  const existente = await Usuario.findOne({ where: whereCondition });

  if (existente) {
    throw new Error(
      `Ya existe un usuario con el correo "${correo}" o la identificación "${identificacion}".`
    );
  }
}

module.exports = {
  existeUsuarioCorreoIdentificacion,
};
