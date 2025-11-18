import React, { useState } from "react";
import { Edit2, Eye, Download, Trash2, X, Calendar, User, Briefcase, FileText, AlertTriangle } from "lucide-react";
import api from "@/services/api";
import ErrorAlert from "@/components/shared/ErrorAlert";
import { ApprovalTimelineCompact } from "../../shared/ApprovalTimeline";

const ActionButtons = ({ laporan, onEdit, onSubmit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const handleViewDocument = () => {
    setShowModal(true);
  };

  const [downloadError, setDownloadError] = useState(null);

  const handleDownloadDocument = async () => {
    try {
      console.log('Starting download for laporan:', laporan._id);

      const response = await api.get(
        `/finaldoc/laporan/${laporan._id}/download`,
        {
          responseType: 'blob'
        }
      );
      
      console.log('Download response received, size:', response.data.size);

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan-final-${laporan._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 100);

      console.log('Download completed successfully');
      setDownloadError(null);
    } catch (err) {
      console.error('Download error:', err);
      const errorMessage = err.response?.data?.message || err.message || "Gagal mengunduh lampiran. File mungkin tidak ditemukan atau sudah dihapus.";
      setDownloadError(errorMessage);
      // clear after some time
      setTimeout(() => setDownloadError(null), 6000);
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
        ? laporan.createdByHSE?._id 
        : laporan.createdByHSE;

      if (!creatorId) return false; // Jika tidak ada creatorId, return false

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
      <>
        {downloadError && (
          <div className="mb-4">
            <ErrorAlert message={downloadError} />
          </div>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10">
          <button
            onClick={handleViewDocument}
            className="flex-1 px-4 sm:px-6 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Lihat Dokumen</span>
          </button>
          <button
            onClick={handleDownloadDocument}
            className="flex-1 px-4 sm:px-6 py-3 bg-emerald-600 text-white border-2 border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base relative z-20"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Download Dokumen</span>
          </button>
        </div>

        {/* Modal Informasi Dokumen Final */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-center p-6 border-b border-gray-200 bg-white rounded-t-lg flex-shrink-0 relative">
                <h3 className="text-xl font-semibold text-gray-900">Dokumen Final Laporan Insiden</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute right-6 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <p className="text-sm text-gray-600 text-center mb-6">
                  Dokumen ini merupakan versi final dari laporan insiden kerja yang telah disetujui.
                </p>

                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <div className="text-center">
                    <div className="w-40 h-40 mx-auto mb-4 relative">
                      <img src="/logo_solanum_potrait.png" alt="SOLANUM AGROTECH" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">LAPORAN INSIDEN KERJA</h2>
                  </div>
                </div>

                {/* Informasi Laporan */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Insiden</p>
                      <p className="font-semibold text-gray-900">{new Date(laporan.tanggalKejadian).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Departemen</p>
                      <p className="font-semibold text-gray-900">{laporan.department}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Nama Pekerja</p>
                      <p className="font-semibold text-gray-900">{laporan.namaPekerja}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Skala Cedera</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        laporan.skalaCedera === 'Berat' ? 'bg-red-100 text-red-700' :
                        laporan.skalaCedera === 'Menengah' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {laporan.skalaCedera}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">NIP</p>
                      <p className="font-semibold text-gray-900">{laporan.nomorIndukPekerja}</p>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Insiden */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Deskripsi Insiden</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{laporan.detailKejadian}</p>
                  </div>
                </div>

                {/* Alur Persetujuan */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Alur Persetujuan</h4>
                  <ApprovalTimelineCompact steps={[
                    { 
                      id: 1, 
                      label: 'Laporan Terkirim',
                      detail: `Disetujui oleh HSE • ${new Date(laporan.createdAt).toLocaleDateString("id-ID")}`,
                      status: 'done'
                    },
                    ...(laporan.signedByKabid ? [{
                      id: 2,
                      label: 'Persetujuan Kepala Bidang',
                      detail: `Disetujui oleh ${laporan.signedByKabid.username} • ${new Date(laporan.updatedAt).toLocaleDateString("id-ID")}`,
                      status: 'done'
                    }] : []),
                    {
                      id: 3,
                      label: 'Persetujuan Direktur SDM',
                      detail: `Disetujui oleh ${laporan.approvedByDirektur?.username || 'Direktur SDM'} • ${new Date(laporan.updatedAt).toLocaleDateString("id-ID")}`,
                      status: 'done'
                    },
                    {
                      id: 4,
                      label: 'Selesai',
                      detail: 'Proses persetujuan telah selesai',
                      status: 'done'
                    }
                  ]} />
                </div>

                {/* Info QR / ID Dokumen */}
                <div className="text-center text-sm text-gray-500 pt-4 border-t">
                  <p className="font-semibold text-gray-700 mb-3">Scan QR Code untuk verifikasi dokumen</p>

                  {/* QR Code */}
                  <div className="flex justify-center mb-3">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/verify/${laporan._id}`)}`}
                      alt="QR Code Verifikasi"
                      className="w-32 h-32"
                    />
                  </div>

                  <p className="font-mono text-xs mt-1 text-gray-600">(ID Dokumen: {laporan._id})</p>

                  {/* Button Lihat Verifikasi Dokumen */}
                  <div className="flex justify-center mt-4 mb-3">
                    <a
                      href={`/verify/${laporan._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Lihat Verifikasi Dokumen
                    </a>
                  </div>

                  <p className="text-xs mt-2">Dokumen ini dihasilkan secara otomatis oleh sistem</p>
                  <p className="text-xs font-semibold">SOLANUM AGROTECH - Incident Report Management System</p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleDownloadDocument();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Dokumen
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export default ActionButtons;
