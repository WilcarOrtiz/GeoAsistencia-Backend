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

/**
 * @openapi
 * /grupo/editar/{id_grupo}:
 *   put:
 *     summary: Editar un grupo existente
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_grupo
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del grupo a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Grupo A
 *               codigo:
 *                 type: string
 *                 example: GRP001
 *               id_asignatura:
 *                 type: integer
 *                 example: 1
 *               id_docente:
 *                 type: string
 *                 nullable: true
 *                 example: 2
 *               estado_asistencia:
 *                 type: boolean
 *                 example: true
 *             required:
 *               - nombre
 *               - codigo
 *               - id_asignatura
 *               - estado_asistencia
 *     responses:
 *       200:
 *         description: Grupo editado correctamente
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
 *                   example: Grupo editado correctamente.
 *                 grupo:
 *                   type: object
 *       400:
 *         description: Error de validación o grupo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no está registrado.
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error del servidor...
 */

router.put("/editar/:id_grupo", grupoController.editarGrupo);

module.exports = router;