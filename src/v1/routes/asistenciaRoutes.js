const express = require("express");
const router = express.Router();
const asistenciaController = require("../../controllers/asistenciaController");
const { verifyToken } = require("../../middlewares/verifyToken");
const validarCampos = require("../../middlewares/validarCamposObligatorios");

/**
 * @openapi
 * /asistencia/registrar:
 *   post:
 *     tags:
 *       - Asistencia
 *     summary: Registrar la asistencia de un estudiante en una clase
 *     description: Registra la asistencia de un estudiante autenticado a un grupo/clase usando fecha y hora actual.
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
 *             properties:
 *               id_grupo:
 *                 type: string
 *                 example: 1
 *     responses:
 *       200:
 *         description: Asistencia registrada exitosamente
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
 *                   example: "Asistencia Registrada"
 *                 asistente:
 *                   type: string
 *                   example: "UUID_DEL_ESTUDIANTE"
 *       404:
 *         description: No se encontró el grupo o el estudiante
 *       409:
 *         description: La asistencia ya está registrada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/registrar",
  verifyToken,
  validarCampos(["id_grupo"], "body"),
  asistenciaController.registrarAsistencia
);

/**
 * @openapi
 * /asistencia/estudiante/{id_estudiante}/grupo/{id_grupo}/estado:
 *   patch:
 *     tags:
 *       - Asistencia
 *     summary: Cambiar el estado de asistencia de un estudiante
 *     description: Alterna el estado (true ↔ false) de la asistencia de un estudiante para una fecha actual.
 *     parameters:
 *       - in: path
 *         name: id_estudiante
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *       - in: path
 *         name: id_grupo
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de asistencia actualizado
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
 *                   example: "Registro de asistencia actualizado."
 *                 asistente:
 *                   type: string
 *                   example: "Hr3BVwCLocRJ5amsEuj1mmUJCci2"
 *       404:
 *         description: No se encontró el registro de asistencia
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
  "/estudiante/:id_estudiante/grupo/:id_grupo/estado",
  validarCampos(["id_estudiante", "id_grupo"], "params"),
  asistenciaController.cambiarEstadoAsistencia
);

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
router.post(
  "/validarUbicacion",
  validarCampos(["latitud", "longitud"], "body"),
  asistenciaController.validarUbicacion
);

/**
 * @openapi
 * /asistencia/manual:
 *   patch:
 *     tags:
 *       - Asistencia
 *     summary: Crear asistencia manualmente
 *     description: Crea un registro de asistencia manualmente para un estudiante en un grupo específico.
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
 *               - identificacion
 *             properties:
 *               id_grupo:
 *                 type: integer
 *                 example: 22
 *               identificacion:
 *                 type: string
 *                 example: "1066865144"
 *     responses:
 *       200:
 *         description: Estado de asistencia actualizado
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
 *                   example: "Registro de asistencia actualizado."
 *                 asistente:
 *                   type: string
 *                   example: "Hr3BVwCLocRJ5amsEuj1mmUJCci2"
 *       404:
 *         description: No se encontró el registro de asistencia
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
  "/manual",
  validarCampos(["id_grupo", "identificacion"], "body"),
  asistenciaController.crearAsistenciaManualmente
);

/**
 * @openapi
 * /asistencia/estudiante/{id_estudiante}/grupo/{id_grupo}:
 *   get:
 *     tags:
 *       - Asistencia
 *     summary: Obtener las asistencias de un estudiante para un grupo específico.
 *     description: Retorna el listado de asistencias de un estudiante en un grupo, incluyendo fecha, hora y estado.
 *     parameters:
 *       - in: path
 *         name: id_estudiante
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *       - in: path
 *         name: id_grupo
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asistencias
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
 *                   example: "Asistencias obtenidas correctamente."
 *                 asistencias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_historial_asistencia:
 *                         type: string
 *                         example: "16"
 *                       hora:
 *                         type: string
 *                         format: time
 *                         example: "13:10:13"
 *                       estado_asistencia:
 *                         type: boolean
 *                         example: true
 *                       fecha:
 *                         type: string
 *                         format: date
 *                         example: "2025-07-23"
 *       404:
 *         description: No se encontraron asistencias
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
 *                   example: "No se encontraron asistencias para el estudiante en el grupo especificado."
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
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */

router.get(
  "/estudiante/:id_estudiante/grupo/:id_grupo",
  validarCampos(["id_estudiante", "id_grupo"], "params"),
  asistenciaController.obtenerAsistenciaPorEstudianteYGrupo
);

module.exports = router;
