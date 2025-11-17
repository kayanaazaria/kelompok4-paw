"use client";

export default function ReportDetailModal({
  report,
  onClose,
  onApprove,
  onReject,
  approvalLoading,
  showActions
}) {
  const getSkalaCederaColor = (skala) => {
    if (skala === 'Ringan') return 'bg-yellow-100 text-yellow-800';
    if (skala === 'Menengah') return 'bg-orange-100 text-orange-800';
    if (skala === 'Berat') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Detail Laporan Kecelakaan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Informasi Pekerja */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pekerja</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Nama Pekerja</p>
                <p className="text-lg font-medium text-gray-900">{report.namaPekerja}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nomor Induk</p>
                <p className="text-lg font-medium text-gray-900">{report.nomorIndukPekerja}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Departemen</p>
                <p className="text-lg font-medium text-gray-900">{report.department}</p>
              </div>
            </div>
          </section>

          {/* Informasi Kejadian */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kejadian</h3>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Tanggal Kejadian</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(report.tanggalKejadian).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Skala Cedera</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSkalaCederaColor(report.skalaCedera)}`}>
                  {report.skalaCedera}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Detail Kejadian</p>
                <p className="text-base text-gray-900 mt-2 whitespace-pre-wrap">{report.detailKejadian}</p>
              </div>
            </div>
          </section>

          {/* Lampiran */}
          {report.attachmentUrl && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lampiran</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <a
                  href={report.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {report.attachmentUrl.split('/').pop()}
                </a>
              </div>
            </section>
          )}

          {/* Status */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Status Saat Ini</p>
              <p className="text-lg font-medium text-gray-900">{report.status}</p>
            </div>
          </section>
          {/* Approval info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Persetujuan</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {report.signedByKabid ? (
                <div className="text-sm text-gray-700">
                  <p>Disetujui oleh: <span className="font-medium text-gray-900">{report.signedByKabid.username || report.signedByKabid.email}</span></p>
                  <p className="text-xs text-gray-500">Pada: {new Date(report.updatedAt || report.createdAt).toLocaleString('id-ID')}</p>
                </div>
              ) : report.status && report.status.includes('Ditolak') ? (
                <div className="text-sm text-gray-700">
                  <p>Ditolak oleh Kepala Bidang</p>
                  <p className="text-xs text-gray-500">Pada: {new Date(report.updatedAt || report.createdAt).toLocaleString('id-ID')}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Belum ada aksi persetujuan</p>
              )}
            </div>
          </section>
        </div>

        {/* Footer - Actions */}
        {showActions && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onReject}
              disabled={approvalLoading}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {approvalLoading ? 'Memproses...' : 'Tolak'}
            </button>
            <button
              onClick={onApprove}
              disabled={approvalLoading}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {approvalLoading ? 'Memproses...' : 'Approve'}
            </button>
          </div>
        )}

        {!showActions && (
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
