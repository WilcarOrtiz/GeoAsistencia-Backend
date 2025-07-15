const asignaturaService = require("../services/asignaturaService");

async function crearAsignatura(req, res) {
    try {
        const datos = req.body;
        const asignaturaCreada = await asignaturaService.crearAsignatura(datos);
        res.status(201).json(asignaturaCreada);
    } catch (error) {
        if (error.message.includes('ya está registrada')) {
            res.status(400).json({ error: error.message });
        } else {
            console.log(error);
            res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
    }
}

async function editarAsignatura(req, res) {
    try {
        const { id_asignatura } = req.params;
        const datos = req.body;
        const asignaturaEditada = await asignaturaService.editarAsignatura(id_asignatura, datos);
        res.status(200).json(asignaturaEditada);
    } catch (error) {
        if (error.message.includes('no está registrada')) {
            res.status(400).json({ error: error.message });
        } else {
            console.log(error);
            res.status(500).json({ error: `Error interno del servidor: ${error}`});
        }
    }
}

module.exports = {
    crearAsignatura,
    editarAsignatura
};