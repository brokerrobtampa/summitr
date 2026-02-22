import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as guidesApi from '../api/guides.api.js';

export function GuideCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    guidesApi.getGuideCompany(Number(id)).then((res) => {
      setCompany(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-500">Loading...</div>;
  if (!company) return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-500">Company not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/guides" className="hover:text-blue-600">Guides</Link>
        <span>/</span>
        <span className="text-gray-900">{company.name}</span>
      </div>

      {/* Company Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            {company.location && (
              <p className="text-gray-500 mt-1">{company.location}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {company.amgaAccredited && (
                <span className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                  AMGA Accredited
                </span>
              )}
              {company.foundedYear && (
                <span className="text-sm text-gray-400">Est. {company.foundedYear}</span>
              )}
              {company.teamSize && (
                <span className="text-sm text-gray-400">{company.teamSize}</span>
              )}
            </div>
          </div>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shrink-0"
            >
              Visit Website
            </a>
          )}
        </div>

        {company.description && (
          <p className="text-gray-700 mt-4 leading-relaxed">{company.description}</p>
        )}

        {/* Contact Info */}
        <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t border-gray-100">
          {company.contactEmail && (
            <a href={`mailto:${company.contactEmail}`} className="text-sm text-blue-600 hover:underline">
              {company.contactEmail}
            </a>
          )}
          {company.contactPhone && (
            <span className="text-sm text-gray-600">{company.contactPhone}</span>
          )}
          {company.priceRange && (
            <span className="text-sm text-gray-600">Price range: {company.priceRange}</span>
          )}
        </div>

        {/* Specialties */}
        {company.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {company.specialties.map((s: string) => (
              <span key={s} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{s}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guide Roster */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Guide Team ({company.guides?.length || 0})</h2>
          {company.guides?.length > 0 ? (
            <div className="space-y-3">
              {company.guides.map((g: any) => (
                <Link
                  key={g.id}
                  to={`/guides/${g.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                    {g.firstName?.[0]}{g.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{g.firstName} {g.lastName}</p>
                    {g.certificationLevel && (
                      <p className="text-xs text-blue-600">{g.certificationLevel}</p>
                    )}
                    {g.yearsExperience && (
                      <p className="text-xs text-gray-400">{g.yearsExperience}+ years</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No individual guides listed yet.</p>
          )}
        </div>

        {/* Peaks Served */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Peaks Served ({company.peaks?.length || 0})</h2>
          {company.peaks?.length > 0 ? (
            <div className="space-y-2">
              {company.peaks.map((p: any) => (
                <Link
                  key={p.id}
                  to={`/peaks/${p.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.country} {p.range ? `- ${p.range}` : ''}</p>
                  </div>
                  <span className="text-blue-600 font-semibold text-sm">{p.elevation?.toLocaleString()}m</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No peaks listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
