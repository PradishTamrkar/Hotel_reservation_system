const multer = require("multer");
const { storage } = require("../config/cloudinary");

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// No need for optimizeImage middleware - Cloudinary handles it
const optimizeImage = (req, res, next) => next();

module.exports = { upload, optimizeImage };