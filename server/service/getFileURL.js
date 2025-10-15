const getFileURL = (filename) => {
  if (!filename) return null;
  const baseURL = process.env.BASE_URL
  return `${baseURL}/uploads/${filename}`;
};

module.exports = getFileURL;