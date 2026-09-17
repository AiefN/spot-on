import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                Spot<span className="text-blue-400">On</span>
              </span>
              <span className="bg-blue-600/30 text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-blue-500/30">
                Direktori Angler
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Platform direktori bagi para pencinta mancing di seluruh Nusantara. Temukan lokasi terbaik mulai dari alam liar, kolam galatama profesional, hingga spot wisata kuliner keluarga.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400 text-sm">
              <span className="inline-flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full text-xs">
                🌊 Komunitas Angler
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full text-xs">
                🎣 100% Gratis
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Navigasi</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-slate-400 hover:text-white transition-colors">
                  Eksplorasi Spot
                </Link>
              </li>
              <li>
                <Link to="/add" className="text-slate-400 hover:text-white transition-colors">
                  Daftarkan Spot Baru
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Kategori Spot</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore?category=Alam+Terbuka" className="text-slate-400 hover:text-white transition-colors">
                  🌲 Alam Terbuka
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Galatama" className="text-slate-400 hover:text-white transition-colors">
                  🏆 Kolam Galatama
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Kuliner" className="text-slate-400 hover:text-white transition-colors">
                  🍲 Kuliner & Keluarga
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Spot On. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
