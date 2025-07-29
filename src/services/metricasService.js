const sequelize = require("../database/supabase/db");

async function obtener_metricas_generales(p_id_usuario, p_rol) {
  const [resultado] = await sequelize.query(
    `SELECT * FROM obtener_metricas_generales(:p_id_usuario, :p_rol)`,
    {
      replacements: { p_id_usuario, p_rol },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return resultado.obtener_metricas_generales;
}

async function obtener_asignatura_con_mayor_y_menor_asistencia() {
  const [resultado] = await sequelize.query(
    `SELECT * FROM obtener_asignatura_con_mayor_y_menor_asistencia()`,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return resultado.obtener_asignatura_con_mayor_y_menor_asistencia;
}

async function obtener_asistencia_por_asignatura(p_id_usuario, p_rol) {
  const [resultado] = await sequelize.query(
    `SELECT * FROM obtener_asistencia_por_asignatura(:p_id_usuario, :p_rol)`,
    {
      replacements: { p_id_usuario, p_rol },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return resultado.obtener_asistencia_por_asignatura;
}

async function obtener_asistencia_por_grupo(
  p_id_usuario,
  p_rol,
  p_id_asignatura
) {
  const [resultado] = await sequelize.query(
    `SELECT * FROM obtener_asistencia_por_grupo(:p_id_usuario, :p_rol, :p_id_asignatura)`,
    {
      replacements: { p_id_usuario, p_rol, p_id_asignatura },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return resultado.obtener_asistencia_por_grupo;
}

async function obtener_extremos_asistencia_por_grupo(p_id_usuario, p_rol) {
  const [resultado] = await sequelize.query(
    `SELECT * FROM obtener_extremos_asistencia_por_grupo(:p_id_usuario, :p_rol)`,
    {
      replacements: { p_id_usuario, p_rol },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return resultado.obtener_extremos_asistencia_por_grupo;
}

async function obtener_indice_faltas(p_id_usuario, p_rol) {
  const [resultado] = await sequelize.query(
    `SELECT * FROM obtener_indice_faltas(:p_id_usuario, :p_rol)`,
    {
      replacements: { p_id_usuario, p_rol },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return resultado.obtener_indice_faltas;
}

async function obtener_top_inasistencias_estudiantes(p_id_usuario, p_rol) {
  const [resultado] = await sequelize.query(
    `SELECT * FROM obtener_top_inasistencias_estudiantes(:p_id_usuario, :p_rol)`,
    {
      replacements: { p_id_usuario, p_rol },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return resultado.obtener_top_inasistencias_estudiantes;
}

module.exports = {
  obtener_extremos_asistencia_por_grupo,
  obtener_metricas_generales,
  obtener_indice_faltas,
  obtener_asistencia_por_asignatura,
  obtener_asistencia_por_grupo,
  obtener_top_inasistencias_estudiantes,
  obtener_asignatura_con_mayor_y_menor_asistencia,
};
