function manejarError(res, error) {
  if (error.message.includes('está')) {
    return res.status(400).json({ error: error.message });
  } else {
    return res.status(500).json({ error: `Error interno del servidor: ${error}` });
  }
}

module.exports = manejarError;