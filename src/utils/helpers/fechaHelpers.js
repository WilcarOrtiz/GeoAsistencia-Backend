function obtenerFechaYHoraActual() {
  const ahora = new Date();
  ahora.setDate(ahora.getDate());
  const fecha = ahora.toISOString().split("T")[0]; // YYYY-MM-DD
  const hora = ahora.toTimeString().slice(0, 8); // HH:mm:ss
  return { fecha, hora };
}

function obtenerPeriodoActual() {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = fecha.getMonth() + 1;
  const periodo = `${año}-${mes <= 6 ? "1" : "2"}`;
  return periodo;
}

module.exports = {
  obtenerFechaYHoraActual,
  obtenerPeriodoActual,
};
