import mysql from 'mysql2/promise';

// Configuración para MySQL Workbench
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'JAJEJO2016',
  database: 'area_eafit',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para ejecutar consultas
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params || []);
    return results;
  } catch (error) {
    console.error('Error ejecutando consulta SQL:', error);
    throw error;
  }
}

// Inicializar la base de datos
export async function initDb() {
  try {
    console.log('Verificando conexión a la base de datos...');
    
    // Verificar si las tablas existen, sino crearlas
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id_estudiante INT PRIMARY KEY,
        nombre VARCHAR(45) NOT NULL,
        apellido VARCHAR(45) NOT NULL,
        correo VARCHAR(80) NOT NULL,
        telefono VARCHAR(45) NOT NULL
      )
    `);
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS materias (
        id_materia INT PRIMARY KEY,
        nombre_materia VARCHAR(45) NOT NULL
      )
    `);
    
    await pool.execute(`
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
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  }
}

// Inicializar la base de datos al iniciar la aplicación
initDb();