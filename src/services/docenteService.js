const { Usuario, Docente, Grupo, Asignatura } = require("../models");

async function docentesActivos() {
  try {
    const docentes_Activos = await Usuario.findAll({
      include: [
        {
          model: Docente,
          where: { estado: true },
          required: true,
        },
      ],
    });

    return {
      mensaje: "Docentes activos",
      docentes: docentes_Activos,
    };
  } catch (error) {
    throw new Error(
      `Error al consultar docentes activos en el sistema: ${error.message}`
    );
  }
}

module.exports = {
  docentesActivos,
};
