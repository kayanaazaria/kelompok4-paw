"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/services/api";
import { Navbar, ErrorAlert, SuccessAlert } from "@/components/shared";
import { 
  LaporanHeader, 
  LaporanInfo, 
  DetailKejadian, 
  LampiranSection, 
  ApprovalInfo 
} from "@/components/hse/detail";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import SubmitConfirmModal from "@/components/shared/SubmitConfirmModal";
import RejectModal from "@/components/shared/RejectModal";

export default function DetailLaporanDirektur() {
  const router = useRouter();
  const params = useParams();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

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
    // use shared modal instead of native confirm
    setShowSubmitModal(true);
  };

  const confirmApprove = async () => {
    try {
      setActionLoading(true);
      setError(null);
      await api.put(`/api/laporan/${params.id}/approve-direktur`);
      setSuccessMessage("Laporan berhasil disetujui");
      setTimeout(() => router.push("/dashboard/direktur-sdm"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyetujui laporan");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason) => {
    const finalReason = typeof reason === 'string' ? reason : rejectionReason;
    if (!finalReason || !finalReason.trim()) {
      alert("Alasan penolakan harus diisi");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      await api.put(
        `/api/laporan/${params.id}/reject-direktur`,
        { alasanPenolakan: finalReason }
      );
      setSuccessMessage("Laporan berhasil ditolak");
      setShowRejectModal(false);
      setTimeout(() => router.push("/dashboard/direktur-sdm"), 1200);
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

  const canTakeAction = laporan.status === "Menunggu Persetujuan Direktur SDM";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/direktur-sdm")}
          className="mb-4 sm:mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali ke Dashboard</span>
        </button>

        {error && <ErrorAlert message={error} />}
        {successMessage && <SuccessAlert message={successMessage} />}

        {/* Header Component */}
        <LaporanHeader laporan={laporan} />

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <LaporanInfo laporan={laporan} />
          <DetailKejadian detailKejadian={laporan.detailKejadian} />
          <LampiranSection lampiran={laporan.lampiran || laporan.attachmentUrl} />
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
          </div>
      </div>

      <SubmitConfirmModal
        show={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={confirmApprove}
        loading={actionLoading}
        reportName={laporan?.title || laporan?.judul}
        title={"Setujui Laporan"}
        message={"Apakah Anda yakin ingin menyetujui laporan ini?"}
        note={"Setelah disetujui, laporan tidak dapat diedit kembali."}
        confirmLabel={"Ya, Setujui"}
      />

      <RejectModal
        show={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={(reason) => handleReject(reason)}
        loading={actionLoading}
      />
    </div>
  );
}
