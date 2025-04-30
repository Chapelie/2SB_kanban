/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import SecurityIllustration from '../../components/SecurityIllustration';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Forgot password submitted:', formData);
    // Simuler l'envoi d'un email de réinitialisation
    setIsSubmitted(true);
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
          <span className="font-semibold text-[var(--text-primary)]">AProjectO</span>
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

        {/* Right Section - Forgot Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 lg:pl-12">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Mot de passe oublié</h2>
              <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                {isSubmitted 
                  ? "Vérifiez votre boîte de réception pour les instructions de réinitialisation."
                  : "Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe."}
              </p>
            </div>

            {!isSubmitted ? (
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
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]"
                  >
                    Envoyer les instructions
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Email envoyé avec succès
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full flex justify-center py-2 px-4 border border-[var(--border-color)] rounded-md shadow-sm text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]"
                  >
                    Essayer une autre adresse email
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Vous vous souvenez de votre mot de passe?{' '}
                <Link 
                  to="/login"
                  className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
                >
                  Retour à la connexion
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;