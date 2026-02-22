import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as guidesApi from '../api/guides.api.js';

export function GuideProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    guidesApi.getGuide(Number(id)).then((res) => {
      setGuide(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Loading...</div>;
  if (!guide) return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Guide not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/guides" className="hover:text-blue-600">Guides</Link>
        <span>/</span>
        <span className="text-gray-900">{guide.firstName} {guide.lastName}</span>
      </div>

      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl shrink-0">
            {guide.firstName?.[0]}{guide.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{guide.firstName} {guide.lastName}</h1>
            {guide.certificationLevel && (
              <p className="text-blue-600 font-medium mt-1">{guide.certificationLevel}</p>
            )}
            {guide.company && (
              <p className="text-gray-600 mt-1">
                <Link to={`/guides/companies/${guide.company.id}`} className="hover:text-blue-600">
                  {guide.company.name}
                </Link>
              </p>
            )}
            {guide.yearsExperience && (
              <p className="text-sm text-gray-500 mt-1">{guide.yearsExperience}+ years of guiding experience</p>
            )}
          </div>
        </div>

        {guide.bio && (
          <p className="text-gray-700 mt-4 leading-relaxed">{guide.bio}</p>
        )}

        {/* Contact */}
        <div className="flex flex-wrap gap-4 mt-5">
          {guide.email && (
            <a href={`mailto:${guide.email}`} className="text-sm text-blue-600 hover:underline">
              {guide.email}
            </a>
          )}
          {guide.website && (
            <a href={guide.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
              Website
            </a>
          )}
        </div>

        {/* Verification links */}
        <div className="flex flex-wrap gap-3 mt-4">
          {guide.amgaMemberId && (
            <a
              href="https://www.amga.com/about/member-directory"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-100"
            >
              Verify on AMGA Directory
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
          {guide.ifmgaLicenseNumber && (
            <a
              href="https://ifmga.info/browse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-xs font-medium hover:bg-green-100"
            >
              Verify on IFMGA Directory
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certifications */}
        {guide.certifications?.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Certifications</h2>
            <ul className="space-y-2">
              {guide.certifications.map((c: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specialties */}
        {guide.specialties?.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {guide.specialties.map((s: string) => (
                <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Operating Regions */}
        {guide.operatingRegions?.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Operating Regions</h2>
            <div className="flex flex-wrap gap-2">
              {guide.operatingRegions.map((r: string) => (
                <span key={r} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Route Specialties */}
        {guide.routeSpecialties?.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Route Specialties</h2>
            <div className="space-y-2">
              {guide.routeSpecialties.map((rs: any, i: number) => (
                <Link
                  key={i}
                  to={`/routes/${rs.route.id}`}
                  className="block text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <span className="font-medium text-gray-900">{rs.route.name}</span>
                  {rs.route.difficulty && (
                    <span className="text-blue-600 ml-1">({rs.route.difficulty})</span>
                  )}
                  <span className="text-gray-400 ml-1">- {rs.route.peak?.name}</span>
                  {rs.summitCount && (
                    <span className="text-gray-400 text-xs ml-2">{rs.summitCount} summits</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
