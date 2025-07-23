function obtenerFechaYHoraActual() {
  const ahora = new Date();
  const fecha = ahora.toISOString().split("T")[0]; // YYYY-MM-DD
  const hora = ahora.toTimeString().slice(0, 8); // HH:mm:ss
  return { fecha, hora };
}

module.exports = {
  obtenerFechaYHoraActual,
};
