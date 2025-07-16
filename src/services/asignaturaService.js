const { Asignatura } = require("../models");
const { Sequelize } = require("sequelize");

async function crearAsignatura(datos) {
    try {
        const validaciones = validarAsignatura(datos);
        if (validaciones.length > 0) {
            throw new Error(validaciones.join(" "));
        }
        const { codigo } = datos;
        const existente = await Asignatura.findOne({ where: { codigo } });
        if (existente) {
            throw new Error("La asignatura ya está registrada.");
        }
        const asignaturaCreada = await Asignatura.create(datos);
        return {
            success: true,
            mensaje: "Asignatura registrada correctamente.",
            asignatura: asignaturaCreada,
        };

    } catch (error) {
        throw new Error(`Error al crear la asignatura: ${error.message}`);
    }
}

async function editarAsignatura(id_asignatura, datos) {
    try {
        const validaciones = validarAsignatura(datos);
        if (validaciones.length > 0) {
            throw new Error(validaciones.join(" "));
        }
        const asignaturaExistente = await Asignatura.findByPk(id_asignatura);
        if (asignaturaExistente) {
            await asignaturaExistente.update(datos);
            return {
                success: true,
                mensaje: "Asignatura editada correctamente.",
            };
        } else {
            throw new Error("La asignatura no está registrada.");
        }
    } catch (error) {
        throw new Error(`Error al editar la asignatura: ${error.message}`);
    }
}

async function habilitarAsignatura(id_asignatura, estado) {
    try {
        const asignaturaExistente = await Asignatura.findByPk(id_asignatura);
        if (asignaturaExistente) {
            await asignaturaExistente.update({estado: estado});
            return {
                success: true,
                mensaje: estado ? "Asignatura habilitada correctamente." : "Asignatura deshabilitada correctamente.",
            };
        } else {
            throw new Error("La asignatura no está registrada.");
        }
    } catch (error) {
        throw new Error(`Error al editar la asignatura: ${error.message}`);
    }
    
}

async function consultarAsignaturas() {
  try {
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
  } catch (error) {
    throw new Error(`Error al consultar las asignaturas: ${error.message}`);
  }
}

module.exports = {
    crearAsignatura,
    editarAsignatura,
    habilitarAsignatura,
    consultarAsignaturas
}