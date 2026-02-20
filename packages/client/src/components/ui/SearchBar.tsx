import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutocomplete } from '../../hooks/useSearch.js';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { results } = useAutocomplete(query);
  const navigate = useNavigate();

  const handleSelect = (type: string, id: number) => {
    setQuery('');
    setIsFocused(false);
    if (type === 'peak') navigate(`/peaks/${id}`);
    else navigate(`/routes/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsFocused(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search peaks, routes..."
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-peak-blue focus:border-transparent"
        />
      </form>

      {isFocused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
          {results.map((r) => (
            <button
              key={`${r.type}-${r.id}`}
              onClick={() => handleSelect(r.type, r.id)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                r.type === 'peak' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {r.type}
              </span>
              <span className="font-medium">{r.name}</span>
              <span className="text-gray-400 text-xs ml-auto">{r.subtitle}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
