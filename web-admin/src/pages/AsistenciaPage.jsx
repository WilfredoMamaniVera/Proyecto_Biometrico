import React, { useState, useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { AttendanceCalendar } from '../components/Asistencia/Asistencia';

const AttendancePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth(); 
    const currentYear = today.getFullYear(); 

    // Obtener el número de días en el mes actual
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate(); // Número de días en el mes actual

    // Generar los registros de asistencia para el mes actual
    const records = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      entries: Math.floor(Math.random() * 100) // Número aleatorio de entradas
    }));

    setAttendanceRecords(records);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6">
          <AttendanceCalendar records={attendanceRecords} />
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;
