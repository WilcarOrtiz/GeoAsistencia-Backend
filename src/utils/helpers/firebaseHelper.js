const admin = require("../../firebase/firebase");

async function crearUsuarioFirebase({ correo, contrasena, displayName }) {
  const user = await admin.auth().createUser({
    email: correo,
    password: contrasena,
    displayName,
  });
  return user;
}

async function actualizarUsuarioFirebase(
  uid,
  { correo, contrasena, displayName }
) {
  return await admin.auth().updateUser(uid, {
    email: correo,
    ...(contrasena && { password: contrasena }),
    displayName,
  });
}

async function asignarClaims(uid, claims) {
  return await admin.auth().setCustomUserClaims(uid, claims);
}

async function existeCorreoEnFirebase(correo) {
  try {
    await admin.auth().getUserByEmail(correo);
    return true; // El correo existe en Firebase
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return false; // No existe, se puede usar
    }
    throw error; // Otros errores (red, permisos, etc.)
  }
}

module.exports = {
  crearUsuarioFirebase,
  actualizarUsuarioFirebase,
  asignarClaims,
  existeCorreoEnFirebase,
};
