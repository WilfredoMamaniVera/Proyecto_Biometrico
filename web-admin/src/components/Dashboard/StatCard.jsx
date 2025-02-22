import React from 'react';

export const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-gray-500">{label}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);