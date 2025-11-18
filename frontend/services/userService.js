import api from "./api";

export const getAllUsers = async () => {
  try {
    const { data } = await api.get('/api/users');
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
    const { data } = await api.put(`/api/users/${userId}`, payload);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const { data } = await api.delete(`/api/users/${userId}`);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createUser = async (userData) => {
  try {
    const { data } = await api.post('/api/users', userData);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
