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
    throw new Error("no está definido un modelo para el rol proporcionado.");
  }

  return modelo;
}

async function buscarRegistroPorCondicion(
  Model,
  where,
  nombreModelo = "Registro"
) {
  const registro = await Model.findOne({ where });

  if (!registro) {
    throw new Error(
      `${nombreModelo} no está con la condición: ${JSON.stringify(where)}.`
    );
  }

  return registro;
}

async function encontrarRegistroEnModelo(
  Model,
  id,
  nombreModelo = "El registro"
) {
  const record = await Model.findByPk(id);
  if (!record) {
    throw new Error(`${nombreModelo} con ID ${id} no está.`);
  }
  return record;
}

module.exports = {
  obtenerModeloPorRol,
  buscarRegistroPorCondicion,
  encontrarRegistroEnModelo,
};
