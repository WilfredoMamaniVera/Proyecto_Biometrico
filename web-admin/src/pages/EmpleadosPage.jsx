import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { EmployeeTable } from '../components/Empleados/EmployeeTable';
import { EmpleadosForm } from '../components/Empleados/EmpleadosForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmpleadosPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshEmployees, setRefreshEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEmployeeAdded = (employee) => {
    setIsFormOpen(false);
    setSelectedEmployee(null);
    setRefreshEmployees(!refreshEmployees); 
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} />
          <main className="flex-1 p-6">
            <EmployeeTable 
              onNewEmployee={() => {
                setSelectedEmployee(null);
                setIsFormOpen(true);
              }}
              refreshEmployees={refreshEmployees}
              onEditEmployee={handleEditEmployee}
            />
            <EmpleadosForm
              isOpen={isFormOpen}
              onClose={handleCloseForm}
              onEmployeeAdded={handleEmployeeAdded}
              employeeToEdit={selectedEmployee}
            />
          </main>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </>
  );
};

export default EmpleadosPage;