import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import { TripPlannerResultCard } from '../components/tripPlanner/TripPlannerResultCard.js';
import {
  ACTIVITY_TYPES,
  SEASONS,
  GRADE_SYSTEMS,
  GRADE_SYSTEM_LABELS,
  CONTINENTS,
  DIFFICULTY_LEVELS,
  COMMITMENT_LEVELS,
} from '@summit/shared';
import type {
  TripPlannerResult,
  TripPlannerFilters,
  TripPlannerSort,
  GradeSystem,
} from '@summit/shared';
import * as tripPlannerApi from '../api/tripPlanner.api.js';

const SORT_OPTIONS: { value: TripPlannerSort; label: string }[] = [
  { value: 'elevation_desc', label: 'Highest Peak First' },
  { value: 'elevation_asc', label: 'Lowest Peak First' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'difficulty_asc', label: 'Easiest First' },
  { value: 'difficulty_desc', label: 'Hardest First' },
  { value: 'name_asc', label: 'Peak Name A-Z' },
];

const ELEVATION_PRESETS = [
  { label: 'Under 4,000m', min: 0, max: 4000 },
  { label: '4,000 - 6,000m', min: 4000, max: 6000 },
  { label: '6,000 - 7,000m', min: 6000, max: 7000 },
  { label: '7,000 - 8,000m', min: 7000, max: 8000 },
  { label: 'Above 8,000m', min: 8000, max: undefined },
];

function FilterSection({ title, children, icon, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          {icon}
          {title}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function CheckboxGroup({ options, selected, onChange }: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  return (
    <div className="space-y-1.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...selected, opt.value]);
              } else {
                onChange(selected.filter((v) => v !== opt.value));
              }
            }}
            className="rounded border-gray-300 text-peak-blue focus:ring-peak-blue w-4 h-4"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function TripPlannerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<TripPlannerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filterCounts, setFilterCounts] = useState<{ totalPeaks: number; totalRoutes: number; countries: string[]; continents: string[] } | null>(null);

  // Filters state
  const [sort, setSort] = useState<TripPlannerSort>('elevation_desc');
  const [q, setQ] = useState('');
  const [continent, setContinent] = useState('');
  const [country, setCountry] = useState('');
  const [range, setRange] = useState('');
  const [minElevation, setMinElevation] = useState<number | undefined>();
  const [maxElevation, setMaxElevation] = useState<number | undefined>();
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [gradeSystem, setGradeSystem] = useState('');
  const [iceClimbing, setIceClimbing] = useState<boolean | undefined>();
  const [permitRequired, setPermitRequired] = useState<'any' | 'yes' | 'no'>('any');
  const [guidesAvailable, setGuidesAvailable] = useState<boolean | undefined>();
  const [maxDistance, setMaxDistance] = useState<number | undefined>();
  const [maxElevationGain, setMaxElevationGain] = useState<number | undefined>();
  const [maxEstimatedTime, setMaxEstimatedTime] = useState<number | undefined>();
  const [selectedCommitments, setSelectedCommitments] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const buildFilters = useCallback((): TripPlannerFilters => {
    const filters: TripPlannerFilters = { page, limit: 20, sort };
    if (q) filters.q = q;
    if (continent) filters.continent = continent;
    if (country) filters.country = country;
    if (range) filters.range = range;
    if (minElevation !== undefined) filters.minElevation = minElevation;
    if (maxElevation !== undefined) filters.maxElevation = maxElevation;
    if (selectedDifficulties.length > 0) filters.difficulty = selectedDifficulties;
    if (selectedActivities.length > 0) filters.activityTypes = selectedActivities;
    if (selectedSeasons.length > 0) filters.seasons = selectedSeasons;
    if (gradeSystem) filters.gradeSystem = gradeSystem;
    if (iceClimbing !== undefined) filters.iceClimbing = iceClimbing;
    if (permitRequired !== 'any') filters.permitRequired = permitRequired;
    if (guidesAvailable !== undefined) filters.guidesAvailable = guidesAvailable;
    if (maxDistance !== undefined) filters.maxDistance = maxDistance;
    if (maxElevationGain !== undefined) filters.maxElevationGain = maxElevationGain;
    if (maxEstimatedTime !== undefined) filters.maxEstimatedTime = maxEstimatedTime;
    if (selectedCommitments.length > 0) filters.commitment = selectedCommitments;
    return filters;
  }, [
    page, sort, q, continent, country, range, minElevation, maxElevation,
    selectedDifficulties, selectedActivities, selectedSeasons, gradeSystem,
    iceClimbing, permitRequired, guidesAvailable, maxDistance, maxElevationGain,
    maxEstimatedTime, selectedCommitments,
  ]);

  const search = useCallback(async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);

    setLoading(true);
    setHasSearched(true);
    try {
      const filters = buildFilters();
      if (resetPage) filters.page = 1;
      const res = await tripPlannerApi.searchTrips(filters);
      setResults(res.results);
      setTotalPages(res.pagination.totalPages);
      setTotalResults(res.pagination.total);
      setFilterCounts(res.filterCounts);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [buildFilters, page]);

  // Search when page changes
  useEffect(() => {
    if (hasSearched) {
      search();
    }
  }, [page]);

  const handleSearch = () => {
    search(true);
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setQ('');
    setContinent('');
    setCountry('');
    setRange('');
    setMinElevation(undefined);
    setMaxElevation(undefined);
    setSelectedDifficulties([]);
    setSelectedActivities([]);
    setSelectedSeasons([]);
    setGradeSystem('');
    setIceClimbing(undefined);
    setPermitRequired('any');
    setGuidesAvailable(undefined);
    setMaxDistance(undefined);
    setMaxElevationGain(undefined);
    setMaxEstimatedTime(undefined);
    setSelectedCommitments([]);
    setSort('elevation_desc');
  };

  const activeFilterCount = [
    q, continent, country, range,
    minElevation !== undefined, maxElevation !== undefined,
    selectedDifficulties.length > 0, selectedActivities.length > 0,
    selectedSeasons.length > 0, gradeSystem,
    iceClimbing !== undefined, permitRequired !== 'any',
    guidesAvailable !== undefined, maxDistance !== undefined,
    maxElevationGain !== undefined, maxEstimatedTime !== undefined,
    selectedCommitments.length > 0,
  ].filter(Boolean).length;

  // Load initial results on mount
  useEffect(() => {
    search(true);
  }, []);

  const filtersPanel = (
    <div className="space-y-0">
      {/* Search */}
      <div className="pb-4 mb-4 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search peaks or routes..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Location */}
      <FilterSection
        title="Location"
        icon={
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      >
        <div className="space-y-2">
          <select
            value={continent}
            onChange={(e) => { setContinent(e.target.value); setCountry(''); }}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
          >
            <option value="">All Continents</option>
            {Object.keys(CONTINENTS).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country..."
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
          />
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="Mountain range..."
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
          />
        </div>
      </FilterSection>

      {/* Elevation */}
      <FilterSection
        title="Peak Elevation"
        icon={
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      >
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {ELEVATION_PRESETS.map((preset) => {
              const isActive = minElevation === preset.min && maxElevation === preset.max;
              return (
                <button
                  key={preset.label}
                  onClick={() => {
                    if (isActive) {
                      setMinElevation(undefined);
                      setMaxElevation(undefined);
                    } else {
                      setMinElevation(preset.min);
                      setMaxElevation(preset.max);
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    isActive
                      ? 'bg-peak-blue text-white border-peak-blue'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-peak-blue hover:text-peak-blue'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              value={minElevation ?? ''}
              onChange={(e) => setMinElevation(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Min (m)"
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="number"
              value={maxElevation ?? ''}
              onChange={(e) => setMaxElevation(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Max (m)"
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
            />
          </div>
        </div>
      </FilterSection>

      {/* Difficulty */}
      <FilterSection
        title="Difficulty"
        icon={
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
      >
        <CheckboxGroup
          options={DIFFICULTY_LEVELS.map((d) => ({ value: d.value, label: d.label }))}
          selected={selectedDifficulties}
          onChange={setSelectedDifficulties}
        />
      </FilterSection>

      {/* Activity Type */}
      <FilterSection
        title="Activity Type"
        icon={
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <CheckboxGroup
          options={ACTIVITY_TYPES.map((a) => ({ value: a, label: a }))}
          selected={selectedActivities}
          onChange={setSelectedActivities}
        />
        <label className="flex items-center gap-2 mt-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={iceClimbing === true}
            onChange={(e) => setIceClimbing(e.target.checked ? true : undefined)}
            className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 flex items-center gap-1">
            <span className="text-base">{'\u2744\uFE0F'}</span> Ice Climbing Routes Only
          </span>
        </label>
      </FilterSection>

      {/* Season */}
      <FilterSection
        title="Best Season"
        icon={
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      >
        <CheckboxGroup
          options={SEASONS.map((s) => ({ value: s, label: s.replace('-', ' ') }))}
          selected={selectedSeasons}
          onChange={setSelectedSeasons}
        />
      </FilterSection>

      {/* Route Characteristics */}
      <FilterSection
        title="Route Characteristics"
        icon={
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        defaultOpen={false}
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">Max Distance (km)</label>
            <input
              type="number"
              value={maxDistance ?? ''}
              onChange={(e) => setMaxDistance(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="No limit"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Max Elevation Gain (m)</label>
            <input
              type="number"
              value={maxElevationGain ?? ''}
              onChange={(e) => setMaxElevationGain(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="No limit"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Max Estimated Time (hours)</label>
            <input
              type="number"
              value={maxEstimatedTime ?? ''}
              onChange={(e) => setMaxEstimatedTime(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="No limit"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Grade System</label>
            <select
              value={gradeSystem}
              onChange={(e) => setGradeSystem(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
            >
              <option value="">Any System</option>
              {GRADE_SYSTEMS.map((gs) => (
                <option key={gs} value={gs}>{GRADE_SYSTEM_LABELS[gs as GradeSystem]}</option>
              ))}
            </select>
          </div>
        </div>
      </FilterSection>

      {/* Commitment Level */}
      <FilterSection
        title="Commitment Level"
        icon={
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        defaultOpen={false}
      >
        <CheckboxGroup
          options={COMMITMENT_LEVELS.map((c) => ({ value: c.value, label: c.label }))}
          selected={selectedCommitments}
          onChange={setSelectedCommitments}
        />
      </FilterSection>

      {/* Logistics */}
      <FilterSection
        title="Expedition Logistics"
        icon={
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        }
        defaultOpen={false}
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">Permit Required</label>
            <div className="flex gap-2">
              {(['any', 'yes', 'no'] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => setPermitRequired(val)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    permitRequired === val
                      ? 'bg-peak-blue text-white border-peak-blue'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-peak-blue'
                  }`}
                >
                  {val === 'any' ? 'Any' : val === 'yes' ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={guidesAvailable === true}
              onChange={(e) => setGuidesAvailable(e.target.checked ? true : undefined)}
              className="rounded border-gray-300 text-peak-blue focus:ring-peak-blue w-4 h-4"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900">
              Guide services available
            </span>
          </label>
        </div>
      </FilterSection>

      {/* Action buttons */}
      <div className="pt-4 space-y-2">
        <button
          onClick={handleSearch}
          className="w-full bg-peak-blue text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Find Expeditions
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="w-full text-gray-500 hover:text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Clear All Filters ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-peak-blue">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Trip Planner</span>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-2xl p-6 md:p-8 mb-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,200 100,80 200,150 300,40 400,120 500,20 600,100 700,60 800,140 800,200" fill="currentColor" />
          </svg>
        </div>
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold">Trip Planner</h1>
          <p className="text-blue-100 mt-2 text-lg max-w-2xl">
            Plan your next expedition. Filter by elevation, difficulty, activity type, season, and more to find the perfect peak and route.
          </p>
          {filterCounts && (
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{filterCounts.totalPeaks}</div>
                <div className="text-xs text-blue-200">Peaks</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{filterCounts.totalRoutes}</div>
                <div className="text-xs text-blue-200">Routes</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{filterCounts.countries.length}</div>
                <div className="text-xs text-blue-200">Countries</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{filterCounts.continents.length}</div>
                <div className="text-xs text-blue-200">Continents</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-peak-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Expedition Filters
            </h2>
            {filtersPanel}
          </div>
        </aside>

        {/* Mobile filters overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {filtersPanel}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {hasSearched && !loading && (
                <p className="text-sm text-gray-500">
                  {totalResults} route{totalResults !== 1 ? 's' : ''} found
                  {activeFilterCount > 0 && ` with ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''}`}
                </p>
              )}
            </div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as TripPlannerSort); }}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Results grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : !hasSearched ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-1">Plan Your Expedition</h3>
              <p className="text-sm text-gray-400">Use the filters to find your ideal climbing route and peak</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-1">No routes match your criteria</h3>
              <p className="text-sm text-gray-400 mb-4">Try adjusting your filters for more results</p>
              <button
                onClick={clearFilters}
                className="text-peak-blue hover:underline text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((result) => (
                  <TripPlannerResultCard key={result.id} result={result} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
