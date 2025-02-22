import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { X, Camera, Fingerprint, User, Mail, Phone, Calendar, Building, Briefcase, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import * as faceapi from 'face-api.js';

export const EmpleadosForm = ({ isOpen, onClose, onEmployeeAdded, employeeToEdit }) => {
  const defaultFormState = useMemo(() => ({
    nombre: '',
    email: '',
    telefono: '',
    departamento: '',
    puesto: '',
    estado: 'Activo',
    fechaIngreso: '',
    password: '',
    confirmPassword: '',
    useFaceId: false,
    useFingerprint: false,
    faceIdImage: null
  }), []);

  const [formData, setFormData] = useState(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [capturedImage, setCapturedImage] = useState(null); // Imagen capturada temporalmente
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // **Cargar modelos de face-api.js al montar el componente**
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // Modelo para detección de rostros
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // Modelo para landmarks faciales
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // Modelo para reconocimiento facial
        ]);
        console.log('Modelos de face-api.js cargados correctamente');
      } catch (error) {
        console.error('Error al cargar los modelos de face-api.js:', error);
        toast.error('No se pudieron cargar los modelos de detección facial.');
      }
    };
    loadModels();
  }, []);

  // **Actualizar formulario cuando hay empleado para editar**
  useEffect(() => {
    if (employeeToEdit) {
      let formattedDate = '';
      if (employeeToEdit.fechaIngreso) {
        const date = new Date(employeeToEdit.fechaIngreso);
        formattedDate = date.toISOString().split('T')[0];
      }
      setFormData({
        ...employeeToEdit,
        fechaIngreso: formattedDate,
        password: '',
        confirmPassword: '',
        useFaceId: employeeToEdit.useFaceId || false,
        useFingerprint: employeeToEdit.useFingerprint || false,
        faceIdImage: employeeToEdit.faceIdImage || null
      });
      setIsEditMode(true);
    } else {
      setFormData(defaultFormState);
      setIsEditMode(false);
    }
    setErrors({});
  }, [employeeToEdit, defaultFormState]);

  // **Detener cámara al desmontar el componente**
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // **Manejar cambios en los campos del formulario**
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // **Iniciar la cámara**
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        detectFaces(); // Iniciar detección de rostros
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      toast.error('No se pudo acceder a la cámara. Verifique los permisos.');
    }
  };

  // **Detener la cámara**
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCapturedImage(null); // Limpiar imagen capturada
  };

  // **Detectar rostros en tiempo real**
  const detectFaces = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      if (!isCameraActive || capturedImage) return; // Detener si la cámara no está activa o ya hay captura
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 100); // Detectar cada 100ms
  };

  // **Capturar imagen del rostro**
  const captureFace = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    toast.success('Imagen capturada. Confirme para guardar.');
  };

  // **Guardar imagen facial**
  const saveFace = () => {
    if (!capturedImage) return;
    setFormData(prevData => ({
      ...prevData,
      faceIdImage: capturedImage,
      useFaceId: true
    }));
    setCapturedImage(null);
    stopCamera();
    toast.success('Rostro guardado con éxito');
  };

  // **Simular registro de huella dactilar**
  const simulateFingerprint = () => {
    toast.info('Simulando registro de huella dactilar...');
    setTimeout(() => {
      setFormData(prevData => ({
        ...prevData,
        useFingerprint: true
      }));
      toast.success('Huella dactilar registrada con éxito');
    }, 1500);
  };

  // **Verificar si el email ya existe**
  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/empleados/check-email/${email}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error al verificar email:', error);
      return false;
    }
  };

  // **Verificar si el nombre ya existe**
  const checkNameExists = async (nombre) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/empleados/check-name/${nombre}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error al verificar nombre:', error);
      return false;
    }
  };

  // **Validar el formulario**
  const validateForm = async () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato de email es inválido';
    }
    if (!formData.departamento) newErrors.departamento = 'El departamento es requerido';
    if (!formData.puesto) newErrors.puesto = 'El puesto es requerido';

    if (!isEditMode) {
      if (!formData.useFaceId && !formData.useFingerprint) {
        if (!formData.password) newErrors.password = 'La contraseña es requerida para nuevos empleados';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Debe confirmar la contraseña';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
      if (formData.useFaceId && !formData.faceIdImage) newErrors.faceId = 'Debe guardar una imagen para Face ID';
    }

    if (Object.keys(newErrors).length === 0) {
      if (!isEditMode || (isEditMode && formData.email !== employeeToEdit.email)) {
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          newErrors.email = 'Este correo electrónico ya está registrado';
          toast.error('Este correo electrónico ya está en uso');
        }
      }
      if (!isEditMode || (isEditMode && formData.nombre !== employeeToEdit.nombre)) {
        const nameExists = await checkNameExists(formData.nombre);
        if (nameExists) {
          newErrors.nombre = 'Este nombre ya está registrado';
          toast.error('Este nombre ya está en uso');
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // **Enviar formulario**
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;
    setIsSubmitting(true);

    try {
      let response;
      const dataToSend = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        departamento: formData.departamento,
        puesto: formData.puesto,
        estado: formData.estado,
        fechaIngreso: formData.fechaIngreso || new Date().toISOString().split('T')[0],
        useFaceId: formData.useFaceId,
        useFingerprint: formData.useFingerprint,
        faceIdImage: formData.faceIdImage
      };

      if (isEditMode) {
        response = await axios.put(`http://localhost:5000/api/empleados/${formData.id}`, dataToSend);
        toast.success('Empleado actualizado con éxito');
      } else {
        response = await axios.post('http://localhost:5000/api/empleados', {
          ...dataToSend,
          password: formData.password || null
        });
        toast.success('Empleado creado con éxito');
      }

      onEmployeeAdded(response.data);
      setFormData(defaultFormState);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} el empleado`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // **Renderizar información personal**
  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-700">Información Personal</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nombre del empleado"
              disabled={isSubmitting}
            />
          </div>
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-4 h-4 text-gray-500" />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="correo@ejemplo.com"
              disabled={isSubmitting}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className="w-4 h-4 text-gray-500" />
          </div>
          <input
            id="telefono"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(123) 456-7890"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <label htmlFor="fechaIngreso" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Calendar className="w-4 h-4 text-gray-500" />
          </div>
          <input
            id="fechaIngreso"
            type="date"
            name="fechaIngreso"
            value={formData.fechaIngreso}
            onChange={handleChange}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );

  // **Renderizar información laboral**
  const renderJobInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Briefcase className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-700">Información Laboral</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Building className="w-4 h-4 text-gray-500" />
            </div>
            <select
              id="departamento"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              className={`w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${errors.departamento ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isSubmitting}
            >
              <option value="">Seleccionar departamento</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Ventas">Ventas</option>
              <option value="Marketing">Marketing</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Operaciones">Operaciones</option>
            </select>
          </div>
          {errors.departamento && <p className="text-red-500 text-xs mt-1">{errors.departamento}</p>}
        </div>
        <div>
          <label htmlFor="puesto" className="block text-sm font-medium text-gray-700 mb-1">Puesto *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Briefcase className="w-4 h-4 text-gray-500" />
            </div>
            <input
              id="puesto"
              type="text"
              name="puesto"
              value={formData.puesto}
              onChange={handleChange}
              className={`w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.puesto ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Cargo del empleado"
              disabled={isSubmitting}
            />
          </div>
          {errors.puesto && <p className="text-red-500 text-xs mt-1">{errors.puesto}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          disabled={isSubmitting}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
          <option value="Vacaciones">Vacaciones</option>
          <option value="Licencia">Licencia</option>
        </select>
      </div>
    </div>
  );

  // **Renderizar métodos de autenticación**
  const renderAuthInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Fingerprint className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-700">Métodos de Autenticación</h3>
      </div>
      <div className="space-y-4 border p-5 rounded-lg shadow-sm bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <label htmlFor="useFaceId" className="text-sm font-medium text-gray-700">Autenticación con Face ID</label>
          </div>
          <input
            id="useFaceId"
            type="checkbox"
            name="useFaceId"
            checked={formData.useFaceId}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className={`${formData.useFaceId && !formData.faceIdImage ? 'block' : 'hidden'} rounded-lg overflow-hidden`}>
          <div className="mb-3 px-4 py-3 bg-gray-100 rounded-lg">
            <h4 className="font-medium text-sm text-gray-700 mb-1">Centro de Captura Facial</h4>
            <p className="text-xs text-gray-500">Coloque su rostro dentro del marco y asegúrese de tener buena iluminación</p>
          </div>
          {!isCameraActive && !capturedImage && (
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg h-64">
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-4">La cámara está inactiva</p>
              <button
                type="button"
                onClick={startCamera}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                <Camera className="w-5 h-5" />
                Activar Cámara
              </button>
            </div>
          )}
          {isCameraActive && !capturedImage && (
            <div className="space-y-3">
              <div className="relative h-72 flex items-center justify-center bg-black">
                <video ref={videoRef} autoPlay playsInline className="max-h-full max-w-full object-contain" />
                <canvas ref={canvasRef} className="absolute inset-0" />
                <div className="absolute inset-0 border-4 border-dashed border-white opacity-40 m-8 pointer-events-none"></div>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3">
                <button
                  type="button"
                  onClick={captureFace}
                  className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  <Camera className="w-5 h-5" />
                  Capturar
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
              </div>
            </div>
          )}
          {capturedImage && (
            <div className="space-y-3">
              <div className="relative h-72 flex items-center justify-center bg-black">
                <img src={capturedImage} alt="Captured Face" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="grid grid-cols-3 gap-3 p-3">
                <button
                  type="button"
                  onClick={saveFace}
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  <Save className="w-5 h-5" />
                  Guardar Rostro
                </button>
                <button
                  type="button"
                  onClick={() => setCapturedImage(null)}
                  className="py-2 px-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  <Camera className="w-5 h-5" />
                  Volver a Capturar
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
        {formData.faceIdImage && (
          <div className="mt-3">
            <div className="relative">
              <img src={formData.faceIdImage} alt="Face ID" className="w-full h-60 object-cover rounded-md" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-green-100 bg-opacity-80 px-4 py-2 rounded-full">
                  <p className="text-green-800 font-medium text-sm">Imagen facial registrada</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, faceIdImage: null }));
                  startCamera();
                }}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        )}
        {errors.faceId && <p className="text-red-500 text-xs mt-1">{errors.faceId}</p>}
      </div>
      <div className="border p-5 rounded-lg shadow-sm bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Fingerprint className="w-5 h-5 text-blue-600" />
            <label htmlFor="useFingerprint" className="text-sm font-medium text-gray-700">Autenticación con Huella Dactilar</label>
          </div>
          <input
            id="useFingerprint"
            type="checkbox"
            name="useFingerprint"
            checked={formData.useFingerprint}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
        {formData.useFingerprint && (
          <div className="mt-3">
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center mb-3">
              <Fingerprint className="w-16 h-16 text-blue-600 mb-3" />
              <p className="text-sm text-gray-600 mb-2 text-center">Coloque su dedo en el sensor para registrar su huella</p>
            </div>
            <button
              type="button"
              onClick={simulateFingerprint}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              <Fingerprint className="w-5 h-5" />
              Registrar Huella Dactilar
            </button>
          </div>
        )}
      </div>
      {(!formData.useFaceId && !formData.useFingerprint) && (
        <div className="space-y-4 border p-5 rounded-lg shadow-sm bg-white">
          <h4 className="text-sm font-medium text-gray-700 pb-2 border-b">Autenticación por Contraseña</h4>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Contraseña nueva"
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña *</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Confirmar contraseña"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>
      )}
    </div>
  );

  // **Renderizar el formulario completo**
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{isEditMode ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
            <button
              onClick={() => {
                setFormData(defaultFormState);
                setErrors({});
                stopCamera();
                onClose();
              }}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isSubmitting}
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100 mt-1">
            {isEditMode ? 'Actualice la información del empleado' : 'Complete el formulario para registrar un nuevo empleado'}
          </p>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 font-medium text-sm transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'personal' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('personal')}
            disabled={isSubmitting}
          >
            <User className={`w-4 h-4 ${activeTab === 'personal' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>Información Personal</span>
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium text-sm transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'job' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('job')}
            disabled={isSubmitting}
          >
            <Briefcase className={`w-4 h-4 ${activeTab === 'job' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>Información Laboral</span>
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium text-sm transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'auth' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('auth')}
            disabled={isSubmitting}
          >
            <Fingerprint className={`w-4 h-4 ${activeTab === 'auth' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>Autenticación</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
          <div className="flex-grow overflow-y-auto p-6">
            {activeTab === 'personal' && renderPersonalInfo()}
            {activeTab === 'job' && renderJobInfo()}
            {activeTab === 'auth' && renderAuthInfo()}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFormData(defaultFormState);
                setErrors({});
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};