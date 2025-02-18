import React, { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Pesquisando:', query);
  };

  return (
    <div className="flex items-center border rounded-lg p-2 bg-white shadow-sm mb-4">
      <input
        type="text"
        className="flex-1 outline-none px-2"
        placeholder="Pesquisar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span className="material-icons">search</span>
      </button>
    </div>
  );
}
