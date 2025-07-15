module.exports = (sequelize, DataTypes) => {
    const Asignatura = sequelize.define(
        "ASIGNATURA", 
        {
            id_asignatura: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            codigo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            }
        },
        {
            tableName: "ASIGNATURA",
            timestamps: false,
            freezeTableName: true,
        }
    );
    return Asignatura;
};