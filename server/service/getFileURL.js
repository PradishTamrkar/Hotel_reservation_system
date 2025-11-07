const getFileURL = (filename) => {
  if (!filename) return null;
  const baseURL = process.env.BASE_URL || 'http://localhost:3002';
  return `${baseURL}/uploads/${filename}`;
};

module.exports = getFileURL;