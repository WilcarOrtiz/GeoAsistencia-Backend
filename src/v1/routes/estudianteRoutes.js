const express = require("express");
const router = express.Router();
const estudianteController = require("../../controllers/estudiantesController");
const validarCampos = require("../../middlewares/validarCamposObligatorios");
const { verifyToken } = require("../../middlewares/verifyToken");

/**
 * @openapi
 * /estudiante/sin-grupo/{id_asignatura}:
 *   get:
 *     tags:
 *       - Estudiante
 *     summary: Obtiene todos los estudiantes que NO estan registrados en ningun grupo de esa asignatura
 *     parameters:
 *       - in: path
 *         name: id_asignatura 
 *         schema:
 *           type: string
 *         description: ID de la asignatura
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
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
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
  "/sin-grupo/:id_asignatura",
  validarCampos(["id_asignatura"], "params"),
  estudianteController.obtenerEstudiantesNoAsignadosAGrupo
);

/**
 * @openapi
 * /estudiante/{id_estudiante}/grupos:
 *   post:
 *     summary: Asignar grupos de clase a un estudiante
 *     description: Asigna uno o varios grupos a un estudiante en la tabla intermedia ESTUDIANTE_GRUPO, evitando duplicados y conflictos por asignaturas.
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
 *                 description: Lista de IDs de grupos a asignar
 *                 items:
 *                   type: integer
 *             example:
 *               grupos: [14,18,4]
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
 *                   example: "Grupos asignados correctamente."
 *                 registrados:
 *                   type: array
 *                   description: Lista de grupos que se registraron exitosamente
 *                   items:
 *                     type: string
 *                   example: ["14", "18"]
 *                 omitidos:
 *                   type: array
 *                   description: Lista de grupos que no se asignaron, con motivo
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_grupo:
 *                         type: string
 *                         example: "4"
 *                       motivo:
 *                         type: string
 *                         example: "Conflicto: ya seleccionó otro grupo de la misma asignatura"
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
