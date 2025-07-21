const express = require("express");
const router = express.Router();
const asistenciaController = require("../../controllers/asistenciaController");
const { verifyToken } = require("../../middlewares/verifyToken");

/**
 * @openapi
 * /asistencia/registrar:
 *   post:
 *     tags:
 *       - Asistencia
 *     summary: Registrar la asistencia de un estudiante en una clase
 *     description: Registra la asistencia de un estudiante autenticado a un grupo/clase en una fecha y hora específica.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_grupo
 *               - fecha
 *               - hora
 *             properties:
 *               id_grupo:
 *                 type: integer
 *                 example: 1
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-21"
 *               hora:
 *                 type: string
 *                 example: "08:15:00"
 *     responses:
 *       200:
 *         description: Asistencia registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Asistencia Registrada."
 *                 idUsuario:
 *                   type: string
 *                   example: "UUID_DEL_ESTUDIANTE"
 *       400:
 *         description: Error de validación o datos incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "La asistencia para este grupo está desactivada."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al registrar la asistencia."
 */
router.post(
  "/registrar",
  verifyToken,
  asistenciaController.registrarAsistencia
);

/**
 * @openapi
 * /asistencia/cambiarEstado:
 *   patch:
 *     tags:
 *       - Asistencia
 *     summary: Cambiar el estado de asistencia de un estudiante
 *     description: Alterna el estado (true ↔ false) de la asistencia de un estudiante según el grupo, fecha e identificación.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_grupo
 *               - fecha
 *               - identificacion
 *             properties:
 *               id_grupo:
 *                 type: integer
 *                 example: 22
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-21"
 *               identificacion:
 *                 type: string
 *                 example: "1001234567"
 *     responses:
 *       200:
 *         description: Estado de asistencia actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Estado de asistencia actualizado."
 *                 estado_asistencia:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: No se encontró el registro de asistencia
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/cambiarEstado", asistenciaController.cambiarEstadoAsistencia);

module.exports = router;
