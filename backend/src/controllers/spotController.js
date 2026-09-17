import { supabase } from '../config/supabase.js';

const enrichWithCoordinates = (spot) => {
  if (!spot) return spot;

  let lat = spot.latitude;
  let lng = spot.longitude;

  if (!lat || !lng) {
    const name = (spot.name || '').toLowerCase();
    if (name.includes('sunter')) {
      lat = -6.136000;
      lng = 106.877000;
    } else if (name.includes('galatama')) {
      lat = -6.168000;
      lng = 106.758000;
    } else if (name.includes('saung') || name.includes('desa')) {
      lat = -6.597000;
      lng = 106.799000;
    } else if (name.includes('jatiluhur')) {
      lat = -6.524000;
      lng = 107.387000;
    } else {
      const randomOffsetLat = (Math.random() - 0.5) * 0.08;
      const randomOffsetLng = (Math.random() - 0.5) * 0.08;
      lat = -6.200000 + randomOffsetLat;
      lng = 106.816666 + randomOffsetLng;
    }
  }

  return {
    ...spot,
    latitude: Number(lat),
    longitude: Number(lng),
  };
};

export const getAllSpots = async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = supabase
      .from('fishing_spots')
      .select('*')
      .order('id', { ascending: false });

    if (category && category !== 'Semua') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, message: 'Database query error', error: error.message });
    }

    let results = (data || []).map(enrichWithCoordinates);

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter((spot) => {
        const nameMatch = spot.name ? spot.name.toLowerCase().includes(q) : false;
        const locMatch = spot.location ? spot.location.toLowerCase().includes(q) : false;
        const descMatch = spot.description ? spot.description.toLowerCase().includes(q) : false;
        return nameMatch || locMatch || descMatch;
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

export const getFeaturedSpots = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('fishing_spots')
      .select('*')
      .order('id', { ascending: false })
      .limit(3);

    if (error) {
      return res.status(500).json({ success: false, message: 'Database query error', error: error.message });
    }

    const enriched = (data || []).map(enrichWithCoordinates);

    return res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

export const getSpotById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Spot ID is required' });
    }

    const { data, error } = await supabase
      .from('fishing_spots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ success: false, message: 'Spot not found', error: error.message });
    }

    return res.status(200).json({
      success: true,
      data: enrichWithCoordinates(data),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

export const createSpot = async (req, res) => {
  try {
    const { name, location, category, description, image_url, latitude, longitude } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ success: false, message: 'Location is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    const defaultImg =
      category === 'Galatama'
        ? 'https://images.unsplash.com/photo-1506518171120-f402434db0de?w=800&q=80'
        : category === 'Kuliner'
        ? 'https://images.unsplash.com/photo-1596700684724-c1871a26d704?w=800&q=80'
        : 'https://images.unsplash.com/photo-1544605927-466d6a575a27?w=800&q=80';

    const finalImageUrl = image_url && image_url.trim() ? image_url.trim() : defaultImg;

    const latVal = latitude ? Number(latitude) : -6.200000;
    const lngVal = longitude ? Number(longitude) : 106.816666;

    const newSpotData = {
      name: name.trim(),
      location: location.trim(),
      category: category || 'Alam Terbuka',
      description: description.trim(),
      image_url: finalImageUrl,
    };

    let insertResult = await supabase
      .from('fishing_spots')
      .insert([{ ...newSpotData, latitude: latVal, longitude: lngVal }])
      .select()
      .single();

    if (insertResult.error && insertResult.error.message.includes('column')) {
      insertResult = await supabase
        .from('fishing_spots')
        .insert([newSpotData])
        .select()
        .single();
    }

    if (insertResult.error) {
      return res.status(500).json({ success: false, message: 'Failed to create spot', error: insertResult.error.message });
    }

    const created = enrichWithCoordinates({ ...insertResult.data, latitude: latVal, longitude: lngVal });

    return res.status(201).json({
      success: true,
      data: created,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

export const deleteSpot = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('fishing_spots')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to delete spot', error: error.message });
    }

    return res.status(200).json({ success: true, message: 'Spot deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};
