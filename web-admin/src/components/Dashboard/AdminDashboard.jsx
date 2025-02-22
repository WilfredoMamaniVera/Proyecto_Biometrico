import React from 'react';
import { useState } from 'react';
import { Menu, Bell, Users, Calendar, Settings, BarChart2, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: Users, label: 'Empleados', count: '234' },
    { icon: Calendar, label: 'Asistencia', count: '18' },
    { icon: BarChart2, label: 'Reportes', count: '3' },
    { icon: Settings, label: 'Configuración' },
  ];

  const recentActivities = [
    { user: 'Carlos Pérez', action: 'Marcó entrada', time: '08:00 AM' },
    { user: 'María González', action: 'Marcó salida', time: '05:00 PM' },
    { user: 'Juan Silva', action: 'Registro tardío', time: '09:15 AM' },
  ];

  const attendanceStats = [
    { label: 'Presentes', value: '45', color: 'bg-green-500' },
    { label: 'Ausentes', value: '12', color: 'bg-red-500' },
    { label: 'Tardanzas', value: '8', color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">Control de Asistencia</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                A
              </div>
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white h-screen transition-all duration-300 shadow-sm`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <item.icon className="w-6 h-6 text-gray-500" />
                    {sidebarOpen && (
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
                  {sidebarOpen && <span>Cerrar Sesión</span>}
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {attendanceStats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-500">{stat.label}</h3>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;