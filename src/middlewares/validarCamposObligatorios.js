function validarCamposObligatorios(keys, origen = "body") {
  console.log(`Validando campos obligatorios: ${keys.join(", ")} en ${origen}`);

  return (req, res, next) => {
    const data = req[origen];
    for (const key of keys) {
      const valor = data?.[key];

      if (
        valor === undefined ||
        valor === null ||
        valor === "" ||
        (Array.isArray(valor) && valor.length === 0)
      ) {
        return res.status(400).json({
          error: `El campo '${key}' es obligatorio y no puede estar vacío.`,
        });
      }
    }
    next();
  };
}

module.exports = validarCamposObligatorios;
