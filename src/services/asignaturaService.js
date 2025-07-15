const { Asignatura } = require("../models");
const validarAsignatura = require("../utils/validarAsignatura");

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
        const existente = await Asignatura.findByPk(id_asignatura);
        if (existente) {
            await Asignatura.update(datos, {where: {id_asignatura}});
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

module.exports = {
    crearAsignatura,
    editarAsignatura
}