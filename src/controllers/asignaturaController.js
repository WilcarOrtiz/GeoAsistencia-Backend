const asignaturaService = require("../services/asignaturaService");
const validarAsignatura = require("../utils/validaciones/validarAsignatura");

async function crearAsignatura(req, res) {
    try {
        const datos = req.body;
        const validaciones = validarAsignatura(datos);
        if (validaciones.length > 0) {
            return res.status(400).json({error: validaciones});
        }
        const asignaturaCreada = await asignaturaService.crearAsignatura(datos);
        return res.status(201).json(asignaturaCreada);
    } catch (error) {
        if (error.message.includes('ya está registrada')) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
    }
}

async function editarAsignatura(req, res) {
    try {
        const { id_asignatura } = req.params;
        if (!id_asignatura) {
            return res.status(400).json({error: "El id asignatura no puede ir vacio."});
        }
        const datos = req.body;
        const validaciones = validarAsignatura(datos);
        if (validaciones.length > 0) {
            return res.status(400).json({error: validaciones});
        }
        const asignaturaEditada = await asignaturaService.editarAsignatura(id_asignatura, datos);
        return res.status(200).json(asignaturaEditada);
    } catch (error) {
        if (error.message.includes('no está registrada')) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
    }
}

async function consultarAsignaturas(req, res) {
    try {
        const asignaturasConsultadas = await asignaturaService.consultarAsignaturas();
        return res.status(200).json(asignaturasConsultadas);
    } catch (error) {
        return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        
    }
}

async function consultarAsignaturasActivas(req, res) {
    try {
        const asignaturasConsultadas = await asignaturaService.consultarAsignaturasActivas();
        return res.status(200).json(asignaturasConsultadas);
    } catch (error) {
        return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        
    }
}

async function habilitarAsignatura(req, res) {
    try {
        const { id_asignatura } = req.params;
        if (!id_asignatura) {
            return res.status(400).json({error: "El id asignatura no puede ir vacio."});
        }
        const { estado } = req.body;
        if (typeof estado !== "boolean") {
            return res.status(400).json({error: "El estado debe ser true o false (Tipo booleano)."});
        }
        const asignaturaHabilitada = await asignaturaService.habilitarAsignatura(id_asignatura, estado);
        return res.status(200).json(asignaturaHabilitada);
    } catch (error) {
        if (error.message.includes('no está registrada')) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
    }
}

module.exports = {
    crearAsignatura,
    editarAsignatura,
    habilitarAsignatura,
    consultarAsignaturas,
    consultarAsignaturasActivas
};