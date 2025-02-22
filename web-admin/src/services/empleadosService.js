// src/services/empleadosService.js

const API_URL = 'http://localhost:5000/api/empleados';

export const empleadosService = {
  // Obtener todos los empleados
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener empleados');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Obtener un empleado por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error al obtener el empleado');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Crear un nuevo empleado
  create: async (empleadoData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: empleadoData.name,
          email: empleadoData.email,
          departamento: empleadoData.department,
          cargo: empleadoData.position,
          password: empleadoData.password,
          estado: empleadoData.status,
          metodos_autenticacion: {
            face_id: empleadoData.useFaceId,
            huella: empleadoData.useFingerprint
          }
        }),
      });
      if (!response.ok) throw new Error('Error al crear empleado');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Actualizar un empleado
  update: async (id, empleadoData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: empleadoData.name,
          email: empleadoData.email,
          departamento: empleadoData.department,
          cargo: empleadoData.position,
          estado: empleadoData.status,
          metodos_autenticacion: {
            face_id: empleadoData.useFaceId,
            huella: empleadoData.useFingerprint
          }
        }),
      });
      if (!response.ok) throw new Error('Error al actualizar empleado');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Eliminar un empleado
  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar empleado');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Actualizar estado del empleado
  updateStatus: async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      });
      if (!response.ok) throw new Error('Error al actualizar estado');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};