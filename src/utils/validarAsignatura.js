function validarAsignatura({ nombre, codigo, estado}) {
  const errores = [];

  if (!nombre || nombre.trim() === "") {
    errores.push("El nombre no puede estar vacío.");
  }

  if (!codigo || codigo.trim() === "") {
    errores.push("El código no puede estar vacío.");
  }

  if (typeof estado !== "boolean") {
    errores.push("El estado debe ser verdadero o falso (Tipo booleano).");
  }

  return errores;
}

module.exports = validarAsignatura;
