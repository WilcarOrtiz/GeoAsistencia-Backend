const { Usuario, Docente, Grupo, Asignatura } = require("../models");
const sequelize = require("../database/supabase/db");
const { encontrarRegistroEnModelo } = require("../utils/helpers/userHelper");
const {
  formatearUsuariosConAsignaturasYGrupos,
} = require("../utils/helpers/formatearUsuarioConAsignaturasYGrupos");

async function docentesActivos() {
  try {
    const docentes_Activos = await Usuario.findAll({
      include: [
        {
          model: Docente,
          where: { estado: true },
          required: true,
        },
      ],
    });

    return {
      mensaje: "Docentes activos",
      docentes: docentes_Activos,
    };
  } catch (error) {
    throw new Error(
      `Error al consultar docentes activos en el sistema: ${error.message}`
    );
  }
}

async function asignarGruposADocente(id_docente, grupos) {
  const transaction = await sequelize.transaction();
  try {
    if (!(await encontrarRegistroEnModelo(Docente, id_docente))) {
      throw new Error("El docente no existe.");
    }

    // 1. Validar existencia de los grupos enviados
    const gruposEncontrados = await Grupo.findAll({
      where: { id_grupo: grupos },
      attributes: ["id_grupo", "id_docente"],
    });

    if (!gruposEncontrados.length) {
      throw new Error("Ninguno de los grupos enviados existe.");
    }

    const asignados = [];
    const omitidos = [];

    // 2. Validar que el grupo no tenga ya un docente
    for (const g of gruposEncontrados) {
      if (g.id_docente) {
        omitidos.push({
          id_grupo: g.id_grupo,
          motivo: "Este grupo ya tiene un docente asignado.",
        });
        continue;
      }
      asignados.push(g.id_grupo);
    }

    // 4. Asignar docente en los grupos válidos
    if (asignados.length > 0) {
      await Grupo.update(
        { id_docente },
        {
          where: { id_grupo: asignados },
          transaction,
        }
      );
    }

    await transaction.commit();

    return {
      success: true,
      mensaje: asignados.length
        ? "Grupos asignados al docente correctamente."
        : "No se asignaron nuevos grupos.",
      registrados: asignados,
      omitidos,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error al asignar grupos a docente: ${error.message}`);
  }
}

async function consultarDocentesConSusGrupos(id_docente) {
  try {
    const whereCondition = id_docente ? { id_docente } : {};
    const docentes = await Docente.findAll({
      where: whereCondition,
      include: [
        {
          model: Usuario,
          attributes: ["identificacion", "nombres", "apellidos", "correo"],
        },
        {
          model: Grupo,
          attributes: ["id_grupo", "nombre"],
          include: [
            {
              model: Asignatura,
              attributes: ["id_asignatura", "nombre"],
            },
          ],
        },
      ],
    });

    if (id_docente && docentes.length === 0) {
      throw new Error("El docente no existe.");
    }

    const data = formatearUsuariosConAsignaturasYGrupos(docentes, "docente");

    return {
      success: true,
      mensaje: id_docente
        ? "Detalle del docente con grupos y asignaturas."
        : "Lista de docentes con sus grupos y asignaturas.",
      data,
    };
  } catch (error) {
    throw new Error(`Error al obtener docentes con grupos: ${error.message}`);
  }
}

module.exports = {
  docentesActivos,
  asignarGruposADocente,
  consultarDocentesConSusGrupos,
};
