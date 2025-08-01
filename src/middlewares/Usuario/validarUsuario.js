function validarCamposUsuario(req, res, next) {
  const errores = [];
  const {
    identificacion,
    nombres,
    apellidos,
    correo,
    contrasena,
    rol,
    estado,
    uuid_telefono,
  } = req.body;

  if (!identificacion || !/^\d{6,10}$/.test(identificacion.toString())) {
    errores.push(
      "La identificación debe contener entre 6 y 10 dígitos numéricos."
    );
  }

  if (!nombres || nombres.trim().length < 3) {
    errores.push("El nombre debe tener al menos 3 caracteres.");
  }

  if (!apellidos || apellidos.trim().length < 3) {
    errores.push("El apellido debe tener al menos 3 caracteres.");
  }

  if (!correo || !/^[\w.%+-]+@unicesar\.edu\.co$/.test(correo)) {
    errores.push(
      "El correo debe tener un formato válido y terminar en @unicesar.edu.co."
    );
  }

  if (!contrasena || contrasena.length < 6) {
    errores.push("La contraseña debe tener al menos 6 caracteres.");
  }

  if (
    !rol ||
    !["DOCENTE", "ESTUDIANTE", "ADMINISTRADOR"].includes(rol.toUpperCase())
  ) {
    errores.push("El rol debe ser DOCENTE o ESTUDIANTE.");
  }

  if (
    estado !== undefined &&
    !["true", "false", true, false].includes(estado)
  ) {
    errores.push("El estado debe ser true o false.");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      success: false,
      errores,
    });
  }

  next();
}

function validarArchivoExcel(req, res, next) {
  const archivo = req.file;

  if (!archivo) {
    return res
      .status(400)
      .json({ success: false, error: "No se envió ningún archivo." });
  }

  const extensionValida =
    archivo.originalname.endsWith(".xlsx") ||
    archivo.originalname.endsWith(".xls");
  if (!extensionValida) {
    return res.status(400).json({
      success: false,
      error: "Debe ser un archivo Excel (.xlsx o .xls).",
    });
  }

  next();
}

module.exports = {
  validarCamposUsuario,
  validarArchivoExcel,
};
