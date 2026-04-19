import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const authService = {
  register: async (email, password, full_name) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      email,
      password,
      full_name,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });
    if (response.data) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_id', response.data.user_id);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    return token && user_id ? { token, user_id } : null;
  },

  getUser: async (user_id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/users/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateUser: async (user_id, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/api/users/${user_id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  changePassword: async (old_password, new_password) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/api/auth/change-password`,
      { old_password, new_password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default authService;
