const express = require("express");
const router = express.Router();
const asignaturaController = require("../../controllers/asignaturaController");

/**
 * @openapi
 * /api/v1/asignaturas:
 *   post:
 *     summary: Crea una nueva asignatura
 *     tags: [Asignaturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asignatura'
 *     responses:
 *       201:
 *         description: Asignatura registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: Asignatura registrada correctamente.
 *                 asignatura:
 *                   $ref: '#/components/schemas/Asignatura'
 *       400:
 *         description: La asignatura ya está registrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: La asignatura ya está registrada.
 *       500:
 *         description: Error interno del servidor
 */

router.post("/asignaturas", asignaturaController.crearAsignatura);

module.exports = router;
