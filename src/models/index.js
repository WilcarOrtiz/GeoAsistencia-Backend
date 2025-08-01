const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/supabase/db");

// Importar modelos
const Usuario = require("./userModel")(sequelize, DataTypes);
const Docente = require("./docenteModel")(sequelize, DataTypes);
const Estudiante = require("./estudianteModel")(sequelize, DataTypes);
const Rol = require("./rolModel")(sequelize, DataTypes);
const Asignatura = require("./asignaturaModel")(sequelize, DataTypes);
const Grupo = require("./grupoModel")(sequelize, DataTypes);
const Horario = require("./horarioModel")(sequelize, DataTypes);
const Dia = require("./diaModel")(sequelize, DataTypes);
const GrupoHorario = require("./grupoHorarioModel")(sequelize, DataTypes);
const EstudianteGrupo = require("./estudianteGrupoModel")(sequelize, DataTypes);
const Historial = require("./historialModel")(sequelize, DataTypes);
const Asistencia = require("./asistenciaModel")(sequelize, DataTypes);

// Relaciones
Usuario.hasOne(Estudiante, { foreignKey: "id_estudiante" });
Estudiante.belongsTo(Usuario, { foreignKey: "id_estudiante" });

Usuario.hasOne(Docente, { foreignKey: "id_docente" });
Docente.belongsTo(Usuario, { foreignKey: "id_docente" });

Rol.hasMany(Usuario, { foreignKey: "id_rol" });
Usuario.belongsTo(Rol, { foreignKey: "id_rol" });

Asignatura.hasMany(Grupo, { foreignKey: "id_asignatura" });
Grupo.belongsTo(Asignatura, { foreignKey: "id_asignatura" });

Docente.hasMany(Grupo, { foreignKey: "id_docente" });
Grupo.belongsTo(Docente, { foreignKey: "id_docente" });

Estudiante.belongsToMany(Grupo, {
  through: "ESTUDIANTE_GRUPO",
  foreignKey: "id_estudiante",
  otherKey: "id_grupo",
  timestamps: false,
});

Estudiante.hasMany(Asistencia, {
  foreignKey: "id_estudiante",
});

Asistencia.belongsTo(Estudiante, {
  foreignKey: "id_estudiante",
});

Historial.hasMany(Asistencia, {
  foreignKey: "id_historial_asistencia",
});

Asistencia.belongsTo(Historial, {
  foreignKey: "id_historial_asistencia",
});

Grupo.belongsToMany(Estudiante, {
  through: "ESTUDIANTE_GRUPO",
  foreignKey: "id_grupo",
  otherKey: "id_estudiante",
  timestamps: false,
});

Grupo.belongsToMany(Horario, {
  through: GrupoHorario,
  foreignKey: "id_grupo",
  otherKey: "id_horario",
  as: "horarios",
});

Horario.belongsToMany(Grupo, {
  through: GrupoHorario,
  foreignKey: "id_horario",
  otherKey: "id_grupo",
});

Grupo.hasMany(Historial, {
  foreignKey: "id_grupo",
});

Historial.belongsTo(Grupo, {
  foreignKey: "id_grupo",
});

Horario.belongsTo(Dia, { foreignKey: "id_dia" });
Dia.hasMany(Horario, { foreignKey: "id_dia" });

module.exports = {
  sequelize,
  Usuario,
  Docente,
  Estudiante,
  Rol,
  Asignatura,
  Grupo,
  Horario,
  Dia,
  GrupoHorario,
  EstudianteGrupo,
  Historial,
  Asistencia,
};
