import api from './api';

export const getFinalDocuments = async () => {
    const response = await api.get('/api/laporan/hse/tracking/?status=selesai'); 
    return response.data;
};

export const downloadFinalDocument = async (documentId) => {
    try {
        const response = await api.get(`/finaldoc/laporan/${documentId}/download`, {
            responseType: 'blob'
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

export const getAllHSEDocuments = async () => {
    const response = await api.get('/api/laporan'); 
    return response.data;
};

export const viewFinalDocument = async (documentId) => {
    try {
        const response = await api.get(`/finaldoc/laporan/${documentId}`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil dokumen final:", error);
        throw error;
    }
};