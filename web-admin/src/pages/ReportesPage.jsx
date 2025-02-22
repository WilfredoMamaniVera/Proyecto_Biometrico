import React, { useState, useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { ReportCard } from '../components/Reportes/ReportesCard';
import { MonthSelector } from '../components/Reportes/SelectorMes';
import { Plus } from 'lucide-react';

const ReportesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Estado para el mes y año seleccionados
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  // Todos los reportes disponibles - definidos en un estado para mantener la consistencia
  const [allReports] = useState([
    { title: 'Reporte Mensual de Asistencia', date: 'Febrero 2024', type: 'PDF' },
    { title: 'Resumen de Tardanzas', date: 'Febrero 2024', type: 'Excel' },
    { title: 'Registro de Horas Extras', date: 'Enero 2024', type: 'PDF' },
    { title: 'Reporte Mensual de Asistencia', date: 'Enero 2024', type: 'PDF' },
    { title: 'Informe de Productividad', date: 'Marzo 2024', type: 'Excel' },
    { title: 'Registro de Vacaciones', date: 'Marzo 2024', type: 'PDF' },
  ]);
  
  // Estado para los reportes filtrados
  const [filteredReports, setFilteredReports] = useState([]);
  
  // Filtrar reportes según el mes y año seleccionados
  useEffect(() => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const selectedMonthName = months[selectedMonth];
    
    const filtered = allReports.filter(report => {
      const [reportMonth, reportYear] = report.date.split(' ');
      return reportMonth === selectedMonthName && reportYear === selectedYear.toString();
    });
    
    setFilteredReports(filtered);
  }, [selectedMonth, selectedYear, allReports]); // Añadí allReports como dependencia
  
  const handleMonthChange = (newMonth, newYear) => {
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  // Función para generar un nuevo reporte
  const handleGenerateReport = () => {
    console.log('Generando nuevo reporte');
    // Aquí manejarías la lógica para crear un nuevo reporte
    // Por ejemplo, abrir un modal o navegar a una nueva página
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Reportes</h1>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              onClick={handleGenerateReport}
            >
              <Plus className="w-4 h-4" />
              Generar Reporte
            </button>
          </div>
          
          <MonthSelector 
            currentMonth={selectedMonth}
            currentYear={selectedYear}
            onChange={handleMonthChange}
          />
          
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report, index) => (
                <ReportCard key={index} report={report} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">No hay reportes disponibles para {
                ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][selectedMonth]
              } {selectedYear}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReportesPage;