const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/supabase/db");

// Modelos
const Usuario = require("./userModel")(sequelize, DataTypes);
const Docente = require("./docenteModel")(sequelize, DataTypes);
const Estudiante = require("./estudianteModel")(sequelize, DataTypes);
const Rol = require("./rolModel")(sequelize, DataTypes);
const Asignatura = require("./asignaturaModel")(sequelize, DataTypes);
const Grupo = require("./grupoModel")(sequelize, DataTypes);
const GrupoPeriodo = require("./grupoPeriodoModel")(sequelize, DataTypes);
const EstudianteGrupo = require("./estudianteGrupoModel")(sequelize, DataTypes);
const Horario = require("./horarioModel")(sequelize, DataTypes);
const Dia = require("./diaModel")(sequelize, DataTypes);
const GrupoHorario = require("./grupoHorarioModel")(sequelize, DataTypes);
const Historial = require("./historialModel")(sequelize, DataTypes);
const Asistencia = require("./asistenciaModel")(sequelize, DataTypes);

// Relaciones
Rol.hasMany(Usuario, { foreignKey: "id_rol" });
Usuario.belongsTo(Rol, { foreignKey: "id_rol" });

Usuario.hasOne(Estudiante, { foreignKey: "id_estudiante" });
Estudiante.belongsTo(Usuario, { foreignKey: "id_estudiante" });

Usuario.hasOne(Docente, { foreignKey: "id_docente" });
Docente.belongsTo(Usuario, { foreignKey: "id_docente" });

Asignatura.hasMany(Grupo, { foreignKey: "id_asignatura" });
Grupo.belongsTo(Asignatura, { foreignKey: "id_asignatura" });

Grupo.hasMany(GrupoPeriodo, { foreignKey: "id_grupo" });
GrupoPeriodo.belongsTo(Grupo, { foreignKey: "id_grupo" });

Docente.hasMany(GrupoPeriodo, { foreignKey: "id_docente" });
GrupoPeriodo.belongsTo(Docente, { foreignKey: "id_docente" });

GrupoPeriodo.hasMany(Historial, { foreignKey: "id_grupo_periodo" });
Historial.belongsTo(GrupoPeriodo, { foreignKey: "id_grupo_periodo" });

GrupoPeriodo.belongsToMany(Estudiante, {
  through: EstudianteGrupo,
  foreignKey: "id_grupo_periodo",
  otherKey: "id_estudiante",
  timestamps: false,
});
Estudiante.belongsToMany(GrupoPeriodo, {
  through: EstudianteGrupo,
  foreignKey: "id_estudiante",
  otherKey: "id_grupo_periodo",
  timestamps: false,
});

Estudiante.hasMany(Asistencia, { foreignKey: "id_estudiante" });
Asistencia.belongsTo(Estudiante, { foreignKey: "id_estudiante" });

Historial.hasMany(Asistencia, { foreignKey: "id_historial_asistencia" });
Asistencia.belongsTo(Historial, { foreignKey: "id_historial_asistencia" });

Grupo.belongsToMany(Horario, {
  through: GrupoHorario,
  foreignKey: "id_grupo",
  otherKey: "id_horario",
});
Horario.belongsToMany(Grupo, {
  through: GrupoHorario,
  foreignKey: "id_horario",
  otherKey: "id_grupo",
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
  GrupoPeriodo,
  EstudianteGrupo,
  Horario,
  Dia,
  GrupoHorario,
  Historial,
  Asistencia,
};
