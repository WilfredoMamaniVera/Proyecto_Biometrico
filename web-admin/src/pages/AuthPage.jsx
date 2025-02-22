import React, { useState } from 'react';
import { LoginForm } from '../components/Autentificacion/LoginForm';

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="Logo.png"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {showLogin ? 'Bienvenido de nuevo' : 'Crear nueva cuenta'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
       
          <LoginForm onRegisterClick={() => setShowLogin(false)} />
      </div>
    </div>
  );
};

export default AuthPage;