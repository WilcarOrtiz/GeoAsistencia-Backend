const { Usuario, Docente, Estudiante, Rol } = require("../models");
const { Op } = require("sequelize");
const { obtenerModeloPorRol } = require("../utils/helpers/userHelper");
const { existeCorreoEnFirebase } = require("../utils/helpers/firebaseHelper");

const {
  crearUsuarioFirebase,
  actualizarUsuarioFirebase,
  asignarClaims,
} = require("../utils/helpers/firebaseHelper");

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

    // VALIDACIONES
    if (await existeCorreoEnFirebase(correo)) {
      throw new Error("El correo ya está registrado en Firebase.");
    }

    const existente = await Usuario.findOne({
      where: {
        [Op.or]: [{ correo: correo }, { identificacion: identificacion }],
      },
    });

    if (existente) {
      throw new Error("El correo o la identificación ya están registrados.");
    }

    //  Buscar ID del rol
    const rol_supabase = await Rol.findOne({ where: { nombre: rol } });

    // CREACION EN FIREBASE
    const firebaseUser = await crearUsuarioFirebase({
      correo,
      contrasena,
      displayName: `${nombres} ${apellidos}`,
    });
    await asignarClaims(firebaseUser.uid, { rol, uuid_telefono });
    const id_usuario = firebaseUser.uid;

    // CREACION EN BASE DE DATOS
    await Usuario.create({
      id_usuario: id_usuario,
      identificacion,
      nombres,
      apellidos,
      correo,
      id_rol: rol_supabase.id_rol,
    });

    if (rol.toUpperCase() === "DOCENTE") {
      await Docente.create({
        id_docente: id_usuario,
        uuid_telefono: "",
        estado,
      });
    } else if (rol.toUpperCase() === "ESTUDIANTE") {
      await Estudiante.create({
        id_estudiante: id_usuario,
        uuid_telefono: "",
        estado,
      });
    }

    // RESPUESTA FINAL
    return {
      mensaje: "Usuario registrado correctamente.",
      idUsuario: id_usuario,
      id_rol: rol_supabase.id_rol,
    };
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
}

async function editarUsuario(data, id_usuario) {
  try {
    const {
      identificacion,
      nombres,
      apellidos,
      correo,
      contrasena,
      estado,
      uuid_telefono,
    } = data;

    // VALIDACIONES
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    if (correo && correo !== usuario.correo) {
      const correoExistente = await Usuario.findOne({
        where: {
          correo,
          id_usuario: { [Op.ne]: id_usuario },
        },
      });
      if (correoExistente) {
        throw new Error(
          "El nuevo correo ya está registrado por otro usuario en la BD."
        );
      }

      if (await existeCorreoEnFirebase(correo)) {
        throw new Error("El nuevo correo ya está registrado en Firebase.");
      }
    }

    // ACTUALIZACIONES
    await actualizarUsuarioFirebase(id_usuario, {
      correo,
      contrasena,
      displayName: `${nombres} ${apellidos}`,
    });

    if (uuid_telefono && uuid_telefono !== registro.uuid_telefono) {
      await asignarClaims(id_usuario, { uuid_telefono });
    }

    await usuario.update({
      identificacion,
      nombres,
      apellidos,
      correo,
      estado,
    });

    // Determinar modelo según el rol actual del usuario
    const rolUsuario = await Rol.findByPk(usuario.id_rol);
    const Modelo = obtenerModeloPorRol(rolUsuario.nombre);
    if (!Modelo) {
      throw new Error("No se encontró el modelo para el rol del usuario.");
    }

    const registro = await Modelo.findByPk(id_usuario);
    if (registro) {
      await registro.update({
        uuid_telefono: uuid_telefono || null,
        estado,
      });
    }

    //RESPUESTA FINAL
    return {
      mensaje: "Usuario actualizado correctamente.",
      idUsuario: id_usuario,
    };
  } catch (error) {
    throw new Error(`Error al editar usuario: ${error.message}`);
  }
}

async function cambiarEstadoUsuario(id_usuario) {
  //este id_usuario es el id de firebase
  try {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) throw new Error("El usuario no existe.");

    const rol = await Rol.findByPk(usuario.id_rol);
    if (!rol) throw new Error("Rol no válido");

    const Modelo = obtenerModeloPorRol(rol.nombre);
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

async function obtenerTodosLosUsuarios(nombreRol) {
  try {
    const rol = await Rol.findOne({
      where: { nombre: nombreRol.toUpperCase() },
    });
    if (!rol) throw new Error(`Rol ${nombreRol} no encontrado`);

    const usuarios = await Usuario.findAll({
      where: { id_rol: rol.id_rol },
      include: [
        {
          model: nombreRol.toUpperCase() === "DOCENTE" ? Docente : Estudiante,
          required: true,
        },
      ],
      order: [["apellidos", "ASC"]],
    });

    return usuarios;
  } catch (error) {
    throw new Error(
      `Error al obtener usuarios tipo ${nombreRol}: ${error.message}`
    );
  }
}

module.exports = {
  crearUsuario,
  editarUsuario,
  cambiarEstadoUsuario,
  crearUsuarioMasivamente,
  obtenerTodosLosUsuarios,
};
