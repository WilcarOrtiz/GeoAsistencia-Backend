const { Usuario, Docente, Estudiante, Rol } = require("../models");

const admin = require("../firebase/firebase");

async function crearUsuario(data) {
  try {
    const {
      identificacion,
      nombres,
      apellidos,
      correo,
      contrasena,
      rol,
      estado,
      uuid_telefono,
    } = data;

    // Validaciones
    const existente = await Usuario.findOne({ where: { correo } });
    if (existente) {
      throw new Error("El correo ya está registrado.");
    }

    //  Buscar ID del rol
    const rol_supabase = await Rol.findOne({ where: { nombre: rol } });
    console.log("Rol encontrado:", rol_supabase.id_rol);

    // Crear usuario en Firebase
    const firebaseUser = await admin.auth().createUser({
      email: correo,
      password: contrasena,
      displayName: `${nombres} ${apellidos}`,
    });

    await admin.auth().setCustomUserClaims(firebaseUser.uid, {
      rol,
      uuid_telefono,
    });

    const id_usuario = firebaseUser.uid;

    const nuevoUsuario = await Usuario.create({
      id_usuario: id_usuario,
      identificacion,
      nombres,
      apellidos,
      correo,
      estado,
      id_rol: rol_supabase.id_rol,
    });

    if (rol === "DOCENTE") {
      await Docente.create({
        id_docente: id_usuario,
        uuid_telefono: uuid_telefono || null,
        estado,
      });
    } else if (rol === "ESTUDIANTE") {
      await Estudiante.create({
        id_estudiante: id_usuario,
        uuid_telefono: uuid_telefono || null,
        estado,
      });
    }

    return {
      mensaje: "Usuario registrado correctamente.",
      idUsuario: id_usuario,
      id_rol: rol_supabase.id_rol,
    };
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
}

module.exports = {
  crearUsuario,
};
