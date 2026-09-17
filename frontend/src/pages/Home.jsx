import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SpotCard from '../components/common/SpotCard';
import { spotService } from '../services/api';

export default function Home() {
  const [featuredSpots, setFeaturedSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        const data = await spotService.getFeatured();
        setFeaturedSpots(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  const categories = [
    {
      name: 'Alam Terbuka',
      desc: 'Danau alami, waduk, muara & sungai berarus tenang',
      icon: '🌲',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    },
    {
      name: 'Galatama',
      desc: 'Kolam lomba adu ketangkasan & hadiah mingguan',
      icon: '🏆',
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    },
    {
      name: 'Kuliner',
      desc: 'Pemancingan keluarga santai, ikan bisa langsung dimasak',
      icon: '🍲',
      color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                <span>🎣</span>
                <span>Direktori Mancing No. 1 di Indonesia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Temukan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Spot Mancing</span> Terbaikmu!
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Jelajahi berbagai lokasi mancing mulai dari alam liar, kolam galatama kompetisi, hingga spot kuliner keluarga. Bagikan lokasi favoritmu dan nikmati sensasi <span className="italic font-semibold text-blue-900">strike</span> setiap waktu.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/explore"
                  className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Mulai Eksplorasi Sekarang
                </Link>
                <Link
                  to="/add"
                  className="w-full sm:w-auto text-center bg-white hover:bg-slate-50 text-blue-700 border-2 border-blue-200 font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm hover:border-blue-400 hover:-translate-y-0.5"
                >
                  + Tambah Spot Baru
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Akses Gratis</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-600">3 Kategori</div>
                  <div className="text-xs text-slate-500 font-medium">Alam, Galatama, Kuliner</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">Komunitas</div>
                  <div className="text-xs text-slate-500 font-medium">Angler Nusantara</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1598188306155-25e400eb5078?q=80&w=1000&auto=format&fit=crop"
                    alt="Memancing di alam bebas"
                    className="w-full h-80 sm:h-96 md:h-[420px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
                    <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 w-max">
                      Spot Favorit Angler
                    </span>
                    <h3 className="text-white text-xl sm:text-2xl font-bold">
                      Jelajahi Surga Tersembunyi di Indonesia
                    </h3>
                    <p className="text-slate-200 text-sm mt-1">
                      Koleksi lokasi memancing yang terverifikasi dan direkomendasikan langsung oleh komunitas.
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                    🐟
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Strike Tiap Hari</div>
                    <div className="text-[11px] text-slate-500">Info spot lengkap & akurat</div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-2 sm:-right-4 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-800">Database Real-time</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Pilih Kategori Petualangan Mancingmu
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Setiap pemancing punya gaya favorit masing-masing. Mau tantangan liar atau santai bersama keluarga?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className={`p-6 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 block ${cat.color}`}
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{cat.desc}</p>
                <div className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-wider">
                  <span>Lihat Semua Spot</span>
                  <span className="ml-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">
                Rekomendasi Terbaru
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Spot Pilihan Angler
              </h2>
            </div>
            <Link
              to="/explore"
              className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1 transition-colors"
            >
              <span>Jelajahi Semua Lokasi</span>
              <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse p-4 flex flex-col justify-between">
                  <div className="bg-slate-200 h-44 rounded-xl w-full"></div>
                  <div className="space-y-2 mt-4">
                    <div className="bg-slate-200 h-4 rounded w-3/4"></div>
                    <div className="bg-slate-200 h-3 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredSpots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500">Belum ada data spot mancing.</p>
              <Link to="/add" className="text-blue-600 font-bold text-sm mt-2 inline-block">
                + Tambah Spot Pertama
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
            Punya Spot Mancing Andalan?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mb-8 leading-relaxed">
            Bantu sesama angler menemukan sensasi strike berikutnya. Daftarkan lokasi mancing favoritmu secara gratis hanya dalam 1 menit!
          </p>
          <Link
            to="/add"
            className="inline-block bg-white text-blue-700 hover:bg-blue-50 font-bold text-base py-3.5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            + Bagikan Spot Mancing Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}