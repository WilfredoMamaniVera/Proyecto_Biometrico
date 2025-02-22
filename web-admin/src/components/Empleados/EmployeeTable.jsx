import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MoreVertical, Edit, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const EmployeeTable = ({ onNewEmployee, refreshEmployees, onEditEmployee }) => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const employeesPerPage = 10;

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/empleados');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Error al cargar los empleados', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [refreshEmployees]);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    const employeeName = employees.find(emp => emp.id === employeeId)?.nombre || 'empleado';
    
    toast.warn(
      <div className="w-full max-w-md p-2 min-h-[100px]">
       
        <div className="flex items-center justify-center mb-2">
        <h3 className="text-xl font-bold text-gray-800 text-center">¡Atención!</h3>
        </div>

        <p className="mb-6 text-center text-gray-800 font-semibold">
          ¿Estás seguro de que deseas eliminar a{" "}
          <span className="text-red-600">{employeeName}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              setIsDeleting(true);
              toast.dismiss();
              try {
                await axios.delete(`http://localhost:5000/api/empleados/${employeeId}`);
                await fetchEmployees();
                toast.success("Empleado eliminado con éxito");
                const newTotalPages = Math.ceil((employees.length - 1) / employeesPerPage);
                if (currentPage > newTotalPages) {
                  setCurrentPage(newTotalPages);
                }
              } catch (error) {
                console.error("Error al eliminar empleado:", error);
                toast.error("Error al eliminar el empleado");
              } finally {
                setIsDeleting(false);
              }
            }}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        icon: false,
      }
    );
    
    
  };

  const handleEditEmployee = (employee) => {
    if (onEditEmployee) {
      onEditEmployee(employee);
    }
  };

  // Rest of the render code remains the same...
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Lista de Empleados</h2>
        <button
          onClick={onNewEmployee}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          disabled={isDeleting}
        >
          Nuevo Empleado
        </button>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-6 text-gray-600">Cargando empleados...</div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-gray-600">Empleado</th>
                  <th className="text-left p-4 text-gray-600">Departamento</th>
                  <th className="text-left p-4 text-gray-600">Puesto</th>
                  <th className="text-left p-4 text-gray-600">Fecha Creación</th>
                  <th className="text-left p-4 text-gray-600">Estado</th>
                  <th className="text-center p-4 text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((employee) => (
                    <tr key={employee.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {employee.nombre.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{employee.nombre}</p>
                            <p className="text-sm text-gray-500">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{employee.departamento}</td>
                      <td className="p-4 text-gray-600">{employee.puesto}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(employee.fecha_creacion).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            employee.estado === 'Activo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {employee.estado}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors disabled:text-gray-400"
                            onClick={() => handleEditEmployee(employee)}
                            title="Editar empleado"
                            disabled={isDeleting}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded text-red-600 transition-colors disabled:text-gray-400"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            title="Eliminar empleado"
                            disabled={isDeleting}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No hay empleados disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {employees.length > employeesPerPage && (
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Mostrando <span className="font-medium">{indexOfFirstEmployee + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastEmployee, employees.length)}
                  </span>{' '}
                  de <span className="font-medium">{employees.length}</span> empleados
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1 || isDeleting}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      currentPage === 1 || isDeleting
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-1 text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || isDeleting}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      currentPage === totalPages || isDeleting
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};