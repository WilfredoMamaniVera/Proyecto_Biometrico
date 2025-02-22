import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { StatCard } from '../components/Dashboard/StatCard';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { Users } from 'lucide-react';

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const attendanceStats = [
    { label: 'Presentes', value: '45', color: 'bg-green-500', icon: Users },
    { label: 'Ausentes', value: '12', color: 'bg-red-500', icon: Users },
    { label: 'Tardanzas', value: '8', color: 'bg-yellow-500', icon: Users },
  ];

  const recentActivities = [
    { user: 'Carlos Pérez', action: 'Marcó entrada', time: '08:00 AM' },
    { user: 'María González', action: 'Marcó salida', time: '05:00 PM' },
    { user: 'Juan Silva', action: 'Registro tardío', time: '09:15 AM' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {attendanceStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
          <RecentActivity activities={recentActivities} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;