
//helper to get auth token
const getAuthToken = () => localStorage.getItem('token')

const authUtils = {
  getToken(){
    return localStorage.getItem('token')
  },
  setToken(){
    localStorage.getItem('token',token)
  },
  clearToken(){
    localStorage.removeItem('token')
  },

  isAuthenticated: () => {
    return !!getAuthToken()
  },

  getCurrentUser: () => {
    const token = getAuthToken()
    if(!token) return null

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    }catch(error){
      console.error('Error decoding token:',error)
      return null
    }
  }
}

export default authUtils
