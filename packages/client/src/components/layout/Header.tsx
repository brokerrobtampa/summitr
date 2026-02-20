import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { SearchBar } from '../ui/SearchBar.js';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-peak-blue flex items-center gap-2 shrink-0">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <polygon points="12,2 22,20 2,20" />
        </svg>
        SummitR
      </Link>

      <nav className="hidden md:flex items-center gap-4 ml-4">
        <Link to="/feed" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
          Feed
        </Link>
        <Link to="/explore" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
          Explore
        </Link>
      </nav>

      <div className="flex-1 max-w-md mx-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {user ? (
          <>
            <Link
              to="/routes/new"
              className="bg-peak-blue text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              + Add Route
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              {user.displayName || user.username}
            </Link>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-peak-blue text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
