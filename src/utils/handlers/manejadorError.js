function manejarError(res, error) {
  console.error("Error capturado:", error); 

  const mensaje = error.message || "Error desconocido";
  
  if (mensaje.includes("no está")) {
    return res.status(404).json({ success: false, error: mensaje });
  } 
  
  if (mensaje.includes("ya está")) {
    return res.status(409).json({ success: false, error: mensaje });
  } 
  
  if (mensaje.includes("parámetro") || mensaje.includes("inválido")) {
    return res.status(400).json({ success: false, error: mensaje });
  }

  return res.status(500).json({ 
    success: false, 
    error: "Error interno del servidor", 
    detalle: mensaje 
  });
}

module.exports = manejarError;
