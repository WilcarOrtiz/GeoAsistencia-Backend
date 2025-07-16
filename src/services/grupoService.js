const { Grupo, Asignatura, Docente } = require("../models");

async function crearGrupo(datos) {
    try {
        const { id_asignatura, id_docente, codigo } = datos;

        const asignatura = await Asignatura.findByPk(id_asignatura);
        if (!asignatura) {
            throw new Error("La asignatura no existe.");
        }

        if (id_docente) {
            const docente = await Docente.findByPk(id_docente);
            if (!docente) {
                throw new Error("El docente no existe.");
            }
        }

        const existente = await Grupo.findOne({ where: { codigo } });
        if (existente) {
            throw new Error("El grupo ya está registrado.");
        }

        const grupoCreado = await Grupo.create(datos);
        return {
            success: true,
            mensaje: "Grupo registrado correctamente.",
            grupo: grupoCreado,
        };
    } catch (error) {
        throw new Error(`Error al crear el grupo: ${error.message}`);
    }
}

async function editarGrupo(id_grupo, datos) {
    try {
        const { id_asignatura, id_docente } = datos;

        const existente = await Grupo.findByPk(id_grupo);
        if (!existente) {
            throw new Error("El grupo no está registrado.");
        }

        const asignatura = await Asignatura.findByPk(id_asignatura);
        if (!asignatura) {
            throw new Error("La asignatura no existe.");
        }

        if (id_docente) {
            const docente = await Docente.findByPk(id_docente);
            if (!docente) {
                throw new Error("El docente no existe.");
            }
        }

        const grupoEditado = await Grupo.update(datos, { where: { id_grupo }});
        return {
            success: true,
            mensaje: "Grupo editado correctamente.",
            grupo: grupoEditado,
        };
    } catch (error) {
        throw new Error(`Error al editar el grupo: ${error.message}`);
    }
}

module.exports = {
    crearGrupo,
    editarGrupo
}