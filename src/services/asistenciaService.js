const { Grupo, Historial, Asistencia, Estudiante } = require("../models");
const {
  encontrarRegistroEnModelo,
  buscarRegistroPorCondicion,
} = require("../utils/helpers/modeloHelper");

async function registrarAsistencia(datos, id_estudiante) {
  try {
    const { id_grupo, fecha, hora } = datos;

    await encontrarRegistroEnModelo(Estudiante, id_estudiante, "El estudiante");

    const grupoClase = await encontrarRegistroEnModelo(
      Grupo,
      id_grupo,
      "El grupo de clase"
    );

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

async function cambiarEstadoAsistencia(datos) {
  try {
    const { id_grupo, fecha, hora, id_estudiante } = datos;

    const estudiante = await encontrarRegistroEnModelo(
      Estudiante,
      id_estudiante,
      "El estudiante"
    );

    await encontrarRegistroEnModelo(Grupo, id_grupo, "El grupo de clase");
    const historial_asistencia = await buscarRegistroPorCondicion(
      Historial,
      { id_grupo, fecha },
      "La lista de asistencia"
    );

    const asistencia = await buscarRegistroPorCondicion(
      Asistencia,
      {
        id_estudiante: estudiante.id_estudiante,
        id_historial_asistencia: historial_asistencia.id_historial_asistencia,
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
