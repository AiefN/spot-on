import express from 'express';
import { uploadMiddleware, handleImageUpload } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', uploadMiddleware.single('image'), handleImageUpload);

export default router;
