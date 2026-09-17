import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fallbackFile = path.join(__dirname, '../../database/reviews_local.json');

function readLocalReviews() {
  try {
    if (!fs.existsSync(fallbackFile)) {
      fs.writeFileSync(fallbackFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(fallbackFile, 'utf8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
}

function writeLocalReviews(reviews) {
  try {
    const dir = path.dirname(fallbackFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fallbackFile, JSON.stringify(reviews, null, 2));
  } catch (e) {
    console.error(e);
  }
}

export const getReviewsBySpot = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('spot_id', id)
      .order('id', { ascending: false });

    const supaReviews = (!error && data) ? data : [];
    const allLocal = readLocalReviews();
    const localReviews = allLocal.filter((r) => String(r.spot_id) === String(id));

    // Merge unique reviews
    const existingIds = new Set(supaReviews.map((r) => r.id));
    const combined = [...supaReviews];
    for (const lr of localReviews) {
      if (!existingIds.has(lr.id)) {
        combined.push(lr);
      }
    }

    const totalReviews = combined.length;
    const averageRating =
      totalReviews > 0
        ? (combined.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) / totalReviews).toFixed(1)
        : 0;

    return res.status(200).json({
      success: true,
      spotId: id,
      totalReviews,
      averageRating: Number(averageRating),
      reviews: combined,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_name, user_email, rating, comment } = req.body;

    if (!user_name || !user_name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Comment is required' });
    }

    const newReview = {
      spot_id: Number(id),
      user_name: user_name.trim(),
      user_email: user_email ? user_email.trim() : null,
      rating: Number(rating),
      comment: comment.trim(),
      created_at: new Date().toISOString(),
    };

    let savedReview = null;
    const { data, error } = await supabase
      .from('reviews')
      .insert([newReview])
      .select()
      .single();

    if (!error && data) {
      savedReview = data;
    } else {
      const allLocal = readLocalReviews();
      const localItem = { id: Date.now(), ...newReview };
      allLocal.unshift(localItem);
      writeLocalReviews(allLocal);
      savedReview = localItem;
    }

    return res.status(201).json({
      success: true,
      review: savedReview,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};
