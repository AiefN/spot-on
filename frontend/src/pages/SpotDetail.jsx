import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SpotMap from '../components/map/SpotMap';
import ReviewSection from '../components/reviews/ReviewSection';
import { spotService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SpotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAuth();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const favorited = isFavorite(id);

  useEffect(() => {
    async function fetchSpotDetail() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const data = await spotService.getById(id);
        setSpot(data);
      } catch (err) {
        console.error(err);
        setErrorMsg("Spot mancing tidak ditemukan atau terjadi kendala jaringan.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchSpotDetail();
    }
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: spot?.name || 'Spot On Fishing Spot',
      text: `Cek spot mancing "${spot?.name}" di ${spot?.location} lewat Spot On!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1544605927-466d6a575a27?w=1200&q=80';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl flex-grow">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors text-sm cursor-pointer"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Kembali ke Halaman Sebelumnya</span>
          </button>

          {spot && (
            <button
              onClick={() => toggleFavorite(spot.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all border cursor-pointer ${
                favorited
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-rose-100'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200'
              }`}
            >
              <span>{favorited ? '❤️ Tersimpan di Favorit' : '🤍 Simpan ke Favorit'}</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 animate-pulse space-y-6">
            <div className="h-80 bg-slate-200 rounded-2xl w-full"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-2/3"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-4/6"></div>
            </div>
          </div>
        ) : errorMsg || !spot ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <span className="text-4xl">🐟</span>
            <h2 className="text-2xl font-bold text-slate-800 mt-3">Spot Tidak Ditemukan</h2>
            <p className="text-slate-500 text-sm mt-1 mb-6">
              {errorMsg || 'Data spot yang kamu cari mungkin sudah dihapus atau URL tidak valid.'}
            </p>
            <Link
              to="/explore"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md"
            >
              Jelajahi Spot Lainnya
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-900">
                <img
                  src={spot.image_url || defaultImage}
                  alt={spot.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6 sm:p-8">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    {spot.category || 'Spot Mancing'}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                      {spot.name}
                    </h1>
                    <p className="text-slate-600 font-medium text-base flex items-center gap-2">
                      <span className="text-red-500">📍</span>
                      <span>{spot.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-max">
                    <span>📅 Terdaftar:</span>
                    <span>{spot.created_at ? new Date(spot.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Baru saja'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span>📝</span>
                    <span>Tentang Spot Ini</span>
                  </h2>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-6 rounded-2xl border border-slate-100 text-base">
                    {spot.description || 'Belum ada deskripsi lengkap untuk spot ini.'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <span>🗺️</span>
                      <span>Peta Lokasi Spot</span>
                    </h2>
                    {spot.latitude && spot.longitude && (
                      <span className="text-xs font-semibold text-slate-400">
                        {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
                      </span>
                    )}
                  </div>
                  <SpotMap
                    spots={[spot]}
                    center={[spot.latitude || -6.2, spot.longitude || 106.816]}
                    zoom={13}
                    height="320px"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      spot.latitude && spot.longitude
                        ? `${spot.latitude},${spot.longitude}`
                        : spot.name + ' ' + spot.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🧭</span>
                    <span>Buka Rute di Google Maps</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full sm:w-auto text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>🔗</span>
                    <span>{copied ? 'Link Tersalin ke Clipboard!' : 'Bagikan Spot Ini'}</span>
                  </button>
                </div>

              </div>
            </div>

            <ReviewSection spotId={id} />
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}