import React from "react";
import { ApprovalTimeline } from "../../shared/ApprovalTimeline";

// Helper function to determine step state based on laporan status
const getStepState = (step, laporan) => {
  const s = laporan?.status;

  // Jika Draft, semua step adalah draft
  if (s === 'Draft') {
    if (step === 1) return 'draft'; 
    if (step === 2 || step === 3 || step === 4) return 'draft'; 
    return 'skipped';
  }

  // Step 1 selalu done (laporan sudah dibuat)
  if (step === 1) return 'done';

  // Jika ditolak di step 2 (Kepala Bidang)
  if (s === 'Ditolak Kepala Bidang') {
    if (step === 2) return 'rejected';
    if (step === 3 || step === 4) return 'rejected'; // Semua step setelahnya juga rejected
    return 'done';
  }

  // Jika ditolak di step 3 (Direktur SDM)
  if (s === 'Ditolak Direktur SDM') {
    if (step === 2) return 'done'; // Kabid sudah approve
    if (step === 3) return 'rejected';
    if (step === 4) return 'rejected'; // Step setelahnya juga rejected
    return 'done';
  }

  // Step 2 - Persetujuan Kepala Bidang
  if (step === 2) {
    if (s === 'Menunggu Persetujuan Kepala Bidang') return 'current';
    return 'done';
  }

  // Step 3 - Persetujuan Direktur SDM
  if (step === 3) {
    if (s === 'Disetujui') return 'done';
    if (s === 'Menunggu Persetujuan Direktur SDM') return 'current';
    return 'pending';
  }

  // Step 4 - Selesai
  if (step === 4) { 
    if (s === 'Disetujui') return 'done';
    return 'pending';
  }

  return 'pending';
};

const ApprovalInfo = ({ laporan }) => {
  const isDraft = laporan.status === "Draft";

  // Helper to get approval date
  const getApprovalDate = (approver, fallbackDate) => {
    if (approver?.approvedAt) return new Date(approver.approvedAt).toLocaleDateString("id-ID");
    if (approver?.signedAt) return new Date(approver.signedAt).toLocaleDateString("id-ID");
    if (fallbackDate) return new Date(fallbackDate).toLocaleDateString("id-ID");
    return new Date().toLocaleDateString("id-ID");
  };

  const approvalSteps = [
    { 
      id: 1, 
      label: isDraft ? 'Laporan Dibuat' : 'Laporan Terkirim', 
      detail: `${laporan.createdByHSE?.username || 'HSE'} • ${new Date(laporan.createdAt).toLocaleDateString("id-ID")}`,
      person: laporan.createdByHSE?.username || 'HSE',
      status: getStepState(1, laporan)
    },
    { 
      id: 2, 
      label: 'Persetujuan Kepala Bidang', 
      detail: laporan.status === 'Ditolak Kepala Bidang'
        ? `Ditolak oleh ${laporan.signedByKabid?.username || 'Kepala Bidang'} • ${getApprovalDate(laporan.signedByKabid, laporan.updatedAt)}`
        : laporan.signedByKabid 
          ? `${laporan.signedByKabid.username} • ${getApprovalDate(laporan.signedByKabid, laporan.updatedAt)}`
          : 'Menunggu • Belum disetujui',
      person: laporan.signedByKabid?.username || 'Kepala Bidang',
      status: getStepState(2, laporan)
    },
    { 
      id: 3, 
      label: 'Persetujuan Direktur SDM', 
      detail: laporan.status === 'Ditolak Direktur SDM'
        ? `Ditolak oleh ${laporan.approvedByDirektur?.username || 'Direktur SDM'} • ${getApprovalDate(laporan.approvedByDirektur, laporan.updatedAt)}`
        : (laporan.status === 'Disetujui' || laporan.approvedByDirektur)
          ? `${laporan.approvedByDirektur?.username || 'Direktur SDM'} • ${getApprovalDate(laporan.approvedByDirektur, laporan.updatedAt)}`
          : laporan.status === 'Ditolak Kepala Bidang'
            ? 'Dibatalkan'
            : 'Menunggu • Belum disetujui',
      person: laporan.approvedByDirektur?.username || 'Direktur SDM',
      status: getStepState(3, laporan)
    },
    { 
      id: 4, 
      label: 'Selesai', 
      detail: laporan.status === 'Disetujui' 
        ? 'Proses persetujuan telah selesai'
        : laporan.status?.includes('Ditolak')
          ? 'Proses dibatalkan'
          : 'Menunggu penyelesaian',
      person: '',
      status: getStepState(4, laporan)
    }
  ];

  return (
    <div className="space-y-0">
      {/* Alur Persetujuan - Timeline Vertical */}
      <div className="bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Alur Persetujuan</h3>
        <ApprovalTimeline steps={approvalSteps} />
      </div>

      {/* Riwayat Persetujuan */}
      <div className="bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Persetujuan</h3>
        
        <div className="space-y-3">
          {/* Laporan dibuat - selalu tampil */}
          <div className="bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 mt-1">📋</span>
              <div>
                <p className="font-semibold text-gray-900">Laporan dibuat</p>
                <p className="text-sm text-gray-500">{laporan.createdByHSE?.username || "-"}</p>
                <p className="text-sm text-gray-500">{laporan.createdByHSE?.email || "-"}</p>
                <p className="text-sm text-gray-500">{new Date(laporan.createdAt).toLocaleDateString("id-ID")}</p>
              </div>
            </div>
          </div>

          {/* Ditolak oleh Kepala Bidang */}
          {laporan.status === 'Ditolak Kepala Bidang' && (
            <div className="bg-red-50 border border-red-200 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Ditolak oleh Kepala Bidang</p>
                  <p className="text-sm text-gray-500">{laporan.signedByKabid?.username || "-"}</p>
                  <p className="text-sm text-gray-500">{laporan.signedByKabid?.email || "-"}</p>
                  <p className="text-sm text-gray-500">{getApprovalDate(laporan.signedByKabid, laporan.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Disetujui oleh Kepala Bidang - tampil jika sudah disetujui */}
          {laporan.signedByKabid && laporan.status !== 'Ditolak Kepala Bidang' && laporan.status !== 'Menunggu Persetujuan Kepala Bidang' && (
            <div className="bg-green-50 border border-green-200 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Disetujui oleh Kepala Bidang</p>
                  <p className="text-sm text-gray-500">{laporan.signedByKabid.username || "-"}</p>
                  <p className="text-sm text-gray-500">{laporan.signedByKabid.email || "-"}</p>
                  <p className="text-sm text-gray-500">{getApprovalDate(laporan.signedByKabid, laporan.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Ditolak oleh Direktur SDM */}
          {laporan.status === 'Ditolak Direktur SDM' && laporan.approvedByDirektur && (
            <div className="bg-red-50 border border-red-200 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Ditolak oleh Direktur SDM</p>
                  <p className="text-sm text-gray-500">{laporan.approvedByDirektur?.username || "-"}</p>
                  <p className="text-sm text-gray-500">{laporan.approvedByDirektur?.email || "-"}</p>
                  <p className="text-sm text-gray-500">{getApprovalDate(laporan.approvedByDirektur, laporan.updatedAt)}</p>
                </div>
              </div>
            </div>
            )}

          {/* Disetujui oleh Direktur SDM - tampil jika sudah disetujui */}
          {laporan.status === 'Disetujui' && (
            <div className="bg-green-50 border border-green-200 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Disetujui oleh Direktur SDM</p>
                  <p className="text-sm text-gray-500">{laporan.approvedByDirektur?.username || "Direktur SDM"}</p>
                  <p className="text-sm text-gray-500">{laporan.approvedByDirektur?.email || "-"}</p>
                  <p className="text-sm text-gray-500">{laporan.approvedByDirektur ? getApprovalDate(laporan.approvedByDirektur, laporan.updatedAt) : new Date(laporan.updatedAt).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Banner */}
        <div className="-mx-6 border-t border-gray-200 mt-4 px-6 pt-4">
          {laporan.status === 'Disetujui' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="font-semibold">Laporan telah disetujui</p>
              </div>
            </div>
          )}

          {laporan.status === 'Menunggu Persetujuan Direktur SDM' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="font-semibold">Laporan telah disetujui</p>
              </div>
              <p className="text-sm text-green-600 mt-2">
                Menunggu persetujuan dari Direktur SDM
              </p>
            </div>
          )}

          {(laporan.status === 'Ditolak Kepala Bidang' || laporan.status === 'Ditolak Direktur SDM') && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="font-semibold">Laporan ditolak</p>
              </div>
              {laporan.alasanPenolakan && (
                <p className="text-sm text-red-600">
                  <span className="font-medium">Alasan:</span> {laporan.alasanPenolakan}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalInfo;
