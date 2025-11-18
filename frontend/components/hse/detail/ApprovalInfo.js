import React from "react";

// Helper function to determine step state based on laporan status
const getStepState = (step, laporan) => {
  const s = laporan?.status;

  if (s === 'Draft') {
    if (step === 1) return 'created_draft'; 
    if (step === 2 || step === 3) return 'pending_draft'; 
    return 'skipped';
  }
  
  if (step === 1) return 'done';

  if (step === 2) {
    if (s === 'Ditolak Kepala Bidang') return 'rejected';
    if (s === 'Menunggu Persetujuan Kepala Bidang') return 'current';
    return 'done';
  }

  if (step === 3) {
    if (s === 'Disetujui') return 'done';
    if (s === 'Menunggu Persetujuan Direktur SDM') return 'current';
    if (s === 'Ditolak Direktur SDM') return 'rejected';
    if (s === 'Ditolak Kepala Bidang') return 'skipped';
    return 'pending';
  }

  if (step === 4) { 
    if (s === 'Disetujui') return 'done';
    return 'skipped';
  }

  return 'pending';
};

const getTimelineColor = (state) => {
  switch(state) {
    case 'done':
      return 'bg-green-600';
    case 'current':
      return 'bg-yellow-400';
    case 'rejected':
      return 'bg-red-500';
    case 'created_draft': 
    case 'pending_draft':
    case 'pending': 
    default:
      return 'bg-gray-400'; 
  }
};

const getInnerIcon = (state) => {
  if (state === 'done') {
    return (
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (state === 'rejected') {
    return (
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (state === 'current' || state.includes('pending') || state.includes('draft')) {
    return (
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
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
      person: laporan.createdByHSE?.username || 'HSE'
    },
    { 
      id: 2, 
      label: 'Persetujuan Kepala Bidang', 
      detail: laporan.signedByKabid 
        ? `${laporan.signedByKabid.username} • ${getApprovalDate(laporan.signedByKabid, laporan.updatedAt)}`
        : 'Menunggu • Belum disetujui',
      person: laporan.signedByKabid?.username || 'Kepala Bidang'
    },
    { 
      id: 3, 
      label: 'Persetujuan Direktur SDM', 
      detail: (laporan.status === 'Disetujui' || laporan.approvedByDirektur)
        ? `${laporan.approvedByDirektur?.username || 'Direktur SDM'} • ${getApprovalDate(laporan.approvedByDirektur, laporan.updatedAt)}`
        : 'Menunggu • Belum disetujui',
      person: laporan.approvedByDirektur?.username || 'Direktur SDM'
    },
    { 
      id: 4, 
      label: 'Selesai', 
      detail: 'Proses persetujuan telah selesai',
      person: ''
    }
  ];

  return (
    <div className="space-y-0">
      {/* Alur Persetujuan - Timeline Vertical */}
      <div className="bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Alur Persetujuan</h3>

        <div>
          <div className="">
            {approvalSteps.map((step, index) => {
              const state = getStepState(step.id, laporan);
              if (state === 'skipped') return null;

              const isLast = index === approvalSteps.length - 1 || getStepState(approvalSteps[index + 1]?.id, laporan) === 'skipped';
              const nextState = !isLast ? getStepState(approvalSteps[index + 1]?.id, laporan) : null;

              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="w-16 flex flex-col items-center">
                    <div className={`${getTimelineColor(state)} ${state === 'done' ? 'animate-pop' : ''} w-10 h-10 rounded-full flex items-center justify-center z-10`}>
                      {getInnerIcon(state)}
                    </div>
                    {!isLast && nextState !== 'skipped' && (
                      <div className={`${getTimelineColor(nextState)} w-0.5 h-8`}></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{step.label}</p>
                    <p className="text-sm text-gray-500">{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default ApprovalInfo;
