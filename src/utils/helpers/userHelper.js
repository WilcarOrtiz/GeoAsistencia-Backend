// utils/modeloPorRol.js
const { Usuario, Docente, Estudiante, Rol } = require("../../models");
const { Op } = require("sequelize");

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

module.exports = {
  obtenerModeloPorRol,
};
