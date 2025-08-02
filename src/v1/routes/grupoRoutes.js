const grupoController = require("../../controllers/grupoController");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/verifyToken");
const { authorizeRoles } = require("../../middlewares/authorizeRoles");

/**
 * @openapi
 * /grupo/registrar:
 *   post:
 *     summary: Crea un nuevo grupo con sus horarios
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
 *                 example: "1065"
 *               estado_asistencia:
 *                 type: boolean
 *                 example: true
 *               horarios:
 *                 type: array
 *                 description: Lista de horarios del grupo
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_dia
 *                     - hora_inicio
 *                     - hora_fin
 *                   properties:
 *                     id_dia:
 *                       type: integer
 *                       example: 1
 *                     hora_inicio:
 *                       type: string
 *                       format: time
 *                       example: "08:00:00"
 *                     hora_fin:
 *                       type: string
 *                       format: time
 *                       example: "10:00:00"
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
 *                       example: "1065"
 *                     id_asignatura:
 *                       type: integer
 *                       example: 1
 *                     estado_asistencia:
 *                       type: boolean
 *                       example: true
 *       409:
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
router.post(
  "/registrar",
  verifyToken,
  authorizeRoles("ADMINISTRADOR"),
  grupoController.crearGrupo
);

/**
 * @openapi
 * /grupo/editar/{id_grupo}:
 *   put:
 *     summary: Editar un grupo existente y sus horarios
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
 *                 example: Grupo B Modificado
 *               codigo:
 *                 type: string
 *                 example: GRP102
 *               id_asignatura:
 *                 type: integer
 *                 example: 1
 *               id_docente:
 *                 type: string
 *                 nullable: true
 *                 example: "1065"
 *               estado_asistencia:
 *                 type: boolean
 *                 example: true
 *               horarios:
 *                 type: array
 *                 description: Lista de horarios para asociar al grupo. Si se omite, no se modifican.
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_dia:
 *                       type: integer
 *                       example: 1
 *                     hora_inicio:
 *                       type: string
 *                       format: time
 *                       example: "08:00"
 *                     hora_fin:
 *                       type: string
 *                       format: time
 *                       example: "10:00"
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
 *                   $ref: '#/components/schemas/Grupo'
 *       404:
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
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */
router.put(
  "/editar/:id_grupo",
  verifyToken,
  authorizeRoles("ADMINISTRADOR"),
  grupoController.editarGrupo
);

/**
 * @openapi
 * /grupo/eliminar/{id_grupo}:
 *   delete:
 *     summary: Eliminar un grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_grupo
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del grupo a eliminar
 *     responses:
 *       200:
 *         description: Grupo eliminado correctamente
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
 *                   example: Grupo eliminado correctamente.
 *       404:
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
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor ...
 */
router.delete(
  "/eliminar/:id_grupo",
  verifyToken,
  authorizeRoles("ADMINISTRADOR"),
  grupoController.eliminarGrupo
);

/**
 * @openapi
 * /grupo/{id_grupo}/estudiante/{id_estudiante}:
 *   delete:
 *     summary: Eliminar un estudiante de un grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_grupo
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del grupo
 *       - in: path
 *         name: id_estudiante
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del estudiante a eliminar del grupo
 *     responses:
 *       200:
 *         description: Estudiante eliminado del grupo correctamente
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
 *                   example: Estudiante eliminado del grupo correctamente.
 *       404:
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
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor ...
 */
router.delete(
  "/:id_grupo/estudiante/:id_estudiante",
  verifyToken,
  authorizeRoles("ADMINISTRADOR"),
  grupoController.eliminarEstudianteDeGrupo
);

/**
 * @openapi
 * /grupo/{id_grupo}/trasladar/{id_nuevo_grupo}/estudiante/{id_estudiante}/semestre/{semestre}:
 *   put:
 *     summary: Trasladar un estudiante de un grupo a otro grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_grupo
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del grupo
 *       - in: path
 *         name: id_nuevo_grupo
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del nuevo grupo del estudiante
 *       - in: path
 *         name: id_estudiante
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: semestre
 *         schema:
 *           type: string
 *         required: false
 *         description: Semestre actual al traslado
 *     responses:
 *       200:
 *         description: Estudiante trasladado al nuevo grupo correctamente
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
 *                   example: Estudiante trasladado al nuevo grupo correctamente.
 *       404:
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
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor ...
 */
router.put(
  "/:id_grupo/trasladar/:id_nuevo_grupo/estudiante/:id_estudiante/semestre/:semestre",
  verifyToken,
  authorizeRoles("ADMINISTRADOR"),
  grupoController.trasladarEstudianteDeGrupo
);

/**
 * @openapi
 * /grupo/{id_grupo}:
 *   get:
 *     summary: Consultar un grupo por ID
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_grupo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo a consultar
 *     responses:
 *       200:
 *         description: Grupo consultado correctamente
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
 *                   example: Grupo consultado correctamente.
 *                 grupo:
 *                   type: object
 *                   properties:
 *                     id_grupo:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: Grupo A
 *                     codigo:
 *                       type: string
 *                       example: GRP101
 *                     id_docente:
 *                       type: string
 *                       nullable: true
 *                       example: "1065"
 *                     id_asignatura:
 *                       type: integer
 *                       example: 1
 *                     estado_asistencia:
 *                       type: boolean
 *                       example: true
 *                     horarios:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_dia:
 *                             type: integer
 *                             example: 2
 *                           hora_inicio:
 *                             type: string
 *                             format: time
 *                             example: "08:00"
 *                           hora_fin:
 *                             type: string
 *                             format: time
 *                             example: "10:00"
 *       404:
 *         description: ID inválido o grupo no registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no está registrado.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */
router.get(
  "/:id_grupo",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "DOCENTE"),
  grupoController.consultarGrupoPorId
);

/**
 * @openapi
 * /grupo/asignatura/{id_asignatura}/docente/{id_docente}:
 *   get:
 *     summary: Consultar grupos de una asignatura asociados a un docente
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_asignatura
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_docente
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grupos consultados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 mensaje:
 *                   type: string
 *                 grupos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Grupo'
 *       400:
 *         description: Parámetros invalidos/faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no está registrado.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */
router.get(
  "/asignatura/:id_asignatura/docente/:id_docente",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "DOCENTE"),
  grupoController.consultarGruposPorDocente
);

/**
 * @openapi
 * /grupo/asignatura/{id_asignatura}/semestre/{semestre}:
 *   get:
 *     summary: Consultar grupos de una asignatura
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_asignatura
 *         required: true
 *         schema:
 *           type: integer
 *      - in: path
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grupos consultados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 mensaje:
 *                   type: string
 *                 grupos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Grupo'
 *       404:
 *         description: Parámetros invalidos/faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no está registrado.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */
router.get(
  "/asignatura/:id_asignatura/semestre/:semestre",
  verifyToken,
  authorizeRoles("ADMINISTRADOR"),
  grupoController.consultarGruposPorAsignatura
);

/**
 * @openapi
 * /grupo/asignatura/{id_asignatura}/estudiante/{id_estudiante}:
 *   get:
 *     summary: Consultar grupos de una asignatura asociados a un estudiante
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_asignatura
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_estudiante
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grupos consultados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 mensaje:
 *                   type: string
 *                 grupos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Grupo'
 *       404:
 *         description: Parámetros invalidos/faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no está registrado.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */
router.get(
  "/asignatura/:id_asignatura/estudiante/:id_estudiante",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "ESTUDIANTE"),
  grupoController.consultarGruposPorEstudiante
);

/**
 * @openapi
 * /grupo/{id_grupo}/estudiantes:
 *   get:
 *     summary: Consultar estudiantes de un grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_grupo
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiantes consultados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 mensaje:
 *                   type: string
 *                 estudiantes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Parámetros invalidos/faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no está registrado.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */
router.get(
  "/:id_grupo/estudiantes",
  verifyToken,
  authorizeRoles("ADMINISTRADOR"),
  grupoController.consultarEstudiantesPorId
);

/**
 * @openapi
 * /grupo/{id_grupo}/asistencia:
 *   patch:
 *     summary: Iniciar llamado a lista
 *     description: Inicia el llamado a lista de un grupo si la solicitud se realiza dentro del horario permitido.
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_grupo
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tema:
 *                 type: string
 *                 example: "Bases de datos"
 *     responses:
 *       201:
 *         description: Llamado a lista iniciado correctamente
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
 *                   example: Iniciado llamado a lista correctamente.
 *                 historial:
 *                   $ref: '#/components/schemas/Historial'
 *       400:
 *         description: El grupo no tiene clase en este momento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no tiene clase en este momento.
 *       404:
 *         description: Grupo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no está registrado.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */
router.patch(
  "/:id_grupo/asistencia",
  verifyToken,
  authorizeRoles("DOCENTE"),
  grupoController.iniciarLlamadoLista
);

/**
 * @openapi
 * /grupo/{id_grupo}/asistencia/detener:
 *   patch:
 *     summary: Detener llamado a lista
 *     description: Detiene el llamado a lista de un grupo.
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_grupo
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Llamado a lista detenido correctamente
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
 *                   example: Detenido llamado a lista correctamente.
 *       404:
 *         description: Grupo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no está registrado.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */
router.patch(
  "/:id_grupo/asistencia/detener",
  verifyToken,
  authorizeRoles("DOCENTE"),
  grupoController.detenerLlamadoLista
);

/**
 * @openapi
 * /grupo/{id_grupo}/asistencia/cancelar:
 *   patch:
 *     summary: Cancelar llamado a lista
 *     description: Cancelar el llamado a lista de un grupo.
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id_grupo
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Llamado a lista cancelado correctamente
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
 *                   example: Cancelado llamado a lista correctamente.
 *       404:
 *         description: Grupo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El grupo no está registrado.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor: ..."
 */
router.patch(
  "/:id_grupo/asistencia/cancelar",
  verifyToken,
  authorizeRoles("DOCENTE"),
  grupoController.cancelarLlamadoLista
);

module.exports = router;
