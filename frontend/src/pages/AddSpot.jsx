import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SpotMap from '../components/map/SpotMap';
import { spotService, uploadService } from '../services/api';

export default function AddSpot() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: 'Alam Terbuka',
    description: '',
    image_url: '',
    latitude: -6.200000,
    longitude: 106.816666,
  });

  const presetImages = [
    {
      label: '🌲 Danau Alam',
      url: 'https://images.unsplash.com/photo-1544605927-466d6a575a27?w=800&q=80',
    },
    {
      label: '🏆 Kolam Galatama',
      url: 'https://images.unsplash.com/photo-1506518171120-f402434db0de?w=800&q=80',
    },
    {
      label: '🍲 Resto Kuliner',
      url: 'https://images.unsplash.com/photo-1596700684724-c1871a26d704?w=800&q=80',
    },
    {
      label: '🌊 Muara Laut',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    try {
      setUploadingImage(true);
      setErrorMsg(null);
      const uploadedUrl = await uploadService.uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLocationPicked = (coord) => {
    setFormData((prev) => ({
      ...prev,
      latitude: coord.lat,
      longitude: coord.lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.name.trim() || !formData.location.trim() || !formData.description.trim()) {
      setErrorMsg('Harap lengkapi semua kolom wajib.');
      setLoading(false);
      return;
    }

    try {
      const defaultImg =
        formData.category === 'Galatama'
          ? 'https://images.unsplash.com/photo-1506518171120-f402434db0de?w=800&q=80'
          : formData.category === 'Kuliner'
          ? 'https://images.unsplash.com/photo-1596700684724-c1871a26d704?w=800&q=80'
          : 'https://images.unsplash.com/photo-1544605927-466d6a575a27?w=800&q=80';

      const finalImageUrl = formData.image_url.trim() ? formData.image_url.trim() : defaultImg;

      await spotService.create({
        name: formData.name.trim(),
        location: formData.location.trim(),
        category: formData.category,
        description: formData.description.trim(),
        image_url: finalImageUrl,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      setSuccessMsg('Spot berhasil didaftarkan.');
      setTimeout(() => {
        navigate('/explore');
      }, 1200);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal menyimpan spot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl flex-grow">
        <div className="mb-6">
          <Link
            to="/explore"
            className="text-slate-500 hover:text-blue-600 font-medium inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <span>←</span>
            <span>Kembali ke Eksplorasi</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md mb-3 text-2xl shadow-inner">
              🎣
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Daftarkan Spot Mancing Baru
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Bagikan spot mancing favoritmu agar dapat ditemukan oleh komunitas angler lainnya.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="font-bold">Gagal Mendaftarkan Spot</h4>
                  <p className="mt-0.5 text-xs text-red-600">{errorMsg}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-2xl flex items-start gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <h4 className="font-bold">Berhasil!</h4>
                  <p className="mt-0.5 text-xs text-emerald-600">{successMsg}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1.5">
                Nama Spot Mancing <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Misal: Danau Sunter, Kolam Galatama Bintaro..."
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Lokasi / Kota <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  placeholder="Misal: Jakarta Utara, Bogor..."
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Kategori Spot <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Alam Terbuka">🌲 Alam Terbuka (Danau, Sungai, Waduk)</option>
                  <option value="Galatama">🏆 Kolam Galatama (Lomba Berhadiah)</option>
                  <option value="Kuliner">🍲 Pemancingan Kuliner (Keluarga & Resto)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-700">
                  Titik Koordinat di Peta
                </label>
                <span className="text-xs text-blue-600 font-semibold">
                  📍 {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                </span>
              </div>
              <SpotMap
                mode="picker"
                selectedCoord={{ lat: formData.latitude, lng: formData.longitude }}
                onLocationSelect={handleLocationPicked}
                height="240px"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Foto Spot Mancing
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-sm">
                  <span>📸</span>
                  <span>{uploadingImage ? 'Mengunggah...' : 'Pilih File Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">Format: JPG, PNG, WEBP (Maks 5 MB)</span>
              </div>

              {(imagePreview || formData.image_url) && (
                <div className="mb-3 relative rounded-xl overflow-hidden border border-slate-200 h-40 max-w-sm bg-slate-100 shadow-sm">
                  <img
                    src={imagePreview || formData.image_url}
                    alt="Preview Spot"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                {presetImages.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image_url: p.url }));
                      setImagePreview(p.url);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      formData.image_url === p.url
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-1.5">
                Deskripsi & Ulasan Spot <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Ceritakan tentang jenis ikan, tips umpan, atau fasilitas..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer"
              >
                {loading ? (
                  <span>Menyimpan...</span>
                ) : (
                  <span>Daftarkan Spot</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}