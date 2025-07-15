const { Usuario, Docente, Estudiante, Rol } = require("../models");
const admin = require("../firebase/firebase");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

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

async function obtenerUsuario(id) {
  try {
  } catch (error) {}
}

async function cambiarEstadoUsuario(id_usuario) {
  //este id_usuario es el id de firebase
  try {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) throw new Error("El usuario no existe.");

    const rol = await Rol.findByPk(usuario.id_rol);
    if (!rol) throw new Error("Rol no válido");

    const modelos = {
      DOCENTE: Docente,
      ESTUDIANTE: Estudiante,
    };

    const Modelo = modelos[rol.nombre];
    if (!Modelo) throw new Error("Rol sin modelo asociado.");

    const registro = await Modelo.findByPk(id_usuario);
    if (!registro) throw new Error(`${rol.nombre} no encontrado`);

    registro.estado = !registro.estado;
    await registro.save();

    return {
      mensaje: `Estado de ${rol.nombre.toLowerCase()} actualizado correctamente.`,
      estado: registro.estado,
    };
  } catch (error) {
    throw new Error("No se pudo cambiar el estado del usuario.");
  }
}

async function crearUsuarioMasivamente(datos) {
  try {
    const resultados = {
      creados: [],
      errores: [],
    };

    for (const fila of datos) {
      try {
        const usuarioCreado = await crearUsuario({
          identificacion: fila.identificacion,
          nombres: fila.nombres,
          apellidos: fila.apellidos,
          correo: fila.correo,
          contrasena: String(fila.identificacion),
          rol: fila.rol.toUpperCase(),
          estado: fila.estado === "true" || fila.estado === true,
          uuid_telefono: fila.uuid_telefono || null,
        });

        resultados.creados.push({
          correo: fila.correo,
          id: usuarioCreado.idUsuario,
        });
      } catch (error) {
        resultados.errores.push({
          correo: fila.correo,
          error: error.message,
        });
      }
    }

    return resultados;
  } catch (error) {
    throw new Error(`Error al procesar archivo Excel: ${error.message}`);
  }
}

module.exports = {
  crearUsuario,
  obtenerUsuario,
  cambiarEstadoUsuario,
  crearUsuarioMasivamente,
};
