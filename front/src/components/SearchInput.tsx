import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className = '' 
}) => {
  
  return (
    <div className={`relative ${className}`}>
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-sm text-[var(--text-primary)]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;