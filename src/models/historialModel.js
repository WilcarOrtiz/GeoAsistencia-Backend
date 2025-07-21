module.exports = (sequelize, DataTypes) => {
    const Historial = sequelize.define(
        "HISTORIAL_ASISTENCIA", 
        {
            id_historial_asistencia: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            fecha: {
                type: DataTypes.DATE,
                allowNull: false,
                unique: false,
            },
            tema: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false,
            },
            id_grupo: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: {
                    model: "GRUPO",
                    key: "id_grupo"
                }
            }
        },
        {
            tableName: "HISTORIAL_ASISTENCIA",
            timestamps: false,
            freezeTableName: true,
        }
    );
    return Historial;
};