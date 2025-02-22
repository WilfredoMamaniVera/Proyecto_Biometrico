import React from 'react';
import { Users, Calendar, BarChart2, Settings, LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/inicio' },
    { icon: Users, label: 'Empleados', count: '234', path: '/empleados' },
    { icon: Calendar, label: 'Asistencia', count: '18', path: '/Asistencias' },
    { icon: BarChart2, label: 'Reportes', count: '3', path: '/Reportes' },
    { icon: Settings, label: 'Configuración', path: '/Configuracion' },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white h-screen transition-all duration-300 shadow-sm`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button 
                onClick={() => navigate(item.path)}
                className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="w-6 h-6 text-gray-500" />
                {isOpen && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>{item.label}</span>
                    {item.count && (
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            </li>
          ))}
          <li className="pt-4 mt-4 border-t">
            <button className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
              <LogOut className="w-6 h-6" />
              {isOpen && <span>Cerrar Sesión</span>}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};