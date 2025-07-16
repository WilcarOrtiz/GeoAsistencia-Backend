module.exports = (sequelize, DataTypes) => {
    const Dia_Semana = sequelize.define(
        "DIA_SEMANA", 
        {
            id_dia: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            dia: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            }
        },
        {
            tableName: "DIA_SEMANA",
            timestamps: false,
            freezeTableName: true,
        }
    );
    return Dia_Semana;
};