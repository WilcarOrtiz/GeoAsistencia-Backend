// ❌ NO uses async aquí
// const authorizeRoles = async (...roles) => {
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.rol;

    if (!userRole || !roles.includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Acceso denegado: rol no autorizado" });
    }

    next();
  };
};

module.exports = { authorizeRoles };
