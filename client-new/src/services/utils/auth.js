// Example content if it’s just helper functions for auth
const authUtils = {
  getToken() {
    return localStorage.getItem('token');
  },
  setToken(token) {
    localStorage.setItem('token', token);
  },
  clearToken() {
    localStorage.removeItem('token');
  },
};

export default authUtils;
