import { Router } from 'express';
import multer from 'multer';
import { uploadController } from '../controllers/uploadController.js';

const router = Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/', upload.single('image'), uploadController.uploadImage);

export default router;
