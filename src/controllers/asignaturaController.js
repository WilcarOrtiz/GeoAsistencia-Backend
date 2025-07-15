const asignaturaService = require("../services/asignaturaService");

async function crearAsignatura(req, res) {
    try {
        const asignaturaCreada = await asignaturaService.crearAsignatura(req.body);
        res.status(201).json(asignaturaCreada);
    } catch (error) {
        if (error.message.includes('ya está registrada')) {
            res.status(400).json({ error: error.message });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor'});
        }
    }
}

module.exports = {
    crearAsignatura,
};