module.exports = (sequelize, DataTypes) => {
    const Grupo = sequelize.define(
        "GRUPO", 
        {
            id_grupo: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            codigo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            id_docente: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false,
                references: {
                    model: "DOCENTE",
                    key: "id_docente"
                }
            },
            id_asignatura: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: {
                    model: "ASIGNATURA",
                    key: "id_asignatura"
                }
            },
            estado_asistencia: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            }
        },
        {
            tableName: "GRUPO",
            timestamps: false,
            freezeTableName: true,
        }
    );
    return Grupo;
};