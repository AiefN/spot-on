const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const spotService = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'Semua') {
      query.append('category', params.category);
    }
    if (params.search && params.search.trim()) {
      query.append('search', params.search.trim());
    }

    const url = `${API_BASE_URL}/spots${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch spots (${response.status})`);
    }
    const result = await response.json();
    return result.data || [];
  },

  async getFeatured() {
    const response = await fetch(`${API_BASE_URL}/spots/featured`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch featured spots (${response.status})`);
    }
    const result = await response.json();
    return result.data || [];
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/spots/${id}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch spot (${response.status})`);
    }
    const result = await response.json();
    return result.data;
  },

  async create(spotData) {
    const response = await fetch(`${API_BASE_URL}/spots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spotData),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create spot (${response.status})`);
    }
    return await response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/spots/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete spot');
    }
    return await response.json();
  },
};

export const reviewService = {
  async getBySpot(spotId) {
    const response = await fetch(`${API_BASE_URL}/spots/${spotId}/reviews`);
    if (!response.ok) {
      return { totalReviews: 0, averageRating: 0, reviews: [] };
    }
    return await response.json();
  },

  async create(spotId, reviewData) {
    const response = await fetch(`${API_BASE_URL}/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit review');
    }
    return await response.json();
  },
};

export const uploadService = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  },
};

export const authService = {
  async register(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },
};

export const bookmarkService = {
  async getBookmarks(userEmail) {
    if (!userEmail) return { count: 0, spotIds: [], spots: [] };
    const response = await fetch(`${API_BASE_URL}/bookmarks?user_email=${encodeURIComponent(userEmail)}`);
    if (!response.ok) return { count: 0, spotIds: [], spots: [] };
    return await response.json();
  },

  async toggle(userEmail, spotId) {
    const response = await fetch(`${API_BASE_URL}/bookmarks/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: userEmail, spot_id: spotId }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update bookmark');
    }
    return await response.json();
  },
};
