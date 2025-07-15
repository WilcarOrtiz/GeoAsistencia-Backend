const { Asignatura } = require("../models");

async function crearAsignatura(datos) {
    try {
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

async function habilitarAsignatura(id_asignatura, estado) {
    try {
        const existente = await Asignatura.findByPk(id_asignatura);
        if (existente) {
            await Asignatura.update({estado: estado}, {where: {id_asignatura}});
            return {
                success: true,
                mensaje: estado ? "Asignatura habilitada correctamente." : "Asignatura deshabilitada correctamente.",
            };
        } else {
            throw new Error("La asignatura no está registrada.");
        }
    } catch (error) {
        throw new Error(`Error al editar el estado de la asignatura: ${error.message}`);
    }
    
}

async function consultarAsignaturas() {
    try {
        const asignaturas = await Asignatura.findAll();
        return {
                success: true,
                mensaje: "Asignaturas consultadas correctamente.",
                asignaturas: asignaturas
        };
    } catch (error) {
        throw new Error(`Error al consultar las asignaturas: ${error.message}`);
    }
    
}

async function consultarAsignaturaById(id_asignatura) {
    try {
        const asignaturaConsultada = await Asignatura.findByPk(id_asignatura);
        if (existente) {
            return {
                success: true,
                mensaje: "Asignatura consultada correctamente",
                asignatura: asignaturaConsultada
            };
        } else {
            throw new Error("La asignatura no está registrada.");
        }
    } catch (error) {
        throw new Error(`Error al consultar la asignatura: ${error.message}`);
    }
}

async function consultarAsignaturaByIdDocente(params) {
    
}

async function consultarAsignaturaByIdEstudiante(params) {
    
}

module.exports = {
    crearAsignatura,
    editarAsignatura,
    habilitarAsignatura, 
    consultarAsignaturas
}