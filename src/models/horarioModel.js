module.exports = (sequelize, DataTypes) => {
    const Horario = sequelize.define(
        "HORARIO", 
        {
            id_horario: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            hora_inicio: {
                type: DataTypes.TIME,
                allowNull: false,
                unique: false,
            },
            hora_fin: {
                type: DataTypes.TIME,
                allowNull: false,
                unique: false,
            },
            id_dia: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: {
                    model: "DIA_SEMANA",
                    key: "id_dia"
                }
            }
        },
        {
            tableName: "HORARIO",
            timestamps: false,
            freezeTableName: true,
        }
    );
    return Horario;
};