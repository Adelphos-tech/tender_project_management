const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Reuse existing cloudinary config to avoid issues, though it should be global
if (!cloudinary.config().cloud_name) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const storage = multer.memoryStorage();

const uploadDoc = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Excel, and Images are allowed.'), false);
    }
  },
});

const uploadDocumentToCloudinary = (buffer, filename, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return reject(new Error('Cloudinary credentials are not configured properly.'));
    }

    let resourceType = 'auto'; // Let cloudinary decide based on file

    // We can't apply typical image transformations to non-images
    const options = {
      folder: 'erp-documents',
      resource_type: resourceType,
      public_id: filename.replace(/\.[^/.]+$/, ""), // Original filename without extension
    };

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = { uploadDoc, uploadDocumentToCloudinary };
