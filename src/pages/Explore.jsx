import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import SpotCard from '../components/common/SpotCard';
import { supabase } from '../services/supabaseClient';

export default function Explore() {
  const [filter, setFilter] = useState('Semua');
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchSpots() {
      try {
        setLoading(true);
       
        const { data, error } = await supabase
          .from('fishing_spots')
          .select('*');

        if (error) throw error;
        
       
        setSpots(data || []);
      } catch (err) {
        console.error("Error mengambil data:", err.message);
        setErrorMsg("Gagal memuat data. Pastikan Supabase sudah terhubung.");
      } finally {
        setLoading(false);
      }
    }

    fetchSpots();
  }, []);

 
  const filteredSpots = filter === 'Semua' 
    ? spots 
    : spots.filter(spot => spot.category === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Eksplorasi Spot Mancing</h1>
        
        
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['Semua', 'Alam Terbuka', 'Galatama', 'Kuliner'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                filter === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 mt-10 animate-pulse">Memuat data spot mancing...</p>
        ) : errorMsg ? (
          <p className="text-center text-red-500 mt-10">{errorMsg}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSpots.map(spot => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>

            {filteredSpots.length === 0 && (
              <p className="text-center text-gray-500 mt-10">Belum ada spot di kategori ini.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}