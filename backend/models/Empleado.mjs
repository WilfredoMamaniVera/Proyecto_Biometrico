import { turso } from '../Db.mjs';

class Empleado {
  // Creación de la tabla empleados (normalizada)
  static async crearTabla() {
    const queryEmpleados = `
      CREATE TABLE IF NOT EXISTS empleados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        departamento TEXT NOT NULL,
        puesto TEXT NOT NULL,
        estado TEXT DEFAULT 'Activo',
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const queryAutenticacionCorreo = `
      CREATE TABLE IF NOT EXISTS autenticacion_por_correo (
        empleado_id INTEGER,
        password TEXT NOT NULL,
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
      )
    `;

    const queryAutenticacionHuella = `
      CREATE TABLE IF NOT EXISTS autenticacion_por_huella (
        empleado_id INTEGER,
        datos_huella TEXT NOT NULL,
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
      )
    `;

    const queryAutenticacionFaceId = `
      CREATE TABLE IF NOT EXISTS autenticacion_por_face_id (
        empleado_id INTEGER,
        datos_face_id TEXT NOT NULL,
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
      )
    `;

    try {
      await turso.execute(queryEmpleados);
      await turso.execute(queryAutenticacionCorreo);
      await turso.execute(queryAutenticacionHuella);
      await turso.execute(queryAutenticacionFaceId);
      console.log('Tablas creadas o ya existentes');
    } catch (error) {
      console.error('Error creando tablas:', error);
      throw error;
    }
  }

  // Creación de un nuevo empleado
  static async crear(empleadoData) {
    const { nombre, email, departamento, puesto } = empleadoData;

    const query = `
      INSERT INTO empleados (nombre, email, departamento, puesto)
      VALUES (?, ?, ?, ?)
      RETURNING id
    `;

    try {
      const result = await turso.execute({
        sql: query,
        args: [nombre, email, departamento, puesto]
      });
      
      // Verificar si tenemos filas y obtener el id de la primera fila
      if (result.rows && result.rows.length > 0) {
        return {
          lastInsertId: result.rows[0].id
        };
      }
      
      throw new Error('No se pudo obtener el ID del empleado creado');
    } catch (error) {
      console.error('Error creando empleado:', error);
      throw error;
    }
  }
  // Obtener todos los empleados activos
  static async obtenerTodos() {
    try {
      const result = await turso.execute('SELECT * FROM empleados WHERE estado = "Activo"');
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo empleados:', error);
      throw error;
    }
  }

  // Obtener empleado por ID
  static async obtenerPorId(id) {
    try {
      const result = await turso.execute({
        sql: 'SELECT * FROM empleados WHERE id = ? AND estado = "Activo"',
        args: [id]
      });
      return result.rows[0];
    } catch (error) {
      console.error('Error obteniendo empleado:', error);
      throw error;
    }
  }

  // Actualizar datos del empleado
  static async actualizar(id, empleadoData) {
    const updateFields = [];
    const updateValues = [];

    Object.entries(empleadoData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });

    updateValues.push(id);

    const query = `
      UPDATE empleados 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    try {
      const result = await turso.execute({
        sql: query,
        args: updateValues
      });
      return result;
    } catch (error) {
      console.error('Error actualizando empleado:', error);
      throw error;
    }
  }

  // Eliminar empleado (cambiar estado a inactivo)
  static async eliminar(id) {
    try {
      const result = await turso.execute({
        sql: 'UPDATE empleados SET estado = "Inactivo" WHERE id = ?',
        args: [id]
      });
      return result;
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      throw error;
    }
  }

  // Métodos de autenticación separados

  // Autenticación por correo
  static async crearAutenticacionCorreo(empleadoId, password) {
    if (!empleadoId || isNaN(Number(empleadoId))) {
      throw new Error("ID de empleado inválido o no numérico");
    }
    
    // Verificar que password sea un string válido
    if (typeof password !== 'string' || !password) {
      throw new Error("La contraseña debe ser un string no vacío");
    }
    
    const query = `
      INSERT INTO autenticacion_por_correo (empleado_id, password)
      VALUES (?, ?)
    `;
    
    try {
      const result = await turso.execute({
        sql: query,
        args: [parseInt(empleadoId, 10), password]
      });
      return result;
    } catch (error) {
      console.error('Error creando autenticación por correo:', error);
      throw error;
    }
  }
  // Autenticación por huella digital
  static async crearAutenticacionHuella(empleadoId, datosHuella) {
    // Convertir explícitamente a String
    const datosHuellaStr = typeof datosHuella === 'string' ? datosHuella : String(datosHuella);
    
    const query = `
      INSERT INTO autenticacion_por_huella (empleado_id, datos_huella)
      VALUES (?, ?)
    `;
    try {
      const result = await turso.execute({
        sql: query,
        args: [Number(empleadoId), datosHuellaStr]
      });
      return result;
    } catch (error) {
      console.error('Error creando autenticación por huella:', error);
      throw error;
    }
  }

  // Autenticación por Face ID
  static async crearAutenticacionFaceId(empleadoId, datosFaceId) {
    // Convertir explícitamente a String
    const datosFaceIdStr = typeof datosFaceId === 'string' ? datosFaceId : String(datosFaceId);
    
    const query = `
      INSERT INTO autenticacion_por_face_id (empleado_id, datos_face_id)
      VALUES (?, ?)
    `;
    try {
      const result = await turso.execute({
        sql: query,
        args: [Number(empleadoId), datosFaceIdStr]
      });
      return result;
    } catch (error) {
      console.error('Error creando autenticación por Face ID:', error);
      throw error;
    }
  }

  // Buscar empleado por email
  static async findByEmail(email) {
    try {
      const result = await turso.execute({
        sql: 'SELECT * FROM empleados WHERE email = ?',
        args: [email]
      });
      return result.rows[0];
    } catch (error) {
      console.error('Error buscando empleado por email:', error);
      throw error;
    }
  }

  // Buscar empleado por datos de Face ID
  static async findByFaceId(datosFaceId) {
    try {
      // Asegurar que los datos de face ID sean una cadena
      const datosFaceIdStr = typeof datosFaceId === 'string' ? datosFaceId : String(datosFaceId);
      
      const result = await turso.execute({
        sql: 'SELECT * FROM autenticacion_por_face_id WHERE datos_face_id = ?',
        args: [datosFaceIdStr]
      });
      return result.rows[0];
    } catch (error) {
      console.error('Error buscando empleado por Face ID:', error);
      throw error;
    }
  }
}

export default Empleado;