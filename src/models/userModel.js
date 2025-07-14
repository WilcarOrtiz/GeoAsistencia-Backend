module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "USUARIO",
    {
      id_usuario: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      identificacion: DataTypes.STRING,
      nombres: DataTypes.STRING,
      apellidos: DataTypes.STRING,
      correo: DataTypes.STRING,
      contrasena: DataTypes.STRING,
      id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ROL",
          key: "id_rol",
        },
      },
    },
    {
      tableName: "USUARIO",
      timestamps: false,
    }
  );

  // Hook para encriptar contraseña
  Usuario.beforeCreate(async (usuario, options) => {
    const bcrypt = require("bcryptjs");
    if (usuario.contrasena) {
      const hash = await bcrypt.hash(usuario.contrasena, 10);
      usuario.contrasena = hash;
    }
  });

  return Usuario;
};
