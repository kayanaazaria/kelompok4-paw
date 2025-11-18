import React, { useState } from "react";
import { Paperclip } from "lucide-react";
import { API_BASE_URL } from "@/services/api";
import ErrorAlert from "@/components/shared/ErrorAlert";

const LampiranSection = ({ attachmentUrl }) => {
  if (!attachmentUrl) return null;

  const fileUrl = `${API_BASE_URL}${attachmentUrl}`;

  const handleDownload = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(fileUrl, {
        method: 'HEAD' // Check if file exists without downloading
      });

      if (!response.ok) {
        throw new Error('File tidak ditemukan');
      }

      // If file exists, trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = attachmentUrl.split('/').pop() || 'lampiran';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      setDownloadError('Gagal mengunduh lampiran. File mungkin tidak ditemukan atau sudah dihapus.');
      setTimeout(() => setDownloadError(null), 6000);
    }
  };

  const [downloadError, setDownloadError] = useState(null);

  return (
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Lampiran</h2>
      {downloadError && <ErrorAlert message={downloadError} />}
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm sm:text-base"
      >
        <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-medium">Download Lampiran</span>
      </button>
    </div>
  );
};

export default LampiranSection;
