const { Grupo, Asignatura, Docente, GrupoHorario, Horario, Estudiante, EstudianteGrupo, Usuario, Historial, Asistencia, GrupoPeriodo } = require("../models");
const { validarExistencia, validarEstadoActivo } = require("../utils/validaciones/validarExistenciaModelo");
const asociarHorariosAGrupo = require("../utils/helpers/asociarHorarios");
const validarGrupo = require("../utils/validaciones/validarGrupo");
const { Sequelize, Op } = require("sequelize");
const { obtenerSemestreActual } = require("../utils/helpers/obtenerSemestreActual");

async function crearGrupo(datos) {
  const { id_asignatura, id_docente, codigo, horarios } = datos;
  const semestreActual = obtenerSemestreActual();

  const asignatura = await validarExistencia(Asignatura, id_asignatura, "La asignatura");
  await validarEstadoActivo(asignatura, "La asignatura");
  
  const existente = await Grupo.findOne({ where: { codigo } });
  if (existente) throw new Error("El grupo ya está registrado.");

  const grupoCreado = await Grupo.create({nombre: datos.nombre, codigo: datos.codigo, id_asignatura: id_asignatura, estado_asistencia: datos.estado_asistencia || true});

  if (id_docente) {
    const docente = await validarExistencia(Docente, id_docente, "El docente");
    await validarEstadoActivo(docente, "El docente");
  }

  await GrupoPeriodo.create({periodo: semestreActual, id_docente: id_docente || null, id_grupo: grupoCreado.id_grupo});

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
      const semestreActual = obtenerSemestreActual();
      const asignado = await GrupoPeriodo.findOne({where: {periodo: semestreActual, id_grupo: grupo.id_grupo}});
      if (asignado) {
        asignado.update({id_docente: id_docente});
      } else {
        GrupoPeriodo.create({id_docente: id_docente, id_grupo: id_grupo, periodo: semestreActual});
      }
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

  const semestreActual = obtenerSemestreActual();

  const grupo = await GrupoPeriodo.findOne({
    where: { id_grupo, semestreActual }
  });

  if (!grupo) {
    throw new Error(`No existe relación para el grupo en el periodo ${periodo}`);
  }

  await EstudianteGrupo.destroy({where: {id_grupo_periodo: grupo.id_grupo_periodo, id_estudiante }});
  return {
      success: true,
      mensaje: "Estudiante eliminado del grupo correctamente.",
  };
}

async function trasladarEstudianteDeGrupo(id_grupo, id_estudiante, id_nuevo_grupo, semestre = null) {
  const grupoActual = await validarExistencia(Grupo, id_grupo, "El grupo");
  const nuevoGrupo = await validarExistencia(Grupo, id_nuevo_grupo, "El grupo para trasladar");
  await validarExistencia(Estudiante, id_estudiante, "El estudiante");

  if (grupoActual.id_asignatura !== nuevoGrupo.id_asignatura) {
    throw new Error("El nuevo grupo debe pertenecer a la misma asignatura.");
  }

  const periodo = semestre || obtenerSemestreActual();

  const grupoPeriodoActual = await GrupoPeriodo.findOne({ where: { id_grupo: id_grupo, periodo: periodo } });
  const grupoPeriodoNuevo = await GrupoPeriodo.findOne({ where: { id_grupo: id_nuevo_grupo, periodo: periodo } });

  if (!grupoPeriodoActual) throw new Error(`No existe relación del grupo actual para el semestre ${periodo}`);
  if (!grupoPeriodoNuevo) throw new Error(`No existe relación del nuevo grupo para el semestre ${periodo}`);

  const existeOtroGrupo = await EstudianteGrupo.findOne({
    where: {
      id_estudiante,
      id_grupo_periodo: { [Op.ne]: grupoPeriodoActual.id_grupo_periodo }
    },
    include: {
      model: GrupoPeriodo,
      where: { periodo: semestre },
      include: { model: Grupo, where: { id_asignatura: grupoActual.id_asignatura } }
    }
  });

  if (existeOtroGrupo) {
    throw new Error("El estudiante ya pertenece a otro grupo de esta asignatura en el mismo periodo.");
  }

  if (periodo === null) {
      await EstudianteGrupo.destroy({ where: { id_estudiante, id_grupo_periodo: grupoPeriodoActual.id_grupo_periodo }
    });
  }

  await EstudianteGrupo.create({
    id_grupo_periodo: grupoPeriodoNuevo.id_grupo_periodo,
    id_estudiante
  });

  return {
    success: true,
    mensaje: `Estudiante trasladado al nuevo grupo correctamente para el semestre ${semestre}.`,
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

  const semestre = obtenerSemestreActual();

  const grupos = await Grupo.findAll({
    where: { id_asignatura },
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "ESTUDIANTE_GRUPO" eg
            INNER JOIN "GRUPO_PERIODO" gp ON gp.id_grupo_periodo = eg.id_grupo_periodo
            WHERE gp.id_grupo = "GRUPO".id_grupo
              AND gp.id_docente = '${id_docente}'
              AND gp.periodo = '${semestre}'
          )`),
          "cantidad_estudiantes"
        ]
      ]
    },
    include: [
      {
        model: GrupoPeriodo,
        where: { id_docente, periodo: semestre },
        attributes: []
      },
      {
        model: Horario,
        as: "horarios",
        attributes: ["id_dia", "hora_inicio", "hora_fin"],
        through: { attributes: [] }
      }
    ],
    group: ["GRUPO.id_grupo", "horarios.id_horario"],
    subQuery: false
  });

  return {
    success: true,
    mensaje: `Grupos del docente para el semestre ${semestre} consultados correctamente.`,
    grupos: grupos
  };
}

async function consultarGruposPorAsignatura(id_asignatura, semestre = null) {
  await validarExistencia(Asignatura, id_asignatura, "La asignatura");

  const whereGrupoPeriodo = semestre ? { semestre } : {}; 

  const grupos = await Grupo.findAll({
    where: { id_asignatura },
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM "ESTUDIANTE_GRUPO" eg
            INNER JOIN "GRUPO_PERIODO" gp ON gp.id_grupo_periodo = eg.id_grupo_periodo
            WHERE gp.id_grupo = "GRUPO".id_grupo
            ${periodo ? `AND gp.periodo = '${semestre}'` : ""}
          )`),
          "cantidad_estudiantes"
        ]
      ]
    },
    include: [
      {
        model: GrupoPeriodo,
        where: whereGrupoPeriodo,
        attributes: ["periodo"], 
        required: false 
      }
    ],
    group: ["GRUPO.id_grupo", "GRUPO_PERIODO.id_grupo_periodo"],
    subQuery: false
  });

  return {
    success: true,
    mensaje: semestre
      ? `Grupos consultados correctamente para el semestre ${semestre}.` 
      : "Grupos consultados correctamente (todos los semestres).",
    grupos: grupos
  };
}

async function consultarGruposPorEstudiante(id_asignatura, id_estudiante) {
  await validarExistencia(Asignatura, id_asignatura, "La asignatura");
  await validarExistencia(Estudiante, id_estudiante, "El estudiante");

  const semestreActual = obtenerSemestreActual();
  const whereGrupoPeriodo =  { semestreActual };

  const grupos = await Grupo.findAll({
    where: { id_asignatura },
    include: [
      {
        model: GrupoPeriodo,
        where: whereGrupoPeriodo,
        required: true,
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
            }
          }
        ]
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
      id_docente: grupo.GRUPO_PERIODOs?.[0]?.DOCENTE?.id_docente || null,
      nombre: grupo.GRUPO_PERIODOs?.[0]?.DOCENTE?.USUARIO?.nombres || null,
      apellido: grupo.GRUPO_PERIODOs?.[0]?.DOCENTE?.USUARIO?.apellidos || null,
    },
    periodo: grupo.GRUPO_PERIODOs?.[0]?.periodo || null,
    horarios: grupo.horarios,
  }));

  return {
    success: true,
    mensaje: periodo 
      ? `Grupos del estudiante para el semestre ${periodo} consultados correctamente.` 
      : "Grupos del estudiante consultados correctamente (todos los semestres).",
    grupos: resultado,
  };
}

async function consultarEstudiantesPorId(id_grupo, semestre = null) {
  await validarExistencia(Grupo, id_grupo, "El grupo");

  const whereGrupoPeriodo = semestre ? { id_grupo, semestre } : { id_grupo };

  const grupo = await Grupo.findOne({
    where: { id_grupo },
    include: [
      {
        model: GrupoPeriodo,
        where: whereGrupoPeriodo,
        required: true,
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
          }
        ]
      }
    ]
  });

  if (!grupo) {
    throw new Error("No hay estudiantes para este grupo o semestre especificado.");
  }

  const estudiantes = grupo.GRUPO_PERIODOs.flatMap(gp =>
    gp.ESTUDIANTEs.map(est => ({
      id_estudiante: est.id_estudiante,
      estado: est.estado,
      identificacion: est.USUARIO?.identificacion,
      nombres: est.USUARIO?.nombres,
      apellidos: est.USUARIO?.apellidos,
      correo: est.USUARIO?.correo,
      periodo: gp.periodo
    }))
  );

  return {
    success: true,
    mensaje: periodo
      ? `Estudiantes del grupo ${id_grupo} en el semestre ${periodo} consultados correctamente.`
      : `Estudiantes del grupo ${id_grupo} consultados correctamente.`,
    estudiantes: estudiantes
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

async function cancelarLlamadoLista(id_grupo) {
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

  await historial.destroy();
  const id_historial_asistencia = historial.id_historial_asistencia;

  const asistenciasRegistradas = await Asistencia.findAll({
    where: { id_historial_asistencia },
  });

  await asistenciasRegistradas.map(a => { a.destroy(); });

  return {
    success: true,
    mensaje: "Llamado de lista cancelado."
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
    detenerLlamadoLista,
    cancelarLlamadoLista
}