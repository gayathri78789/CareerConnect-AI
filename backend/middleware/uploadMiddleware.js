import multer from 'multer';

// Storage configuration (memory storage for file uploads)
const storage = multer.memoryStorage();

// File filter function for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/json',
    'text/plain',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type "${file.mimetype}". Allowed: JPG, PNG, WEBP, GIF, PDF, DOC, DOCX, JSON, TXT.`), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size
  },
  fileFilter,
});

// Specialized image filter function for image storage uploads
const imageFilter = (req, file, cb) => {
  const allowedImageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];

  if (allowedImageMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid image format "${file.mimetype}". Allowed image formats: JPG, PNG, WEBP, GIF, SVG.`), false);
  }
};

export const uploadImageMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max image size
  },
  fileFilter: imageFilter,
});

