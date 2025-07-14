/**
 * @openapi
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - identificacion
 *         - nombres
 *         - apellidos
 *         - correo
 *         - contrasena
 *         - id_rol
 *       properties:
 *         identificacion:
 *           type: string
 *           example: "1020304050"
 *         nombres:
 *           type: string
 *           example: "Carlos Andrés"
 *         apellidos:
 *           type: string
 *           example: "Pérez Gómez"
 *         correo:
 *           type: string
 *           example: "carlos.perez@unicesar.edu.co"
 *         contrasena:
 *           type: string
 *           example: "MiContraseñaSegura123"
 *         id_rol:
 *           type: integer
 *           enum: [1) DOCENTE, 2) ESTUDIANTE, 3) ADMINISTRADOR]
 *           example: 1
 *         estado:
 *           type: boolean
 *           example: true
 *         uuid_telefono:
 *           type: string
 *           example: "aabbccdd-1122-3344"
 */
