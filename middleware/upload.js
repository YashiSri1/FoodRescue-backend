import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadRoot = process.env.UPLOAD_PATH || './uploads';
const resolvedPath = path.resolve(uploadRoot);

if (!fs.existsSync(resolvedPath)) {
  fs.mkdirSync(resolvedPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resolvedPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ext || '.jpg';
    cb(null, `user-${req.userId}-${Date.now()}${safeExt}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;
