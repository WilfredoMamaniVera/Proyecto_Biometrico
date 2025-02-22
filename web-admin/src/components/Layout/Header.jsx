import React from 'react';
import { Bell, Menu } from 'lucide-react';

export const Header = ({ toggleSidebar }) => (
  <header className="bg-white shadow-sm">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
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
);
