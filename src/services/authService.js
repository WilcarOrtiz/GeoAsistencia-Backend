const admin = require("../firebase/firebase");

async function iniciarSesion(data) {}

async function cerrarSesion(data) {}

async function actualizarContraseña(data) {}

async function RecuperarContraseña(correo) {
  try {
    const link = await admin.auth().generatePasswordResetLink(correo, {
      url: "https://geoasistencia-48628.firebaseapp.com", // debe estar autorizado
      handleCodeInApp: true,
    });

    console.log("Enlace enviado por Firebase:", link);

    return {
      mensaje: "Se ha enviado un correo para restablecer la contraseña.",
    };
  } catch (err) {
    throw new Error("Error al generar el enlace: " + err.message);
  }
}

module.exports = {
  iniciarSesion,
  cerrarSesion,
  RecuperarContraseña,
  actualizarContraseña,
};
