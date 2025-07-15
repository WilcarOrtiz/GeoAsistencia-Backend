/**
 * @openapi
 * components:
 *   schemas:
 *     Grupo:
 *       type: object
 *       required:
 *         - nombre
 *         - codigo
 *         - id_asignatura
 *         - estado_asistencia
 *       properties:
 *         id_grupo:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Grupo A"
 *         codigo:
 *           type: string
 *           example: "GRP101"
 *         id_docente:
 *           type: string
 *           nullable: true
 *           example: "12345"
 *         id_asignatura:
 *           type: integer
 *           example: 10
 *         estado_asistencia:
 *           type: boolean
 *           example: true
 */
