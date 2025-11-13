const getAuthToken = () => localStorage.getItem('token');
const getUserRole = () => localStorage.getItem('userRole');

const adminAuthUtils = {
    isAdminAuthenticated: () => {
        const token = getAuthToken();
        const role = getUserRole();
        return !!token && role === 'admin';
    },

    getCurrentAdmin: () => {
        const token = getAuthToken();
        if(!token) return null;

        try{
            const base64url = token.split('.')[1];
            const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c)=> '%' + ('00'+c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        }catch(error){
            console.error('Error decoding token:',error);
            return null;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.dispatchEvent(new Event('adminAuthChange'));
    },
};

export default adminAuthUtils;