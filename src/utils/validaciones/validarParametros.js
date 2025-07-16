function validarParametros(req, res, keys) {
  for (const key of keys) {
    if (!req.params[key]) {
      res.status(400).json({ error: `El ${key} no debe ir vacío.` });
      return false;
    }
  }
  return true;
}

module.exports = validarParametros;