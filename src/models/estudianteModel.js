module.exports = (sequelize, DataTypes) => {
  const Estudiante = sequelize.define(
    "ESTUDIANTE",
    {
      id_estudiante: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: "Usuario",
          key: "id",
        },
      },
      uuid_telefono: DataTypes.STRING,
      estado: DataTypes.BOOLEAN,
    },
    {
      tableName: "ESTUDIANTE",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Estudiante;
};
