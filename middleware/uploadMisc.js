const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/miscellaneous/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs only
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|jpg)$/) && !file.mimetype.match(/pdf$/)) {
      return cb(new Error('Only image and PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});

module.exports = upload; 