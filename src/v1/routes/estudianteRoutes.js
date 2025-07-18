const express = require("express");
const router = express.Router();
const estudianteController = require("../../controllers/estudiantesController");
const upload = require("../../middlewares/uploadMiddleware");

const {
  validarCamposUsuario,
  validarArchivoExcel,
  validarIdObligatorio,
} = require("../../middlewares/Usuario/validarUsuario");

const { verifyToken } = require("../../middlewares/verifyToken");

/**
 * @openapi
 * /estudiante/registrarEstudiante:
 *   post:
 *     tags:
 *       - Estudiante
 *     summary: Crea un nuevo estudiante en el sistema
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
  validarCamposUsuario,
  estudianteController.registrarUsuarioEstudiante
);

/**
 * @openapi
 * /estudiante/cambiarEstado/{id_usuario}:
 *   put:
 *     tags:
 *       - Estudiante
 *     summary: Cambia el estado de un estudiante (activo/inactivo)
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
  validarIdObligatorio("id_usuario"),
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
  validarArchivoExcel,
  estudianteController.crearEstudianteMasivamente
);

/**
 * @openapi
 * /estudiante/editarEstudiante/{id_usuario}:
 *   put:
 *     tags:
 *       - Estudiante
 *     summary: Edita los datos de un estudiante existente
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
  "/editarEstudiante/:id_usuario",
  validarIdObligatorio("id_usuario"),
  estudianteController.editarEstudiante
);

/**
 * @openapi
 * /estudiante/listar:
 *   get:
 *     tags:
 *       - Estudiante
 *     summary: Obtiene la informacion de uno o todos los estudiantes registrados en el sistema
 *     parameters:
 *       - name: id_usuario
 *         in: query
 *         required: false
 *         description: ID único del estudiante (opcional)
 *         schema:
 *           type: string
 *           example: "12345"
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
router.get("/listar", estudianteController.listarEstudiantes);

/**
 * @openapi
 * /estudiante/sinGrupo/{id_asignatura}:
 *   get:
 *     tags:
 *       - Estudiante
 *     summary: Obtiene todos los estudiantes que NO estan registrados en ningun grupo de esa asignatura
 *     parameters:
 *       - in: path
 *         name: id_asignatura
 *         required: true
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
  "/sinGrupo/:id_asignatura",
  validarIdObligatorio("id_asignatura"),
  estudianteController.obtenerEstudiantesNoAsignadosAGrupo
);

/**
 * @openapi
 * /estudiante/{id_estudiante}/gruposDeClase:
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
  "/:id_estudiante/gruposDeClase",
  validarIdObligatorio("id_estudiante"),
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

module.exports = router;
