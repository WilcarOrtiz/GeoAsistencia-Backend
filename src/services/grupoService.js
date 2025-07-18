const { Grupo, Asignatura, Docente, GrupoHorario, Horario, Estudiante, EstudianteGrupo, Usuario } = require("../models");
const { validarExistencia, validarEstadoActivo } = require("../utils/validaciones/validarExistenciaModelo");
const asociarHorariosAGrupo = require("../utils/helpers/asociarHorarios");
const { Sequelize, Op } = require("sequelize");

async function crearGrupo(datos) {
    const { id_asignatura, id_docente, codigo, horarios } = datos;

    const asignatura = await validarExistencia(Asignatura, id_asignatura, "La asignatura");
    await validarEstadoActivo(asignatura, "La asignatura");

    if (id_docente) {
        const docente = await validarExistencia(Docente, id_docente, "El docente");
        await validarEstadoActivo(docente, "El docente");
    }

    const existente = await Grupo.findOne({ where: { codigo } });
    if (existente) throw new Error("El grupo ya está registrado.");

    const grupoCreado = await Grupo.create(datos);

    await asociarHorariosAGrupo(grupoCreado.id_grupo, horarios);

    return {
        success: true,
        mensaje: "Grupo registrado correctamente.",
        grupo: grupoCreado,
    };
}

async function editarGrupo(id_grupo, datos) {
    const { id_asignatura, id_docente, codigo, horarios } = datos;

    const grupo = await validarExistencia(Grupo, id_grupo, "El grupo");
    
    const asignatura = await validarExistencia(Asignatura, id_asignatura, "La asignatura");
    await validarEstadoActivo(asignatura, "La asignatura");
    
    if (id_docente) {
        const docente = await validarExistencia(Docente, id_docente, "El docente");
        await validarEstadoActivo(docente, "El docente");
    }

    if (codigo !== grupo.codigo) {
        const codigoExistente = await Grupo.findOne({ where: { codigo } });
        if (codigoExistente) throw new Error("Ya existe otro grupo con este código.");
    }

    const grupoEditado = await grupo.update(datos);

    await GrupoHorario.destroy({ where: { id_grupo } });

    await asociarHorariosAGrupo(id_grupo, horarios);

    return {
        success: true,
        mensaje: "Grupo editado correctamente.",
        grupo: grupoEditado,
    };
}

async function eliminarGrupo(id_grupo) {
    const grupo = await validarExistencia(Grupo, id_grupo, "El grupo");
    await grupo.destroy();

    return {
        success: true,
        mensaje: "Grupo eliminado correctamente.",
    };
}
    

async function eliminarEstudianteDeGrupo(id_grupo, id_estudiante) {
    await validarExistencia(Grupo, id_grupo, "El grupo");
    await validarExistencia(Estudiante, id_estudiante, "El estudiante");

    await EstudianteGrupo.destroy({where: {id_grupo, id_estudiante}});
    return {
        success: true,
        mensaje: "Estudiante eliminado del grupo correctamente.",
    };
}

async function trasladarEstudianteDeGrupo(id_grupo, id_estudiante, id_nuevo_grupo) {
    const grupoActual = await validarExistencia(Grupo, id_grupo, "El grupo");
    const nuevoGrupo = await validarExistencia(Grupo, id_nuevo_grupo, "El grupo para trasladar");
    await validarExistencia(Estudiante, id_estudiante, "El estudiante");

    if (grupoActual.id_asignatura !== nuevoGrupo.id_asignatura) {
        throw new Error("El nuevo grupo debe pertenecer a la misma asignatura.");
    }

    const gruposAsignatura = await Grupo.findAll({
        where: {
            id_asignatura: grupoActual.id_asignatura,
            id_grupo: { [Op.ne]: id_grupo },
        },
        include: {
            model: Estudiante,
            where: { id_estudiante },
            through: { attributes: [] }
        }
    });

    if (gruposAsignatura.length > 0) {
        throw new Error("El estudiante ya pertenece a otro grupo de esta asignatura.");
    }

    await EstudianteGrupo.destroy({ where: { id_grupo, id_estudiante } });
    await EstudianteGrupo.create({
        id_grupo: id_nuevo_grupo,
        id_estudiante: id_estudiante
    });

    return {
        success: true,
        mensaje: "Estudiante trasladado al nuevo grupo correctamente.",
    };
}

async function consultarGrupoPorId(id_grupo) {
    await validarExistencia(Grupo, id_grupo, "El grupo");

    const grupo = await Grupo.findByPk(id_grupo, {
        include: [
        {
            model: Horario,
            as: "horarios",
            through: { attributes: [] },
            attributes: ["hora_inicio", "hora_fin", "id_dia"],
        },
        ],
    });

    return {
        success: true,
        mensaje: "Grupo consultado correctamente.",
        grupo: grupo,
    };
}

async function consultarGruposPorDocente(id_asignatura, id_docente) {
    await validarExistencia(Asignatura, id_asignatura, "La asignatura");
    await validarExistencia(Docente, id_docente, "El docente");
    
    const grupos = await Grupo.findAll({
    where: { id_asignatura, id_docente },
    attributes: {
        include: [
            [Sequelize.fn("COUNT", Sequelize.col("ESTUDIANTEs.id_estudiante")), "cantidad_estudiantes"],
        ],
        },
        include: [
        {
            model: Estudiante,
            attributes: [],
            through: { attributes: [] },
        },
        {
            model: Horario,
            as: "horarios",
            attributes: ["id_dia", "hora_inicio", "hora_fin"],
            through: { attributes: [] },
        },
        ],
        group: ["GRUPO.id_grupo", "horarios.id_horario"],
        subQuery: false,
    });

    return {
        success: true,
        mensaje: "Grupos consultados correctamente.",
        grupos: grupos,
    };
}

async function consultarGruposPorAsignatura(id_asignatura) {
    await validarExistencia(Asignatura, id_asignatura, "La asignatura");

    const grupos = await Grupo.findAll({
        where: { id_asignatura },
        attributes: {
        include: [
            [Sequelize.fn("COUNT", Sequelize.col("ESTUDIANTEs.id_estudiante")), "cantidad_estudiantes"],
        ],
        },
        include: [
        {
            model: Estudiante,
            attributes: [],
            through: { attributes: [] },
        },
        ],
        group: ["GRUPO.id_grupo"],
        subQuery: false,
    });

    return {
        success: true,
        mensaje: "Grupos consultados correctamente.",
        grupos: grupos,
    };
}

async function consultarGruposPorEstudiante(id_asignatura, id_estudiante) {
  try {
    await validarExistencia(Asignatura, id_asignatura, "La asignatura");
    await validarExistencia(Estudiante, id_estudiante, "El estudiante");

    const grupos = await Grupo.findAll({
      where: { id_asignatura },
      include: [
        {
          model: Estudiante,
          where: { id_estudiante },
          attributes: [], 
          through: { attributes: [] },
        },
        {
          model: Docente,
          attributes: ["id_docente"],
          include: {
            model: Usuario,
            attributes: ["nombres", "apellidos"],
          },
        },
        {
          model: Horario,
          as: "horarios",
          attributes: ["id_dia", "hora_inicio", "hora_fin"],
          through: { attributes: [] },
        },
      ],
    });

    const resultado = grupos.map((grupo) => ({
      id_grupo: grupo.id_grupo,
      nombre: grupo.nombre,
      codigo: grupo.codigo,
      docente: {
        id_docente: grupo.DOCENTE?.id_docente,
        nombre: grupo.DOCENTE?.USUARIO?.nombres,
        apellido: grupo.DOCENTE?.USUARIO?.apellidos,
      },
      horarios: grupo.horarios,
    }));

    return {
      success: true,
      mensaje: "Grupos consultados correctamente.",
      grupos: resultado,
    };
  } catch (error) {
    return {
      success: false,
      mensaje: "Error interno del servidor.",
      error: error.message,
    };
  }
}


async function consultarEstudiantesPorId(id_grupo) {
    await validarExistencia(Grupo,id_grupo, "El grupo");

    const estudiantes = await Grupo.findByPk(id_grupo,{
        include: [
                {
                    model: Estudiante,
                    attributes: ["estado"], 
                    through: { attributes: [] },
                    include: [
                        {
                        model: Usuario,
                        attributes: ["identificacion", "nombres", "apellidos", "correo"], 
                        }
                    ]
                },
            ],
            group: ["GRUPO.id_grupo", "ESTUDIANTEs.id_estudiante", "ESTUDIANTEs->USUARIO.id_usuario"],
            subQuery: false,
        });

    return {
        success: true,
        mensaje: "Estudiantes consultados correctamente.",
        estudiantes: estudiantes,
    };
}

module.exports = {
    crearGrupo,
    editarGrupo,
    eliminarGrupo,
    eliminarEstudianteDeGrupo,
    trasladarEstudianteDeGrupo,
    consultarGrupoPorId,
    consultarGruposPorDocente,
    consultarGruposPorAsignatura,
    consultarGruposPorEstudiante,
    consultarEstudiantesPorId    
}