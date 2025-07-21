function validarHorario(horario, fecha) {
  const diaActual = fecha.getDay() === 0 ? 7 : fecha.getDay();
  if (horario.id_dia !== diaActual) return false;
  const horaActual = fecha.toTimeString().slice(0, 5);
  return horaActual >= horario.hora_inicio && horaActual <= horario.hora_fin;
}

module.exports =  validarHorario;