module.exports = (sequelize, DataTypes) => {
  const GrupoHorario = sequelize.define(
    "GRUPO_HORARIO",
    {
      id_grupo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "GRUPO",
          key: "id_grupo",
        },
      },
      id_horario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "HORARIO",
          key: "id_horario",
        },
      },
    },
    {
      tableName: "GRUPO_HORARIO",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return GrupoHorario;
};
