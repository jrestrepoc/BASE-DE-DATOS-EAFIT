import { query } from "./db";
import {
  type Estudiante,
  type Materia,
  type Clase,
  type InsertEstudiante,
  type InsertMateria,
  type InsertClase
} from "../shared/schema";

export interface IStorage {
  // Estudiantes
  getAllEstudiantes(): Promise<Estudiante[]>;
  getEstudiante(id: number): Promise<Estudiante | undefined>;
  createEstudiante(data: InsertEstudiante): Promise<Estudiante>;
  updateEstudiante(id: number, data: InsertEstudiante): Promise<Estudiante>;
  deleteEstudiante(id: number): Promise<void>;
  
  // Materias
  getAllMaterias(): Promise<Materia[]>;
  getMateria(id: number): Promise<Materia | undefined>;
  createMateria(data: InsertMateria): Promise<Materia>;
  updateMateria(id: number, data: InsertMateria): Promise<Materia>;
  deleteMateria(id: number): Promise<void>;
  
  // Clases
  getAllClases(): Promise<Clase[]>;
  getClase(id: number): Promise<Clase | undefined>;
  createClase(data: InsertClase): Promise<Clase>;
  updateClase(id: number, data: InsertClase): Promise<Clase>;
  deleteClase(id: number): Promise<void>;
  getClasesByEstudiante(estudianteId: number): Promise<Clase[]>;
  getClasesByMateria(materiaId: number): Promise<Clase[]>;
}

export class DbStorage implements IStorage {
  // Estudiantes
  async getAllEstudiantes(): Promise<Estudiante[]> {
    return await query('SELECT * FROM estudiantes') as Estudiante[];
  }

  async getEstudiante(id: number): Promise<Estudiante | undefined> {
    const result = await query('SELECT * FROM estudiantes WHERE id_estudiante = ?', [id]) as Estudiante[];
    return result[0];
  }

  async createEstudiante(data: InsertEstudiante): Promise<Estudiante> {
    try {
      console.log('Creando estudiante:', data);
      await query(
        'INSERT INTO estudiantes (id_estudiante, nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?, ?)',
        [data.id_estudiante, data.nombre, data.apellido, data.correo, data.telefono]
      );
      return data as Estudiante;
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      throw error;
    }
  }

  async updateEstudiante(id: number, data: InsertEstudiante): Promise<Estudiante> {
    await query(
      'UPDATE estudiantes SET nombre = ?, apellido = ?, correo = ?, telefono = ? WHERE id_estudiante = ?',
      [data.nombre, data.apellido, data.correo, data.telefono, id]
    );
    return data as Estudiante;
  }

  async deleteEstudiante(id: number): Promise<void> {
    await query('DELETE FROM estudiantes WHERE id_estudiante = ?', [id]);
  }

  // Materias
  async getAllMaterias(): Promise<Materia[]> {
    return await query('SELECT * FROM materias') as Materia[];
  }

  async getMateria(id: number): Promise<Materia | undefined> {
    const result = await query('SELECT * FROM materias WHERE id_materia = ?', [id]) as Materia[];
    return result[0];
  }

  async createMateria(data: InsertMateria): Promise<Materia> {
    await query(
      'INSERT INTO materias (id_materia, nombre_materia) VALUES (?, ?)',
      [data.id_materia, data.nombre_materia]
    );
    return data as Materia;
  }

  async updateMateria(id: number, data: InsertMateria): Promise<Materia> {
    await query(
      'UPDATE materias SET nombre_materia = ? WHERE id_materia = ?',
      [data.nombre_materia, id]
    );
    return data as Materia;
  }

  async deleteMateria(id: number): Promise<void> {
    await query('DELETE FROM materias WHERE id_materia = ?', [id]);
  }

  // Clases
  async getAllClases(): Promise<Clase[]> {
    return await query('SELECT * FROM clases') as Clase[];
  }

  async getClase(id: number): Promise<Clase | undefined> {
    const result = await query('SELECT * FROM clases WHERE id_clase = ?', [id]) as Clase[];
    return result[0];
  }

  async createClase(data: InsertClase): Promise<Clase> {
    await query(
      'INSERT INTO clases (id_clase, numero_clase, hora_inicio, hora_fin, fecha_inicio, fecha_fin, capacidad_clase, id_estudiante, id_materia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        data.id_clase, 
        data.numero_clase, 
        data.hora_inicio, 
        data.hora_fin, 
        data.fecha_inicio, 
        data.fecha_fin, 
        data.capacidad_clase, 
        data.id_estudiante, 
        data.id_materia
      ]
    );
    return data as Clase;
  }

  async updateClase(id: number, data: InsertClase): Promise<Clase> {
    await query(
      'UPDATE clases SET numero_clase = ?, hora_inicio = ?, hora_fin = ?, fecha_inicio = ?, fecha_fin = ?, capacidad_clase = ?, id_estudiante = ?, id_materia = ? WHERE id_clase = ?',
      [
        data.numero_clase, 
        data.hora_inicio, 
        data.hora_fin, 
        data.fecha_inicio, 
        data.fecha_fin, 
        data.capacidad_clase, 
        data.id_estudiante, 
        data.id_materia,
        id
      ]
    );
    return data as Clase;
  }

  async deleteClase(id: number): Promise<void> {
    await query('DELETE FROM clases WHERE id_clase = ?', [id]);
  }

  async getClasesByEstudiante(estudianteId: number): Promise<Clase[]> {
    return await query('SELECT * FROM clases WHERE id_estudiante = ?', [estudianteId]) as Clase[];
  }

  async getClasesByMateria(materiaId: number): Promise<Clase[]> {
    return await query('SELECT * FROM clases WHERE id_materia = ?', [materiaId]) as Clase[];
  }
}

export const storage = new DbStorage();