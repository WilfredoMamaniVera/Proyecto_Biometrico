import Empleado from '../models/Empleado.mjs';
import bcrypt from 'bcrypt';
import { turso } from '../Db.mjs';

class EmpleadoController {
  // Crear nuevo empleado
  static async crearEmpleado(req, res) {
    try {
      const { nombre, email, departamento, puesto, password, datosHuella, datosFaceId } = req.body;
      
      // Validar datos requeridos
      if (!nombre || !email || !departamento || !puesto) {
        return res.status(400).json({ 
          error: 'Se requieren nombre, email, departamento y puesto' 
        });
      }
      
      // Verificar si el email ya existe
      const empleadoExistente = await Empleado.findByEmail(email);
      if (empleadoExistente) {
        return res.status(400).json({ 
          error: 'El email ya está registrado' 
        });
      }
      
      // Crear el empleado
      const resultado = await Empleado.crear({ nombre, email, departamento, puesto });
      
      // Verificar que lastInsertId existe y es válido
      if (!resultado || !resultado.lastInsertId || isNaN(Number(resultado.lastInsertId))) {
        throw new Error("No se pudo obtener un ID válido para el nuevo empleado");
      }
      
      const empleadoId = resultado.lastInsertId;
      console.log(`Empleado creado con ID: ${empleadoId}`);
      
      // Registrar métodos de autenticación si se proporcionan
      if (password) {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          await Empleado.crearAutenticacionCorreo(empleadoId, hashedPassword);
          console.log("Autenticación por correo creada exitosamente");
        } catch (authError) {
          console.error("Error específico en autenticación por correo:", authError);
          // Continuar con el proceso aunque falle una autenticación
        }
      }
      
      if (datosHuella) {
        try {
          await Empleado.crearAutenticacionHuella(empleadoId, datosHuella);
          console.log("Autenticación por huella creada exitosamente");
        } catch (authError) {
          console.error("Error específico en autenticación por huella:", authError);
        }
      }
      
      if (datosFaceId) {
        try {
          await Empleado.crearAutenticacionFaceId(empleadoId, datosFaceId);
          console.log("Autenticación por Face ID creada exitosamente");
        } catch (authError) {
          console.error("Error específico en autenticación por Face ID:", authError);
        }
      }
      
      // Obtener el empleado recién creado
      const nuevoEmpleado = await Empleado.obtenerPorId(empleadoId);
      
      res.status(201).json({ 
        mensaje: 'Empleado creado exitosamente',
        empleado: nuevoEmpleado
      });
      
    } catch (error) {
      console.error('Error en controlador de creación:', error);
      res.status(500).json({ 
        error: 'Error al crear el empleado',
        detalles: error.message 
      });
    }
  }
  
  // Resto del controlador se mantiene igual...
  // Obtener todos los empleados
  static async obtenerEmpleados(req, res) {
    try {
      const empleados = await Empleado.obtenerTodos();
      res.status(200).json(empleados);
    } catch (error) {
      console.error('Error en controlador de obtención:', error);
      res.status(500).json({ 
        error: 'Error al obtener los empleados',
        detalles: error.message 
      });
    }
  }
  
  // Obtener empleado por ID
  static async obtenerEmpleadoPorId(req, res) {
    try {
      const { id } = req.params;
      const empleado = await Empleado.obtenerPorId(id);
      
      if (!empleado) {
        return res.status(404).json({ 
          error: 'Empleado no encontrado' 
        });
      }
      
      res.status(200).json(empleado);
    } catch (error) {
      console.error('Error en controlador de obtención por ID:', error);
      res.status(500).json({ 
        error: 'Error al obtener el empleado',
        detalles: error.message 
      });
    }
  }
  
  // Actualizar empleado
  static async actualizarEmpleado(req, res) {
    try {
      const { id } = req.params;
      const { nombre, email, departamento, puesto } = req.body;
      
      // Verificar si el empleado existe
      const empleadoExistente = await Empleado.obtenerPorId(id);
      if (!empleadoExistente) {
        return res.status(404).json({ 
          error: 'Empleado no encontrado' 
        });
      }
      
      // Si se está actualizando el email, verificar que no exista
      if (email && email !== empleadoExistente.email) {
        const emailExistente = await Empleado.findByEmail(email);
        if (emailExistente) {
          return res.status(400).json({ 
            error: 'El email ya está registrado por otro empleado' 
          });
        }
      }
      
      // Actualizar los datos
      await Empleado.actualizar(id, { nombre, email, departamento, puesto });
      
      // Obtener el empleado actualizado
      const empleadoActualizado = await Empleado.obtenerPorId(id);
      
      res.status(200).json({
        mensaje: 'Empleado actualizado exitosamente',
        empleado: empleadoActualizado
      });
      
    } catch (error) {
      console.error('Error en controlador de actualización:', error);
      res.status(500).json({ 
        error: 'Error al actualizar el empleado',
        detalles: error.message 
      });
    }
  }
  
  // Eliminar empleado (cambiar estado a inactivo)
  static async eliminarEmpleado(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar si el empleado existe
      const empleadoExistente = await Empleado.obtenerPorId(id);
      if (!empleadoExistente) {
        return res.status(404).json({ 
          error: 'Empleado no encontrado' 
        });
      }
      
      await Empleado.eliminar(id);
      
      res.status(200).json({
        mensaje: 'Empleado eliminado exitosamente'
      });
      
    } catch (error) {
      console.error('Error en controlador de eliminación:', error);
      res.status(500).json({ 
        error: 'Error al eliminar el empleado',
        detalles: error.message 
      });
    }
  }
  
  // Autenticación de empleado
  static async autenticarEmpleado(req, res) {
    try {
      const { email, password, datosFaceId, datosHuella } = req.body;
      
      // Al menos un método de autenticación debe ser proporcionado
      if (!email && !datosFaceId && !datosHuella) {
        return res.status(400).json({
          error: 'Se debe proporcionar al menos un método de autenticación'
        });
      }
      
      let empleado = null;
      
      // Autenticación por email/password
      if (email && password) {
        empleado = await Empleado.findByEmail(email);
        
        if (!empleado) {
          return res.status(401).json({
            error: 'Credenciales inválidas'
          });
        }
        
        // Buscar credenciales de autenticación por correo
        const credencialesResult = await turso.execute({
          sql: 'SELECT * FROM autenticacion_por_correo WHERE empleado_id = ?',
          args: [empleado.id]
        });
        
        if (credencialesResult.rows.length === 0) {
          return res.status(401).json({
            error: 'Este empleado no tiene configurada la autenticación por correo'
          });
        }
        
        const credenciales = credencialesResult.rows[0];
        const passwordMatch = await bcrypt.compare(password, credenciales.password);
        
        if (!passwordMatch) {
          return res.status(401).json({
            error: 'Contraseña incorrecta'
          });
        }
      }
      
      // Autenticación por Face ID
      else if (datosFaceId) {
        const resultado = await Empleado.findByFaceId(datosFaceId);
        
        if (!resultado) {
          return res.status(401).json({
            error: 'Autenticación por Face ID fallida'
          });
        }
        
        empleado = await Empleado.obtenerPorId(resultado.empleado_id);
      }
      
      // Si llegamos aquí, la autenticación fue exitosa
      res.status(200).json({
        mensaje: 'Autenticación exitosa',
        empleado: {
          id: empleado.id,
          nombre: empleado.nombre,
          email: empleado.email,
          departamento: empleado.departamento,
          puesto: empleado.puesto
        }
      });
      
    } catch (error) {
      console.error('Error en autenticación:', error);
      res.status(500).json({
        error: 'Error al autenticar al empleado',
        detalles: error.message
      });
    }
  }
}

export default EmpleadoController;