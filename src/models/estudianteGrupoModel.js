module.exports = (sequelize, DataTypes) => {
  const EstudianteGrupo = sequelize.define(
    "EstudianteGrupo",
    {
      id_estudiante: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "ESTUDIANTE",
          key: "id_estudiante",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_grupo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "GRUPO",
          key: "id_grupo",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "ESTUDIANTE_GRUPO",
      timestamps: false,
    }
  );

  return EstudianteGrupo;
};
