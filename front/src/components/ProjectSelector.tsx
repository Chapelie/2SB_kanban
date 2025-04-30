import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { FaFolder, FaCaretDown, FaSearch, FaCheckCircle } from 'react-icons/fa';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: string;
  onChange: (projectId: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  projects, 
  selectedProject, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus sur le champ de recherche quand on ouvre le dropdown
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Obtenir le nom du projet sélectionné
  const getSelectedProjectTitle = () => {
    if (selectedProject === 'all') return 'Tous les projets';
    const project = projects.find(p => p.id === selectedProject);
    return project ? project.title : 'Sélectionner un projet';
  };

  // Filtrer les projets en fonction du terme de recherche
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la sélection d'un projet
  const handleSelect = (projectId: string) => {
    onChange(projectId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        Sélectionner un projet
      </label>
      
      {/* Bouton du sélecteur */}
      <button
        type="button"
        className="relative w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-left shadow-sm hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition duration-150 ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FaFolder className={`mr-2 ${selectedProject === 'all' ? 'text-[var(--accent-color)]' : 'text-yellow-500'}`} />
          <span className="block truncate font-medium text-[var(--text-primary)]">{getSelectedProjectTitle()}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaCaretDown className={`h-4 w-4 text-[var(--text-secondary)] transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </span>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-[var(--bg-primary)] shadow-lg max-h-80 overflow-y-auto ring-1 ring-[var(--border-color)] divide-y divide-[var(--border-color)] animate-slideDown">
          {/* Barre de recherche */}
          <div className="sticky top-0 z-10 bg-[var(--bg-primary)] p-2">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="h-4 w-4 text-[var(--text-secondary)]" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                className="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-[var(--text-primary)] ring-1 ring-inset ring-[var(--border-color)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-inset focus:ring-[var(--accent-color)] sm:text-sm bg-[var(--bg-primary)]"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Option Tous les projets */}
          <div className="p-1">
            <button
              type="button"
              className={`flex items-center w-full px-4 py-3 text-sm rounded-md hover:bg-[var(--bg-secondary)] ${selectedProject === 'all' ? 'bg-[var(--bg-secondary)] text-[var(--accent-color)]' : 'text-[var(--text-primary)]'}`}
              onClick={() => handleSelect('all')}
            >
              <FaFolder className="mr-2 text-[var(--accent-color)]" />
              <span className="flex-grow text-left font-medium">Tous les projets</span>
              {selectedProject === 'all' && <FaCheckCircle className="h-4 w-4 text-[var(--accent-color)]" />}
            </button>
          </div>

          {/* Liste des projets */}
          <div className="p-1">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className={`flex items-center w-full px-4 py-3 text-sm rounded-md hover:bg-[var(--bg-secondary)] ${selectedProject === project.id ? 'bg-[var(--bg-secondary)] text-[var(--accent-color)]' : 'text-[var(--text-primary)]'}`}
                  onClick={() => handleSelect(project.id)}
                >
                  <FaFolder className="mr-2 text-yellow-500" />
                  <div className="flex-grow text-left">
                    <div className="font-medium">{project.title}</div>
                    {project.description && (
                      <div className="text-xs text-[var(--text-secondary)] truncate max-w-xs">{project.description}</div>
                    )}
                  </div>
                  {selectedProject === project.id && <FaCheckCircle className="h-4 w-4 text-[var(--accent-color)]" />}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-[var(--text-secondary)] text-center">
                Aucun projet trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;