import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import SecurityIllustration from '../components/SecurityIllustration';
import { useNavigate, Link } from 'react-router-dom';

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login submitted:', formData);
        // Simuler une connexion réussie
        onLoginSuccess();
        // Rediriger vers le tableau de bord après la connexion
        navigate('/dashboard/projects');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Top Navigation Bar - Plus responsive sur petits écrans */}
            <div className="flex justify-between items-center p-4 sm:p-6 w-full">
                {/* Logo - Toujours visible */}
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <span className="font-semibold text-gray-800">2SB Kanban</span>
                </div>
                
                {/* System Name - Caché sur très petits écrans */}
                <div className="hidden sm:flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Asike Product System</span>
                    <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </div>
            </div>

            {/* Main Content - Adapté pour tous les écrans */}
            <div className="flex flex-1 flex-col lg:flex-row p-4 sm:p-6 lg:p-8">
                {/* Left Section - Illustration */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-3xl shadow-lg">
                    {/* Conteneur centré pour l'illustration avec des marges */}
                    <div className="w-full max-w-lg mx-auto px-4 sm:px-8">
                        <SecurityIllustration />
                    </div>
                </div>

                {/* Right Section - Login Form - Ajout de marge pour séparer du fond bleu */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 lg:pl-12">
                    <div className="w-full max-w-md space-y-6 sm:space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back</h2>
                            <p className="mt-2 text-xs sm:text-sm text-gray-600">Welcome back! Please enter your details.</p>
                        </div>

                        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <FiEye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons supplémentaires - Réorganisés pour petits écrans */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="flex items-center">
                                    <button type="button" className="text-xs text-gray-600 hover:text-blue-500">
                                        Terms & Conditions
                                    </button>
                                </div>
                                <div>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Forgot Password
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                >
                                    Log in
                                </button>
                            </div>
                        </form>

                        <div className="text-center">
                            <p className="text-xs sm:text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Sign up for free
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