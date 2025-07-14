Usuario.hasOne(Estudiante, { foreignKey: "id_estudiante" });
Estudiante.belongsTo(Usuario, { foreignKey: "id_estudiante" });

Usuario.hasOne(Docente, { foreignKey: "id_docente" });
Docente.belongsTo(Usuario, { foreignKey: "id_docente" });
