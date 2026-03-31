// middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const createUploadDirectories = () => {
  const dirs = [
    path.join(__dirname, '../../public/uploads/equipment-delivery-notes'),
    path.join(__dirname, '../../public/uploads/equipment-off-hire-notes'),
    path.join(__dirname, '../../public/uploads/operator-delivery-notes'),
    path.join(__dirname, '../../public/uploads/operator-off-hire-notes'),
    path.join(__dirname, '../../public/uploads/attachment-delivery-notes'),
    path.join(__dirname, '../../public/uploads/attachment-off-hire-notes'),
    path.join(__dirname, '../../public/uploads/delivery-notes'),
    path.join(__dirname, '../../public/uploads/off-hire-notes')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Create directories on startup
createUploadDirectories();

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, '../public/uploads');
    
    // Determine upload directory based on route
    if (req.originalUrl.includes('equipment-swaps/delivery-note')) {
      uploadPath = path.join(uploadPath, 'equipment-delivery-notes');
    } else if (req.originalUrl.includes('equipment-swaps/off-hire-note')) {
      uploadPath = path.join(uploadPath, 'equipment-off-hire-notes');
    } else if (req.originalUrl.includes('attachment-swaps/delivery-note')) {
      uploadPath = path.join(uploadPath, 'attachment-delivery-notes');
    } else if (req.originalUrl.includes('attachment-swaps/off-hire-note')) {
      uploadPath = path.join(uploadPath, 'attachment-off-hire-notes');
    } else if (req.originalUrl.includes('operator-changes/delivery-note')) {
      uploadPath = path.join(uploadPath, 'operator-delivery-notes');
    } else if (req.originalUrl.includes('operator-changes/off-hire-note')) {
      uploadPath = path.join(uploadPath, 'operator-off-hire-notes');
    } else {
      uploadPath = path.join(uploadPath, 'general');
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, JPEG, JPG, and PNG files are allowed'));
  }
};

// Upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Single file upload
  },
  fileFilter: fileFilter
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    // Other errors
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = upload;