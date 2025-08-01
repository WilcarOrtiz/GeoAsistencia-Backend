const express = require("express");
const router = express.Router();
const estudianteController = require("../../controllers/estudiantesController");
const validarCampos = require("../../middlewares/validarCamposObligatorios");
const { verifyToken } = require("../../middlewares/verifyToken");

/**
 * @openapi
 * /estudiante/sin-grupo/{id_asignatura}/{periodo}:
 *   get:
 *     tags:
 *       - Estudiante
 *     summary: Obtiene todos los estudiantes que NO estan registrados en ningun grupo de esa asignatura para el periodo especificado.
 *     parameters:
 *       - in: path
 *         name: id_asignatura
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignatura
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *         description: Período académico "2023-2"
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida correctamente
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
 *                   example: "Estudiantes fuera de Programación Móvil período 2025-1."
 *                 estudiantes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_estudiante:
 *                         type: string
 *                         example: "XDIpEdPHFENBjIjtWjOk3w3jdYT2"
 *                       identificacion:
 *                         type: string
 *                         example: "1232123212"
 *                       nombres:
 *                         type: string
 *                         example: "Carlos Andrés"
 *                       apellidos:
 *                         type: string
 *                         example: "Pérez Gómez"
 *                       correo:
 *                         type: string
 *                         example: "perez@unicesar.edu.co"
 *       400:
 *         description: Error al obtener los estudiantes
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
 *                   example: "Error al obtener usuarios"
 */
router.get(
  "/sin-grupo/:id_asignatura/:periodo",
  validarCampos(["id_asignatura", "periodo"], "params"),
  estudianteController.obtenerEstudiantesNoAsignadosAGrupo
);

/**
 * @openapi
 * /estudiante/{id_estudiante}/grupos:
 *   post:
 *     summary: Asignar grupos de clase a un estudiante
 *     description: >
 *       Asigna uno o varios grupos a un estudiante en la tabla intermedia ESTUDIANTE_GRUPO.
 *       La función evita asignaciones duplicadas y conflictos por asignaturas, permitiendo que
 *       un estudiante esté en un solo grupo por asignatura en un mismo período académico.
 *       También valida que los grupos existan antes de intentar la asignación.
 *
 *       - **grupos** (Body): se refiere a los id_grupo_periodo, ya que la entidad grupo es atemporal,
 *         pero grupo_periodo no (lo que permite discernir entre grupos de diferentes semestres).
 *     tags:
 *       - Estudiante
 *     parameters:
 *       - name: id_estudiante
 *         in: path
 *         required: true
 *         description: ID único del estudiante
 *         schema:
 *           type: string
 *           example: "12345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grupos:
 *                 type: array
 *                 description: Lista de IDs de grupo_periodo a asignar.
 *                 items:
 *                   type: integer
 *             example:
 *               grupos: [14, 18, 4]
 *     responses:
 *       200:
 *         description: Grupos asignados correctamente, mostrando cuáles fueron registrados y cuáles se omitieron con motivo.
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
 *                   example: "No se asignaron nuevos grupos."
 *                 registrados:
 *                   type: array
 *                   description: Lista de grupos que se registraron exitosamente
 *                   items:
 *                     type: string
 *                   example: []
 *                 omitidos:
 *                   type: array
 *                   description: Lista de grupos que no se asignaron, agrupados por motivo
 *                   items:
 *                     type: object
 *                     properties:
 *                       grupos:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Grupo A", "Grupo B"]
 *                       motivo:
 *                         type: string
 *                         example: "Ya tiene un grupo de esta asignatura"
 *             example:
 *               success: true
 *               mensaje: "No se asignaron nuevos grupos."
 *               registrados: []
 *               omitidos:
 *                 - grupos: ["Grupo A"]
 *                   motivo: "Ya asignado al estudiante"
 *                 - grupos: ["Grupo B"]
 *                   motivo: "Ya tiene un grupo de esta asignatura"
 *                 - grupos: [" ID 7"]
 *                   motivo: "El grupo no existe"
 *       400:
 *         description: Error de validación
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
 *                   example: "El estudiante no está registrado."
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
 *                   example: "Error al asignar grupos de clase: Detalle del error."
 */

router.post(
  "/:id_estudiante/grupos",
  validarCampos(["id_estudiante"], "params"),
  validarCampos(["grupos"], "body"),
  estudianteController.asignarGruposDeClase
);

/**
 * @openapi
 * /estudiante/grupos:
 *   get:
 *     summary: Consultar estudiantes con sus grupos y asignaturas
 *     description: Retorna todos los estudiantes con la lista de grupos a los que pertenecen y las asignaturas asociadas. Si se envía un ID de estudiante por query param, devuelve únicamente la información de ese estudiante.
 *     tags:
 *       - Estudiante
 *     parameters:
 *       - name: id_estudiante
 *         in: query
 *         required: false
 *         description: ID único del estudiante (opcional)
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Lista de estudiantes con sus grupos y asignaturas
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
 *                   example: "Lista de estudiantes con sus grupos y asignaturas."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "E001"
 *                       nombreCompleto:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       correo:
 *                         type: string
 *                         example: "juan.perez@email.com"
 *                       uuidTelefono:
 *                         type: string
 *                         example: "aabbccdd-1122-3344"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *                       grupos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 5
 *                             nombre:
 *                               type: string
 *                               example: "Grupo A"
 *                             asignatura:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 10
 *                                 nombre:
 *                                   type: string
 *                                   example: "Programación I"
 *       400:
 *         description: Error en la consulta
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
 *                   example: "Error al obtener estudiantes."
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
 *                   example: "Error inesperado en el servidor."
 */

router.get("/grupos", estudianteController.consultarEstudiantesConSusGrupos);

/**
 * @openapi
 * /estudiante/me:
 *   get:
 *     summary: Consultar mi informacion de perfil, junto con  grupos de clase.
 *     description: Retorna toda la informacion asociada al estudiante que inicio sesion, incluyendo la lista de grupos a los que pertenece.
 *     tags:
 *       - Estudiante
 *     responses:
 *       200:
 *         description: Detalle del estudiante con grupos y asignaturas.
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
 *                   example: "Detalle del estudiante con grupos y asignaturas."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "E001"
 *                       nombreCompleto:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       correo:
 *                         type: string
 *                         example: "juan.perez@email.com"
 *                       uuidTelefono:
 *                         type: string
 *                         example: "aabbccdd-1122-3344"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *                       grupos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 5
 *                             nombre:
 *                               type: string
 *                               example: "Grupo A"
 *                             asignatura:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 10
 *                                 nombre:
 *                                   type: string
 *                                   example: "Programación I"
 *       400:
 *         description: Error en la consulta
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
 *                   example: "Error al obtener docentes."
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
 *                   example: "Error inesperado en el servidor."
 */

router.get("/me", verifyToken, estudianteController.obtenerMiPerfil);

module.exports = router;
