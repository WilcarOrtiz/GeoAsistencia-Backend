const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/supabase/db");

// Importar modelos
const Usuario = require("./userModel")(sequelize, DataTypes);
const Docente = require("./docenteModel")(sequelize, DataTypes);
const Estudiante = require("./estudianteModel")(sequelize, DataTypes);
const Rol = require("./rolModel")(sequelize, DataTypes);
const Asignatura = require("./asignaturaModel")(sequelize, DataTypes);


// Relaciones 
Usuario.hasOne(Estudiante, { foreignKey: "id_estudiante" });
Estudiante.belongsTo(Usuario, { foreignKey: "id_estudiante" });

Usuario.hasOne(Docente, { foreignKey: "id_docente" });
Docente.belongsTo(Usuario, { foreignKey: "id_docente" });

Rol.hasMany(Usuario, { foreignKey: "id_rol" });
Usuario.belongsTo(Rol, { foreignKey: "id_rol" });

module.exports = {
  sequelize,
  Usuario,
  Docente,
  Estudiante,
  Rol,
  Asignatura
};
