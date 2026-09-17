import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, bookmarkService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('spoton_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('spoton_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    async function loadBookmarks() {
      if (user?.email) {
        try {
          const res = await bookmarkService.getBookmarks(user.email);
          setFavoriteIds(res.spotIds || []);
        } catch (e) {
          console.error(e);
        }
      } else {
        setFavoriteIds([]);
      }
    }
    loadBookmarks();
  }, [user]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('spoton_user', JSON.stringify(res.user));
    localStorage.setItem('spoton_token', res.token);
    setIsAuthModalOpen(false);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    return await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setFavoriteIds([]);
    localStorage.removeItem('spoton_user');
    localStorage.removeItem('spoton_token');
  };

  const toggleFavorite = async (spotId) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }

    try {
      const res = await bookmarkService.toggle(user.email, spotId);
      if (res.bookmarked) {
        setFavoriteIds((prev) => [...prev, Number(spotId)]);
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== Number(spotId)));
      }
      return res.bookmarked;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const isFavorite = (spotId) => {
    return favoriteIds.includes(Number(spotId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        favoriteIds,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
