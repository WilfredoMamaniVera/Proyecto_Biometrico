import express from 'express';
import cors from 'cors';
import empleadoRoutes from './routes/EmpleadoRoutes.js';
import Empleado from './models/Empleado.mjs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/empleados', empleadoRoutes);

// Inicialización de la base de datos
(async () => {
  try {
    await Empleado.crearTabla();
    console.log('Base de datos inicializada');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});