import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(config => {
  let token = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || 
            localStorage.getItem('jwt_token') || 
            localStorage.getItem('authToken');
    
    if (!token) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          token = parsed.token;
        } catch (e) {}
      }
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.url.includes('/finaldoc/')) {
    console.warn("Mencoba mengakses finaldoc tanpa token otorisasi.");
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const getFinalDocuments = async () => {
    const response = await api.get('/laporan/hse/tracking/?status=selesai'); 
    return response.data;
};

export const downloadFinalDocument = async (documentId) => {
  const DOWNLOAD_ENDPOINT = `/finaldoc/laporan/${documentId}/download`;

  try {
        const response = await api.get(DOWNLOAD_ENDPOINT, { 
            responseType: 'blob',
        });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      const contentDisposition = response.headers['content-disposition'];
      let filename = `Laporan_Insiden_${documentId}.pdf`; 

      if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch && filenameMatch.length === 2) {
                 filename = filenameMatch[1];
            }
      }

      link.href = window.URL.createObjectURL(blob);
      link.download = filename; 
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blob);
      
      return true; 
    } catch (error) {
        console.error("Gagal mengunduh dokumen:", error);
        alert("Gagal mengunduh dokumen. Otorisasi mungkin ditolak atau file tidak ada.");
      return false;
   }
};

export const getAllHSEDocuments = async () => {
    const response = await api.get('/laporan'); 
    return response.data;
};

export const viewFinalDocument = async (documentId) => {
    const VIEW_ENDPOINT = `/finaldoc/laporan/${documentId}`;
    
    try {
        const response = await api.get(VIEW_ENDPOINT);

        return response.data;
    } catch (error) {
        console.error("Gagal mengambil dokumen final:", error);
        throw error;
    }
};

export default api;