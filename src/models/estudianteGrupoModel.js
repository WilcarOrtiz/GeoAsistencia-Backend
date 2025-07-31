module.exports = (sequelize, DataTypes) => {
  const EstudianteGrupo = sequelize.define(
    "ESTUDIANTE_GRUPO",
    {
      id_grupo_periodo: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "GRUPO_PERIODO",
          key: "id_grupo_periodo",
        },
      },
      id_estudiante: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "ESTUDIANTE",
          key: "id_estudiante",
        },
      },
    },
    {
      tableName: "ESTUDIANTE_GRUPO",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return EstudianteGrupo;
};
