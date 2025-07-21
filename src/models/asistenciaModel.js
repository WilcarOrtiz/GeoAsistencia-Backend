module.exports = (sequelize, DataTypes) => {
  const Asistencia = sequelize.define(
    "Asistencia",
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
      id_historial_asistencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "HISTORIAL_ASISTENCIA",
          key: "id_historial_asistencia",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      hora: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      estado_asistencia: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: "ASISTENCIA",
      timestamps: false,
    }
  );

  return Asistencia;
};
