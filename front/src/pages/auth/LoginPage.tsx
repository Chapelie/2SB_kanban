import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import SecurityIllustration from '../../components/SecurityIllustration';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null); // Réinitialiser l'erreur lorsque l'utilisateur modifie le formulaire
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            // Utilisation du service d'authentification pour la connexion
            const response = await authService.login(formData);
            console.log('Connexion réussie:', response);
            
            // Informer le composant parent de la connexion réussie
            onLoginSuccess();
            
            // Rediriger vers le tableau de bord
            navigate('/dashboard/projects');
        } catch (error: any) {
            console.error('Erreur de connexion:', error);
            // Afficher un message d'erreur à l'utilisateur
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Erreur de connexion. Veuillez vérifier vos identifiants et réessayer.');
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

                {/* Right Section - Login Form - Ajout de marge pour séparer du fond bleu */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 lg:pl-12">
                    <div className="w-full max-w-md space-y-6 sm:space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Bienvenue</h2>
                            <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)]">Veuillez entrer vos informations de connexion.</p>
                        </div>

                        {/* Affichage des erreurs */}
                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-3 sm:space-y-4">
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
                                        className="mt-1 block w-full px-3 py-2 border border-[var(--border-color)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)]">Mot de passe</label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-2 border border-[var(--border-color)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
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
                                </div>
                            </div>

                            {/* Boutons supplémentaires - Réorganisés pour petits écrans */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="flex items-center">
                                    <button type="button" className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-color)]">
                                        Conditions générales
                                    </button>
                                </div>
                                <div>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-medium text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
                                    >
                                        Mot de passe oublié
                                    </Link>
                                </div>
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
                                            Connexion...
                                        </>
                                    ) : (
                                        'Se connecter'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="text-center">
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                                Vous n'avez pas de compte ?{' '}
                                <Link
                                    to="/register"
                                    className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
                                >
                                    S'inscrire gratuitement
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;