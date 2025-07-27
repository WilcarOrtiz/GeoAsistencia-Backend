const {
Grupo,
  Historial,
  Asistencia,
  Estudiante,
  Horario,
  Usuario,
} = require("../models");
const { buscarRegistroPorCondicion } = require("../utils/helpers/modeloHelper");
const {
  obtenerFechaYHoraActual,
} = require("../utils/helpers/obtenerFechaHoraActual");
const validarHorario = require("../utils/validaciones/validarHorario");
const {
  validarUbicacion: validarUbicacionUtils,
} = require("../utils/validaciones/validarUbicacion");
const {
  validarExistencia,
} = require("../utils/validaciones/validarExistenciaModelo");

async function esHoraClaseValida(id_grupo, fecha, hora) {
  const grupo = await Grupo.findByPk(id_grupo, {
    attributes: ["estado_asistencia"],
    include: {
      model: Horario,
      as: "horarios",
      attributes: ["id_dia", "hora_inicio", "hora_fin"],
    },
  });

  if (!grupo) {
    throw new Error("El grupo no está registrado");
  }

  const fechaSolicitud = new Date(`${fecha}T${hora}`);
  const enHorario = grupo.horarios.some((h) => {
    const horarioNormalizado = {
      id_dia: Number(h.id_dia),
      hora_inicio: h.hora_inicio.slice(0, 5),
      hora_fin: h.hora_fin.slice(0, 5),
    };
    return validarHorario(horarioNormalizado, fechaSolicitud);
  });

  if (!enHorario) {
    throw new Error("Actualmente no está en horario de clase");
  }

  return { estado_asistencia: grupo.estado_asistencia };
}

async function registrarAsistencia(id_grupo, id_estudiante) {
  try {
    const { fecha, hora } = obtenerFechaYHoraActual();
    await validarExistencia(Estudiante, id_estudiante, "El estudiante");
    const grupoClase = await esHoraClaseValida(id_grupo, fecha, hora);
    if (!grupoClase.estado_asistencia) {
      throw new Error("La asistencia para este grupo no está habilitada.");
    }

    const historial_asistencia = await buscarRegistroPorCondicion(
      Historial,
      { id_grupo, fecha },
      "El estudiante "
    );

    const yaRegistrado = await buscarRegistroPorCondicion(Asistencia, {
      id_estudiante,
      id_historial_asistencia: historial_asistencia.id_historial_asistencia,
    });

    if (yaRegistrado) {
      throw new Error(
        "El estudiante ya está registrado en el historial de asistencia."
      );
    }

    await Asistencia.create({
      id_estudiante,
      id_historial_asistencia: historial_asistencia.id_historial_asistencia,
      hora,
      estado_asistencia: true,
    });

    return {
      success: true,
      mensaje: "Asistencia Registrada",
      asistente: id_estudiante,
    };
  } catch (error) {
    throw new Error(`Error al registrar la asistencia ${error.message}`);
  }
}

async function cambiarEstadoAsistencia(id_grupo, id_estudiante) {
  try {
    const { fecha, hora } = obtenerFechaYHoraActual();
    const estudiante = await validarExistencia(
      Asistencia,
      id_estudiante,
      "El estudiante"
    );

    await esHoraClaseValida(id_grupo, fecha, hora);

    const historial = await buscarRegistroPorCondicion(
      Historial,
      { id_grupo, fecha },
      "La lista de asistencia"
    );

    const asistencia = await buscarRegistroPorCondicion(
      Asistencia,
      {
        id_estudiante: estudiante.id_estudiante,
        id_historial_asistencia: historial.id_historial_asistencia,
      },
      "La asistencia"
    );

    const nuevoEstado = !asistencia.estado_asistencia;
    asistencia.estado_asistencia = nuevoEstado;
    await asistencia.save();

    return {
      success: true,
      mensaje: "Registro de asistencia actualizado.",
      asistente: id_estudiante,
    };
  } catch (error) {
    throw new Error(
      `Error al actualizar el registro de la asistencia, ${error.message}`
    );
  }
}

async function validarUbicacion(latitud, longitud) {
  try {
    const dentro = await validarUbicacionUtils(latitud, longitud);
    return {
      success: true,
      mensaje: dentro
        ? "Está dentro de la geocerca"
        : "Está fuera de la geocerca",
      dentro,
    };
  } catch (error) {
    throw new Error(`Error al validar la ubicación: ${error.message}`);
  }
}

async function generarAsistenciaManualmente(id_grupo, identificacion) {
  try {
    const estudiante = await buscarRegistroPorCondicion(
      Usuario,
      { identificacion },
      "El estudiante"
    );

    const resultado = await cambiarEstadoAsistencia(
      id_grupo,
      estudiante.id_usuario
    );
    return resultado;
  } catch (error) {
    throw new Error(
      `Error al generar la asistencia manualmente: ${error.message}`
    );
  }
}

module.exports = {
  registrarAsistencia,
  cambiarEstadoAsistencia,
  validarUbicacion,
  generarAsistenciaManualmente,
};
