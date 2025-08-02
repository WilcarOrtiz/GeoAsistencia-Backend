const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/verifyToken");
const { authorizeRoles } = require("../../middlewares/authorizeRoles");
const metricaController = require("../../controllers/metricaController");

/**
 * @openapi
 * /metricas/resumen-general:
 *   get:
 *     summary: Obtener métricas generales del sistema educativo
 *     description: >
 *       Retorna un resumen estadístico clave del sistema educativo, adaptado al rol del usuario autenticado. Esta función retorna un resumen de métricas generales del sistema de asistencia, ajustado al rol del usuario. Si es administrador, entrega conteos globales como total de asignaturas, docentes, estudiantes y grupos, además del número de docentes activos e inactivos en un periodo. Si es docente, muestra cuántas asignaturas y grupos imparte y cuántos estudiantes tiene asignados en ese periodo.
 *
 *     parameters:
 *       - in: query
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *           example: "2025-1"
 *         description: semestre académico a consultar (obligatorio para el administrador)
 *     tags:
 *       - Métricas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas generales obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               oneOf:
 *                 - properties:
 *                     total_asignaturas:
 *                       type: integer
 *                       example: 9
 *                     total_estudiantes:
 *                       type: integer
 *                       example: 24
 *                     total_grupos:
 *                       type: integer
 *                       example: 8
 *                     total_docentes:
 *                       type: integer
 *                       example: 12
 *                 - properties:
 *                     total_asignaturas:
 *                       type: integer
 *                       example: 2
 *                     total_estudiantes:
 *                       type: integer
 *                       example: 5
 *                     total_grupos:
 *                       type: integer
 *                       example: 6
 *       401:
 *         description: Token no proporcionado o inválido.
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
 *                   example: "Token no válido o no proporcionado"
 *       500:
 *         description: Error interno del servidor al obtener métricas
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
 *                   example: "Ha ocurrido un error inesperado al consultar las métricas."
 */

router.get(
  "/resumen-general",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "DOCENTE"),
  metricaController.obtener_metricas_generales
);

/**
 * @openapi
 * /metricas/asistencia/extremos-asignatura:
 *   get:
 *     summary: Obtener métricas de la asignatura con mayor y menor asistencia
 *     description: >
 *       Esta función identifica cuál asignatura tuvo el mayor y el menor porcentaje de asistencia en un periodo o mes específico. Presenta ambos extremos en un mismo objeto JSON con sus respectivos totales y porcentajes.
 *
 *       - Metrica exclusiva del **administrador**
 *     tags:
 *       - Métricas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *           example: "2025-1"
 *         description: semestre académico a consultar (obligatorio para el administrador)
 *       - in: query
 *         name: mes
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         description: Número del mes dentro del semestre académico (opcional)
 *     responses:
 *       200:
 *         description: Métricas generales obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 asignatura_mayor_asistencia:
 *                   type: object
 *                   properties:
 *                     id_asignatura:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Matemáticas"
 *                     total_asistencias:
 *                       type: integer
 *                       example: 14
 *                     total_registros:
 *                       type: integer
 *                       example: 20
 *                     porcentaje_asistencia:
 *                       type: number
 *                       format: float
 *                       example: 70.0
 *                 asignatura_menor_asistencia:
 *                   type: object
 *                   properties:
 *                     id_asignatura:
 *                       type: integer
 *                       example: 2
 *                     nombre:
 *                       type: string
 *                       example: "Física"
 *                     total_asistencias:
 *                       type: integer
 *                       example: 5
 *                     total_registros:
 *                       type: integer
 *                       example: 15
 *                     porcentaje_asistencia:
 *                       type: number
 *                       format: float
 *                       example: 33.33
 *       401:
 *         description: Token no proporcionado o inválido.
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
 *                   example: "Token no válido o no proporcionado"
 *       500:
 *         description: Error interno del servidor al obtener métricas
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
 *                   example: "Ha ocurrido un error inesperado al consultar las métricas."
 */

router.get(
  "/asistencia/extremos-asignatura",
  verifyToken,
  authorizeRoles("ADMINISTRADOR"),
  metricaController.obtener_asignatura_con_mayor_y_menor_asistencia
);

/**
 * @openapi
 * /metricas/asistencia/por-asignatura:
 *   get:
 *     summary: calcula el porcentaje de asistencias e inasistencias por asignatura.
 *     description: >
 *       Proporciona estadísticas de asistencia e inasistencia por cada asignatura, incluyendo los porcentajes respectivos. El administrador obtiene una vista global, mientras que el docente ve solo las asignaturas que ha impartido durante el periodo o mes solicitado.
 *
 *     parameters:
 *       - in: query
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *           example: "2025-1"
 *         description: semestre académico a consultar (obligatorio para el administrador)
 *       - in: query
 *         name: mes
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         description: Número del mes dentro del semestre académico (opcional)
 *     tags:
 *       - Métricas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas generales obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               oneOf:
 *                 - properties:
 *                     id_asignatura:
 *                       type: integer
 *                       example: 1
 *                     asignatura:
 *                       type: string
 *                       example: "Matemáticas"
 *                     asistencias:
 *                       type: integer
 *                       example: 8
 *                     inasistencias:
 *                       type: integer
 *                       example: 12
 *                     porcentaje_asistencia:
 *                       type: number
 *                       format: float
 *                       example: 57.14
 *                     porcentaje_inasistencia:
 *                       type: number
 *                       format: float
 *                       example: 42.56
 *       401:
 *         description: Token no proporcionado o inválido.
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
 *                   example: "Token no válido o no proporcionado"
 *       500:
 *         description: Error interno del servidor al obtener métricas
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
 *                   example: "Ha ocurrido un error inesperado al consultar las métricas."
 */

router.get(
  "/asistencia/por-asignatura",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "DOCENTE"),
  metricaController.obtener_asistencia_por_asignatura
);

/**
 * @openapi
 * /metricas/asistencia/{p_id_asignatura}/por-grupo:
 *   get:
 *     summary: calcula el porcentaje de asistencias e inasistencias por grupo de clase.
 *     parameters:
 *       - in: query
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *           example: "2025-1"
 *         description: semestre académico a consultar (obligatorio para el administrador)
 *       - in: query
 *         name: mes
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         description: Número del mes dentro del semestre académico (opcional)
 *       - in: path
 *         name: p_id_asignatura
 *         required: true
 *         schema:
 *           type: string
 *         description: ID interno de la asignatura.
 *
 *     description: >
 *       Esta función calcula el total de asistencias e inasistencias por cada grupo de una asignatura en particular, para un periodo y/o mes dado. Dependiendo del rol, el resultado se filtra globalmente (administrador) o por los grupos que dicta el docente.
 *
 *     tags:
 *       - Métricas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas generales obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               oneOf:
 *                 - properties:
 *                     id_grupo:
 *                       type: integer
 *                       example: 1
 *                     grupo:
 *                       type: string
 *                       example: "Matemáticas"
 *                     asistencias:
 *                       type: integer
 *                       example: 8
 *                     inasistencias:
 *                       type: integer
 *                       example: 12
 *                     porcentaje_asistencia:
 *                       type: number
 *                       format: float
 *                       example: 57.14
 *                     porcentaje_inasistencia:
 *                       type: number
 *                       format: float
 *                       example: 42.56
 *       401:
 *         description: Token no proporcionado o inválido.
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
 *                   example: "Token no válido o no proporcionado"
 *       500:
 *         description: Error interno del servidor al obtener métricas
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
 *                   example: "Ha ocurrido un error inesperado al consultar las métricas."
 */

router.get(
  "/asistencia/:p_id_asignatura/por-grupo",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "DOCENTE"),
  metricaController.obtener_asistencia_por_grupo
);

/**
 * @openapi
 * /metricas/asistencia/extremos-grupo:
 *   get:
 *     summary: los grupos con mayor y menor porcentaje de asistencia.
 *     description: >
 *       Entrega un resumen con el grupo que tuvo mayor porcentaje de asistencia y el grupo con menor porcentaje, en función del rol del usuario. El docente ve sus propios grupos, mientras que el administrador accede a todos los grupos disponibles.
 *
 *     parameters:
 *       - in: query
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *           example: "2025-1"
 *         description: semestre académico a consultar (obligatorio para el administrador)
 *       - in: query
 *         name: mes
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         description: Número del mes dentro del semestre académico (opcional)
 *     tags:
 *       - Métricas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas generales obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 grupo_mayor_asistencia:
 *                   type: object
 *                   properties:
 *                     id_grupo:
 *                       type: integer
 *                       example: 1
 *                     grupo:
 *                       type: string
 *                       example: "Matemáticas"
 *                     asistencias:
 *                       type: integer
 *                       example: 14
 *                     total:
 *                       type: integer
 *                       example: 20
 *                     porcentaje_asistencia:
 *                       type: number
 *                       format: float
 *                       example: 70.0
 *                 grupo_menor_asistencia:
 *                   type: object
 *                   properties:
 *                     id_grupo:
 *                       type: integer
 *                       example: 1
 *                     grupo:
 *                       type: string
 *                       example: "Matemáticas"
 *                     asistencias:
 *                       type: integer
 *                       example: 14
 *                     total:
 *                       type: integer
 *                       example: 20
 *                     porcentaje_asistencia:
 *                       type: number
 *                       format: float
 *                       example: 70.0
 *       401:
 *         description: Token no proporcionado o inválido.
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
 *                   example: "Token no válido o no proporcionado"
 *       500:
 *         description: Error interno del servidor al obtener métricas
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
 *                   example: "Ha ocurrido un error inesperado al consultar las métricas."
 */

router.get(
  "/asistencia/extremos-grupo",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "DOCENTE"),
  metricaController.obtener_extremos_asistencia_por_grupo
);

/**
 * @openapi
 * /metricas/inasistencia/indice:
 *   get:
 *     summary: Obtener métricas de indice de falta.
 *     description: >
 *       Devuelve el índice de inasistencia en porcentaje, junto con el total de registros y faltas. Se basa en un filtro de periodo o mes. Si es administrador, analiza todos los registros; si es docente, solo los de sus grupos asignados.
 *
 *     parameters:
 *       - in: query
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *           example: "2025-1"
 *         description: semestre académico a consultar (obligatorio para el administrador)
 *       - in: query
 *         name: mes
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         description: Número del mes dentro del semestre académico (opcional)
 *     tags:
 *       - Métricas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas generales obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               oneOf:
 *                 - properties:
 *                     total_registros:
 *                       type: integer
 *                       example: 7
 *                     total_faltas:
 *                       type: integer
 *                       example: 3
 *                     indice_faltas:
 *                       type: number
 *                       format: float
 *                       example: 42.86
 *       401:
 *         description: Token no proporcionado o inválido.
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
 *                   example: "Token no válido o no proporcionado"
 *       500:
 *         description: Error interno del servidor al obtener métricas
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
 *                   example: "Ha ocurrido un error inesperado al consultar las métricas."
 */

router.get(
  "/inasistencia/indice",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "DOCENTE"),
  metricaController.obtener_indice_faltas
);

/**
 * @openapi
 * /metricas/inasistencia/top-estudiantes:
 *   get:
 *     summary: Top 5 los estudiantes con mayor número de inasistencias
 *     description: >
 *       Genera un listado de los estudiantes con mayor número de inasistencias. El administrador recibe los 5 estudiantes con más inasistencias globales, y el docente los 5 estudiantes con más inasistencias en sus clases, desglosado por grupo.
 *
 *       - Si es **administrador** realiza el cálculo para todos los estudiantes, en todos los grupos de clase
 *
 *       - Si es **docente** evalúa únicamente los estudiantes pertenecientes a sus grupos de clase y para el semestre actual (unicamente)
 *
 *     parameters:
 *       - in: query
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *           example: "2025-1"
 *         description: semestre académico a consultar
 *       - in: query
 *         name: mes
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         description: Número del mes dentro del semestre académico (opcional)
 *     tags:
 *       - Métricas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudiantes con mayor porcentaje de inasistencia
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_estudiante:
 *                     type: string
 *                     example: "qdt4oNCsWfZXfFd6wqFu3Am8esU2"
 *                   nombres:
 *                     type: string
 *                     example: "Mateo"
 *                   apellidos:
 *                     type: string
 *                     example: "González"
 *                   correo:
 *                     type: string
 *                     example: "gonzalez@unicesar.edu.co"
 *                   grupo:
 *                     type: string
 *                     example: "Matemáticas 10A"
 *                   total_registros:
 *                     type: integer
 *                     example: 5
 *                   total_inasistencias:
 *                     type: integer
 *                     example: 5
 *                   porcentaje_inasistencia:
 *                     type: number
 *                     format: float
 *                     example: 100
 *       401:
 *         description: Token no proporcionado o inválido.
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
 *                   example: "Token no válido o no proporcionado"
 *       500:
 *         description: Error interno del servidor al obtener métricas
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
 *                   example: "Ha ocurrido un error inesperado al consultar las métricas."
 */
router.get(
  "/inasistencia/top-estudiantes",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "DOCENTE"),
  metricaController.obtener_top_inasistencias_estudiantes
);

module.exports = router;
