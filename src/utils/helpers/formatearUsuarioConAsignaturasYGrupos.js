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
