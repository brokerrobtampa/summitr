import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as guidesApi from '../api/guides.api.js';

const SPECIALTIES = ['alpine', 'rock', 'ice', 'ski', 'mixed', 'trekking'];
const CERTIFICATIONS = ['IFMGA', 'AMGA Certified Alpine', 'AMGA Certified Rock', 'AMGA Certified Ski'];

export function GuideDirectoryPage() {
  const [tab, setTab] = useState<'guides' | 'companies'>('guides');
  const [guides, setGuides] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [certification, setCertification] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tab, search, specialty, certification]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'guides') {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (specialty) params.specialty = specialty;
        if (certification) params.certification = certification;
        const res = await guidesApi.getGuides(params);
        setGuides(res.data || []);
      } else {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        const res = await guidesApi.getGuideCompanies(params);
        setCompanies(res.data || []);
      }
    } catch {
      // silent
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mountain Guide Directory</h1>
        <p className="text-gray-600">
          Find certified mountain guides and guide companies for your next expedition.
          Verify credentials on the{' '}
          <a href="https://www.amga.com/about/member-directory" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            AMGA Directory
          </a>{' '}
          or{' '}
          <a href="https://ifmga.info/browse" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            IFMGA Directory
          </a>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('guides')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'guides' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Individual Guides
        </button>
        <button
          onClick={() => setTab('companies')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'companies' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Guide Companies
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tab === 'guides' ? 'Search by name...' : 'Search companies...'}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64"
        />
        {tab === 'guides' && (
          <>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Specialties</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <select
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Certifications</option>
              {CERTIFICATIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : tab === 'guides' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((g: any) => (
            <Link
              key={g.id}
              to={`/guides/${g.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
                  {g.firstName?.[0]}{g.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">{g.firstName} {g.lastName}</h3>
                  {g.certificationLevel && (
                    <p className="text-xs text-blue-600 font-medium mt-0.5">{g.certificationLevel}</p>
                  )}
                  {g.company && (
                    <p className="text-xs text-gray-500 mt-0.5">{g.company.name}</p>
                  )}
                </div>
              </div>
              {g.bio && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{g.bio}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(g.specialties || []).map((s: string) => (
                  <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{s}</span>
                ))}
              </div>
              {g.yearsExperience && (
                <p className="text-xs text-gray-400 mt-2">{g.yearsExperience}+ years experience</p>
              )}
            </Link>
          ))}
          {guides.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">No guides found matching your filters.</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c: any) => (
            <Link
              key={c.id}
              to={`/guides/companies/${c.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 text-lg">{c.name}</h3>
              {c.location && (
                <p className="text-sm text-gray-500 mt-1">{c.location}</p>
              )}
              {c.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{c.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                {c.guideCount > 0 && <span>{c.guideCount} guides</span>}
                {c.peakCount > 0 && <span>{c.peakCount} peaks</span>}
                {c.priceRange && <span>{c.priceRange}</span>}
              </div>
              {c.amgaAccredited && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
                  AMGA Accredited
                </span>
              )}
            </Link>
          ))}
          {companies.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">No companies found.</div>
          )}
        </div>
      )}
    </div>
  );
}
