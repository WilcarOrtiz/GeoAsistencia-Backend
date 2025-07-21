const { Usuario, Docente, Estudiante, Rol } = require("../models");
const { Op } = require("sequelize");
const {
  obtenerModeloPorRol,
  existeUsuarioCorreoIdentificacion,
  buscarRolPorNombre,
  encontrarRegistroEnModelo,
} = require("../utils/helpers/userHelper");
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

    // VALIDACIONES DE EXISTENCIA
    if (
      (await existeCorreoEnFirebase(correo)) ||
      (await existeUsuarioCorreoIdentificacion(correo, identificacion))
    ) {
      throw new Error(
        (await existeCorreoEnFirebase(correo))
          ? "El correo ya está registrado en Firebase."
          : "El correo o la identificación ya están registrados."
      );
    }

    //  VALIDACION EXISTENCIA DEL ROL (helper)
    const rol_supabase = await buscarRolPorNombre(rol);
    if (!rol_supabase) throw new Error(`Rol ${rol} no encontrado`);

    // CREACION EN FIREBASE - ASIGNACION DE CLAIMS (Helper)
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

    const Modelo = obtenerModeloPorRol(rol.toUpperCase());
    const idField =
      rol.toUpperCase() === "DOCENTE" ? "id_docente" : "id_estudiante";

    await Modelo.create({
      [idField]: id_usuario,
      uuid_telefono: uuid_telefono ?? null,
      estado,
    });

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
    const usuario = await encontrarRegistroEnModelo(Usuario, id_usuario);
    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    if (
      (correo && correo !== usuario.correo) ||
      (identificacion && identificacion !== usuario.identificacion)
    ) {
      const correoEnFirebase =
        correo && correo !== usuario.correo
          ? await existeCorreoEnFirebase(correo)
          : false;

      const duplicadoBD = await existeUsuarioCorreoIdentificacion(
        correo,
        identificacion,
        usuario.id_usuario
      );

      if (correoEnFirebase || duplicadoBD) {
        throw new Error(
          correoEnFirebase
            ? "El correo ya está registrado en Firebase para otro usuario."
            : "El correo o la identificación ya están registrados para otro usuario."
        );
      }
    }

    // ACTUALIZACIONES (en firebase, modelo usuario y modelo específico)
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

    const rolUsuario = await encontrarRegistroEnModelo(Rol, usuario.id_rol);
    const Modelo = obtenerModeloPorRol(rolUsuario.nombre);
    if (!Modelo) {
      throw new Error("No se encontró el modelo para el rol del usuario.");
    }
    const registro = await encontrarRegistroEnModelo(Modelo, id_usuario);
    if (registro) {
      await registro.update({
        uuid_telefono: uuid_telefono || null,
        estado,
      });
    }

    return {
      mensaje: "Usuario actualizado correctamente.",
      idUsuario: id_usuario,
    };
  } catch (error) {
    throw new Error(`Error al editar usuario: ${error.message}`);
  }
}

async function cambiarEstadoUsuario(id_usuario) {
  try {
    const usuario = await encontrarRegistroEnModelo(Usuario, id_usuario);
    if (!usuario) throw new Error("El usuario no existe.");

    const rol = await encontrarRegistroEnModelo(Rol, usuario.id_rol);
    if (!rol) throw new Error("Rol no válido.");
    const Modelo = obtenerModeloPorRol(rol.nombre);

    const registro = await encontrarRegistroEnModelo(Modelo, id_usuario);
    if (!registro) throw new Error(`${rol.nombre} no encontrado.`);

    registro.estado = !registro.estado;
    await registro.save();

    return {
      mensaje: `Estado de ${rol.nombre.toLowerCase()} actualizado.`,
      estado: registro.estado,
    };
  } catch (error) {
    throw new Error(`No se pudo cambiar el estado: ${error.message}`);
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
        //aqui si estado viene pues lo toma sino pues lo pone en true a todos
        const usuarioCreado = await crearUsuario({
          identificacion: String(fila.identificacion),
          nombres: String(fila.nombres),
          apellidos: String(fila.apellidos),
          correo: String(fila.correo),
          contrasena: String(fila.identificacion),
          rol: fila.rol.toUpperCase(),
          estado:
            fila.estado !== undefined
              ? fila.estado === "true" || fila.estado === true
              : true,
          uuid_telefono: fila.uuid_telefono ?? null,
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

/*async function obtenerUsuarios(nombreRol, id_usuario = null) {
  try {
    if (id_usuario) {
      if (!(await encontrarRegistroEnModelo(Usuario, id_usuario))) {
        throw new Error("El usuario no existe.");
      }
    }

    const rol = await buscarRolPorNombre(nombreRol);
    if (!rol) throw new Error(`Rol ${nombreRol} no encontrado.`);
    const ModeloAsociado = obtenerModeloPorRol(rol.nombre);
    const whereCondition = { id_rol: rol.id_rol };
    if (id_usuario) whereCondition.id_usuario = id_usuario;

    return await Usuario.findAll({
      where: whereCondition,
      include: [{ model: ModeloAsociado, required: true }],
      order: [["apellidos", "ASC"]],
    });
  } catch (error) {
    throw new Error(
      `Error al obtener usuarios tipo ${nombreRol}: ${error.message}`
    );
  }
}

 */
async function obtenerUsuarios(filtros = {}) {
  try {
    const whereConditionUsuario = {};
    let include = [];
    let ModeloAsociado = null;
    let whereAsociado = {};

    // 1. ID usuario
    if (filtros.id_usuario) {
      const existeUsuario = await encontrarRegistroEnModelo(
        Usuario,
        filtros.id_usuario
      );
      if (!existeUsuario) throw new Error("El usuario no existe.");
      whereConditionUsuario.id_usuario = filtros.id_usuario;
    }

    // 2. Rol
    if (filtros.rol) {
      const rol = await buscarRolPorNombre(filtros.rol);
      if (!rol) throw new Error(`Rol ${filtros.rol} no encontrado.`);
      whereConditionUsuario.id_rol = rol.id_rol;
      ModeloAsociado = obtenerModeloPorRol(rol.nombre);
    }

    // 3. Filtros propios de Usuario
    if (filtros.correo)
      whereConditionUsuario.correo = { [Op.like]: `%${filtros.correo}%` };
    if (filtros.nombres)
      whereConditionUsuario.nombres = { [Op.like]: `%${filtros.nombres}%` };
    if (filtros.apellidos)
      whereConditionUsuario.apellidos = { [Op.like]: `%${filtros.apellidos}%` };
    if (filtros.identificacion)
      whereConditionUsuario.identificacion = filtros.identificacion;
    if (filtros.uuid_telefono)
      whereConditionUsuario.uuid_telefono = filtros.uuid_telefono;

    // 4. Estado (aplicable al modelo asociado)
    if (filtros.estado !== undefined && ModeloAsociado) {
      whereAsociado.estado = filtros.estado;
    }

    // 5. Include dinámico
    if (ModeloAsociado) {
      include.push({
        model: ModeloAsociado,
        required: true,
        where: whereAsociado,
      });
    }

    // 6. Paginación
    const limit = filtros.limit ? parseInt(filtros.limit, 10) : 50;
    const offset = filtros.offset ? parseInt(filtros.offset, 10) : 0;

    return await Usuario.findAll({
      where: whereConditionUsuario,
      include,
      order: [["apellidos", "ASC"]],
      limit,
      offset,
    });
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error.message}`);
  }
}

module.exports = {
  crearUsuario,
  editarUsuario,
  cambiarEstadoUsuario,
  crearUsuarioMasivamente,
  obtenerUsuarios,
};
