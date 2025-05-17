import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEstudianteSchema, 
  insertMateriaSchema, 
  insertClaseSchema 
} from "../shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware for validation errors
  const handleValidationError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    
    console.error("API Error:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  };

  // Estudiantes routes
  app.get("/api/estudiantes", async (_req, res) => {
    try {
      const estudiantes = await storage.getAllEstudiantes();
      res.json(estudiantes);
    } catch (err) {
      console.error("Error getting estudiantes:", err);
      res.status(500).json({ message: "Error al obtener estudiantes" });
    }
  });

  app.get("/api/estudiantes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const estudiante = await storage.getEstudiante(id);
      
      if (!estudiante) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }
      
      res.json(estudiante);
    } catch (err) {
      console.error("Error getting estudiante:", err);
      res.status(500).json({ message: "Error al obtener estudiante" });
    }
  });

  app.post("/api/estudiantes", async (req, res) => {
    try {
      const data = insertEstudianteSchema.parse(req.body);
      
      // Check if estudiante already exists
      const existing = await storage.getEstudiante(data.id_estudiante);
      if (existing) {
        return res.status(409).json({ message: "El ID de estudiante ya existe" });
      }
      
      const estudiante = await storage.createEstudiante(data);
      res.status(201).json(estudiante);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/estudiantes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertEstudianteSchema.parse(req.body);
      
      // Ensure IDs match
      if (id !== data.id_estudiante) {
        return res.status(400).json({ message: "ID en URL no coincide con el ID en los datos" });
      }
      
      // Check if estudiante exists
      const existing = await storage.getEstudiante(id);
      if (!existing) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }
      
      const estudiante = await storage.updateEstudiante(id, data);
      res.json(estudiante);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/estudiantes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if estudiante exists
      const existing = await storage.getEstudiante(id);
      if (!existing) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }
      
      // Check if the estudiante is referenced in any class
      const clasesWithEstudiante = await storage.getClasesByEstudiante(id);
      if (clasesWithEstudiante.length > 0) {
        return res.status(409).json({ 
          message: "No se puede eliminar este estudiante porque está asignado a una o más clases" 
        });
      }
      
      await storage.deleteEstudiante(id);
      res.status(204).send();
    } catch (err) {
      console.error("Error deleting estudiante:", err);
      res.status(500).json({ message: "Error al eliminar estudiante" });
    }
  });

  // Materias routes
  app.get("/api/materias", async (_req, res) => {
    try {
      const materias = await storage.getAllMaterias();
      res.json(materias);
    } catch (err) {
      console.error("Error getting materias:", err);
      res.status(500).json({ message: "Error al obtener materias" });
    }
  });

  app.get("/api/materias/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const materia = await storage.getMateria(id);
      
      if (!materia) {
        return res.status(404).json({ message: "Materia no encontrada" });
      }
      
      res.json(materia);
    } catch (err) {
      console.error("Error getting materia:", err);
      res.status(500).json({ message: "Error al obtener materia" });
    }
  });

  app.post("/api/materias", async (req, res) => {
    try {
      const data = insertMateriaSchema.parse(req.body);
      
      // Check if materia already exists
      const existing = await storage.getMateria(data.id_materia);
      if (existing) {
        return res.status(409).json({ message: "El ID de materia ya existe" });
      }
      
      const materia = await storage.createMateria(data);
      res.status(201).json(materia);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/materias/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertMateriaSchema.parse(req.body);
      
      // Ensure IDs match
      if (id !== data.id_materia) {
        return res.status(400).json({ message: "ID en URL no coincide con el ID en los datos" });
      }
      
      // Check if materia exists
      const existing = await storage.getMateria(id);
      if (!existing) {
        return res.status(404).json({ message: "Materia no encontrada" });
      }
      
      const materia = await storage.updateMateria(id, data);
      res.json(materia);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/materias/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if materia exists
      const existing = await storage.getMateria(id);
      if (!existing) {
        return res.status(404).json({ message: "Materia no encontrada" });
      }
      
      // Check if the materia is referenced in any class
      const clasesWithMateria = await storage.getClasesByMateria(id);
      if (clasesWithMateria.length > 0) {
        return res.status(409).json({ 
          message: "No se puede eliminar esta materia porque está asignada a una o más clases" 
        });
      }
      
      await storage.deleteMateria(id);
      res.status(204).send();
    } catch (err) {
      console.error("Error deleting materia:", err);
      res.status(500).json({ message: "Error al eliminar materia" });
    }
  });

  // Clases routes
  app.get("/api/clases", async (_req, res) => {
    try {
      const clases = await storage.getAllClases();
      res.json(clases);
    } catch (err) {
      console.error("Error getting clases:", err);
      res.status(500).json({ message: "Error al obtener clases" });
    }
  });

  app.get("/api/clases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const clase = await storage.getClase(id);
      
      if (!clase) {
        return res.status(404).json({ message: "Clase no encontrada" });
      }
      
      res.json(clase);
    } catch (err) {
      console.error("Error getting clase:", err);
      res.status(500).json({ message: "Error al obtener clase" });
    }
  });

  app.post("/api/clases", async (req, res) => {
    try {
      const data = insertClaseSchema.parse(req.body);
      
      // Check if clase already exists
      const existing = await storage.getClase(data.id_clase);
      if (existing) {
        return res.status(409).json({ message: "El ID de clase ya existe" });
      }
      
      // Check if estudiante exists
      const estudiante = await storage.getEstudiante(data.id_estudiante);
      if (!estudiante) {
        return res.status(400).json({ message: "El estudiante seleccionado no existe" });
      }
      
      // Check if materia exists
      const materia = await storage.getMateria(data.id_materia);
      if (!materia) {
        return res.status(400).json({ message: "La materia seleccionada no existe" });
      }
      
      const clase = await storage.createClase(data);
      res.status(201).json(clase);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/clases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertClaseSchema.parse(req.body);
      
      // Ensure IDs match
      if (id !== data.id_clase) {
        return res.status(400).json({ message: "ID en URL no coincide con el ID en los datos" });
      }
      
      // Check if clase exists
      const existing = await storage.getClase(id);
      if (!existing) {
        return res.status(404).json({ message: "Clase no encontrada" });
      }
      
      // Check if estudiante exists
      const estudiante = await storage.getEstudiante(data.id_estudiante);
      if (!estudiante) {
        return res.status(400).json({ message: "El estudiante seleccionado no existe" });
      }
      
      // Check if materia exists
      const materia = await storage.getMateria(data.id_materia);
      if (!materia) {
        return res.status(400).json({ message: "La materia seleccionada no existe" });
      }
      
      const clase = await storage.updateClase(id, data);
      res.json(clase);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/clases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if clase exists
      const existing = await storage.getClase(id);
      if (!existing) {
        return res.status(404).json({ message: "Clase no encontrada" });
      }
      
      await storage.deleteClase(id);
      res.status(204).send();
    } catch (err) {
      console.error("Error deleting clase:", err);
      res.status(500).json({ message: "Error al eliminar clase" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}