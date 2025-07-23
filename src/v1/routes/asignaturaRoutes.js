const express = require("express");
const router = express.Router();
const asignaturaController = require("../../controllers/asignaturaController");
const upload = require("../../middlewares/uploadMiddleware");

/**
 * @openapi
 * /asignatura/registrar:
 *   post:
 *     summary: Crea una nueva asignatura
 *     tags: [Asignaturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asignatura'
 *     responses:
 *       201:
 *         description: Asignatura registrada correctamente
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
 *                   example: Asignatura registrada correctamente.
 *                 asignatura:
 *                   $ref: '#/components/schemas/Asignatura'
 *       409:
 *         description: La asignatura ya está registrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: La asignatura ya está registrada.
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
router.post("/registrar", asignaturaController.crearAsignatura);

/**
 * @openapi
 * /asignatura/editar/{id_asignatura}:
 *   put:
 *     summary: Editar una asignatura
 *     tags: [Asignaturas]
 *     parameters:
 *       - in: path
 *         name: id_asignatura
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asignatura a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Asignatura editada correctamente.
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
 *                   example: "Asignatura editada correctamente."
 *       404:
 *         description: Asignatura no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Asignatura no encontrada."
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
router.put("/editar/:id_asignatura", asignaturaController.editarAsignatura);

/**
 * @openapi
 * /asignatura/habilitar/{id_asignatura}:
 *   patch:
 *     summary: Habilitar/Deshabilitar una asignatura
 *     tags: [Asignaturas]
 *     parameters:
 *       - in: path
 *         name: id_asignatura
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asignatura a habilitar/deshabilitar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Asignatura habilitada correctamente
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
 *                   example: "Asignatura habilitada correctamente."
 *       404:
 *         description: Asignatura no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Asignatura no encontrada."
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
router.patch("/habilitar/:id_asignatura", asignaturaController.habilitarAsignatura);

/**
 * @openapi
 * /asignatura:
 *   get:
 *     summary: Consultar todas las asignaturas
 *     tags: [Asignaturas]
 *     responses:
 *       200:
 *         description: Asignaturas consultadas correctamente
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
 *                   example: Asignaturas consultadas correctamente.
 *                 asignaturas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Asignatura'
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
router.get("/", asignaturaController.consultarAsignaturas);

/**
 * @openapi
 * /asignatura/activas:
 *   get:
 *     summary: Consultar todas las asignaturas activas
 *     tags: [Asignaturas]
 *     responses:
 *       200:
 *         description: Asignaturas consultadas correctamente
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
 *                   example: Asignaturas consultadas correctamente.
 *                 asignaturas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Asignatura'
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
router.get("/activas", asignaturaController.consultarAsignaturasActivas);

/**
 * @openapi
 * /asignatura/docente/{id_docente}:
 *   get:
 *     summary: Consultar todas las asignaturas de un docente
 *     tags: [Asignaturas]
 *     parameters:
 *       - in: path
 *         name: id_docente
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del docente
 *     responses:
 *       200:
 *         description: Asignaturas consultadas correctamente
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
 *                   example: Asignaturas consultadas correctamente.
 *                 asignaturas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Asignatura'
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
router.get("/docente/:id_docente", asignaturaController.consultarAsignaturasPorDocente);

/**
 * @openapi
 * /asignatura/{id_asignatura}:
 *   get:
 *     summary: Consultar una asignatura por su ID
 *     tags: [Asignaturas]
 *     parameters:
 *       - in: path
 *         name: id_asignatura
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asignatura
 *     responses:
 *       200:
 *         description: Asignatura consultada correctamente
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
 *                   example: Asignatura consultada correctamente.
 *                 asignaturas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Asignatura'
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
router.get("/:id_asignatura", asignaturaController.consultarAsignaturaPorId);

/**
 * @openapi
 * /asignatura/cargaMasivaAsignaturas:
 *   post:
 *     tags: [Asignaturas]
 *     summary: Crea múltiples asignaturas a partir de un archivo Excel
 *     description: Permite cargar un archivo `.xlsx` con la información de varias asignaturas para registrarlas masivamente.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: Archivo Excel con la lista de asignaturas
 *     responses:
 *       200:
 *         description: Carga masiva procesada correctamente
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
 *                   example: "Carga masiva finalizada."
 *                 resumen:
 *                   type: object
 *                   properties:
 *                     creados:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "1"
 *                     errores:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           codigo:
 *                             type: string
 *                             example: "1"
 *                           error:
 *                             type: string
 *                             example: "El correo ya está registrado."
 *       400:
 *         description: Error en la solicitud (archivo faltante o malformado)
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
 *                   example: "No se envió archivo Excel."
 *       5XX:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al procesar archivo Excel: ..."
 */
router.post("/cargaMasivaAsignaturas", upload.single("archivo"), asignaturaController.crearAsignaturaMasivamente);

module.exports = router;
