import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { ConfigCard } from '../components/Configuracion/ConfigCard';
import { ConfigSection } from '../components/Configuracion/ConfigSection';
import { 
  Building2, 
  User, 
  Bell, 
  Users, 
  Briefcase, 
  Clock, 
  Shield, 
  Link, 
  HardDrive 
} from 'lucide-react';

const ConfigurationPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const handleConfigClick = (configType) => {
    // Aquí manejarías la navegación o apertura de modales
    console.log(`Configuración seleccionada: ${configType}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Guardar Cambios
            </button>
          </div>
          
          <ConfigSection title="Configuración General">
            <ConfigCard 
              title="Información de la Empresa" 
              description="Gestiona la información básica de la empresa"
              onClick={() => handleConfigClick('company-info')}
              icon={Building2}
            />
            <ConfigCard 
              title="Preferencias de Usuario" 
              description="Personaliza tu experiencia en la plataforma"
              onClick={() => handleConfigClick('user-preferences')}
              icon={User}
            />
            <ConfigCard 
              title="Notificaciones" 
              description="Configura tus preferencias de notificaciones"
              onClick={() => handleConfigClick('notifications')}
              icon={Bell}
            />
          </ConfigSection>
          
          <ConfigSection title="Administración de Personal">
            <ConfigCard 
              title="Departamentos" 
              description="Gestiona los departamentos de la empresa"
              onClick={() => handleConfigClick('departments')}
              icon={Users}
            />
            <ConfigCard 
              title="Cargos" 
              description="Administra los cargos disponibles"
              onClick={() => handleConfigClick('positions')}
              icon={Briefcase}
            />
            <ConfigCard 
              title="Turnos de Trabajo" 
              description="Configura los turnos y horarios laborales"
              onClick={() => handleConfigClick('shifts')}
              icon={Clock}
            />
          </ConfigSection>
          
          <ConfigSection title="Configuración Avanzada">
            <ConfigCard 
              title="Seguridad" 
              description="Ajustes de seguridad y permisos"
              onClick={() => handleConfigClick('security')}
              icon={Shield}
            />
            <ConfigCard 
              title="Integraciones" 
              description="Conecta con otras plataformas y servicios"
              onClick={() => handleConfigClick('integrations')}
              icon={Link}
            />
            <ConfigCard 
              title="Respaldo y Recuperación" 
              description="Gestiona copias de seguridad del sistema"
              onClick={() => handleConfigClick('backup')}
              icon={HardDrive}
            />
          </ConfigSection>
        </main>
      </div>
    </div>
  );
};

export default ConfigurationPage;