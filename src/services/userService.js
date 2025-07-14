const { Usuario, Docente, Estudiante } = require("../models");
const { v4: uuidv4 } = require("uuid"); // para generar IDs únicos
const bcrypt = require("bcryptjs"); // para encriptar la contraseña

async function crearUsuario(data) {
  try {
    const {
      identificacion,
      nombres,
      apellidos,
      correo,
      contrasena,
      id_rol,
      estado,
      uuid_telefono,
    } = data;

    // Validar que no exista ya el correo
    const existente = await Usuario.findOne({ where: { correo } });
    if (existente) {
      throw new Error("El correo ya está registrado.");
    }

    // Generar un ID único esto es de prueba,  ya que tengo que meter el de firebase
    const id_usuario = uuidv4();

    // Crear en la tabla Usuario
    const nuevoUsuario = await Usuario.create({
      id_usuario,
      identificacion,
      nombres,
      apellidos,
      correo,
      contrasena,
      estado,
      id_rol,
    });

    if (id_rol === 1) {
      await Docente.create({
        id_docente: id_usuario,
        uuid_telefono: uuid_telefono || null,
        estado,
      });
    } else if (id_rol === 2) {
      await Estudiante.create({
        id_estudiante: id_usuario,
        uuid_telefono: uuid_telefono || null,
        estado,
      });
    }

    return {
      mensaje: "Usuario registrado correctamente.",
      idUsuario: id_usuario,
      id_rol,
    };
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
}

module.exports = {
  crearUsuario,
};
