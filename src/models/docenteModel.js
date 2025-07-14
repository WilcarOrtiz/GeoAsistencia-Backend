module.exports = (sequelize, DataTypes) => {
  const Docente = sequelize.define(
    "DOCENTE",
    {
      id_docente: {
        type: DataTypes.STRING, // mismo tipo que Usuario.id
        primaryKey: true,
        references: {
          model: "Usuario", // nombre exacto de la tabla
          key: "id",
        },
      },
      uuid_telefono: DataTypes.STRING,
      estado: DataTypes.BOOLEAN,
    },
    {
      tableName: "DOCENTE",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Docente;
};
