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
 *         - rol
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
 *         rol:
 *           type: string
 *           enum: [DOCENTE,ESTUDIANTE,ADMINISTRADOR]
 *           example: "DOCENTE"
 *         estado:
 *           type: boolean
 *           example: true
 *         uuid_telefono:
 *           type: string
 *           example: "aabbccdd-1122-3344"
 */
