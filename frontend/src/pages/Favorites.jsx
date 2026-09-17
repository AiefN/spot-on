import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SpotCard from '../components/common/SpotCard';
import { bookmarkService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
  const { user, openAuthModal, favoriteIds } = useAuth();
  const [favoriteSpots, setFavoriteSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (!user?.email) {
        setFavoriteSpots([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await bookmarkService.getBookmarks(user.email);
        setFavoriteSpots(res.spots || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user, favoriteIds]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-10 flex-grow max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span>❤️</span>
              <span>Spot Mancing Favorit</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Daftar tempat mancing yang telah kamu simpan untuk agenda memancing berikutnya.
            </p>
          </div>

          {user && (
            <div className="text-xs font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-max">
              Tersimpan: <span className="text-rose-600 font-bold">{favoriteSpots.length}</span> spot
            </div>
          )}
        </div>

        {!user ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto p-8 shadow-sm">
            <div className="text-5xl mb-3">🔒</div>
            <h3 className="text-xl font-bold text-slate-800">Masuk untuk Melihat Favorit</h3>
            <p className="text-slate-500 text-sm mt-2 mb-6">
              Simpan spot mancing impianmu ke dalam bookmark akun agar mudah diakses kapan saja dari perangkat manapun.
            </p>
            <button
              onClick={openAuthModal}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-xl text-sm shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Masuk / Daftar Akun
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse p-4 flex flex-col justify-between border border-slate-100">
                <div className="bg-slate-200 h-44 rounded-xl w-full"></div>
                <div className="space-y-2 mt-4">
                  <div className="bg-slate-200 h-4 rounded w-3/4"></div>
                  <div className="bg-slate-200 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : favoriteSpots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto p-8 shadow-sm">
            <div className="text-5xl mb-3">🎣</div>
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Spot Favorit</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">
              Kamu belum menyimpan spot mancing ke daftar favorit. Klik ikon hati ❤️ pada kartu spot untuk menyimpannya di sini.
            </p>
            <Link
              to="/explore"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md inline-block"
            >
              Jelajahi Spot Mancing
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
