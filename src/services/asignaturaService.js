const { Asignatura } = require("../models");
const { Sequelize } = require("sequelize");

async function crearAsignatura(datos) {
    try {
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

    } catch (error) {
        throw new Error(`Error al crear la asignatura: ${error.message}`);
    }
}

async function editarAsignatura(id_asignatura, datos) {
    try {
        const { codigo, nombre } = datos;
        const asignaturaExistente = await Asignatura.findByPk(id_asignatura);
        if (!asignaturaExistente) {
            throw new Error("La asignatura no está registrada.");
        }
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

async function consultarAsignaturasActivas() {
  try {
    const asignaturas = await Asignatura.findAll({where: {estado: true}});

    return {
      success: true,
      mensaje: "Asignaturas consultadas correctamente.",
      asignaturas: asignaturas,
    };
  } catch (error) {
    throw new Error(`Error al consultar las asignaturas: ${error.message}`);
  }
}

async function habilitarAsignatura(id_asignatura, estado) {
    try {
        const asignaturaExistente = await Asignatura.findByPk(id_asignatura);
        if (!asignaturaExistente) {
            throw new Error("La asignatura no está registrada.");
        } 
        await asignaturaExistente.update({estado: estado});
        return {
            success: true,
            mensaje: estado ? "Asignatura habilitada correctamente." : "Asignatura deshabilitada correctamente.",
        };
    } catch (error) {
        throw new Error(`Error al editar la asignatura: ${error.message}`);
    }
}



module.exports = {
    crearAsignatura,
    editarAsignatura,
    habilitarAsignatura,
    consultarAsignaturas,
    consultarAsignaturasActivas
}