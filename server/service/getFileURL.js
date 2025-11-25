const getFileURL = (filename) => {
  if (!filename) return null;

  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  const baseURL = process.env.BASE_URL || 'http://localhost:3002';
  return `${baseURL}/uploads/${filename}`;
};

module.exports = getFileURL;