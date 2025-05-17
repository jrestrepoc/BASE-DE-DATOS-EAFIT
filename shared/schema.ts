import { z } from "zod";

// Esquema del estudiante
export const estudianteSchema = z.object({
  id_estudiante: z.number().int().positive(),
  nombre: z.string().min(1).max(45),
  apellido: z.string().min(1).max(45),
  correo: z.string().email().max(80),
  telefono: z.string().min(1).max(45)
});

export type Estudiante = z.infer<typeof estudianteSchema>;
export type InsertEstudiante = Estudiante;
export const insertEstudianteSchema = estudianteSchema;

// Esquema de la materia
export const materiaSchema = z.object({
  id_materia: z.number().int().positive(),
  nombre_materia: z.string().min(1).max(45)
});

export type Materia = z.infer<typeof materiaSchema>;
export type InsertMateria = Materia;
export const insertMateriaSchema = materiaSchema;

// Esquema de la clase
export const claseSchema = z.object({
  id_clase: z.number().int().positive(),
  numero_clase: z.number().int().positive(),
  hora_inicio: z.string().max(45),
  hora_fin: z.string().max(45),
  fecha_inicio: z.string().max(45),
  fecha_fin: z.string().max(45),
  capacidad_clase: z.number().int().positive(),
  id_estudiante: z.number().int().positive(),
  id_materia: z.number().int().positive()
});

export type Clase = z.infer<typeof claseSchema>;
export type InsertClase = Clase;
export const insertClaseSchema = claseSchema;