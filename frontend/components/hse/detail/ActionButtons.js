import React from "react";
import { Edit2, Eye, Download, Trash2 } from "lucide-react";
import axios from "axios";

const ActionButtons = ({ laporan, onEdit, onSubmit, onDelete }) => {
  const handleViewDocument = () => {
    const token = sessionStorage.getItem("token");
    window.open(`http://localhost:5001/finaldoc/laporan/${laporan._id}/pdf?token=${token}`, '_blank');
  };

  const handleDownloadDocument = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5001/finaldoc/laporan/${laporan._id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan-final-${laporan._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mendownload dokumen");
    }
  };

  // Cek apakah user yang sedang login adalah pembuat laporan
  const isCreator = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload._id || payload.id;
      const creatorId = typeof laporan.createdByHSE === 'object' 
        ? laporan.createdByHSE._id 
        : laporan.createdByHSE;

      return userId === creatorId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  };

  // Draft status - hanya tampilkan tombol jika user adalah pembuat
  if (laporan.status === "Draft") {
    if (!isCreator()) {
      return null; // Tidak ada tombol untuk laporan orang lain
    }

    return (
      <div className="mt-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onEdit}
            className="flex-1 px-4 sm:px-6 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Edit Laporan</span>
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 sm:px-6 py-3 bg-emerald-600 text-white border-2 border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm sm:text-base"
          >
            Submit untuk Persetujuan
          </button>
        </div>
        <button
          onClick={onDelete}
          className="w-full px-4 sm:px-6 py-3 bg-red-700 text-white border-2 border-red-700 rounded-lg hover:bg-red-800 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Hapus Laporan</span>
        </button>
      </div>
    );
  }

  // Approved status
  if (laporan.status === "Disetujui") {
    return (
      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={handleViewDocument}
          className="flex-1 px-4 sm:px-6 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Lihat Dokumen</span>
        </button>
        <button
          onClick={handleDownloadDocument}
          className="flex-1 px-4 sm:px-6 py-3 bg-emerald-600 text-white border-2 border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Download Dokumen</span>
        </button>
      </div>
    );
  }

  return null;
};

export default ActionButtons;
