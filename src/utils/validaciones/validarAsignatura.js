function validarAsignatura({ nombre, codigo, estado }) {
  const errores = [];

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    errores.push("El nombre debe ser una cadena de string no vacía.");
  }

  if (!codigo || typeof codigo !== "string" || codigo.trim() === "") {
    errores.push("El codigo debe ser una cadena de string no vacía.");
  }

  if (typeof estado !== "boolean" || !estado) {
    errores.push("El estado debe ser verdadero o falso (Tipo booleano).");
  }

  return errores;
}

module.exports = validarAsignatura;
