const {
  Estudiante,
  Usuario,
  Grupo,
  EstudianteGrupo,
  Asignatura,
  GrupoPeriodo,
} = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../database/supabase/db");
const {
  formatearUsuariosConAsignaturasYGrupos,
  formatearDocentesConAsignaturasYGrupos,
} = require("../utils/helpers/formatearUsuarioConAsignaturasYGrupos");

const {
  validarExistencia,
} = require("../utils/validaciones/validarExistenciaModelo");
const { obtenerPeriodoActual } = require("../utils/helpers/fechaHelpers");

async function obtenerEstudiantesNoAsignadosAGrupo(id_asignatura, periodo) {
  try {
    const asignatura = await validarExistencia(
      Asignatura,
      id_asignatura,
      "Asignatura"
    );

    const estudiantesSinGrupo = await Estudiante.findAll({
      include: [
        {
          model: Usuario,
          attributes: [
            "id_usuario",
            "nombres",
            "apellidos",
            "correo",
            "identificacion",
          ],
        },
      ],
      where: {
        estado: true,
        id_estudiante: {
          [Op.notIn]: sequelize.literal(`(
            SELECT eg.id_estudiante
            FROM "ESTUDIANTE_GRUPO" eg
            INNER JOIN "GRUPO_PERIODO" gp ON eg.id_grupo_periodo = gp.id_grupo_periodo
            INNER JOIN "GRUPO" g ON gp.id_grupo = g.id_grupo
            WHERE g.id_asignatura = ${id_asignatura}
              AND gp.periodo = '${periodo}'
          )`),
        },
      },
    });

    const resultadoLimpio = estudiantesSinGrupo.map((estudiante) => ({
      id_estudiante: estudiante.id_estudiante,
      identificacion: estudiante.USUARIO.identificacion,
      nombres: estudiante.USUARIO.nombres,
      apellidos: estudiante.USUARIO.apellidos,
      correo: estudiante.USUARIO.correo,
    }));

    return {
      success: true,
      mensaje: `Estudiantes fuera de ${asignatura.nombre} período ${periodo}.`,
      estudiantes: resultadoLimpio,
    };
  } catch (error) {
    throw new Error(
      `Error al obtener estudiantes no asignados a un grupo de la asignatura en el período: ${error.message}`
    );
  }
}

async function asignarGruposDeClase(id_estudiante, idsGrupoPeriodo) {
  const transaction = await sequelize.transaction();
  try {
    await validarExistencia(Estudiante, id_estudiante, "El estudiante");

    // 1. Buscar los grupos solicitados
    const gruposPeriodo = await GrupoPeriodo.findAll({
      where: { id_grupo_periodo: idsGrupoPeriodo },
      include: {
        model: Grupo,
        attributes: ["id_grupo", "id_asignatura", "nombre"],
      },
    });

    // 2. Obtener los que no existen

    const encontradosIds = gruposPeriodo.map((gp) =>
      Number(gp.id_grupo_periodo)
    );
    const noEncontrados = idsGrupoPeriodo
      .map(Number)
      .filter((id) => !encontradosIds.includes(id));

    // 3. Consultar grupos ya asignados del estudiante
    const gruposActuales = await EstudianteGrupo.findAll({
      where: { id_estudiante },
      include: {
        model: GrupoPeriodo,
        include: {
          model: Grupo,
          attributes: ["id_grupo", "id_asignatura", "nombre"],
        },
      },
    });

    const asignaturasYaInscritas = new Set(
      gruposActuales.map((g) => g.GRUPO_PERIODO.GRUPO.id_asignatura)
    );
    const gruposYaInscritos = new Set(
      gruposActuales.map((g) => g.id_grupo_periodo)
    );

    const asignaturasEnRequest = new Set();
    const asignados = [];
    const omitidosMap = new Map();

    const agregarOmitido = (nombreGrupo, motivo) => {
      if (!omitidosMap.has(motivo)) omitidosMap.set(motivo, []);
      omitidosMap.get(motivo).push(nombreGrupo);
    };

    // 4. Procesar los grupos encontrados
    for (const gp of gruposPeriodo) {
      const idGrupoPeriodo = gp.id_grupo_periodo;
      const nombreGrupo = gp.GRUPO.nombre;
      const idAsignatura = gp.GRUPO.id_asignatura;

      if (asignaturasEnRequest.has(idAsignatura)) {
        agregarOmitido(
          nombreGrupo,
          "Conflicto: ya seleccionó otro grupo de la misma asignatura"
        );
        continue;
      }

      if (gruposYaInscritos.has(idGrupoPeriodo)) {
        agregarOmitido(nombreGrupo, "Ya asignado al estudiante");
        continue;
      }

      if (asignaturasYaInscritas.has(idAsignatura)) {
        agregarOmitido(nombreGrupo, "Ya tiene un grupo de esta asignatura");
        continue;
      }

      asignaturasEnRequest.add(idAsignatura);

      asignados.push({
        id_estudiante,
        id_grupo_periodo: idGrupoPeriodo,
      });
    }

    // 5. Procesar grupos que no existen
    for (const id of noEncontrados) {
      agregarOmitido(` ID ${id}`, "El grupo no existe");
    }

    // 6. Insertar solo los válidos
    if (asignados.length > 0) {
      await EstudianteGrupo.bulkCreate(asignados, {
        ignoreDuplicates: true,
        transaction,
      });
    }

    await transaction.commit();

    // 7. Transformar omitidos agrupados
    const omitidos = Array.from(omitidosMap.entries()).map(
      ([motivo, grupos]) => ({
        grupos,
        motivo,
      })
    );

    return {
      success: true,
      mensaje: asignados.length
        ? "Grupos asignados correctamente."
        : "No se asignaron nuevos grupos.",
      registrados: asignados.map((a) => a.id_grupo_periodo),
      omitidos,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error al asignar grupos: ${error.message}`);
  }
}

async function consultarEstudiantesConSusGrupos(id_estudiante, periodo) {
  try {
    const whereCondition = id_estudiante ? { id_estudiante } : {};
    const whereGrupoPeriodo = periodo
      ? { periodo }
      : { periodo: obtenerPeriodoActual() };

    const estudiantes = await Estudiante.findAll({
      where: whereCondition,
      include: [
        {
          model: Usuario,
          attributes: ["identificacion", "nombres", "apellidos", "correo"],
        },
        {
          model: GrupoPeriodo,
          where: { periodo: whereGrupoPeriodo.periodo },
          required: false,
          include: [
            {
              model: Grupo,
              attributes: ["id_grupo", "nombre", "codigo"],
              include: [
                {
                  model: Asignatura,
                  attributes: ["id_asignatura", "nombre", "codigo"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (id_estudiante && estudiantes.length === 0) {
      throw new Error("El estudiante no existe.");
    }

    const data = formatearDocentesConAsignaturasYGrupos(estudiantes);

    return {
      success: true,
      mensaje: id_estudiante
        ? "Detalle del estudiante con grupos"
        : "Lista de estudiantes con sus grupos.",
      data,
    };
  } catch (error) {
    throw new Error(
      `Error al obtener estudiantes con grupos: ${error.message}`
    );
  }
}

module.exports = {
  obtenerEstudiantesNoAsignadosAGrupo,
  asignarGruposDeClase,
  consultarEstudiantesConSusGrupos,
};
