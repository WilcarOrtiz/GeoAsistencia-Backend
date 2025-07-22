const admin = require("../../firebase/firebase");

async function crearUsuarioFirebase({ correo, contrasena, displayName }) {
  try {
    const user = await admin.auth().createUser({
      email: correo,
      password: contrasena,
      displayName,
    });
    return user;
  } catch (error) {
    throw new Error(`Error al crear el usuario en Firebase: ${error.message}`);
  }
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
    throw new Error(`El correo ${correo} ya está registrado en Firebase.`);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return;
    }
    throw new Error(
      `Error al verificar el correo en Firebase: ${error.message}`
    );
  }
}

module.exports = {
  crearUsuarioFirebase,
  actualizarUsuarioFirebase,
  asignarClaims,
  existeCorreoEnFirebase,
};
