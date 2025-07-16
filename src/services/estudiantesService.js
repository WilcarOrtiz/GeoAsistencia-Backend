const { Estudiante, Usuario, Grupo, EstudianteGrupo } = require("../models");
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

    //EN ESTA PUEDO CAMBIAR SI PONGO EL ALIAS EN GRUPO PARA UTILIZAR EL MODELO, PERO DEBO PREGUNTARLE A KENDRYS SI ESO LE AFECTE SU CODIGO
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

async function asignarGruposDeClase(id_estudiante, grupos) {
  const transaction = await sequelize.transaction();
  try {
    if (!Array.isArray(grupos) || grupos.length === 0) {
      throw new Error("Debe enviar al menos un grupo.");
    }

    // 1. Validar existencia del estudiante
    const estudiante = await Estudiante.findByPk(id_estudiante);
    if (!estudiante) {
      throw new Error("El estudiante no existe.");
    }

    // 2. Validar existencia de los grupos enviados
    const gruposEncontrados = await Grupo.findAll({
      where: { id_grupo: grupos },
      attributes: ["id_grupo", "id_asignatura"],
    });

    if (!gruposEncontrados.length) {
      throw new Error("Ninguno de los grupos enviados existe.");
    }

    // 3. Consultar desde la BD qué asignaturas ya tiene
    const gruposActuales = await Grupo.findAll({
      include: {
        model: Estudiante,
        where: { id_estudiante },
        attributes: [],
        through: { attributes: [] },
      },
      attributes: ["id_grupo", "id_asignatura"],
      raw: true,
    });

    const asignaturasYaInscritas = new Set(
      gruposActuales.map((g) => g.id_asignatura)
    );
    const gruposYaInscritos = new Set(gruposActuales.map((g) => g.id_grupo));

    const asignaturasEnRequest = new Set();
    const asignados = [];
    const omitidos = [];

    // 4. Validar uno por uno
    for (const g of gruposEncontrados) {
      if (asignaturasEnRequest.has(g.id_asignatura)) {
        omitidos.push({
          id_grupo: g.id_grupo,
          motivo: "Conflicto: ya seleccionó otro grupo de la misma asignatura",
        });
        continue;
      }
      asignaturasEnRequest.add(g.id_asignatura);

      if (gruposYaInscritos.has(g.id_grupo)) {
        omitidos.push({
          id_grupo: g.id_grupo,
          motivo: "Ya asignado al estudiante",
        });
        continue;
      }

      if (asignaturasYaInscritas.has(g.id_asignatura)) {
        omitidos.push({
          id_grupo: g.id_grupo,
          motivo: "Ya tiene un grupo de esta asignatura",
        });
        continue;
      }

      asignados.push(g);
    }

    // 5. Insertar solo válidos
    if (asignados.length > 0) {
      await EstudianteGrupo.bulkCreate(
        asignados.map((g) => ({
          id_estudiante,
          id_grupo: g.id_grupo,
        })),
        { ignoreDuplicates: true, transaction }
      );
    }

    await transaction.commit();

    return {
      success: true,
      mensaje: asignados.length
        ? "Grupos asignados correctamente."
        : "No se asignaron nuevos grupos.",
      registrados: asignados.map((g) => g.id_grupo),
      omitidos,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error al asignar grupos: ${error.message}`);
  }
}

module.exports = {
  obtenerEstudiantesNoAsignadosAGrupo,
  asignarGruposDeClase,
};
