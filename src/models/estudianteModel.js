module.exports = (sequelize, DataTypes) => {
  const Estudiante = sequelize.define(
    "ESTUDIANTE",
    {
      id_estudiante: {
        type: DataTypes.STRING, // mismo tipo que Usuario.id
        primaryKey: true,
        references: {
          model: "Usuario", // nombre exacto de la tabla
          key: "id"
        }
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
