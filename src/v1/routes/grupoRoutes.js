const express = require("express");
const router = express.Router();
const grupoController = require("../../controllers/grupoController");

/**
 * @openapi
 * /grupo/registrar:
 *   post:
 *     summary: Crea un nuevo grupo
 *     tags: [Grupos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - codigo
 *               - id_asignatura
 *               - estado_asistencia
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Grupo A
 *               codigo:
 *                 type: string
 *                 example: GRP101
 *               id_asignatura:
 *                 type: integer
 *                 example: 1
 *               id_docente:
 *                 type: string
 *                 nullable: true
 *                 example: 1065
 *               estado_asistencia:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Grupo registrado correctamente
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
 *                   example: Grupo registrado correctamente.
 *                 grupo:
 *                   type: object
 *                   properties:
 *                     id_grupo:
 *                       type: integer
 *                       example: 10
 *                     nombre:
 *                       type: string
 *                       example: Grupo A
 *                     codigo:
 *                       type: string
 *                       example: GRP101
 *                     id_docente:
 *                       type: string
 *                       nullable: true
 *                       example: 1065
 *                     id_asignatura:
 *                       type: integer
 *                       example: 1
 *                     estado_asistencia:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Error de validación o grupo ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo ya está registrado.
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */

router.post("/registrar", grupoController.crearGrupo);

module.exports = router;