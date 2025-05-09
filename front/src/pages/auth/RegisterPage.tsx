import React, { useState, useRef } from 'react';
import { FiEye, FiEyeOff, FiUser, FiUpload } from 'react-icons/fi';
import SecurityIllustration from '../../components/SecurityIllustration';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import authService from '../../services/authService';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  avatar: File | null;
  location: string; // Ajout du champ location requis par l'interface User
}

interface RegisterPageProps {
  onRegisterSuccess: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    avatar: null,
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Effacer l'erreur pour ce champ lorsqu'il est modifié
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Effacer les erreurs API lorsque le formulaire est modifié
    if (apiError) {
      setApiError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, avatar: file }));
    
    // Créer une URL d'aperçu pour l'image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};
    
    // Validation du nom
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Une adresse email valide est requise";
    }
    
    // Validation du mot de passe
    if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    // Validation des CGU
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
    }
    
    // Validation de la localisation
    if (!formData.location.trim()) {
      newErrors.location = "La localisation est requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Préparation des données à envoyer à l'API
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location,
        avatar: formData.avatar
      };
      
      // Utilisation du service d'authentification pour l'inscription
      const response = await authService.register(registerData);
      console.log('Inscription réussie:', response);
      
      // Si l'inscription est réussie, appeler onRegisterSuccess
      onRegisterSuccess();
      
      // Rediriger vers le tableau de bord après la connexion
      navigate('/dashboard/projects');
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      
      // Amélioration du traitement des erreurs
      if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
        // Si le serveur renvoie des erreurs spécifiques aux champs
        const serverErrors = error.response.data.errors;
        const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        
        // Convertir les erreurs du serveur en format compatible avec notre état d'erreurs
        Object.entries(serverErrors).forEach(([key, value]) => {
          if (key in formData) {
            fieldErrors[key as keyof RegisterFormData] = Array.isArray(value) 
              ? value[0] 
              : String(value);
          }
        });
        
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...fieldErrors }));
        } else {
          // Si pas d'erreurs spécifiques aux champs, utiliser le message général
          setApiError(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
        }
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-secondary)]">
      {/* Top Navigation Bar - Plus responsive sur petits écrans */}
      <div className="flex justify-between items-center p-4 sm:p-6 w-full">
        {/* Logo - Toujours visible */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="font-semibold text-[var(--text-primary)]">2SB Kanban</span>
        </div>
        
        {/* System Name - Caché sur très petits écrans */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-sm text-[var(--text-secondary)]">Asike Product System</span>
          <svg className="h-5 w-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </div>
      </div>

      {/* Main Content - Adapté pour tous les écrans */}
      <div className="flex flex-1 flex-col lg:flex-row p-4 sm:p-6 lg:p-8">
        {/* Left Section - Illustration */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[var(--accent-color)] to-[var(--accent-hover)] rounded-3xl shadow-lg">
          {/* Conteneur centré pour l'illustration avec des marges */}
          <div className="w-full max-w-lg mx-auto px-4 sm:px-8">
            <SecurityIllustration />
          </div>
        </div>

        {/* Right Section - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 lg:pl-12">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Créer un compte</h2>
              <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)]">Rejoignez notre communauté en créant votre compte.</p>
            </div>

            {/* Affichage des erreurs API */}
            {apiError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{apiError}</h3>
                  </div>
                </div>
              </div>
            )}

            <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Photo de profil */}
              <div className="flex flex-col items-center space-y-3">
                <div 
                  className="h-24 w-24 rounded-full bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-[var(--border-color)]"
                  onClick={triggerFileInput}
                >
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Avatar preview" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser className="h-12 w-12 text-[var(--text-secondary)]" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex items-center text-sm text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
                >
                  <FiUpload className="mr-1" />
                  {previewUrl ? "Changer la photo" : "Ajouter une photo de profil"}
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)]">Nom complet</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-300 ring-red-500' : 'border-[var(--border-color)]'} rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)]">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-300 ring-red-500' : 'border-[var(--border-color)]'} rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-[var(--text-primary)]">Localisation</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Ex: Paris, France"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.location ? 'border-red-300 ring-red-500' : 'border-[var(--border-color)]'} rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]`}
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)]">Mot de passe</label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-300 ring-red-500' : 'border-[var(--border-color)]'} rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-[var(--text-secondary)]" />
                      ) : (
                        <FiEye className="h-5 w-5 text-[var(--text-secondary)]" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-primary)]">Confirmer le mot de passe</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300 ring-red-500' : 'border-[var(--border-color)]'} rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start sm:items-center">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className={`mt-1 sm:mt-0 h-4 w-4 ${errors.acceptTerms ? 'border-red-300 text-red-600' : 'border-[var(--border-color)] text-[var(--accent-color)]'} focus:ring-[var(--accent-color)] rounded bg-[var(--bg-primary)]`}
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-xs sm:text-sm text-[var(--text-secondary)]">
                    J'accepte les{' '}
                    <button 
                      type="button" 
                      className="text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
                      onClick={() => console.log('Terms and conditions clicked')}
                    >
                      conditions d'utilisation
                    </button>
                  </label>
                </div>
                {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Inscription...
                    </>
                  ) : (
                    'S\'inscrire'
                  )}
                </button>
              </div>
            </form>

            <div className="text-center">
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Vous avez déjà un compte ?{' '}
                <Link 
                  to="/login"
                  className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;