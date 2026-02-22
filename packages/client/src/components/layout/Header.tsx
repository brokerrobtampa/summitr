import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { SearchBar } from '../ui/SearchBar.js';
import { NotificationBell } from '../notifications/NotificationBell.js';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-peak-blue flex items-center gap-2 shrink-0">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <polygon points="12,2 22,20 2,20" />
          </svg>
          SummitR
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          <Link to="/peaks" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            Peaks
          </Link>
          <Link to="/routes" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            Routes
          </Link>
          <Link to="/explore" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            Explore
          </Link>
          <Link to="/forums" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            Forums
          </Link>
          <Link to="/feed" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            Feed
          </Link>
        </nav>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <SearchBar />
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link
                to="/routes/new"
                className="bg-peak-blue text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                + Add Route
              </Link>
              <NotificationBell />
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
                className="bg-peak-blue text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden ml-auto">
          {user && <NotificationBell />}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
          <div className="mb-3">
            <SearchBar />
          </div>
          <nav className="flex flex-col gap-1">
            <Link to="/peaks" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
              Peaks
            </Link>
            <Link to="/routes" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
              Routes
            </Link>
            <Link to="/explore" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
              Explore Map
            </Link>
            <Link to="/forums" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
              Forums
            </Link>
            <Link to="/feed" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
              Feed
            </Link>
            <Link to="/guided" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
              Guided Peaks
            </Link>
          </nav>
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
            {user ? (
              <>
                <Link to="/routes/new" onClick={() => setMobileOpen(false)} className="bg-peak-blue text-white px-3 py-2 rounded-md text-sm font-medium text-center hover:bg-blue-700">
                  + Add Route
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-gray-700 px-3 py-2 text-sm font-medium">
                  My Profile
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
                  className="text-gray-400 hover:text-gray-600 text-sm text-left px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gray-700 px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="bg-peak-blue text-white px-3 py-2 rounded-md text-sm font-medium text-center hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
