// utils/modeloPorRol.js
const { Docente, Estudiante } = require("../../models");

function obtenerModeloPorRol(rolNombre) {
  const modelos = {
    DOCENTE: Docente,
    ESTUDIANTE: Estudiante,
  };

  const modelo = modelos[rolNombre];
  if (!modelo) {
    throw new Error("Rol sin modelo asociado.");
  }

  return modelo;
}

module.exports = { obtenerModeloPorRol };
