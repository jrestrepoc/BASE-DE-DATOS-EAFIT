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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
exports.initDb = initDb;
const promise_1 = __importDefault(require("mysql2/promise"));
// Configuración para MySQL Workbench
const pool = promise_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: 'JAJEJO2016',
    database: 'area_eafit',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Función para ejecutar consultas
function query(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results] = yield pool.execute(sql, params || []);
            return results;
        }
        catch (error) {
            console.error('Error ejecutando consulta SQL:', error);
            throw error;
        }
    });
}
// Inicializar la base de datos
function initDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Verificando conexión a la base de datos...');
            // Verificar si las tablas existen, sino crearlas
            yield pool.execute(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id_estudiante INT PRIMARY KEY,
        nombre VARCHAR(45) NOT NULL,
        apellido VARCHAR(45) NOT NULL,
        correo VARCHAR(80) NOT NULL,
        telefono VARCHAR(45) NOT NULL
      )
    `);
            yield pool.execute(`
      CREATE TABLE IF NOT EXISTS materias (
        id_materia INT PRIMARY KEY,
        nombre_materia VARCHAR(45) NOT NULL
      )
    `);
            yield pool.execute(`
      CREATE TABLE IF NOT EXISTS clases (
        id_clase INT PRIMARY KEY,
        numero_clase INT NOT NULL,
        hora_inicio VARCHAR(45) NOT NULL,
        hora_fin VARCHAR(45) NOT NULL,
        fecha_inicio VARCHAR(45) NOT NULL,
        fecha_fin VARCHAR(45) NOT NULL,
        capacidad_clase INT NOT NULL,
        id_estudiante INT NOT NULL,
        id_materia INT NOT NULL,
        FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante),
        FOREIGN KEY (id_materia) REFERENCES materias(id_materia)
      )
    `);
            console.log('Base de datos inicializada correctamente');
        }
        catch (error) {
            console.error('Error inicializando la base de datos:', error);
            throw error;
        }
    });
}
// Inicializar la base de datos al iniciar la aplicación
initDb();
