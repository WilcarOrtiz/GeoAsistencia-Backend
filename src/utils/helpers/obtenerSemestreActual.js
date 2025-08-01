function obtenerSemestreActual() {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const semestre = (fecha.getMonth() + 1) <= 6 ? "1" : "2";
  return `${año}-${semestre}`;
}

module.exports = { obtenerSemestreActual };
