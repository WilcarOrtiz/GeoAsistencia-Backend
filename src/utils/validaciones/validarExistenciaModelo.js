async function validarExistencia(modelo, id, nombreModelo = "El registro") {
  const instancia = await modelo.findByPk(id);
  if (!instancia) {
    throw new Error(`${nombreModelo} no está registrado.`);
  }
  return instancia;
}

async function validarEstadoActivo(instancia, nombreModelo = "El registro") {
  if (!instancia.estado) {
    throw new Error(`${nombreModelo} no está activo.`);
  }
}

module.exports = {
  validarExistencia,
  validarEstadoActivo,
};
