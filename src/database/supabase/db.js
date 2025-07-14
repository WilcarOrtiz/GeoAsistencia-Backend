const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.SUPABASE_DB_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: { rejectUnauthorized: false }, // Requerido por Supabase
  },
  define: {
    freezeTableName: true, // Evita que Sequelize pluralice los nombres
    timestamps: false, // Si tus tablas no tienen createdAt/updatedAt
  },
});

module.exports = sequelize;
