import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(config => {
  let token = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('jwt_token'); 
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
    try {
        const fullDownloadUrl = `http://localhost:5001/finaldoc/laporan/${documentId}/download`;
        
        const token = localStorage.getItem('jwt_token');

        if (!token) {
             throw new Error("Token otorisasi tidak ditemukan.");
        }

        const response = await axios.get(fullDownloadUrl, {
            responseType: 'blob', 
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });

        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const link = document.createElement('a');
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'document_final.pdf';

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
    } catch (error) {
        console.error("Gagal mengunduh dokumen:", error);
        alert("Gagal mengunduh dokumen. Otorisasi mungkin ditolak atau file tidak ada.");
    }
};

export default api;