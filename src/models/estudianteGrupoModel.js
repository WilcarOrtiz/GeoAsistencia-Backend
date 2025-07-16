module.exports = (sequelize, DataTypes) => {
  const GrupoEstudiante = sequelize.define(
    "GrupoEstudiante",
    {
      id_grupo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "grupos", key: "id" },
      },
      id_estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "estudiantes", key: "id" },
      }
    },
    {
      tableName: "grupo_estudiante",
      timestamps: false,
    }
  );

  return GrupoEstudiante;
};
