/*function formatearEstudiantesConAsignaturasYGrupos(estudiantes) {
  return estudiantes.map((e) => ({
    id: e.id_estudiante,
    uuidTelefono: e.uuid_telefono || null,
    identificacion: e.identificacion || "",
    estado: e.estado,
    nombreCompleto: `${e.USUARIO?.nombres || ""} ${
      e.USUARIO?.apellidos || ""
    }`.trim(),
    correo: e.USUARIO?.correo || "",
    grupos: e.GRUPOs.map((g) => ({
      id: g.id_grupo,
      nombre: g.nombre,
      codigo: g.codigo || "",
      asignatura: {
        id: g.ASIGNATURA?.id_asignatura || null,
        nombre: g.ASIGNATURA?.nombre || "",
      },
    })),
  }));
}

function formatearDocentesConAsignaturasYGrupos(docentes) {
  return docentes.map((docente) => {
    const asignaturasMap = {};
    const grupos = docente.Grupos || docente.GRUPOs || [];
    const usuario = docente.Usuario || docente.USUARIO || {};

    grupos.forEach((grupo) => {
      const asignatura = grupo.Asignatura || grupo.ASIGNATURA;
      if (!asignatura) return;

      const idAsignatura = asignatura.id_asignatura;

      if (!asignaturasMap[idAsignatura]) {
        asignaturasMap[idAsignatura] = {
          id: idAsignatura,
          nombre: asignatura.nombre,
          grupos: [],
        };
      }

      asignaturasMap[idAsignatura].grupos.push({
        id: grupo.id_grupo,
        nombre: grupo.nombre,
      });
    });

    return {
      id_docente: docente.id_docente,
      uuid_telefono: docente.uuid_telefono || null,
      identificacion: usuario.identificacion || "",
      nombreCompleto: `${usuario.nombres || ""} ${
        usuario.apellidos || ""
      }`.trim(),
      correo: usuario.correo || "",
      asignaturas: Object.values(asignaturasMap),
    };
  });
}

module.exports = {
  formatearEstudiantesConAsignaturasYGrupos,
  formatearDocentesConAsignaturasYGrupos,
};
 */

function formatearUsuariosConAsignaturasYGrupos(usuarios, tipo = "estudiante") {
  return usuarios.map((usuario) => {
    const user = usuario.Usuario || usuario.USUARIO || {};
    const grupos = usuario.Grupos || usuario.GRUPOs || [];

    // Estructura de asignaturas
    let asignaturas = [];
    if (tipo === "docente") {
      const asignaturasMap = {};
      grupos.forEach((grupo) => {
        const asignatura = grupo.Asignatura || grupo.ASIGNATURA;
        if (!asignatura) return;

        const idAsignatura = asignatura.id_asignatura;

        if (!asignaturasMap[idAsignatura]) {
          asignaturasMap[idAsignatura] = {
            id: idAsignatura,
            nombre: asignatura.nombre,
            grupos: [],
          };
        }

        asignaturasMap[idAsignatura].grupos.push({
          id: grupo.id_grupo,
          nombre: grupo.nombre,
          codigo: grupo.codigo || "",
        });
      });
      asignaturas = Object.values(asignaturasMap);
    } else {
      // Estudiante: 1 grupo por asignatura
      asignaturas = grupos.map((g) => ({
        id: g.ASIGNATURA?.id_asignatura || g.Asignatura?.id_asignatura || null,
        nombre: g.ASIGNATURA?.nombre || g.Asignatura?.nombre || "",
        grupo: {
          id: g.id_grupo,
          nombre: g.nombre,
          codigo: g.codigo || "",
        },
      }));
    }

    return {
      id: tipo === "docente" ? usuario.id_docente : usuario.id_estudiante,
      uuidTelefono: usuario.uuid_telefono || null,
      identificacion: user.identificacion || "",
      estado: usuario.estado,
      nombreCompleto: `${user.nombres || ""} ${user.apellidos || ""}`.trim(),
      correo: user.correo || "",
      asignaturas,
    };
  });
}

module.exports = {
  formatearUsuariosConAsignaturasYGrupos,
};
