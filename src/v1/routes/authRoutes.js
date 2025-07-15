const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");

/**
 * @openapi
 * /api/v1/recuperar-contrasena:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Enviar enlace de recuperación de contraseña al correo del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 example: "usuario@unicesar.edu.co"
 *     responses:
 *       200:
 *         description: Link de recuperación enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Correo enviado para restablecer contraseña."
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Correo no válido o no registrado."
 *       500:
 *         description: Error del servidor
 */
router.post("/recuperar-contrasena", authController.RecuperarContraseña);

module.exports = router;
