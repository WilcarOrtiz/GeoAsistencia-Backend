const express = require("express");
const router = express.Router();
const usuarioController = require("../../controllers/userController");
const upload = require("../../middlewares/uploadMiddleware");
const validarCampos = require("../../middlewares/validarCamposObligatorios");

const {
  validarCamposUsuario,
  validarArchivoExcel,
  validarIdObligatorio,
} = require("../../middlewares/Usuario/validarUsuario");

const { verifyToken } = require("../../middlewares/verifyToken");
const { authorizeRoles } = require("../../middlewares/authorizeRoles");

/**
 * @openapi
 * /usuario/registrar:
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario registrado correctamente."
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
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
  "/registrar",
  verifyToken,
  authorizeRoles("DOCENTE"),
  validarCamposUsuario,
  usuarioController.registrarUsuario
);

/**
 * @openapi
 * /usuario/{id_usuario}/estado:
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
 *                 mensaje:
 *                   type: string
 *                   example: "Estado de Juan Pérez actualizado."
 *                 Estado:
 *                   type: boolean
 *                   example: true
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
  "/:id_usuario/estado",
  validarCampos(["id_usuario"], "params"),
  usuarioController.cambiarEstadoUsuario
);

/**
 * @openapi
 * /usuario/carga-masiva:
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
  "/carga-masiva",
  upload.single("archivo"),
  validarArchivoExcel,
  usuarioController.crearUsuarioMasivamente
);

/**
 * @openapi
 * /usuario/editar/{id_usuario}:
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
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
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
  "/editar/:id_usuario",
  validarCampos(["id_usuario"], "params"),
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
 *       - name: identificacion
 *         in: query
 *         required: false
 *         description: Filtrar por identificación (búsqueda parcial).
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
 *                 mensaje:
 *                   type: string
 *                   example: "Información consultada correctamente."
 *                 resultado:
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
