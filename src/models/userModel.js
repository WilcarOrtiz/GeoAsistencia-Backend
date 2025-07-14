module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Usuario",
    {
      id: DataTypes.STRING,
      identificacion: DataTypes.STRING,
      nombres: DataTypes.STRING,
      apellidos: DataTypes.STRING,
      correo: DataTypes.STRING,
      contrasena: DataTypes.STRING,
      estado: DataTypes.BOOLEAN,
      rol: DataTypes.ENUM("DOCENTE", "ESTUDIANTE", "ADMINISTRADOR"),
    },
    {
      tableName: "Usuario", // nombre exacto en Supabase
      timestamps: false, // si no tienes createdAt / updatedAt
    }
  );
};

