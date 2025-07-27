const express = require("express");
const router = express.Router();
const historialController = require("../../controllers/historialController");

/**
 * @openapi
 * /historial/{id_historial_asistencia}:
 *   get:
 *     summary: Consultar estudiantes por ID de historial de asistencia
 *     tags:
 *       - Historial de Asistencia
 *     parameters:
 *       - in: path
 *         name: id_historial_asistencia
 *         required: true
 *         description: ID del historial de asistencia
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Lista de estudiantes que registraron su asistencia
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
 *                   example: Estudiantes de la lista consultados correctamente.
 *                 estudiantes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_asistencia:
 *                         type: integer
 *                         example: 5
 *                       id_estudiante:
 *                         type: integer
 *                         example: 12
 *                       id_historial_asistencia:
 *                         type: integer
 *                         example: 3
 *                       hora:
 *                         type: string
 *                         format: time
 *                         example: "15:09:00"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *       400:
 *         description: Parámetros inválidos o ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Faltan parámetros requeridos: id_historial_asistencia"
 *       404:
 *         description: No se encontró el historial de asistencia
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "El historial de asistencia con el ID proporcionado no existe."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Ha ocurrido un error inesperado en el servidor."
 */
router.get("/:id_historial_asistencia", historialController.consultarEstudiantesPorIdHistorial);

/**
 * @openapi
 * /historial/grupo/{id_grupo}:
 *   get:
 *     summary: Consultar todas las listas de asistencia de un grupo
 *     description: Retorna el historial de asistencias asociado a un grupo específico.
 *     tags: [Historial]
 *     parameters:
 *       - in: path
 *         name: id_grupo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del grupo.
 *     responses:
 *       200:
 *         description: Listas de asistencia consultadas correctamente.
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
 *                   example: Listas de asistencia consultadas correctamente.
 *                 listas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Historial'
 *       400:
 *         description: Parámetros inválidos o faltantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El id_grupo no puede ir vacío.
 *       404:
 *         description: Grupo no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no está registrado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */
router.get("/grupo/:id_grupo", historialController.consultarHistorialPorIdGrupo);

module.exports = router;