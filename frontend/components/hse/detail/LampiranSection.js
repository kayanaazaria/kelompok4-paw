import React, { useState } from "react";
import { Paperclip, FileText, Download } from "lucide-react";
import ErrorAlert from "@/components/shared/ErrorAlert";

const LampiranSection = ({ lampiran }) => {
  const [downloadError, setDownloadError] = useState(null);

  // Handle both old attachmentUrl (string) and new lampiran (array) formats
  const files = React.useMemo(() => {
    if (!lampiran) return [];
    
    // If it's the old format (string), convert to array
    if (typeof lampiran === 'string') {
      return [{
        originalName: lampiran.split('/').pop() || 'lampiran',
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}${lampiran}`,
        mimetype: 'application/octet-stream',
        size: 0
      }];
    }
    
    // If it's already an array, use it directly
    if (Array.isArray(lampiran)) {
      return lampiran;
    }
    
    return [];
  }, [lampiran]);

  if (files.length === 0) return null;

  const handleDownload = async (file) => {
    try {
      // For Supabase files, url is already the full public URL
      const response = await fetch(file.url, {
        method: 'HEAD'
      });

      if (!response.ok) {
        throw new Error('File tidak ditemukan');
      }

      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.originalName || 'lampiran';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      setDownloadError('Gagal mengunduh lampiran. File mungkin tidak ditemukan atau sudah dihapus.');
      setTimeout(() => setDownloadError(null), 6000);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
        Lampiran ({files.length})
      </h2>
      
      {downloadError && <ErrorAlert message={downloadError} />}
      
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.originalName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleDownload(file)}
              className="ml-3 p-2 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors flex-shrink-0"
              title="Download file"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LampiranSection;
