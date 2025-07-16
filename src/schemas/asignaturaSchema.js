/**
 * @openapi
 * components:
 *   schemas:
 *     Asignatura:
 *       type: object
 *       required:
 *         - nombre
 *         - codigo
 *         - estado
 *       properties:
 *         id_asignatura:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Lógica de Programación
 *         codigo:
 *           type: string
 *           example: LP-101
 *         estado:
 *           type: boolean
 *           example: true
 *         cantidad_grupos:
 *           type: integer
 *           example: 10
 */
