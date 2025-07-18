function formatearEstudiantesConAsignaturasYGrupos(estudiantes) {
  return estudiantes.map((e) => ({
    id: e.id_estudiante,
    uuidTelefono: e.uuid_telefono || null,
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
      id_usuario: docente.id_docente,
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
