import api from './api';

export const login = async (credentials) => {
  const { data } = await api.post('/api/auth/login', credentials);
  return data;
};