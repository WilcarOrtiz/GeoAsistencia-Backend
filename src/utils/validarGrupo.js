function validarGrupo({ nombre, codigo, id_asignatura, estado_asistencia, id_docente }) {
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

  if (typeof estado_asistencia !== "boolean" || !estado_asistencia) {
    errores.push("El estado de asistencia debe ser un valor booleano (true o false).");
  }

  if (id_docente !== undefined && id_docente !== null && id_docente !== "") {
    if (typeof id_docente !== "number" || id_docente <= 0) {
      errores.push("El ID del docente debe ser un número válido mayor a 0.");
    }
  }

  return errores;
}

module.exports = validarGrupo;
