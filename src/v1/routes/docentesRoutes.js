const express = require("express");
const router = express.Router();
const docenteController = require("../../controllers/docentesController");
const { verify } = require("jsonwebtoken");

/**
 * @openapi
 * /docente/registrarDocente:
 *   post:
 *     tags:
 *       - Docente
 *     summary: Crea un nuevo docente en el sistema
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario registrado correctamente."
 *                 idUsuario:
 *                   type: string
 *                   example: "d7e5d8f2-5f7c-4d85-b9a1-1d1cdeae2e23"
 *                 rol:
 *                   type: string
 *                   example: "ESTUDIANTE"
 *       400:
 *         description: Error en la solicitud (por ejemplo, correo ya existe)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El correo ya está registrado."
 *       5XX:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear usuario: descripción detallada"
 */
router.post("/registrarDocente", docenteController.registrarUsuarioDocente);

module.exports = router;
