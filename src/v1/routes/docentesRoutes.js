const express = require("express");
const router = express.Router();
const docenteController = require("../../controllers/docentesController");
const upload = require("../../middlewares/uploadMiddleware");
const { verifyToken } = require("../../middlewares/verifyToken");
const { authorizeRoles } = require("../../middlewares/authorizeRoles");

/**
 * @openapi
 * /docente/registrarDocente:
 *   post:
 *     tags:
 *       - Docente
 *     summary: Crea un nuevo docente en el sistema
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
router.post("/registrarDocente", docenteController.registrarUsuarioDocente);

/**
 * @openapi
 * /docente/cambiarEstado/{id_usuario}:
 *   put:
 *     tags:
 *       - Docente
 *     summary: Cambia el estado de un docente (activo/inactivo)
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario (UID de Firebase)
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
 *                   example: "Estado de docente actualizado correctamente."
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
  "/cambiarEstado/:id_usuario",
  docenteController.habilitarDeshabiliarDocente
);

/**
 * @openapi
 * /docente/cargaMasivaDocentes:
 *   post:
 *     tags:
 *       - Docente
 *     summary: Crea múltiples docentes a partir de un archivo Excel
 *     description: Permite cargar un archivo `.xlsx` con la información de varios docentes para registrarlos masivamente. La contraseña será igual al número de identificación.
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
 *                 description: Archivo Excel con la lista de docentes
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
  "/cargaMasivaDocentes",
  upload.single("archivo"),
  docenteController.crearDocenteMasivamente
);

/**
 * @openapi
 * /docente/editarDocente/{id_usuario}:
 *   put:
 *     tags:
 *       - Docente
 *     summary: Edita los datos de un docente existente
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del docente (UID de Firebase)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario Edicion'
 *     responses:
 *       200:
 *         description: Docente actualizado correctamente
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
 *                   example: "Usuario actualizado correctamente."
 *                 idUsuario:
 *                   type: string
 *                   example: "uid-firebase-actualizado"
 *       400:
 *         description: Error en la solicitud (correo repetido o ID inválido)
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
 *                   example: "El nuevo correo ya está registrado."
 *       5XX:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al editar usuario: descripción detallada"
 */
router.put("/editarDocente/:id_usuario", docenteController.editarDocente);

/**
 * @openapi
 * /docente/listar:
 *   get:
 *     tags:
 *       - Docente
 *     summary: Obtiene todos los docentes registrados en el sistema
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
 *         description: Error al obtener los docentes
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
router.get("/listar", docenteController.listarDocentes);



/**
 * @openapi
 * /docente/activos:
 *   get:
 *     tags:
 *       - Docente
 *     summary: Obtiene todos los docentes activos en el sistema
 *     responses:
 *       200:
 *         description: Lista de docentes activos obtenida correctamente
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
 *         description: Error al obtener los docentes
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
router.get("/activos", docenteController.docentesActivos);

//asi queda la ruta que verifica toeken y rol
//router.get("/listar", verifyToken, authorizeRoles("ESTUDIANTE"), docenteController.listarDocentes);

module.exports = router;
