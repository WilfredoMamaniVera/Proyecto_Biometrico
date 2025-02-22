import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmpleadosPage';  
import AsistenciPage from './pages/AsistenciaPage';  
import ReportesPage from './pages/ReportesPage';  
import ConfiguracionPage from './pages/ConfiguracionPage';  
import AuthPage from './pages/AuthPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta por defecto - redirige a la página de autenticación */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        
        {/* Ruta de autenticación */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Rutas protegidas */}
        <Route path="/inicio" element={<DashboardPage />} />
        <Route path="/empleados" element={<EmployeesPage />} /> 
        <Route path="/asistencias" element={<AsistenciPage />} /> 
        <Route path="/reportes" element={<ReportesPage />} /> 
        <Route path="/configuracion" element={<ConfiguracionPage />} /> 
        
        {/* Ruta para manejar URLs no encontradas */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;