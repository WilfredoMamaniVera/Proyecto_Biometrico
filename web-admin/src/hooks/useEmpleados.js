// src/hooks/useEmpleados.js

import { useState, useEffect } from 'react';
import { empleadosService } from '../services/empleadosService';

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  // Cargar empleados
  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const data = await empleadosService.getAll();
      setEmpleados(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear empleado
  const createEmpleado = async (empleadoData) => {
    setLoading(true);
    try {
      const nuevoEmpleado = await empleadosService.create(empleadoData);
      setEmpleados([...empleados, nuevoEmpleado]);
      setError(null);
      return nuevoEmpleado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar empleado
  const updateEmpleado = async (id, empleadoData) => {
    setLoading(true);
    try {
      const empleadoActualizado = await empleadosService.update(id, empleadoData);
      setEmpleados(empleados.map(emp => 
        emp.id === id ? empleadoActualizado : emp
      ));
      setError(null);
      return empleadoActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar empleado
  const deleteEmpleado = async (id) => {
    setLoading(true);
    try {
      await empleadosService.delete(id);
      setEmpleados(empleados.filter(emp => emp.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado del empleado
  const updateEmpleadoStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const empleadoActualizado = await empleadosService.updateStatus(id, newStatus);
      setEmpleados(empleados.map(emp => 
        emp.id === id ? empleadoActualizado : emp
      ));
      setError(null);
      return empleadoActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar empleado para edición
  const selectEmpleado = (empleado) => {
    setSelectedEmpleado(empleado);
  };

  // Limpiar selección
  const clearSelection = () => {
    setSelectedEmpleado(null);
  };

  // Cargar empleados al montar el componente
  useEffect(() => {
    fetchEmpleados();
  }, []);

  return {
    empleados,
    loading,
    error,
    selectedEmpleado,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    updateEmpleadoStatus,
    selectEmpleado,
    clearSelection,
    reloadEmpleados: fetchEmpleados
  };
};