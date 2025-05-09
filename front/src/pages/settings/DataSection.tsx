import React, { useState } from 'react';
import { FaChevronLeft, FaDownload, FaTrash } from 'react-icons/fa';

interface DataSectionProps {
  onBack: () => void;
}

const DataSection: React.FC<DataSectionProps> = ({ onBack }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleExportData = () => {
    alert('Exportation des données simulée');
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
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Gestion des données</h2>
      </div>
      
      <div className="space-y-8">
        <div className="bg-[var(--bg-primary)] p-6 rounded-lg border border-[var(--border-color)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Exporter vos données</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Vous pouvez exporter toutes vos données personnelles et vos logs de travail dans un format JSON ou CSV.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] flex items-center"
            >
              <FaDownload className="mr-2" /> Exporter en JSON
            </button>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-[var(--text-secondary)] text-white rounded-md hover:bg-[var(--text-primary)] flex items-center"
            >
              <FaDownload className="mr-2" /> Exporter en CSV
            </button>
          </div>
        </div>
        
        <div className="bg-[var(--bg-primary)] p-6 rounded-lg border border-[var(--border-color)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Stockage et cache</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Cache de l'application</p>
                <p className="text-sm text-[var(--text-secondary)]">2.4 MB utilisés</p>
              </div>
              <button className="text-[var(--accent-color)] hover:text-[var(--accent-hover)]">
                Vider le cache
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Données locales</p>
                <p className="text-sm text-[var(--text-secondary)]">5.7 MB utilisés</p>
              </div>
              <button className="text-[var(--accent-color)] hover:text-[var(--accent-hover)]">
                Effacer les données
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="font-medium text-red-800 mb-4">Zone dangereuse</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            La suppression de votre compte est irréversible. Toutes vos données personnelles et vos logs de travail seront définitivement supprimés.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
          >
            <FaTrash className="mr-2" /> Supprimer mon compte
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Confirmer la suppression</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Tapez "SUPPRIMER" pour confirmer</label>
              <input 
                type="text" 
                className="w-full p-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)]" 
                placeholder="SUPPRIMER" 
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)]"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button 
                type="button" 
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={() => {
                  alert('Suppression de compte simulée');
                  setShowDeleteModal(false);
                }}
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSection;