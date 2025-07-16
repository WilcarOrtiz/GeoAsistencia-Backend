const { Grupo, Asignatura, Docente, GrupoHorario, Horario, Estudiante } = require("../models");
const { Sequelize } = require("sequelize");

async function crearGrupo(datos) {
    try {
        const { id_asignatura, id_docente, codigo, horarios } = datos;

        const asignatura = await Asignatura.findByPk(id_asignatura);
        if (!asignatura) {
            throw new Error("La asignatura no está registrada.");
        } else {
            if (!asignatura.estado) {
                throw new Error("La asignatura no está activa.");
            }
        }

        if (id_docente) {
            const docente = await Docente.findByPk(id_docente);
            if (!docente) {
                throw new Error("El docente no está registrado.");
            } else {
                if (!docente.estado) {
                    throw new Error("El docente no está activo.");
                }
            }
        }

        const existente = await Grupo.findOne({ where: { codigo } });
        if (existente) {
            throw new Error("El grupo ya está registrado.");
        }

        const grupoCreado = await Grupo.create(datos);

        if (Array.isArray(horarios) && horarios.length > 0) {
            for (const horario of horarios) {
                let horarioExistente = await Horario.findOne({
                where: {
                    id_dia: horario.id_dia,
                    hora_inicio: horario.hora_inicio,
                    hora_fin: horario.hora_fin,
                },
                });

                if (!horarioExistente) {
                    horarioExistente = await Horario.create(horario);
                }

                await GrupoHorario.create({
                    id_grupo: grupoCreado.id_grupo,
                    id_horario: horarioExistente.id_horario,
                });
            }
        }

        return {
            success: true,
            mensaje: "Grupo registrado correctamente.",
            grupo: grupoCreado,
        };
    } catch (error) {
        throw new Error(`Error al crear el grupo: ${error.message}`);
    }
}

async function editarGrupo(id_grupo, datos) {
    try {
        const { id_asignatura, id_docente, codigo, horarios } = datos;

        const grupoExistente = await Grupo.findByPk(id_grupo);
        if (!grupoExistente) {
            throw new Error("El grupo no está registrado.");
        }

        const asignatura = await Asignatura.findByPk(id_asignatura);
        if (!asignatura) {
            throw new Error("La asignatura no está registrada.");
        } else {
            if (!asignatura.estado) {
                throw new Error("La asignatura no está activa.");
            }
        }

        if (id_docente) {
            const docente = await Docente.findByPk(id_docente);
            if (!docente) {
                throw new Error("El docente no está registrado.");
            } else {
                if (!docente.estado) {
                    throw new Error("El docente no está activo.");
                }
            }
        }

        if (codigo !== grupoExistente.codigo) {
            const codigoExistente = await Grupo.findOne({ where: { codigo } });
            if (codigoExistente) {
                throw new Error("Ya existe otro grupo con este código.");
            }
        }
        const grupoEditado = await grupoExistente.update(datos);

        if (Array.isArray(horarios) && horarios.length > 0) {
            await GrupoHorario.destroy({ where: { id_grupo } });
            for (const horario of horarios) {
                let horarioExistente = await Horario.findOne({
                where: {
                    id_dia: horario.id_dia,
                    hora_inicio: horario.hora_inicio,
                    hora_fin: horario.hora_fin,
                },
                });

                if (!horarioExistente) {
                    horarioExistente = await Horario.create(horario);
                }

                await GrupoHorario.create({
                    id_grupo: grupoEditado.id_grupo,
                    id_horario: horarioExistente.id_horario,
                });
            }
        }

        return {
            success: true,
            mensaje: "Grupo editado correctamente.",
            grupo: grupoEditado,
        };
    } catch (error) {
        throw new Error(`Error al editar el grupo: ${error.message}`);
    }
}

async function eliminarGrupo(id_grupo) {
    try {
        const grupoExistente = await Grupo.findByPk(id_grupo);
        if (!grupoExistente) {
            throw new Error("El grupo no está registrado.");
        } else {
            await grupoExistente.destroy();
            return {
                success: true,
                mensaje: "Grupo eliminado correctamente."
            };
        }
    } catch (error) {
        throw new Error(`Error al eliminar el grupo: ${error.message}`);
    }
}

async function consultarGrupoPorId(id_grupo) {
    try {
        const grupoExistente = await Grupo.findByPk(id_grupo);
        if (!grupoExistente) {
            throw new Error("El grupo no está registrado.");
        } 
        const grupoConsultado = await Grupo.findByPk(id_grupo, {
            include: [
                {
                    model: Horario,
                    as: "horarios",
                    through: { attributes: [] }, 
                    attributes: ["hora_inicio", "hora_fin", "id_dia"]
                }
            ]
        });


        return {
            success: true,
            mensaje: "Grupo consultado correctamente.",
            grupo: grupoConsultado
        };
    } catch (error) {
        throw new Error(`Error al consultar el grupo: ${error.message}`);
    }
}


async function consultarGruposPorDocente(id_asignatura, id_docente) {
  try {
    const asignaturaExistente = await Asignatura.findByPk(id_asignatura);
    if (!asignaturaExistente) {
        throw new Error("La asignatura no está registrada.");
    }

    const docenteExistente = await Docente.findByPk(id_docente);
    if (!docenteExistente) {
        throw new Error("El docente no está registrado.");
    }

    const grupos = await Grupo.findAll({
      where: {
        id_asignatura,
        id_docente
      },
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('ESTUDIANTEs.id_estudiante')), 'cantidad_estudiantes']
        ]
      },
      include: [
        {
          model: Estudiante,
          attributes: [],
          through: { attributes: [] }
        }
      ],
      group: ['GRUPO.id_grupo'],
      subQuery: false
    });

    return {
      success: true,
      mensaje: "Grupos consultados correctamente.",
      grupos
    };

  } catch (error) {
    throw new Error(`Error al consultar los grupos: ${error.message}`);
  }
}

async function consultarGruposPorAsignatura(id_asignatura) {
  try {
    const asignaturaExistente = await Asignatura.findByPk(id_asignatura);
    if (!asignaturaExistente) {
        throw new Error("La asignatura no está registrada.");
    }

    const grupos = await Grupo.findAll({
      where: { id_asignatura },
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('ESTUDIANTEs.id_estudiante')), 'cantidad_estudiantes']
        ]
      },
      include: [
        {
          model: Estudiante,
          attributes: [],
          through: { attributes: [] }
        }
      ],
      group: ['GRUPO.id_grupo'],
      subQuery: false
    });

    return {
      success: true,
      mensaje: "Grupos consultados correctamente.",
      grupos
    };

  } catch (error) {
    throw new Error(`Error al consultar los grupos: ${error.message}`);
  }
}

module.exports = {
    crearGrupo,
    editarGrupo,
    eliminarGrupo,
    consultarGrupoPorId,
    consultarGruposPorDocente,
    consultarGruposPorAsignatura
}