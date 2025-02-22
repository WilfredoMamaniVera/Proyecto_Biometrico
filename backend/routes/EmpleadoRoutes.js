import express from 'express';
import EmpleadoController from '../controllers/EmpleadoController.js';

const router = express.Router();

// Rutas para empleados
router.post('/', EmpleadoController.crearEmpleado);
router.get('/', EmpleadoController.obtenerEmpleados);
router.get('/:id', EmpleadoController.obtenerEmpleadoPorId);
router.put('/:id', EmpleadoController.actualizarEmpleado);
router.delete('/:id', EmpleadoController.eliminarEmpleado);

// Ruta para autenticación
router.post('/autenticar', EmpleadoController.autenticarEmpleado);

export default router;