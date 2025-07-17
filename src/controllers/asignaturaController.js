const asignaturaService = require("../services/asignaturaService");
const manejarError = require("../utils/handlers/manejadorError");
const validarAsignatura = require("../utils/validaciones/validarAsignatura");
const xlsx = require("xlsx");
const validarParametros = require("../utils/validaciones/validarParametros");

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
        return manejarError(res, error);
    }
}

async function editarAsignatura(req, res) {
    try {
        const { id_asignatura } = req.params;
        if (!validarParametros(req, res, ["id_asignatura"])) return;
        const datos = req.body;
        const validaciones = validarAsignatura(datos);
        if (validaciones.length > 0) {
            return res.status(400).json({error: validaciones});
        }
        const asignaturaEditada = await asignaturaService.editarAsignatura(id_asignatura, datos);
        return res.status(200).json(asignaturaEditada);
    } catch (error) {
        return manejarError(res, error);
    }
}

async function consultarAsignaturas(req, res) {
    try {
        const asignaturasConsultadas = await asignaturaService.consultarAsignaturas();
        return res.status(200).json(asignaturasConsultadas);
    } catch (error) {
        return manejarError(res, error);
    }
}

async function habilitarAsignatura(req, res) {
    try {
        const { id_asignatura } = req.params;
        if (!validarParametros(req, res, ["id_asignatura"])) return;
        const { estado } = req.body;
        if (typeof estado !== "boolean") {
            return res.status(400).json({error: "El estado debe ser true o false (Tipo booleano)."});
        }
        const asignaturaHabilitada = await asignaturaService.habilitarAsignatura(id_asignatura, estado);
        return res.status(200).json(asignaturaHabilitada);
    } catch (error) {
        return manejarError(res, error);
    }
}

async function consultarAsignaturasActivas(req, res) {
    try {
        const asignaturasConsultadas = await asignaturaService.consultarAsignaturasActivas();
        return res.status(200).json(asignaturasConsultadas);
    } catch (error) {
        return manejarError(res, error);
    }
}

async function consultarAsignaturasPorDocente(req, res) {
    try {
        const { id_docente } = req.params;
        if (!validarParametros(req, res, ["id_docente"])) return;
        const asignaturasConsultadas = await asignaturaService.consultarAsignaturasPorDocente(id_docente);
        return res.status(200).json(asignaturasConsultadas);
    } catch (error) {
        return manejarError(res, error);
    }
}

async function consultarAsignaturaPorId(req, res) {
    try {
        const { id_asignatura } = req.params;
        if (!validarParametros(req, res, ["id_asignatura"])) return;
        const asignaturasConsultadas = await asignaturaService.consultarAsignaturaPorId(id_asignatura);
        return res.status(200).json(asignaturasConsultadas);
    } catch (error) {
       return manejarError(res, error);
    }
}


async function crearAsignaturaMasivamente(req, res) {
  try {
    const archivo = req.file;
    if (!archivo) {
      return res.status(400).json({ success: false, error: "No se envió archivo Excel." });
    }

    const workbook = xlsx.read(archivo.buffer, { type: "buffer" });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const datos = xlsx.utils.sheet_to_json(hoja);
    const resultado = await asignaturaService.crearAsignaturaMasivamente(datos);

    res.status(200).json({
      success: true,
      mensaje: "Carga masiva finalizada.",
      resumen: resultado,
    });
  } catch (error) {
    return manejarError(res, error);
  }
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
};