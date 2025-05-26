import mysql from 'mysql2/promise';

// Configuración para MySQL Workbench
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1897',
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
    console.log('Inicializando base de datos...');

    // Crear tablas
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
        id_clase INT AUTO_INCREMENT PRIMARY KEY,
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

    // Crear función (la eliminamos primero para evitar errores)
    await pool.query(`DROP FUNCTION IF EXISTS contar_materias`);
    await pool.query(`
      CREATE FUNCTION contar_materias() RETURNS INT
      READS SQL DATA
      BEGIN
        DECLARE total INT;
        SELECT COUNT(*) INTO total FROM materias;
        RETURN total;
      END
    `);

    // ⚙️ Crear procedimiento crear_materias
    await pool.query(`DROP PROCEDURE IF EXISTS crear_materias`);
    await pool.query(`
      CREATE PROCEDURE crear_materias()
      BEGIN
        INSERT INTO materias (id_materia, nombre_materia) VALUES
          (1, 'Bases de datos'),
          (2, 'Algebra lineal'),
          (3, 'Calculo'),
          (4, 'Fundamentos de programacion'),
          (5, 'Fisica')
        ON DUPLICATE KEY UPDATE nombre_materia = VALUES(nombre_materia);
      END
    `);

    // ⚙️ Crear procedimiento crear_clases_para_estudiante
    await pool.query(`DROP PROCEDURE IF EXISTS crear_clases_para_estudiante`);
    await pool.query(`
      CREATE PROCEDURE crear_clases_para_estudiante(p_id_estudiante INT)
      BEGIN
        DECLARE id_m1 INT;
        DECLARE id_m2 INT;
        DECLARE id_m3 INT;

        SELECT id_materia INTO id_m1 FROM materias ORDER BY RAND() LIMIT 1 OFFSET 0;
        SELECT id_materia INTO id_m2 FROM materias ORDER BY RAND() LIMIT 1 OFFSET 1;
        SELECT id_materia INTO id_m3 FROM materias ORDER BY RAND() LIMIT 1 OFFSET 2;

        INSERT INTO clases (
          numero_clase, hora_inicio, hora_fin,
          fecha_inicio, fecha_fin, capacidad_clase,
          id_estudiante, id_materia
        ) VALUES
          (1, '08:00:00', '10:00:00', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 30, p_id_estudiante, id_m1),
          (2, '10:00:00', '12:00:00', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 30, p_id_estudiante, id_m2),
          (3, '14:00:00', '16:00:00', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 30, p_id_estudiante, id_m3);
      END
    `);

    // ⚙️ Crear trigger AFTER INSERT
    await pool.query(`DROP TRIGGER IF EXISTS estudiantes_AFTER_INSERT`);
    await pool.query(`
      CREATE TRIGGER estudiantes_AFTER_INSERT
      AFTER INSERT ON estudiantes FOR EACH ROW
      BEGIN
        DECLARE total_materias INT;

        SET total_materias = contar_materias();

        IF total_materias = 0 THEN
          CALL crear_materias();
        END IF;

        CALL crear_clases_para_estudiante(NEW.id_estudiante);
      END
    `);

    console.log('Base de datos y lógica inicializada correctamente.');

  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  }
}

// Ejecutar al iniciar
initDb();