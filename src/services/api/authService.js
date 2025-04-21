import http from '../http';

const authService = {
    login: async (username, password) => {
        localStorage.removeItem('token'); // Xóa token cũ trước khi đăng nhập
        const response = await http.post('auth/login', {
            username, password
        });

        const data = response.data; // axios tự parse JSON
        console.log('Login response:', data); // Log the response for debugging
        localStorage.setItem('token', data.token);
        return data;
    },

    introspect: async () => {
        const token = localStorage.getItem('token');
        const response = await http.post('auth/introspect', { token });
        return response.data;
    },

    register: async (username, email, password) => {
        const response = await http.post('user/register', {
            username, email, password
        });
        return response.data;
    },

    logout: async () => {
        const token = localStorage.getItem('token');
        localStorage.removeItem('token');
        await http.post('auth/logout', { token });
    }
};

export default authService;
