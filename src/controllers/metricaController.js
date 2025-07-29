const metricaService = require("../services/metricasService");
const manejarError = require("../utils/handlers/manejadorError");

async function obtener_metricas_generales(req, res) {
  try {
    const p_id_usuario = req.user.uid;
    const p_rol = req.user.rol;
    const resultado = await metricaService.obtener_metricas_generales(
      p_id_usuario,
      p_rol
    );
    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function obtener_asignatura_con_mayor_y_menor_asistencia(req, res) {
  try {
    const resultado =
      await metricaService.obtener_asignatura_con_mayor_y_menor_asistencia();
    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function obtener_asistencia_por_asignatura(req, res) {
  try {
    const p_id_usuario = req.user.uid;
    const p_rol = req.user.rol;
    const resultado = await metricaService.obtener_asistencia_por_asignatura(
      p_id_usuario,
      p_rol
    );
    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function obtener_indice_faltas(req, res) {
  try {
    const p_id_usuario = req.user.uid;
    const p_rol = req.user.rol;

    const resultado = await metricaService.obtener_indice_faltas(
      p_id_usuario,
      p_rol
    );

    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function obtener_asistencia_por_grupo(req, res) {
  try {
    const p_id_usuario = req.user.uid;
    const p_rol = req.user.rol;
    const p_id_asignatura = req.params.p_id_asignatura;

    const resultado = await metricaService.obtener_asistencia_por_grupo(
      p_id_usuario,
      p_rol,
      p_id_asignatura
    );

    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function obtener_extremos_asistencia_por_grupo(req, res) {
  try {
    const p_id_usuario = req.user.uid;
    const p_rol = req.user.rol;

    const resultado =
      await metricaService.obtener_extremos_asistencia_por_grupo(
        p_id_usuario,
        p_rol
      );

    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function obtener_top_inasistencias_estudiantes(req, res) {
  try {
    const p_id_usuario = req.user.uid;
    const p_rol = req.user.rol;

    const resultado =
      await metricaService.obtener_top_inasistencias_estudiantes(
        p_id_usuario,
        p_rol
      );

    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
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
