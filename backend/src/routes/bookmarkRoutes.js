import express from 'express';
import { getBookmarks, toggleBookmark } from '../controllers/bookmarkController.js';

const router = express.Router();

router.get('/', getBookmarks);
router.post('/toggle', toggleBookmark);

export default router;
