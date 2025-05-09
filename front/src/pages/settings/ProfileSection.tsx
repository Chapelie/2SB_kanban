import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { 
  FaEnvelope, FaMapMarkerAlt, FaCamera, FaSignOutAlt, FaChevronLeft,
  FaCheck, FaTimes, FaSpinner
} from 'react-icons/fa';
import authService, { ProfileUpdateData } from '../../services/authService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProfileSectionProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onBack: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || '',
    location: user.location || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setAvatarFile(file);
      
      // Créer une URL pour prévisualiser l'image
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Préparer les données à envoyer à l'API
      const profileData: ProfileUpdateData = {
        name: formData.name,
        location: formData.location
      };
      
      // Ajouter l'avatar s'il a été changé
      if (avatarFile) {
        profileData.avatar = avatarFile;
      }
      
      // Appeler le service d'authentification pour mettre à jour le profil
      const updatedUser = await authService.updateProfile(profileData);
      
      // Mettre à jour l'état local avec les données réelles retournées par l'API
      const updatedUserData = {
        ...user,
        ...updatedUser,
        // S'assurer que ces champs sont bien présents
        name: updatedUser.name || user.name,
        location: updatedUser.location || user.location,
        avatar: updatedUser.avatar || user.avatar
      };
      
      // Mettre à jour l'interface utilisateur
      onSave(updatedUserData);
      
      // Réinitialiser les états
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    // Utiliser authService pour la déconnexion
    authService.logout();
    window.location.href = '/login';
  };
  
  // Générer les initiales pour l'avatar par défaut
  const getInitials = () => {
    if (!user.name) return '';
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color-light)] rounded-full transition-colors"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Profil utilisateur</h2>
      </div>
      
      <div className="flex flex-col md:flex-row mb-8">
        <div className="w-full md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={user.name}
                className="h-32 w-32 rounded-full object-cover border-4 border-[var(--bg-primary)] shadow-md"
                onError={(e) => {
                  // En cas d'erreur de chargement, afficher les initiales
                  (e.target as HTMLImageElement).style.display = 'none';
                  document.getElementById('avatar-fallback')?.classList.remove('hidden');
                }}
              />
            ) : (
              <div
                id="avatar-fallback"
                className="h-32 w-32 rounded-full bg-[var(--accent-color-light)] flex items-center justify-center text-[var(--accent-color)] text-3xl font-bold border-4 border-[var(--bg-primary)] shadow-md"
              >
                {getInitials()}
              </div>
            )}
            <button 
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 bg-[var(--accent-color)] text-white p-2 rounded-full hover:bg-[var(--accent-hover)] transition-colors"
              title="Changer la photo"
            >
              <FaCamera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <h3 className="text-lg font-medium mt-4 text-[var(--text-primary)]">{formData.name}</h3>
          <p className="text-[var(--text-secondary)]">{formData.location}</p>
          
          {isEditing && avatarFile && (
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <FaCheck className="mr-1" /> Nouvelle photo sélectionnée
            </div>
          )}
        </div>
        
        <div className="w-full md:w-2/3">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)]"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-[var(--text-secondary)]" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true} // Email toujours désactivé car il ne peut pas être modifié
                    className="w-full p-2 pl-10 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)]"
                  />
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">L'adresse email ne peut pas être modifiée</p>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Localisation
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-[var(--text-secondary)]" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Ville, Pays"
                    className="w-full p-2 pl-10 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)]"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        email: user.email || '',
                        location: user.location || '',
                      });
                      setAvatarPreview(user.avatar || '');
                      setAvatarFile(null);
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] mr-3 flex items-center"
                  >
                    <FaTimes className="mr-2" /> Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" /> Enregistrement...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-2" /> Enregistrer
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)]"
                >
                  Modifier le profil
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <hr className="my-8 border-[var(--border-color)]" />
      
      <div>
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Informations du compte</h3>
        <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">ID Utilisateur</p>
              <p className="font-medium text-[var(--text-primary)]">{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Adresse email</p>
              <p className="font-medium text-[var(--text-primary)]">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Date de création</p>
              <p className="font-medium text-[var(--text-primary)]">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'Non disponible'}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Dernière connexion</p>
              <p className="font-medium text-[var(--text-primary)]">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Aujourd\'hui'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button 
          className="text-red-600 hover:text-red-800 flex items-center" 
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-2" /> Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;