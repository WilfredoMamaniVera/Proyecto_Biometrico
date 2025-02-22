import React from 'react';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';

export const ReportCard = ({ report }) => {
  // Función para manejar la descarga según el tipo
  const handleDownload = () => {
    console.log(`Descargando "${report.title}" en formato ${report.type}`);
    // Aquí implementarías la lógica real de descarga
    alert(`Descargando "${report.title}" en formato ${report.type}`);
  };

  // Selecciona el icono adecuado basado en el tipo de archivo
  const getFileIcon = () => {
    switch (report.type.toLowerCase()) {
      case 'excel':
        return <FileSpreadsheet className="w-6 h-6 text-green-600" />;
      case 'pdf':
      default:
        return <FileText className="w-6 h-6 text-red-600" />;
    }
  };

  // Establece el color de fondo según el tipo de archivo
  const getIconBgColor = () => {
    switch (report.type.toLowerCase()) {
      case 'excel':
        return 'bg-green-100';
      case 'pdf':
      default:
        return 'bg-red-100';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${getIconBgColor()} rounded`}>
            {getFileIcon()}
          </div>
          <div>
            <h3 className="font-medium">{report.title}</h3>
            <p className="text-sm text-gray-500">{report.date}</p>
            <span className={`text-xs px-2 py-0.5 ${
              report.type.toLowerCase() === 'excel' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            } rounded mt-2 inline-block`}>
              {report.type}
            </span>
          </div>
        </div>
        <button 
          onClick={handleDownload}
          className="p-2 hover:bg-gray-100 rounded" 
          title={`Descargar en formato ${report.type}`}
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};