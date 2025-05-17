"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertClaseSchema = exports.claseSchema = exports.insertMateriaSchema = exports.materiaSchema = exports.insertEstudianteSchema = exports.estudianteSchema = void 0;
const zod_1 = require("zod");
// Esquema del estudiante
exports.estudianteSchema = zod_1.z.object({
    id_estudiante: zod_1.z.number().int().positive(),
    nombre: zod_1.z.string().min(1).max(45),
    apellido: zod_1.z.string().min(1).max(45),
    correo: zod_1.z.string().email().max(80),
    telefono: zod_1.z.string().min(1).max(45)
});
exports.insertEstudianteSchema = exports.estudianteSchema;
// Esquema de la materia
exports.materiaSchema = zod_1.z.object({
    id_materia: zod_1.z.number().int().positive(),
    nombre_materia: zod_1.z.string().min(1).max(45)
});
exports.insertMateriaSchema = exports.materiaSchema;
// Esquema de la clase
exports.claseSchema = zod_1.z.object({
    id_clase: zod_1.z.number().int().positive(),
    numero_clase: zod_1.z.number().int().positive(),
    hora_inicio: zod_1.z.string().max(45),
    hora_fin: zod_1.z.string().max(45),
    fecha_inicio: zod_1.z.string().max(45),
    fecha_fin: zod_1.z.string().max(45),
    capacidad_clase: zod_1.z.number().int().positive(),
    id_estudiante: zod_1.z.number().int().positive(),
    id_materia: zod_1.z.number().int().positive()
});
exports.insertClaseSchema = exports.claseSchema;
