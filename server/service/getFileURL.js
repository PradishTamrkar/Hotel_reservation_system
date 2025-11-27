const getFileURL = (filename) => {
  if (!filename) return null;

  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  const baseURL = process.env.BASE_URL || 'https://hotel-reservation-api-u047.onrender.com';
  return `${baseURL}/uploads/${filename}`;
};

module.exports = getFileURL;