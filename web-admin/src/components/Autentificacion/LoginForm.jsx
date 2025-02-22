import React, { useState } from 'react';
import { Mail, Lock, Fingerprint, Scan } from 'lucide-react';

export const LoginForm = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/empleados/autenticar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }
      
      setSuccess(`Bienvenido, ${data.empleado.nombre}`);
      console.log('Usuario autenticado:', data.empleado);
      
      // Aquí podrías almacenar el usuario en el estado global o localStorage
      localStorage.setItem('empleadoInfo', JSON.stringify(data.empleado));
      
      // Redirección después de login exitoso (puedes ajustar según tu flujo)
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (error) {
      setError(error.message);
      console.error('Error de autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFingerprint = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // En un caso real, aquí obtendrías los datos biométricos del escáner
      // Para este ejemplo, simulamos datos de huella
      const mockDatosHuella = 'fingerprint-data-12345';
      
      const response = await fetch('/api/empleados/autenticar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datosHuella: mockDatosHuella
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error de autenticación por huella');
      }
      
      setSuccess(`Bienvenido, ${data.empleado.nombre}`);
      localStorage.setItem('empleadoInfo', JSON.stringify(data.empleado));
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (error) {
      setError(error.message);
      console.error('Error de autenticación por huella:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceId = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // En un caso real, aquí obtendrías los datos de reconocimiento facial
      // Para este ejemplo, simulamos datos de Face ID
      const mockDatosFaceId = 'faceid-data-98765';
      
      const response = await fetch('/api/empleados/autenticar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datosFaceId: mockDatosFaceId
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error de autenticación por Face ID');
      }
      
      setSuccess(`Bienvenido, ${data.empleado.nombre}`);
      localStorage.setItem('empleadoInfo', JSON.stringify(data.empleado));
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (error) {
      setError(error.message);
      console.error('Error de autenticación por Face ID:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Por favor, ingrese su correo electrónico para recuperar su contraseña');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Aquí conectarías con un endpoint de recuperación de contraseña
      // Como ejemplo, solo mostramos un mensaje de éxito
      setSuccess(`Hemos enviado un correo de recuperación a ${email}`);
    } catch (error) {
      setError('Error al procesar la solicitud de recuperación de contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm w-full max-w-md mx-auto overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 block w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ejemplo@correo.com"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 block w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recordarme
                </label>
              </div>
              
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-blue-600 hover:text-blue-500"
                  disabled={isLoading}
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continuar con</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleFaceId}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={isLoading}
            >
              <Scan className="h-5 w-5 mr-2 text-green-500" />
              Face ID
            </button>
            <button
              type="button"
              onClick={handleFingerprint}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={isLoading}
            >
              <Fingerprint className="h-5 w-5 mr-2 text-blue-500" />
              Huella
            </button>
          </div>
        </div>
        
        {onRegisterClick && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tiene una cuenta?{' '}
              <button 
                onClick={onRegisterClick}
                className="font-medium text-blue-600 hover:text-blue-500"
                disabled={isLoading}
              >
                Registrarse
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};