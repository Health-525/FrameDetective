import express from 'express';
import { runVideoTask, analyzeZip } from '../controllers/videoController.js';
import { extractFeatures } from '../controllers/featureController.js';
import { uploadFile } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/run', runVideoTask);
router.post('/analyze-zip', analyzeZip);
router.post('/extract-features', extractFeatures);
router.post('/upload', upload.single('file'), uploadFile);

export default router;