const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRol = req.user?.rol?.toUpperCase();
    if (!userRol || !roles.includes(userRol)) {
      return res
        .status(403)
        .json({ error: "Acceso denegado: rol no autorizado" });
    }

    next();
  };
};

module.exports = { authorizeRoles };
