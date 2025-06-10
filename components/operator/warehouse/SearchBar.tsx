import React from 'react';

type SearchBarProps = {
  onSearch: (value: string) => void;
  console.log('🔍 [SearchBar.tsx] onSearch: (value: string) => void;');
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => (
console.log('🔍 [SearchBar.tsx] Entering function: const SearchBar: React.FC<SearchBarProps> = ');
  <input
    type="text"
    placeholder="Search inventory..."
    className="border p-2 w-full"
    onChange={(e) => onSearch(e.target.value)}
  />
);

export default SearchBar;
