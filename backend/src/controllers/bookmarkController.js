import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bookmarksFile = path.join(__dirname, '../../database/bookmarks_local.json');

function readLocalBookmarks() {
  try {
    if (!fs.existsSync(bookmarksFile)) {
      fs.writeFileSync(bookmarksFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(bookmarksFile, 'utf8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
}

function writeLocalBookmarks(bms) {
  try {
    const dir = path.dirname(bookmarksFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(bookmarksFile, JSON.stringify(bms, null, 2));
  } catch (e) {
    console.error(e);
  }
}

export const getBookmarks = async (req, res) => {
  try {
    const { user_email } = req.query;

    if (!user_email) {
      return res.status(400).json({ success: false, message: 'user_email is required' });
    }

    const email = user_email.toLowerCase().trim();

    // 1. Fetch from Supabase
    const { data: supaData, error: supaErr } = await supabase
      .from('bookmarks')
      .select('spot_id')
      .eq('user_email', email);

    const supaSpotIds = (!supaErr && supaData) ? supaData.map((b) => Number(b.spot_id)) : [];

    // 2. Fetch from local
    const allLocal = readLocalBookmarks();
    const localSpotIds = allLocal
      .filter((b) => b.user_email === email)
      .map((b) => Number(b.spot_id));

    // 3. Union unique IDs
    const spotIds = Array.from(new Set([...supaSpotIds, ...localSpotIds]));

    let spots = [];
    if (spotIds.length > 0) {
      const { data: spotsData } = await supabase
        .from('fishing_spots')
        .select('*')
        .in('id', spotIds);
      spots = spotsData || [];
    }

    return res.status(200).json({
      success: true,
      count: spotIds.length,
      spotIds,
      spots,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { user_email, spot_id } = req.body;

    if (!user_email || !spot_id) {
      return res.status(400).json({ success: false, message: 'user_email and spot_id are required' });
    }

    const email = user_email.toLowerCase().trim();
    const sId = Number(spot_id);

    let supaSuccess = false;
    let currentlyBookmarked = false;

    // Check Supabase
    const { data: existing, error: checkErr } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_email', email)
      .eq('spot_id', sId)
      .maybeSingle();

    if (!checkErr && existing) {
      const { error: delErr } = await supabase.from('bookmarks').delete().eq('id', existing.id);
      if (!delErr) {
        supaSuccess = true;
        currentlyBookmarked = false;
      }
    } else if (!checkErr && !existing) {
      const { error: insErr } = await supabase.from('bookmarks').insert([{ user_email: email, spot_id: sId }]);
      if (!insErr) {
        supaSuccess = true;
        currentlyBookmarked = true;
      }
    }

    const allLocal = readLocalBookmarks();
    const index = allLocal.findIndex((b) => b.user_email === email && Number(b.spot_id) === sId);

    if (supaSuccess) {
      if (currentlyBookmarked && index === -1) {
        allLocal.push({ id: Date.now(), user_email: email, spot_id: sId, created_at: new Date().toISOString() });
        writeLocalBookmarks(allLocal);
      } else if (!currentlyBookmarked && index >= 0) {
        allLocal.splice(index, 1);
        writeLocalBookmarks(allLocal);
      }
      return res.status(200).json({
        success: true,
        bookmarked: currentlyBookmarked,
      });
    }

    // Local fallback toggle
    if (index >= 0) {
      allLocal.splice(index, 1);
      writeLocalBookmarks(allLocal);
      return res.status(200).json({
        success: true,
        bookmarked: false,
      });
    } else {
      allLocal.push({ id: Date.now(), user_email: email, spot_id: sId, created_at: new Date().toISOString() });
      writeLocalBookmarks(allLocal);
      return res.status(200).json({
        success: true,
        bookmarked: true,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};
