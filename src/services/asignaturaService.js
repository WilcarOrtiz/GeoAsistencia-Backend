const { Asignatura } = require("../models");

async function crearAsignatura(data) {
    try {
        const { codigo } = data;
        const existente = await Asignatura.findOne({ where: { codigo } });
        if (existente) {
            throw new Error("La asignatura ya está registrada.");
        }
        const asignaturaCreada = await Asignatura.create(data);
        return {
            success: true,
            mensaje: "Asignatura registrada correctamente.",
            asignatura: asignaturaCreada,
        };

    } catch (error) {
        throw new Error(`Error al crear la asignatura: ${error.message}`);
    }
}

module.exports = {
    crearAsignatura,
}