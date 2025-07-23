const { validarExistencia } = require("../utils/validaciones/validarExistenciaModelo");
const { Asignatura, Docente, Grupo} = require("../models");
const { Sequelize } = require("sequelize");

async function crearAsignatura(datos) {
  const { codigo } = datos;
  const asignaturaExistente = await Asignatura.findOne({ where: { codigo } });
  if (asignaturaExistente) {
    throw new Error("La asignatura ya está registrada.");
  }
  const asignaturaCreada = await Asignatura.create(datos);
  return {
    success: true,
    mensaje: "Asignatura registrada correctamente.",
    asignatura: asignaturaCreada,
  };
}

async function editarAsignatura(id_asignatura, datos) {
  const { codigo, nombre } = datos;

  const asignaturaExistente = await validarExistencia(Asignatura, id_asignatura, "La asignatura");

  if (asignaturaExistente.nombre !== nombre) {
      const nombreExistente = await Asignatura.findOne({where:{nombre}});
      if (nombreExistente) {
          throw new Error("Una asignatura ya está registrada con el nombre proporcionado.");
      }
  }
  if (asignaturaExistente.codigo !== codigo) {
      const codigoExistente = await Asignatura.findOne({where:{codigo}});
      if (codigoExistente) {
          throw new Error("Una asignatura ya está registrada con el codigo proporcionado.");
      }
  }
  await asignaturaExistente.update(datos);
  return {
      success: true,
      mensaje: "Asignatura editada correctamente.",
  };
}

async function habilitarAsignatura(id_asignatura, estado) {
  const asignaturaExistente = await validarExistencia(Asignatura, id_asignatura, "La asignatura");
  await asignaturaExistente.update({estado: estado});

  return {
      success: true,
      mensaje: estado ? "Asignatura habilitada correctamente." : "Asignatura deshabilitada correctamente.",
  };
}

async function consultarAsignaturas() {
  const asignaturas = await Asignatura.findAll({
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "GRUPO" AS "grupos" 
            WHERE "grupos"."id_asignatura" = "ASIGNATURA"."id_asignatura"
          )`),
          "cantidad_grupos"
        ]
      ]
    }
  });

  return {
    success: true,
    mensaje: "Asignaturas consultadas correctamente.",
    asignaturas: asignaturas,
  };
}

async function consultarAsignaturasActivas() {
  const asignaturas = await Asignatura.findAll({where: {estado: true}});

  return {
    success: true,
    mensaje: "Asignaturas consultadas correctamente.",
    asignaturas: asignaturas,
  };
}

async function consultarAsignaturasPorDocente(id_docente) {
  await validarExistencia(Docente, id_docente, "El docente");
  const asignaturas = await Asignatura.findAll({
    include: [
      {
        model: Grupo,
        where: { id_docente },
        attributes: [],
        required: true
      }
    ],
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "GRUPO" AS "grupos" 
            WHERE 
              "grupos"."id_asignatura" = "ASIGNATURA"."id_asignatura"
              AND "grupos"."id_docente" = '${id_docente}'
          )`),
          "cantidad_grupos"
        ]
      ]
    },
    group: ["ASIGNATURA.id_asignatura"]
  });


  return {
    success: true,
    mensaje: "Asignaturas consultadas correctamente.",
    asignaturas: asignaturas,
  };
}

async function consultarAsignaturaPorId(id_asignatura) {
  const asignaturaExistente = await validarExistencia(Asignatura, id_asignatura, "La asignatura");

  return {
    success: true,
    mensaje: "Asignatura consultada correctamente.",
    asignatura: asignaturaExistente,
  };
}

async function crearAsignaturaMasivamente(datos) {
  const resultados = {
    creados: [],
    errores: [],
  };

  for (const fila of datos) {
    try {
      const asignaturaCreado = await crearAsignatura({
        nombre: fila.nombre,
        codigo: fila.codigo,
        estado: fila.estado === "true" || fila.estado === true,
      });

      resultados.creados.push({
        nombre: asignaturaCreado.asignatura.nombre,
      });
    } catch (error) {
      resultados.errores.push({
        codigo: fila.codigo,
        error: error.message,
      });
    }
  }

  return resultados;
}

module.exports = {
  crearAsignatura,
  editarAsignatura,
  habilitarAsignatura,
  consultarAsignaturas,
  consultarAsignaturasActivas,
  consultarAsignaturasPorDocente,
  consultarAsignaturaPorId,
  crearAsignaturaMasivamente
}