"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const storage_1 = require("./storage");
const schema_1 = require("../shared/schema");
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        // Error handling middleware for validation errors
        const handleValidationError = (err, res) => {
            if (err instanceof zod_1.ZodError) {
                const validationError = (0, zod_validation_error_1.fromZodError)(err);
                return res.status(400).json({ message: validationError.message });
            }
            console.error("API Error:", err);
            return res.status(500).json({ message: "Error interno del servidor" });
        };
        // Estudiantes routes
        app.get("/api/estudiantes", (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const estudiantes = yield storage_1.storage.getAllEstudiantes();
                res.json(estudiantes);
            }
            catch (err) {
                console.error("Error getting estudiantes:", err);
                res.status(500).json({ message: "Error al obtener estudiantes" });
            }
        }));
        app.get("/api/estudiantes/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const estudiante = yield storage_1.storage.getEstudiante(id);
                if (!estudiante) {
                    return res.status(404).json({ message: "Estudiante no encontrado" });
                }
                res.json(estudiante);
            }
            catch (err) {
                console.error("Error getting estudiante:", err);
                res.status(500).json({ message: "Error al obtener estudiante" });
            }
        }));
        app.post("/api/estudiantes", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = schema_1.insertEstudianteSchema.parse(req.body);
                // Check if estudiante already exists
                const existing = yield storage_1.storage.getEstudiante(data.id_estudiante);
                if (existing) {
                    return res.status(409).json({ message: "El ID de estudiante ya existe" });
                }
                const estudiante = yield storage_1.storage.createEstudiante(data);
                res.status(201).json(estudiante);
            }
            catch (err) {
                handleValidationError(err, res);
            }
        }));
        app.put("/api/estudiantes/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const data = schema_1.insertEstudianteSchema.parse(req.body);
                // Ensure IDs match
                if (id !== data.id_estudiante) {
                    return res.status(400).json({ message: "ID en URL no coincide con el ID en los datos" });
                }
                // Check if estudiante exists
                const existing = yield storage_1.storage.getEstudiante(id);
                if (!existing) {
                    return res.status(404).json({ message: "Estudiante no encontrado" });
                }
                const estudiante = yield storage_1.storage.updateEstudiante(id, data);
                res.json(estudiante);
            }
            catch (err) {
                handleValidationError(err, res);
            }
        }));
        app.delete("/api/estudiantes/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                // Check if estudiante exists
                const existing = yield storage_1.storage.getEstudiante(id);
                if (!existing) {
                    return res.status(404).json({ message: "Estudiante no encontrado" });
                }
                // Check if the estudiante is referenced in any class
                const clasesWithEstudiante = yield storage_1.storage.getClasesByEstudiante(id);
                if (clasesWithEstudiante.length > 0) {
                    return res.status(409).json({
                        message: "No se puede eliminar este estudiante porque está asignado a una o más clases"
                    });
                }
                yield storage_1.storage.deleteEstudiante(id);
                res.status(204).send();
            }
            catch (err) {
                console.error("Error deleting estudiante:", err);
                res.status(500).json({ message: "Error al eliminar estudiante" });
            }
        }));
        // Materias routes
        app.get("/api/materias", (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const materias = yield storage_1.storage.getAllMaterias();
                res.json(materias);
            }
            catch (err) {
                console.error("Error getting materias:", err);
                res.status(500).json({ message: "Error al obtener materias" });
            }
        }));
        app.get("/api/materias/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const materia = yield storage_1.storage.getMateria(id);
                if (!materia) {
                    return res.status(404).json({ message: "Materia no encontrada" });
                }
                res.json(materia);
            }
            catch (err) {
                console.error("Error getting materia:", err);
                res.status(500).json({ message: "Error al obtener materia" });
            }
        }));
        app.post("/api/materias", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = schema_1.insertMateriaSchema.parse(req.body);
                // Check if materia already exists
                const existing = yield storage_1.storage.getMateria(data.id_materia);
                if (existing) {
                    return res.status(409).json({ message: "El ID de materia ya existe" });
                }
                const materia = yield storage_1.storage.createMateria(data);
                res.status(201).json(materia);
            }
            catch (err) {
                handleValidationError(err, res);
            }
        }));
        app.put("/api/materias/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const data = schema_1.insertMateriaSchema.parse(req.body);
                // Ensure IDs match
                if (id !== data.id_materia) {
                    return res.status(400).json({ message: "ID en URL no coincide con el ID en los datos" });
                }
                // Check if materia exists
                const existing = yield storage_1.storage.getMateria(id);
                if (!existing) {
                    return res.status(404).json({ message: "Materia no encontrada" });
                }
                const materia = yield storage_1.storage.updateMateria(id, data);
                res.json(materia);
            }
            catch (err) {
                handleValidationError(err, res);
            }
        }));
        app.delete("/api/materias/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                // Check if materia exists
                const existing = yield storage_1.storage.getMateria(id);
                if (!existing) {
                    return res.status(404).json({ message: "Materia no encontrada" });
                }
                // Check if the materia is referenced in any class
                const clasesWithMateria = yield storage_1.storage.getClasesByMateria(id);
                if (clasesWithMateria.length > 0) {
                    return res.status(409).json({
                        message: "No se puede eliminar esta materia porque está asignada a una o más clases"
                    });
                }
                yield storage_1.storage.deleteMateria(id);
                res.status(204).send();
            }
            catch (err) {
                console.error("Error deleting materia:", err);
                res.status(500).json({ message: "Error al eliminar materia" });
            }
        }));
        // Clases routes
        app.get("/api/clases", (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clases = yield storage_1.storage.getAllClases();
                res.json(clases);
            }
            catch (err) {
                console.error("Error getting clases:", err);
                res.status(500).json({ message: "Error al obtener clases" });
            }
        }));
        app.get("/api/clases/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const clase = yield storage_1.storage.getClase(id);
                if (!clase) {
                    return res.status(404).json({ message: "Clase no encontrada" });
                }
                res.json(clase);
            }
            catch (err) {
                console.error("Error getting clase:", err);
                res.status(500).json({ message: "Error al obtener clase" });
            }
        }));
        app.post("/api/clases", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = schema_1.insertClaseSchema.parse(req.body);
                // Check if clase already exists
                const existing = yield storage_1.storage.getClase(data.id_clase);
                if (existing) {
                    return res.status(409).json({ message: "El ID de clase ya existe" });
                }
                // Check if estudiante exists
                const estudiante = yield storage_1.storage.getEstudiante(data.id_estudiante);
                if (!estudiante) {
                    return res.status(400).json({ message: "El estudiante seleccionado no existe" });
                }
                // Check if materia exists
                const materia = yield storage_1.storage.getMateria(data.id_materia);
                if (!materia) {
                    return res.status(400).json({ message: "La materia seleccionada no existe" });
                }
                const clase = yield storage_1.storage.createClase(data);
                res.status(201).json(clase);
            }
            catch (err) {
                handleValidationError(err, res);
            }
        }));
        app.put("/api/clases/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const data = schema_1.insertClaseSchema.parse(req.body);
                // Ensure IDs match
                if (id !== data.id_clase) {
                    return res.status(400).json({ message: "ID en URL no coincide con el ID en los datos" });
                }
                // Check if clase exists
                const existing = yield storage_1.storage.getClase(id);
                if (!existing) {
                    return res.status(404).json({ message: "Clase no encontrada" });
                }
                // Check if estudiante exists
                const estudiante = yield storage_1.storage.getEstudiante(data.id_estudiante);
                if (!estudiante) {
                    return res.status(400).json({ message: "El estudiante seleccionado no existe" });
                }
                // Check if materia exists
                const materia = yield storage_1.storage.getMateria(data.id_materia);
                if (!materia) {
                    return res.status(400).json({ message: "La materia seleccionada no existe" });
                }
                const clase = yield storage_1.storage.updateClase(id, data);
                res.json(clase);
            }
            catch (err) {
                handleValidationError(err, res);
            }
        }));
        app.delete("/api/clases/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                // Check if clase exists
                const existing = yield storage_1.storage.getClase(id);
                if (!existing) {
                    return res.status(404).json({ message: "Clase no encontrada" });
                }
                yield storage_1.storage.deleteClase(id);
                res.status(204).send();
            }
            catch (err) {
                console.error("Error deleting clase:", err);
                res.status(500).json({ message: "Error al eliminar clase" });
            }
        }));
        const httpServer = (0, http_1.createServer)(app);
        return httpServer;
    });
}
