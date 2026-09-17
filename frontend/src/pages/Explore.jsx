import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SpotCard from '../components/common/SpotCard';
import SpotMap from '../components/map/SpotMap';
import { spotService } from '../services/api';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Semua';

  const [filter, setFilter] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilter(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchSpots() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const data = await spotService.getAll();
        setSpots(data || []);
      } catch (err) {
        console.error(err);
        setErrorMsg('Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    }

    fetchSpots();
  }, []);

  const filteredSpots = spots.filter((spot) => {
    const matchCategory = filter === 'Semua' || spot.category === filter;

    const query = searchQuery.toLowerCase().trim();
    const nameMatch = spot.name ? spot.name.toLowerCase().includes(query) : false;
    const locationMatch = spot.location ? spot.location.toLowerCase().includes(query) : false;
    const descMatch = spot.description ? spot.description.toLowerCase().includes(query) : false;

    const matchSearch = query === '' || nameMatch || locationMatch || descMatch;

    return matchCategory && matchSearch;
  });

  const handleCategoryChange = (cat) => {
    setFilter(cat);
    if (cat === 'Semua') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleResetFilters = () => {
    setFilter('Semua');
    setSearchQuery('');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-10 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Eksplorasi Spot Mancing
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Temukan referensi tempat mancing terbaik di seluruh Indonesia
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center shadow-inner">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📋</span>
                <span>Daftar Kartu</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🗺️</span>
                <span>Tampilan Peta</span>
              </button>
            </div>

            <div className="hidden sm:block text-xs font-semibold text-slate-500 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-blue-600 font-bold">{filteredSpots.length}</span> spot
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Cari nama spot, kota, atau jenis ikan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {['Semua', 'Alam Terbuka', 'Galatama', 'Kuliner'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    filter === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'Semua' ? '🌐 Semua' : cat === 'Alam Terbuka' ? '🌲 Alam Terbuka' : cat === 'Galatama' ? '🏆 Galatama' : '🍲 Kuliner'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse p-4 flex flex-col justify-between border border-slate-100">
                <div className="bg-slate-200 h-44 rounded-xl w-full"></div>
                <div className="space-y-2 mt-4">
                  <div className="bg-slate-200 h-4 rounded w-3/4"></div>
                  <div className="bg-slate-200 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : errorMsg ? (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-200 max-w-lg mx-auto p-6">
            <span className="text-3xl">⚠️</span>
            <p className="text-red-700 font-semibold mt-2">{errorMsg}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Coba Muat Ulang
            </button>
          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Menampilkan {filteredSpots.length} Titik Spot Mancing
              </span>
              <span className="text-xs text-blue-600 font-semibold">
                Klik pin untuk melihat rincian
              </span>
            </div>
            <SpotMap spots={filteredSpots} height="560px" />
          </div>
        ) : filteredSpots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto p-8 shadow-sm">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-slate-800">Spot Tidak Ditemukan</h3>
            <p className="text-slate-500 text-sm mt-1 mb-5">
              Tidak ada spot yang cocok dengan pencarian "{searchQuery}" pada kategori "{filter}".
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}