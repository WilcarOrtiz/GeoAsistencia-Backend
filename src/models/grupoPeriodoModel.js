module.exports = (sequelize, DataTypes) => {
  const GrupoPeriodo = sequelize.define(
    "GRUPO_PERIODO",
    {
      id_grupo_periodo: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      periodo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      id_docente: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "DOCENTE",
          key: "id_docente",
        },
      },
      id_grupo: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "GRUPO",
          key: "id_grupo",
        },
      },
    },
    {
      tableName: "GRUPO_PERIODO",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return GrupoPeriodo;
};
