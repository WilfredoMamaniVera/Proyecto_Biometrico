import React from 'react';

export const AttendanceCalendar = ({ records }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold">Registro de Asistencia</h2>
      <div className="flex gap-2">
        <button className="px-4 py-2 border rounded hover:bg-gray-50">Hoy</button>
        <button className="px-4 py-2 border rounded hover:bg-gray-50">⬅️</button>
        <button className="px-4 py-2 border rounded hover:bg-gray-50">➡️</button>
      </div>
    </div>
    <div className="grid grid-cols-7 gap-4">
      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb','Dom'].map(day => (
        <div key={day} className="text-center font-medium text-gray-500">
          {day}
        </div>
      ))}
      {records.map((record, index) => (
        <div key={index} className="aspect-square p-2 border rounded hover:bg-gray-50 cursor-pointer">
          <div className="text-sm font-medium">{record.day}</div>
          <div className="text-xs text-gray-500">{record.entries} registros</div>
        </div>
      ))}
    </div>
  </div>
);
