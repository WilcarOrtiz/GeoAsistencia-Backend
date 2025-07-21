const { Grupo, Asignatura, Docente, GrupoHorario, Horario, Estudiante, EstudianteGrupo, Usuario, Historial, Asistencia } = require("../models");
const { validarExistencia, validarEstadoActivo } = require("../utils/validaciones/validarExistenciaModelo");
const asociarHorariosAGrupo = require("../utils/helpers/asociarHorarios");
const { Sequelize, Op } = require("sequelize");
const validarGrupo = require("../utils/validaciones/validarGrupo");
const { Timestamp } = require("firebase-admin/firestore");

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

async function iniciarLlamadoLista(id_grupo, tema) {
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

    const fechaActual = new Date();

    const horarioValido = grupo.horarios.some(horario => validarGrupo(horario, fechaActual));

    if (!horarioValido) {
        throw new Error("No se puede iniciar el llamado fuera del horario del grupo.");
    }

    grupo.update({estado_asistencia: true});

    const historialCreado = await Historial.create({fecha: fechaActual, tema: tema, id_grupo: id_grupo});
    return {
        success: true,
        mensaje: "Iniciado llamado a lista correctamente.",
        historial: historialCreado,
    };
}

async function detenerLlamadoLista(id_grupo) {
  const grupoExistente = await validarExistencia(Grupo, id_grupo, "El grupo");

  await grupoExistente.update({ estado_asistencia: false });

  const historial = await Historial.findOne({
    where: {
      id_grupo,
      fecha: new Date().toISOString().split('T')[0], 
    },
  });

  if (!historial) {
    throw new Error("No se encontró un historial de asistencia para este grupo en esta fecha.");
  }

  const id_historial_asistencia = historial.id_historial_asistencia;

  const estudiantesGrupo = await Estudiante.findAll({
    include: {
      model: Grupo,
      where: { id_grupo },
    },
  });

  const asistenciasRegistradas = await Asistencia.findAll({
    where: { id_historial_asistencia },
  });

  const idsAsistentes = asistenciasRegistradas.map(a => a.id_estudiante);

  const estudiantesNoAsistieron = estudiantesGrupo.filter(est => !idsAsistentes.includes(est.id_estudiante));

  const fechaActual = new Date();
  const hora = fechaActual.toTimeString().slice(0, 5);
  const registroFaltas = estudiantesNoAsistieron.map(est => ({
    id_estudiante: est.id_estudiante,
    hora: hora,
    id_historial_asistencia: id_historial_asistencia,
    estado: false,
  }));

  await Asistencia.bulkCreate(registroFaltas);

  return {
    success: true,
    mensaje: "Llamado de lista finalizado. Registros completados."
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
    consultarEstudiantesPorId,
    iniciarLlamadoLista,
    detenerLlamadoLista
}