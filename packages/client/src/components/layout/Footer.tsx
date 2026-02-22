import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <polygon points="12,2 22,20 2,20" />
              </svg>
              SummitR
            </Link>
            <p className="text-sm leading-relaxed">
              Plan your next summit. Discover routes, connect with climbers, and track your
              mountaineering journey worldwide.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/peaks" className="hover:text-white transition-colors">All Peaks</Link></li>
              <li><Link to="/routes" className="hover:text-white transition-colors">All Routes</Link></li>
              <li><Link to="/explore" className="hover:text-white transition-colors">Interactive Map</Link></li>
              <li><Link to="/guided" className="hover:text-white transition-colors">Guided Peaks</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/forums" className="hover:text-white transition-colors">Forums</Link></li>
              <li><Link to="/feed" className="hover:text-white transition-colors">Activity Feed</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Search</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} SummitR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
