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
exports.storage = exports.DbStorage = void 0;
const db_1 = require("./db");
class DbStorage {
    // Estudiantes
    getAllEstudiantes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.query)('SELECT * FROM estudiantes');
        });
    }
    getEstudiante(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, db_1.query)('SELECT * FROM estudiantes WHERE id_estudiante = ?', [id]);
            return result[0];
        });
    }
    createEstudiante(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Creando estudiante:', data);
                yield (0, db_1.query)('INSERT INTO estudiantes (id_estudiante, nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?, ?)', [data.id_estudiante, data.nombre, data.apellido, data.correo, data.telefono]);
                return data;
            }
            catch (error) {
                console.error('Error al crear estudiante:', error);
                throw error;
            }
        });
    }
    updateEstudiante(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.query)('UPDATE estudiantes SET nombre = ?, apellido = ?, correo = ?, telefono = ? WHERE id_estudiante = ?', [data.nombre, data.apellido, data.correo, data.telefono, id]);
            return data;
        });
    }
    deleteEstudiante(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.query)('DELETE FROM estudiantes WHERE id_estudiante = ?', [id]);
        });
    }
    // Materias
    getAllMaterias() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.query)('SELECT * FROM materias');
        });
    }
    getMateria(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, db_1.query)('SELECT * FROM materias WHERE id_materia = ?', [id]);
            return result[0];
        });
    }
    createMateria(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.query)('INSERT INTO materias (id_materia, nombre_materia) VALUES (?, ?)', [data.id_materia, data.nombre_materia]);
            return data;
        });
    }
    updateMateria(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.query)('UPDATE materias SET nombre_materia = ? WHERE id_materia = ?', [data.nombre_materia, id]);
            return data;
        });
    }
    deleteMateria(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.query)('DELETE FROM materias WHERE id_materia = ?', [id]);
        });
    }
    // Clases
    getAllClases() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.query)('SELECT * FROM clases');
        });
    }
    getClase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, db_1.query)('SELECT * FROM clases WHERE id_clase = ?', [id]);
            return result[0];
        });
    }
    createClase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.query)('INSERT INTO clases (id_clase, numero_clase, hora_inicio, hora_fin, fecha_inicio, fecha_fin, capacidad_clase, id_estudiante, id_materia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                data.id_clase,
                data.numero_clase,
                data.hora_inicio,
                data.hora_fin,
                data.fecha_inicio,
                data.fecha_fin,
                data.capacidad_clase,
                data.id_estudiante,
                data.id_materia
            ]);
            return data;
        });
    }
    updateClase(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.query)('UPDATE clases SET numero_clase = ?, hora_inicio = ?, hora_fin = ?, fecha_inicio = ?, fecha_fin = ?, capacidad_clase = ?, id_estudiante = ?, id_materia = ? WHERE id_clase = ?', [
                data.numero_clase,
                data.hora_inicio,
                data.hora_fin,
                data.fecha_inicio,
                data.fecha_fin,
                data.capacidad_clase,
                data.id_estudiante,
                data.id_materia,
                id
            ]);
            return data;
        });
    }
    deleteClase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.query)('DELETE FROM clases WHERE id_clase = ?', [id]);
        });
    }
    getClasesByEstudiante(estudianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.query)('SELECT * FROM clases WHERE id_estudiante = ?', [estudianteId]);
        });
    }
    getClasesByMateria(materiaId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.query)('SELECT * FROM clases WHERE id_materia = ?', [materiaId]);
        });
    }
}
exports.DbStorage = DbStorage;
exports.storage = new DbStorage();
