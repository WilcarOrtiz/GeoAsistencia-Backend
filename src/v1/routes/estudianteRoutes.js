const express = require("express");
const router = express.Router();
const estudianteController = require("../../controllers/estudiantesController");
const upload = require("../../middlewares/uploadMiddleware");

/**
 * @openapi
 * /estudiante/registrarEstudiante:
 *   post:
 *     tags:
 *       - Estudiante
 *     summary: Crea un nuevo estudiante en el sistema
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario registrado correctamente."
 *                 idUsuario:
 *                   type: string
 *                   example: "d7e5d8f2-5f7c-4d85-b9a1-1d1cdeae2e23"
 *                 rol:
 *                   type: string
 *                   example: "ESTUDIANTE"
 *       400:
 *         description: Error en la solicitud (por ejemplo, correo ya existe)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El correo ya está registrado."
 *       5XX:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear usuario: descripción detallada"
 */
router.post(
  "/registrarEstudiante",
  estudianteController.registrarUsuarioEstudiante
);

/**
 * @openapi
 * /estudiante/cambiarEstado:
 *   put:
 *     tags:
 *       - Estudiante
 *     summary: Cambia el estado de un estudiante (activo/inactivo)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: string
 *                 description: ID del usuario (UID de Firebase)
 *                 example: "d7e5d8f2-5f7c-4d85-b9a1-1d1cdeae2e23"
 *     responses:
 *       200:
 *         description: Estado cambiado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Estado de estudiante actualizado correctamente."
 *                 estado:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Error al cambiar estado (ID inválido u otro problema)
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
 *                   example: "El usuario no existe."
 */
router.put(
  "/cambiarEstado",
  estudianteController.habilitarDeshabiliarEstudiante
);

/**
 * @openapi
 * /estudiante/cargaMasivaEstudiantes:
 *   post:
 *     tags:
 *       - Estudiante
 *     summary: Crea múltiples estudiantes a partir de un archivo Excel
 *     description: Permite cargar un archivo `.xlsx` con la información de varios estudiantes para registrarlos masivamente. La contraseña será igual al número de identificación.
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
 *                 description: Archivo Excel con la lista de estudiantes
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
 *                           correo:
 *                             type: string
 *                             example: "juan@ejemplo.com"
 *                           id:
 *                             type: string
 *                             example: "uid-de-firebase"
 *                     errores:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           correo:
 *                             type: string
 *                             example: "yaexiste@ejemplo.com"
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
router.post(
  "/cargaMasivaEstudiante",
  upload.single("archivo"),
  estudianteController.crearEstudianteMasivamente
);

module.exports = router;
