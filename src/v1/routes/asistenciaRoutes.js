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
 *               - id_estudiante
 *             properties:
 *               id_grupo:
 *                 type: integer
 *                 example: 22
 *               id_estudiante:
 *                 type: string
 *                 example: "Hr3BVwCLocRJ5amsEuj1mmUJCci2"
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

/**
 * @openapi
 * /asistencia/validarUbicacion:
 *   post:
 *     tags:
 *       - Asistencia
 *     summary: Validar la ubicación del usuario
 *     description: Verifica si el usuario se encuentra dentro de la geocerca de la universidad.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitud
 *               - longitud
 *             properties:
 *               latitud:
 *                 type: number
 *                 example: 10.476013
 *               longitud:
 *                 type: number
 *                 example: -73.259493
 *     responses:
 *       200:
 *         description: Resultado de la validación de geocerca.
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
 *                   example: "Está dentro de la geocerca"
 *                 dentro:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Error de validación o parámetros incorrectos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/validarUbicacion", asistenciaController.validarUbicacion);

module.exports = router;
