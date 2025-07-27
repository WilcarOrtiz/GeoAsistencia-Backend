module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define(
    "ROL",
    {
      id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "ROL",
      timestamps: false,
    }
  );

  return Rol;
};
