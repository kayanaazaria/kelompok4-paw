import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

const userClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
userClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('jwt_token') || localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllUsers = async () => {
  try {
    const { data } = await userClient.get('/users');
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUserRole = async (userId, role, department = null) => {
  try {
    const payload = { role };
    if (department) {
      payload.department = department;
    }
    const { data } = await userClient.put(`/users/${userId}`, payload);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const { data } = await userClient.delete(`/users/${userId}`);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createUser = async (userData) => {
  try {
    const { data } = await userClient.post('/users', userData);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
