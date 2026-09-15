import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { supabase } from '../services/supabaseClient';

export default function AddSpot() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // State untuk menyimpan input form
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: 'Alam Terbuka', // Nilai default
    description: '',
    image_url: ''
  });

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fungsi untuk mengirim data ke Supabase
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from('fishing_spots')
        .insert([
          {
            name: formData.name,
            location: formData.location,
            category: formData.category,
            description: formData.description,
            image_url: formData.image_url || 'https://via.placeholder.com/400x300?text=Spot+Mancing'
          }
        ]);

      if (error) throw error;

      // Jika sukses, arahkan kembali ke halaman Explore
      navigate('/explore');
      
    } catch (err) {
      console.error("Gagal menambah data:", err.message);
      setErrorMsg("Gagal menyimpan data. Pastikan RLS mengizinkan INSERT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tambah Spot Baru</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nama Spot</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Contoh: Danau Cibubur" 
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Lokasi / Kota</label>
            <input 
              type="text" 
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Contoh: Jakarta Timur" 
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Kategori</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Alam Terbuka">Alam Terbuka</option>
              <option value="Galatama">Galatama</option>
              <option value="Kuliner">Kuliner</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">URL Gambar (Opsional)</label>
            <input 
              type="url" 
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="https://..." 
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Deskripsi</label>
            <textarea 
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Ceritakan sedikit tentang spot ini..." 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Menyimpan...' : 'Simpan Lokasi'}
          </button>
        </form>
      </main>
    </div>
  );
}