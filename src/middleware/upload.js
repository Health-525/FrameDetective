import multer from 'multer';
import path from 'path';
import { mkdir } from 'fs/promises';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Note: This relies on process.cwd() or assumes structure.
    // Ideally use absolute path or config.
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    mkdir(uploadDir, { recursive: true })
      .then(() => cb(null, uploadDir))
      .catch(err => cb(err));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});