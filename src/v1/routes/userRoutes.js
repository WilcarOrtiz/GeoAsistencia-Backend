const express = require("express");
const router = express.Router();
const usuarioController = require("../../controllers/userController");
const upload = require("../../middlewares/uploadMiddleware");

const {
  validarCamposUsuario,
  validarArchivoExcel,
  validarIdObligatorio,
} = require("../../middlewares/Usuario/validarUsuario");

const { verifyToken } = require("../../middlewares/verifyToken");

/**
 * @openapi
 * /usuario/registrarUsuario:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Crea un nuevo usuario en el sistema
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
  "/registrarUsuario",
  validarCamposUsuario,
  usuarioController.registrarUsuario
);

/**
 * @openapi
 * /usuario/cambiarEstado/{id_usuario}:
 *   patch:
 *     tags:
 *       - Usuario
 *     summary: Cambia el estado de un usuario (activo/inactivo)
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
router.patch(
  "/cambiarEstado/:id_usuario",
  validarIdObligatorio("id_usuario"),
  usuarioController.cambiarEstadoUsuario
);

/**
 * @openapi
 * /usuario/cargaMasivaUsuarios:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Crea múltiples usuarios a partir de un archivo Excel
 *     description: Permite cargar un archivo `.xlsx` con la información de varios usuarios para registrarlos masivamente. La contraseña será igual al número de identificación.
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
  "/cargaMasivaUsuarios",
  upload.single("archivo"),
  validarArchivoExcel,
  usuarioController.crearUsuarioMasivamente
);

/**
 * @openapi
 * /usuario/editarUsuario/{id_usuario}:
 *   put:
 *     tags:
 *       - Usuario
 *     summary: Edita los datos de un usuario existente
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante (UID de Firebase)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario Edicion'
 *     responses:
 *       200:
 *         description: Estudiante actualizado correctamente
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
router.put(
  "/editarUsuario/:id_usuario",
  validarIdObligatorio("id_usuario"),
  usuarioController.editarUsuario
);

/**
 * @openapi
 * /usuario/listar:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Obtiene la información de uno o varios usuarios tanto docente como estudiantes con filtros opcionales.
 *     parameters:
 *       - name: id_usuario
 *         in: query
 *         required: false
 *         description: ID único del usuario.
 *         schema:
 *           type: string
 *       - name: rol
 *         in: query
 *         required: false
 *         description: Filtrar usuarios por rol (DOCENTE, ESTUDIANTE).
 *         schema:
 *           type: string
 *       - name: correo
 *         in: query
 *         required: false
 *         description: Filtrar por correo electrónico exacto o parcial.
 *         schema:
 *           type: string
 *       - name: estado
 *         in: query
 *         required: false
 *         description: Estado del usuario (true o false).
 *         schema:
 *           type: boolean
 *           example: true
 *       - name: nombres
 *         in: query
 *         required: false
 *         description: Filtrar por nombres (búsqueda parcial).
 *         schema:
 *           type: string
 *       - name: apellidos
 *         in: query
 *         required: false
 *         description: Filtrar por apellidos (búsqueda parcial).
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Número de resultados a retornar.
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: offset
 *         in: query
 *         required: false
 *         description: Desde qué registro iniciar (paginación).
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
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
 *         description: Error al obtener los usuarios.
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

router.get("/listar", usuarioController.obtenerUsuarios);

module.exports = router;
