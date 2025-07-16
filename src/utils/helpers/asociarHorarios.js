const { Horario, GrupoHorario } = require("../../models");

async function asociarHorariosAGrupo(id_grupo, horarios) {
  if (!Array.isArray(horarios) || horarios.length === 0) return;

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
      id_grupo,
      id_horario: horarioExistente.id_horario,
    });
  }
}

module.exports = asociarHorariosAGrupo;
