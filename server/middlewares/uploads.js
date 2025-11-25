const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs").promises;
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary")

//Cloudinary configs:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hotel-himalayas',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ 
      width: 1200, 
      height: 800, 
      crop: 'limit',
      quality: 'auto:good'
    }]
  }
})

function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = file.originalname.toLowerCase().match(/\.(jpeg|jpg|png|webp)$/);
  if (ext) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});


const optimizeImage = async (req, res, next) => {
  return next();
}

//   try {
//     const tempPath = req.file.path;
//     const filename = req.file.filename;
//     const optimizedFilename = `optimized-${filename.replace(path.extname(filename), '.webp')}`;
//     const optimizedPath = path.join(__dirname, "../uploads", optimizedFilename);

//     // Create uploads directory if it doesn't exist
//     const uploadsDir = path.join(__dirname, "../uploads");
//     await fs.mkdir(uploadsDir, { recursive: true });

//     // Optimize and convert to WebP
//     await sharp(tempPath)
//       .resize(1200, 800, {
//         fit: 'inside',
//         withoutEnlargement: true,
//       })
//       .webp({ quality: 85 })
//       .toFile(optimizedPath);

//     // Delete temporary file
//     await fs.unlink(tempPath);

//     // Update req.file with optimized file info
//     req.file.filename = optimizedFilename;
//     req.file.path = optimizedPath;

//     next();
//   } catch (error) {
//     console.error("Image optimization error:", error);
//     next();
//   }
// };

module.exports = { 
  upload, 
  optimizeImage
};
