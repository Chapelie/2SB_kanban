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
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;