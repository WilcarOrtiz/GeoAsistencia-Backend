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
    return true;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return false;
    }
    throw error;
  }
}

module.exports = {
  crearUsuarioFirebase,
  actualizarUsuarioFirebase,
  asignarClaims,
  existeCorreoEnFirebase,
};
