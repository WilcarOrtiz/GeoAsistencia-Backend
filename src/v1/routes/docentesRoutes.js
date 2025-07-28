const express = require("express");
const router = express.Router();
const docenteController = require("../../controllers/docentesController");
const { verifyToken } = require("../../middlewares/verifyToken");
const { authorizeRoles } = require("../../middlewares/authorizeRoles");
const validarCampos = require("../../middlewares/validarCamposObligatorios");

/**
 * @openapi
 * /docente/{id_docente}/grupos:
 *   post:
 *     summary: Asignar grupos de clase a un docente
 *     description: Asigna uno o varios grupos a un docente.
 *     tags:
 *       - Docente
 *     parameters:
 *       - name: id_docente
 *         in: path
 *         required: true
 *         description: ID único del docente
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
 *                         example: "Este grupo ya tiene un docente asignado."
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
 *                   example: "El docente no está registrado."
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
  "/:id_docente/grupos",
  validarCampos(["id_docente"], "params"),
  validarCampos(["grupos"], "body"),
  docenteController.asignarGruposDeClase
);

/**
 * @openapi
 * /docente/grupos:
 *   get:
 *     summary: Consultar docentes con sus grupos y asignaturas
 *     description: Retorna todos los docentes con la lista de grupos a los que pertenecen y las asignaturas asociadas. Si se envía un ID de docente por query param, devuelve únicamente la información de ese docente.
 *     tags:
 *       - Docente
 *     parameters:
 *       - name: id_docente
 *         in: query
 *         required: false
 *         description: ID único del docente (opcional)
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Lista de docentes con sus asignaturas y grupos
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
 *                   example: "Lista de docentes con sus grupos y asignaturas."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "8INV6ygSwxV8OOsR4keetq4hv3V2"
 *                       uuidTelefono:
 *                         type: string
 *                         example: "aabbccdd-1122-3341"
 *                       identificacion:
 *                         type: string
 *                         example: "1111111111"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *                       nombreCompleto:
 *                         type: string
 *                         example: "Wilcar Daniel Ortiz Colpas"
 *                       correo:
 *                         type: string
 *                         example: "daniel@unicesar.edu.co"
 *                       asignaturas:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "1"
 *                             nombre:
 *                               type: string
 *                               example: "Lógica de Programación IV"
 *                             grupos:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     example: "14"
 *                                   nombre:
 *                                     type: string
 *                                     example: "Grupo A"
 *                                   codigo:
 *                                     type: string
 *                                     example: "GRP-A-01"
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

router.get("/grupos", docenteController.consultarDocentesConSusGrupos);

/**
 * @openapi
 * /docente/me:
 *   get:
 *     summary: Consultar mi informacion de perfil, junto con  grupos y asignaturas
 *     description: Retorna toda la informacion asociada al docente que inicio sesion, incluyendo la lista de grupos a los que pertenece y las asignaturas asociadas.
 *     tags:
 *       - Docente
 *     responses:
 *       200:
 *         description: Detalle del docente con grupos y asignaturas.
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
 *                   example: "Detalle del docente con grupos y asignaturas."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "8INV6ygSwxV8OOsR4keetq4hv3V2"
 *                       uuidTelefono:
 *                         type: string
 *                         example: "aabbccdd-1122-3341"
 *                       identificacion:
 *                         type: string
 *                         example: "1111111111"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *                       nombreCompleto:
 *                         type: string
 *                         example: "Wilcar Daniel Ortiz Colpas"
 *                       correo:
 *                         type: string
 *                         example: "daniel@unicesar.edu.co"
 *                       asignaturas:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "1"
 *                             nombre:
 *                               type: string
 *                               example: "Lógica de Programación IV"
 *                             grupos:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     example: "14"
 *                                   nombre:
 *                                     type: string
 *                                     example: "Grupo A"
 *                                   codigo:
 *                                     type: string
 *                                     example: "GRP-A-01"
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

router.get("/me", verifyToken, docenteController.obtenerMiPerfil);

module.exports = router;
