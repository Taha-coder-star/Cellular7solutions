const multer = require('multer');
const CloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// multer-storage-cloudinary@2.2.1 (the only version compatible with cloudinary
// v2 without a vulnerable nested cloudinary@1.x) exports a factory function
// directly (no named `CloudinaryStorage` export) and internally calls
// `cloudinary.v2.uploader...` — but config/cloudinary.js exports the already-
// unwrapped v2 namespace (which other callers like productController.js need
// as `cloudinary.uploader...` directly). Wrap it back in a `.v2` shell here,
// scoped to just this one call site, rather than changing the shared export.
const storage = CloudinaryStorage({
  cloudinary: { v2: cloudinary },
  params: {
    folder: 'cellular-solutions/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
