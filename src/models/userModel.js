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

  return Usuario;
};
