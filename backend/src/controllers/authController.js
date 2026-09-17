import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFile = path.join(__dirname, '../../database/users_local.json');

function readLocalUsers() {
  try {
    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
}

function writeLocalUsers(users) {
  try {
    const dir = path.dirname(usersFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error(e);
  }
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const { data: supaData, error: supaErr } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });

    let userData = null;

    if (!supaErr && supaData?.user) {
      userData = {
        id: supaData.user.id,
        email: supaData.user.email,
        name: name.trim(),
      };
    } else {
      const users = readLocalUsers();
      if (users.some((u) => u.email === cleanEmail)) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      userData = {
        id: `user_${Date.now()}`,
        email: cleanEmail,
        name: name.trim(),
        password,
      };
      users.push(userData);
      writeLocalUsers(users);
    }

    return res.status(201).json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const { data: supaData, error: supaErr } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (!supaErr && supaData?.user) {
      return res.status(200).json({
        success: true,
        user: {
          id: supaData.user.id,
          email: supaData.user.email,
          name: supaData.user.user_metadata?.full_name || cleanEmail.split('@')[0],
        },
        token: supaData.session?.access_token || 'token',
      });
    }

    const users = readLocalUsers();
    const found = users.find((u) => u.email === cleanEmail && u.password === password);

    if (found) {
      return res.status(200).json({
        success: true,
        user: {
          id: found.id,
          email: found.email,
          name: found.name,
        },
        token: `token_${found.id}`,
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  return res.status(200).json({ success: true, message: 'Authorized' });
};
