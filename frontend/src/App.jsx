import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import AddSpot from './pages/AddSpot';
import SpotDetail from './pages/SpotDetail';
import Favorites from './pages/Favorites';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/add" element={<AddSpot />} />
        <Route path="/detail/:id" element={<SpotDetail />} />
        <Route path="/spot/:id" element={<SpotDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthModal />
    </AuthProvider>
  );
}

export default App;