import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/LogoSplash.css';

export default function Navbar() {
  const [isSplashing, setIsSplashing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout, openAuthModal, favoriteIds } = useAuth();
  const location = useLocation();

  const handleLogoClick = () => {
    setIsSplashing(true);
    setTimeout(() => {
      setIsSplashing(false);
    }, 1000);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="container mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 select-none" onClick={handleLogoClick}>
          <div className="relative flex items-center justify-center p-1 cursor-pointer">
            <div className="sonar-waves">
              <span className="wave w-1"></span>
              <span className="wave w-2"></span>
              <span className="wave w-3"></span>
            </div>

            <img
              src="/images/spot-on-logo.png"
              alt="Spot On Logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              className={`h-10 w-auto relative z-10 transition-transform duration-200 hover:scale-105 ${
                isSplashing ? 'pulse-anim' : ''
              }`}
            />

            <span className="text-2xl font-black tracking-tight text-blue-950 flex items-center ml-1">
              Spot<span className="text-blue-600">On</span>
            </span>

            {isSplashing && (
              <div className="water-splash-effect">
                <span className="splash-dot dot-1"></span>
                <span className="splash-dot dot-2"></span>
                <span className="splash-dot dot-3"></span>
                <span className="splash-dot dot-4"></span>
              </div>
            )}
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-semibold text-sm">
          <Link
            to="/"
            className={`transition-colors py-1 ${
              isActive('/') 
                ? 'text-blue-600 font-bold border-b-2 border-blue-600' 
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Beranda
          </Link>
          <Link
            to="/explore"
            className={`transition-colors py-1 ${
              isActive('/explore') 
                ? 'text-blue-600 font-bold border-b-2 border-blue-600' 
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Eksplorasi Spot
          </Link>
          <Link
            to="/favorites"
            className={`flex items-center gap-1.5 transition-colors py-1 ${
              isActive('/favorites') 
                ? 'text-rose-600 font-bold border-b-2 border-rose-600' 
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <span>❤️</span>
            <span>Favorit</span>
            {favoriteIds.length > 0 && (
              <span className="bg-rose-100 text-rose-600 text-xs px-1.5 py-0.2 rounded-full font-bold">
                {favoriteIds.length}
              </span>
            )}
          </Link>

          <Link
            to="/add"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <span>+</span>
            <span>Tambah Spot</span>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-slate-700 max-w-[90px] truncate">
                  {user.name || user.email}
                </span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/favorites"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <span>❤️</span> Spot Favorit Saya ({favoriteIds.length})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <span>🚪</span> Keluar (Logout)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="text-xs font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-full transition-all cursor-pointer"
            >
              Masuk / Daftar
            </button>
          )}
        </nav>

        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <button
              onClick={openAuthModal}
              className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full"
            >
              Masuk
            </button>
          )}
          <Link
            to="/add"
            className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold"
          >
            + Spot
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 shadow-lg">
          {user && (
            <div className="p-3 bg-blue-50/50 rounded-xl mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="text-xs font-bold text-rose-600 bg-white px-2.5 py-1 rounded-lg border border-rose-100"
              >
                Keluar
              </button>
            </div>
          )}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/') ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            🎣 Beranda
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/explore') ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            🗺️ Eksplorasi Spot Mancing
          </Link>
          <Link
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/favorites') ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            ❤️ Spot Favorit ({favoriteIds.length})
          </Link>
          <Link
            to="/add"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/add') ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            ➕ Tambah Spot Baru
          </Link>
        </div>
      )}
    </header>
  );
}