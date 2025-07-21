const { id } = require("apicache");
const { Grupo, Historial, Asistencia, Estudiante } = require("../models");
const { encontrarRegistroEnModelo } = require("../utils/helpers/modeloHelper");

async function registrarAsistencia(datos, id_estudiante) {
  try {
    const { id_grupo, fecha, hora } = datos;
    const grupoClase = await encontrarRegistroEnModelo(Grupo, id_grupo);
    if (!grupoClase) throw new Error("El grupo no existe.");

    if (grupoClase.estado_asistencia) {
      const historial_asistencia = await Historial.findOne({
        where: { id_grupo, fecha },
        attributes: ["id_historial_asistencia"],
      });
      if (!historial_asistencia)
        throw new Error("No se encontró el historial de asistencia.");

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

async function cambiarEstadoAsistencia(datos) {
  try {
    const { id_grupo, fecha, identificacion } = datos;

    const estudiante = await encontrarRegistroEnModelo(
      Estudiante,
      identificacion
    );
    if (!estudiante) throw new Error("El estudiante no existe.");

    const grupoClase = await encontrarRegistroEnModelo(Grupo, id_grupo);
    if (!grupoClase) throw new Error("El grupo no existe.");

    const historial_asistencia = await Historial.findOne({
      where: { id_grupo, fecha },
      attributes: ["id_historial_asistencia"],
    });

    const asistencia = await Asistencia.findOne({
      where: {
        id_estudiante: estudiante.id_estudiante,
        id_historial_asistencia: historial_asistencia.id_historial_asistencia,
      },
    });

    if (!asistencia) {throw new Error("No se encontró el registro de asistencia.");}

    const nuevoEstado = !asistencia.estado_asistencia;
    asistencia.estado_asistencia = nuevoEstado;
    await asistencia.save();

    return {
      mensaje: "Registro de asistencia actualizado.",
    };
  } catch (error) {
    throw new Error(`Error al actualizar el registro de la asistencia, ${error.message}`);
  }
}

async function validarUbicacion(datos) {
  try {
    return resultados;
  } catch (error) {
    throw new Error(`Error al validar la ubicación ${error.message}`);
  }
}

module.exports = {
  registrarAsistencia,
  cambiarEstadoAsistencia,
  validarUbicacion,
};
