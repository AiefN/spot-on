import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SpotCard({ spot }) {
  const { isFavorite, toggleFavorite } = useAuth();
  const favorited = isFavorite(spot.id);

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Alam Terbuka':
        return 'bg-emerald-600 text-white';
      case 'Galatama':
        return 'bg-amber-600 text-white';
      case 'Kuliner':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const defaultImage = 'https://images.unsplash.com/photo-1544605927-466d6a575a27?w=600&q=80';

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col hover:-translate-y-1 relative">
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={spot.image_url || defaultImage}
          alt={spot.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-3.5 left-3.5 text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm ${getCategoryBadgeClass(
            spot.category
          )}`}
        >
          {spot.category || 'Spot Mancing'}
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(spot.id);
          }}
          title={favorited ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md cursor-pointer ${
            favorited
              ? 'bg-rose-500 text-white scale-110 shadow-rose-500/30'
              : 'bg-white/85 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <span className="text-sm transform transition-transform active:scale-125">
            {favorited ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
            {spot.name}
          </h3>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5 mb-3">
            <span className="text-red-500">📍</span>
            <span>{spot.location || 'Indonesia'}</span>
          </p>
          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4">
            {spot.description || 'Tempat mancing yang menarik untuk dikunjungi bersama teman atau keluarga.'}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <span className="text-xs font-semibold text-slate-400">
            {spot.created_at ? new Date(spot.created_at).toLocaleDateString('id-ID') : 'Spot Terverifikasi'}
          </span>
          <Link
            to={`/detail/${spot.id}`}
            className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <span>Detail</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}