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

async function buscarRolPorNombre(nombreRol) {
  const rol = await Rol.findOne({
    where: { nombre: nombreRol.toUpperCase() },
  });
  return rol; // Devuelve el objeto Rol o null si no existe
}

async function encontrarRegistroEnModelo(Model, id) {
  const record = await Model.findByPk(id);
  return record || null; // Retorna null si no existe
}

module.exports = {
  obtenerModeloPorRol,
  buscarRolPorNombre,
  encontrarRegistroEnModelo,
};
