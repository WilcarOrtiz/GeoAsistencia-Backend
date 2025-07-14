const { User } = require("../models");

async function registrarUsuario(data) {
  const existente = await User.findOne({ where: { correo: data.correo } });
  if (existente) throw new Error("Correo ya registrado");

  return await User.create(data);
}

module.exports = {
  registrarUsuario,
};
