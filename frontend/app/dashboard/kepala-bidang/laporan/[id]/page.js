"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/services/api";
import { Navbar, ErrorAlert } from "@/components/shared";
import { 
  LaporanHeader, 
  LaporanInfo, 
  DetailKejadian, 
  LampiranSection, 
  ApprovalInfo 
} from "@/components/hse/detail";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function DetailLaporanKepalaBidang() {
  const router = useRouter();
  const params = useParams();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/laporan/${params.id}`);
        setLaporan(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal mengambil detail laporan");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLaporan();
    }
  }, [params.id]);

  const handleApprove = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menyetujui laporan ini?")) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      await api.put(`/api/laporan/${params.id}/approve-kepala`);
      alert("Laporan berhasil disetujui dan diteruskan ke Direktur SDM");
      router.push("/dashboard/kepala-bidang");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyetujui laporan");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Alasan penolakan harus diisi");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      await api.put(
        `/api/laporan/${params.id}/reject-kepala`,
        { alasanPenolakan: rejectionReason }
      );
      alert("Laporan berhasil ditolak");
      setShowRejectModal(false);
      router.push("/dashboard/kepala-bidang");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menolak laporan");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !laporan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error || "Laporan tidak ditemukan"} />
          <button
            onClick={() => router.push("/dashboard/direktur-sdm")}
            className="mt-4 flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft size={20} />
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const canTakeAction = laporan.status === "Menunggu Persetujuan Kepala Bidang";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/kepala-bidang")}
          className="mb-4 sm:mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali ke Dashboard</span>
        </button>

        {error && <ErrorAlert message={error} />}

        {/* Header Component */}
        <LaporanHeader laporan={laporan} />

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <LaporanInfo laporan={laporan} />
            <DetailKejadian laporan={laporan} />
            <LampiranSection attachmentUrl={laporan.attachmentUrl} />
            <ApprovalInfo laporan={laporan} />
        </div>

          <div className="space-y-6">
            {canTakeAction && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Persetujuan</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={20} />
                    {actionLoading ? "Memproses..." : "Setujui Laporan"}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={20} />
                    Tolak Laporan
                  </button>
                </div>
              </div>
            )}

            {(laporan.status === "Menunggu Persetujuan Direktur SDM" || laporan.status === "Disetujui") && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={20} />
                  <p className="font-semibold">Laporan telah disetujui</p>
                </div>
                {laporan.status === "Menunggu Persetujuan Direktur SDM" && (
                  <p className="text-sm text-green-600 mt-2">
                    Menunggu persetujuan dari Direktur SDM
                  </p>
                )}
              </div>
            )}

            {laporan.status === "Ditolak Kepala Bidang" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <XCircle size={20} />
                  <p className="font-semibold">Laporan ditolak</p>
                </div>
                {laporan.alasanPenolakan && (
                  <p className="text-sm text-red-600 mt-2">
                    <span className="font-medium">Alasan:</span> {laporan.alasanPenolakan}
                  </p>
                )}
              </div>
            )}
          </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowRejectModal(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tolak Laporan</h3>
              <p className="text-gray-600 mb-4">
                Silakan berikan alasan penolakan laporan ini:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Masukkan alasan penolakan..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[120px]"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "Memproses..." : "Tolak"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
