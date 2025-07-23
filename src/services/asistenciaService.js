const {
  Grupo,
  Historial,
  Asistencia,
  Estudiante,
  Horario,
} = require("../models");

const {
  encontrarRegistroEnModelo,
  buscarRegistroPorCondicion,
} = require("../utils/helpers/modeloHelper");

const {
  obtenerFechaYHoraActual,
} = require("../utils/helpers/obtenerFechaHoraActual");
const validarHorario = require("../utils/validaciones/validarHorario");
const {
  validarUbicacion: validarUbicacionUtils,
} = require("../utils/validaciones/validarUbicacion");

async function esHoraClaseValida(id_grupo, fecha, hora) {
  const grupo = await Grupo.findByPk(id_grupo, {
    include: {
      model: Horario,
      as: "horarios",
      attributes: ["id_dia", "hora_inicio", "hora_fin"],
    },
  });

  const fechaSolicitud = new Date(`${fecha}T${hora}`);

  const enHorario = grupo.horarios.some((h) => {
    const horarioNormalizado = {
      ...h.dataValues,
      id_dia: Number(h.id_dia), // <- convertimos a número
      hora_inicio: h.hora_inicio.slice(0, 5),
      hora_fin: h.hora_fin.slice(0, 5),
    };
    return validarHorario(horarioNormalizado, fechaSolicitud);
  });

  if (!enHorario) {
    throw new Error("No puede realizar acciones fuera del horario de clases.");
  }
}

async function registrarAsistencia(id_grupo, id_estudiante) {
  try {
    const { fecha, hora } = obtenerFechaYHoraActual();
    await encontrarRegistroEnModelo(Estudiante, id_estudiante, "El estudiante");

    const grupoClase = await encontrarRegistroEnModelo(
      Grupo,
      id_grupo,
      "El grupo "
    );

    await esHoraClaseValida(id_grupo, fecha, hora);

    if (grupoClase.estado_asistencia) {
      const historial_asistencia = await buscarRegistroPorCondicion(
        Historial,
        { id_grupo, fecha },
        "La lista de asistencia"
      );

      await Asistencia.create({
        id_estudiante: id_estudiante,
        id_historial_asistencia: historial_asistencia.id_historial_asistencia,
        id_estudiante,
        hora,
        estado_asistencia: true,
      });
      return {
        mensaje: "Asistencia Registrada.",
        idUsuario: id_estudiante,
      };
    } else {
      throw new Error("La asistencia para este grupo está desactivada.");
    }
  } catch (error) {
    throw new Error(`Error al registrar la asistencia ${error.message}`);
  }
}

async function cambiarEstadoAsistencia(id_grupo, id_estudiante) {
  try {
    const { fecha, hora } = obtenerFechaYHoraActual();

    const estudiante = await encontrarRegistroEnModelo(
      Asistencia,
      id_estudiante,
      "El estudiante"
    );

    await encontrarRegistroEnModelo(Grupo, id_grupo, "El grupo de clase");
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
      mensaje: "Registro de asistencia actualizado.",
    };
  } catch (error) {
    throw new Error(
      `Error al actualizar el registro de la asistencia, ${error.message}`
    );
  }
}

async function generarAsistenciaManualmente(id_grupo, identificacion) {
  try {
    const estudiante = await buscarRegistroPorCondicion(
      Estudiante,
      identificacion,
      "El estudiante"
    );
    await encontrarRegistroEnModelo(Grupo, id_grupo, "El grupo de clase");
    cambiarEstadoAsistencia(id_grupo, estudiante.id_estudiante);
  } catch (error) {}
}

async function validarUbicacion(latitud, longitud) {
  try {
    const dentro = validarUbicacionUtils(latitud, longitud);
    return {
      mensaje: dentro
        ? "Está dentro de la geocerca"
        : "Está fuera de la geocerca",
      dentro,
    };
  } catch (error) {
    throw new Error(`Error al validar la ubicación: ${error.message}`);
  }
}

module.exports = {
  registrarAsistencia,
  cambiarEstadoAsistencia,
  validarUbicacion,
  generarAsistenciaManualmente,
};
