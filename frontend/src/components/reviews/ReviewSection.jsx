import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ReviewSection({ spotId }) {
  const { user } = useAuth();
  const [reviewsData, setReviewsData] = useState({ totalReviews: 0, averageRating: 0, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(user?.name || '');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getBySpot(spotId);
      setReviewsData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spotId) {
      loadReviews();
    }
  }, [spotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !comment.trim()) {
      setErrorMsg('Nama dan komentar ulasan wajib diisi.');
      return;
    }

    try {
      setSubmitting(true);
      await reviewService.create(spotId, {
        user_name: name.trim(),
        user_email: user?.email || null,
        rating,
        comment: comment.trim(),
      });

      setSuccessMsg('Terima kasih! Ulasan Anda berhasil diterbitkan.');
      setComment('');
      loadReviews();
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengirimkan ulasan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Ulasan & Rating Pemancing</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
              {reviewsData.totalReviews} Ulasan
            </span>
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Pengalaman langsung para angler yang pernah memancing di sini.
          </p>
        </div>

        {reviewsData.totalReviews > 0 && (
          <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 px-4 py-2.5 rounded-2xl">
            <span className="text-3xl font-extrabold text-amber-500">
              {reviewsData.averageRating}
            </span>
            <div>
              <div className="flex text-amber-400 text-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= Math.round(reviewsData.averageRating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-xs text-amber-700 font-medium">
                dari {reviewsData.totalReviews} penilai
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="my-6 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60">
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
          <span>✍️</span> Tulis Ulasan Anda
        </h4>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <span>✅</span> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Beri Bintang:
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <span
                    className={
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 drop-shadow-sm'
                        : 'text-slate-300'
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
              <span className="ml-2 text-xs font-semibold text-slate-500">
                ({rating} dari 5 bintang)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Nama Anda:
              </label>
              <input
                type="text"
                required
                placeholder="Misal: Dimas Angler"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Pengalaman Mancing Anda:
            </label>
            <textarea
              rows="3"
              required
              placeholder="Ceritakan jenis umpan yang efektif, kondisi spot, kenyamanan, atau hasil tangkapan..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            Memuat daftar ulasan...
          </div>
        ) : reviewsData.reviews.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-2xl mb-1">🎣</p>
            <p className="text-sm font-medium text-slate-600">Belum ada ulasan untuk spot ini.</p>
            <p className="text-xs text-slate-400 mt-0.5">Jadilah pemancing pertama yang memberikan review!</p>
          </div>
        ) : (
          reviewsData.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {rev.user_name ? rev.user_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-800 leading-tight">
                      {rev.user_name}
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rev.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex text-amber-400 text-xs">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {star <= rev.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-10">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
