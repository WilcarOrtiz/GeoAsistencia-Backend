const {
  Usuario,
  Docente,
  Grupo,
  Asignatura,
  GrupoPeriodo,
} = require("../models");
const sequelize = require("../database/supabase/db");

const {
  formatearDocentesConAsignaturasYGrupos,
} = require("../utils/helpers/formatearUsuarioConAsignaturasYGrupos");

const {
  validarExistencia,
} = require("../utils/validaciones/validarExistenciaModelo");

const { obtenerPeriodoActual } = require("../utils/helpers/fechaHelpers");

async function asignarGruposADocente(id_docente, grupoPeriodos) {
  const transaction = await sequelize.transaction();
  try {
    await validarExistencia(Docente, id_docente, "El docente");

    const gruposEncontrados = await GrupoPeriodo.findAll({
      where: { id_grupo_periodo: grupoPeriodos },
      include: [{ model: Grupo, attributes: ["nombre"] }],
    });

    const asignados = [];
    const omitidos = [];

    const idsEncontrados = new Set(
      gruposEncontrados.map((g) => g.id_grupo_periodo)
    );

    for (const id of grupoPeriodos) {
      if (!idsEncontrados.has(id)) {
        omitidos.push({
          nombre: `ID ${id}`,
          motivo: "Este grupo no existe en el sistema.",
        });
      }
    }

    for (const grupo of gruposEncontrados) {
      const nombre = grupo.GRUPO?.nombre || `ID ${grupo.id_grupo_periodo}`;
      if (grupo.id_docente) {
        omitidos.push({
          nombre,
          motivo: "Este grupo ya tiene un docente asignado.",
        });
      } else {
        asignados.push(grupo.id_grupo_periodo);
      }
    }

    // Asignar los válidos
    if (asignados.length > 0) {
      await GrupoPeriodo.update(
        { id_docente },
        {
          where: { id_grupo_periodo: asignados },
          transaction,
        }
      );
    }

    await transaction.commit();

    const omitidosAgrupados = omitidos.reduce((acc, curr) => {
      const grupoExistente = acc.find((item) => item.motivo === curr.motivo);
      if (grupoExistente) {
        grupoExistente.grupos.push(curr.nombre);
      } else {
        acc.push({ motivo: curr.motivo, grupos: [curr.nombre] });
      }
      return acc;
    }, []);

    return {
      success: true,
      mensaje: asignados.length
        ? "Grupos asignados al docente correctamente."
        : "No se asignaron nuevos grupos.",
      registrados: asignados,
      omitidos: omitidosAgrupados,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error al asignar grupos a docente: ${error.message}`);
  }
}

async function consultarDocentesConSusGrupos(id_docente, periodo) {
  try {
    const whereDocente = id_docente ? { id_docente } : {};
    const whereGrupoPeriodo = periodo
      ? { periodo }
      : { periodo: obtenerPeriodoActual() };
    const docentes = await Docente.findAll({
      where: whereDocente,
      include: [
        {
          model: Usuario,
          attributes: ["identificacion", "nombres", "apellidos", "correo"],
        },
        {
          model: GrupoPeriodo,
          where: whereGrupoPeriodo,
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

    if (id_docente && docentes.length === 0) {
      return {
        success: false,
        mensaje: "El docente no está registrado",
        data: null,
      };
    }

    const data = formatearDocentesConAsignaturasYGrupos(docentes);

    return {
      success: true,
      mensaje: id_docente
        ? "Detalle del docente con sus grupos y asignaturas."
        : "Lista de docentes con sus grupos y asignaturas.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      mensaje: "Error al obtener docentes con grupos.",
      error: error.message,
    };
  }
}

module.exports = {
  asignarGruposADocente,
  consultarDocentesConSusGrupos,
};
