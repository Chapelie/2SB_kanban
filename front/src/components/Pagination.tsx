import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? 'text-[var(--text-secondary)] cursor-not-allowed'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          Previous
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? 'bg-[var(--accent-color)] text-white'
                : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? 'text-[var(--text-secondary)] cursor-not-allowed'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;