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

module.exports = {
  crearUsuarioFirebase,
  actualizarUsuarioFirebase,
  asignarClaims,
};
