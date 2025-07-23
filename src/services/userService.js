const { Op } = require("sequelize");
const { Usuario, Rol, sequelize } = require("../models");
const { obtenerModeloPorRol,buscarRegistroPorCondicion,} = require("../utils/helpers/modeloHelper");
const { existeUsuarioCorreoIdentificacion } = require("../utils/validaciones/validarExistenciaCorreoIdentificacion");
const { crearUsuarioFirebase, actualizarUsuarioFirebase, asignarClaims, existeCorreoEnFirebase,} = require("../utils/helpers/firebaseHelper");
const { validarExistencia} = require("../utils/validaciones/validarExistenciaModelo");

async function crearUsuario(data) {
  const transaction = await sequelize.transaction();

  try {
    const {
      identificacion,
      nombres,
      apellidos,
      correo,
      contrasena,
      rol,
      estado = true,
      uuid_telefono,
    } = data;

    await existeCorreoEnFirebase(correo);
    await existeUsuarioCorreoIdentificacion(correo, identificacion);
    const rol_supabase = await buscarRegistroPorCondicion( Rol, { nombre: rol.toUpperCase() }, "Rol");
    const firebaseUser = await crearUsuarioFirebase({
      correo,
      contrasena,
      displayName: `${nombres} ${apellidos}`,
    });
    const id_usuario = firebaseUser.uid;

    await asignarClaims(id_usuario, { rol, uuid_telefono });
    const nuevoUsuario= await Usuario.create(
      {
        id_usuario,
        identificacion,
        nombres,
        apellidos,
        correo,
        id_rol: rol_supabase.id_rol,
      },
      { transaction }
    );

    const Modelo = obtenerModeloPorRol(rol.toUpperCase());
    const idField =
      rol.toUpperCase() === "DOCENTE" ? "id_docente" : "id_estudiante";

    await Modelo.create(
      {
        [idField]: id_usuario,
        uuid_telefono: uuid_telefono ?? null,
        estado,
      },
      { transaction }
    );

    await transaction.commit();
    return {
      success: true,
      mensaje: "Usuario registrado correctamente.",
      usuario: nuevoUsuario,
    };
    
  } catch (error) {
    await transaction.rollback();
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

  
    const usuario = await validarExistencia(
      Usuario,
      id_usuario,
      "El Usuario"
    );
    if (
      (correo && correo !== usuario.correo) ||
      (identificacion && identificacion !== usuario.identificacion)
    ) {
      if (correo && correo !== usuario.correo) {
        await existeCorreoEnFirebase(correo);
      }

      await existeUsuarioCorreoIdentificacion(
        correo,
        identificacion,
        usuario.id_usuario
      );
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

    const rolUsuario = await validarExistencia(
      Rol,
      usuario.id_rol,
      "El rol"
    );
    const Modelo = obtenerModeloPorRol(rolUsuario.nombre);
    const registro = await validarExistencia(
      Modelo,
      id_usuario,
      "el registro asociado"
    );
    if (registro) {
      await registro.update({
        uuid_telefono: uuid_telefono || null,
        estado,
      });
    }

    return {
      success: true,
      mensaje: "Usuario actualizad correctamente.",
      usuario: usuario,
    };
  } catch (error) {
    throw new Error(`Error al editar usuario: ${error.message}`);
  }
}

async function cambiarEstadoUsuario(id_usuario) {
  try {
    const usuario = await validarExistencia(
      Usuario,
      id_usuario,
      "El Usuario"
    );
    const rol = await validarExistencia(
      Rol,
      usuario.id_rol,
      "El rol del usuario"
    );
    const Modelo = obtenerModeloPorRol(rol.nombre);
    const registro = await validarExistencia(
      Modelo,
      id_usuario,
      "el registro asociado"
    );

    registro.estado = !registro.estado;
    await registro.save();

    return {
      success: true,
      mensaje: `Estado de ${usuario.nombres.toLowerCase()} actualizado.`,
      Estado: registro.estado,
    };

  } catch (error) {
    throw new Error(`Error no se pudo cambiar el estado: ${error.message}`);
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

async function obtenerUsuarios(filtros = {}) {
  try {
    const whereConditionUsuario = {};
    let include = [];
    let ModeloAsociado = null;
    let whereAsociado = {};

    // 1. ID usuario
    if (filtros.id_usuario) {
      await validarExistencia(
        Usuario,
        filtros.id_usuario,
        "El Usuario"
      );
      whereConditionUsuario.id_usuario = filtros.id_usuario;
    }

    // 2. Rol
    if (filtros.rol) {
      const rol = await buscarRegistroPorCondicion(
        Rol,
        { nombre: filtros.rol.toUpperCase() },
        "Rol"
      );
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
    const resultado= await Usuario.findAll({
      where: whereConditionUsuario,
      include,
      order: [["apellidos", "ASC"]],
      limit,
      offset,
    });
    
    return {
      success: true,
      mensaje: "informacion consultada correctamente.",
      resultado: resultado,
    };

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
