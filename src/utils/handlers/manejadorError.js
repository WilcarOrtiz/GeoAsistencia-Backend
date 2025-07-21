function manejarError(res, error) {
  if (error.message.includes('no está')) {
    return res.status(404).json({ error: error.message });
  } else {
    if (error.message.includes('ya está')) {
      return res.status(409).json({ error: error.message });
    } else {
      return res.status(500).json({ error: `Error interno del servidor: ${error}` });
    }
  }
}

module.exports = manejarError;