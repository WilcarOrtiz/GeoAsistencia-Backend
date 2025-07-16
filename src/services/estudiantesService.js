const { Estudiante, Usuario, Grupo } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../database/supabase/db");

async function obtenerEstudiantesNoAsignadosAGrupo(id_asignatura) {
  //Consultar estudiantes que no pertenezcan a un grupo de la asignatura
  try {
    const estudiantesSinGrupo = await Estudiante.findAll({
      include: [
        {
          model: Usuario,
          attributes: ["id_usuario", "nombres", "apellidos", "correo"],
        },
      ],
      where: {
        id_estudiante: {
          [Op.notIn]: sequelize.literal(`(
        SELECT eg.id_estudiante
        FROM "ESTUDIANTE_GRUPO" eg
        INNER JOIN "GRUPO" g ON eg.id_grupo = g.id_grupo
        WHERE g.id_asignatura = ${id_asignatura}
      )`),
        },
      },
    });

    return {
      mensaje: "Estudiantes no asignados a un grupo de la asignatura.",
      estudiantes: estudiantesSinGrupo,
    };
  } catch (error) {
    throw new Error(
      `Error al obtener estudiantes no asignados a un grupo de la asignatura: ${error.message}`
    );
  }
}

module.exports = {
  obtenerEstudiantesNoAsignadosAGrupo,
};
