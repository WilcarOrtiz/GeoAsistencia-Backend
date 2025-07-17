function formatEstudiantesConGrupos(estudiantes) {
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
      asignatura: {
        id: g.ASIGNATURA?.id_asignatura || null,
        nombre: g.ASIGNATURA?.nombre || "",
      },
    })),
  }));
}

module.exports = { formatEstudiantesConGrupos };
