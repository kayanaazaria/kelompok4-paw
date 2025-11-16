import { jwtDecode } from 'jwt-decode';

export const ROLE_REDIRECTS = {
  admin: '/dashboard/admin',
  hse: '/dashboard/hse',
  kepala_bidang: '/dashboard/kepala-bidang',
  direktur_sdm: '/dashboard/direktur-sdm',
};

const TOKEN_KEYS = ['token', 'jwt_token', 'authToken'];

export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  for (const key of TOKEN_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) {
      return value;
    }
  }

  const userData = window.localStorage.getItem('userData');
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      if (parsed.token) return parsed.token;
    } catch (error) {}
  }

  return null;
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  const keysToRemove = [...TOKEN_KEYS, 'userData'];
  keysToRemove.forEach((key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  });
};

export const getDecodedToken = () => {
  const token = getStoredToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const getRoleRoute = (role) => {
  if (!role) return '/login';
  return ROLE_REDIRECTS[role] || '/';
};

export const storeAuthSession = (payload) => {
  if (typeof window === 'undefined' || !payload) return;
  const { token, role, username, email, department } = payload;
  if (token) {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('jwt_token', token);
    window.localStorage.setItem('authToken', token);
  }
  window.localStorage.setItem('userData', JSON.stringify({ role, username, email, department, token }));
  window.sessionStorage.setItem('token', token);
  window.sessionStorage.setItem('userData', JSON.stringify({ role, username, email, department }));
};

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  // Try session storage first
  const sessionData = window.sessionStorage.getItem('userData');
  if (sessionData) {
    try {
      return JSON.parse(sessionData);
    } catch (error) {}
  }
  
  // Fallback to localStorage
  const localData = window.localStorage.getItem('userData');
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (error) {}
  }
  
  // Fallback to decoded token
  const decoded = getDecodedToken();
  if (decoded) {
    return {
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      department: decoded.department
    };
  }
  
  return null;
};

export const getRoleStatus = (allowedRoles = []) => {
  const decoded = getDecodedToken();
  if (!decoded) {
    return { status: 'unauthorized', role: null };
  }
  const role = decoded.role;
  if (allowedRoles.length === 0) {
    return { status: 'authorized', role };
  }
  if (allowedRoles.includes(role)) {
    return { status: 'authorized', role };
  }
  return { status: 'forbidden', role };
};