function validarGrupo({ nombre, codigo, id_asignatura, estado_asistencia, id_docente, horarios }) {
  const errores = [];

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    errores.push("El nombre debe ser una cadena de texto no vacía.");
  }

  if (!codigo || typeof codigo !== "string" || codigo.trim() === "") {
    errores.push("El código debe ser una cadena de texto no vacía.");
  }

  if (typeof id_asignatura !== "number" || !id_asignatura || id_asignatura <= 0) {
    errores.push("El ID de la asignatura debe ser un número válido mayor a 0.");
  }

  if (typeof estado_asistencia !== "boolean") {
    errores.push("El estado de asistencia debe ser un valor booleano (true o false).");
  }

  if (id_docente !== undefined && id_docente !== null && id_docente !== "") {
    if (typeof id_docente !== "string") {
      errores.push("El ID del docente debe ser una cadena de texto no vacía.");
    }
  }
  
  if (horarios !== undefined && horarios !== null && horarios != []) {
    for (const horario of horarios) {
      if (!horario.id_dia || !horario.hora_inicio || !horario.hora_fin) {
        errores.push("Cada horario debe tener 'dia', 'hora_inicio' y 'hora_fin'.");
      }
    }
  }

  return errores;
}

module.exports = validarGrupo;
