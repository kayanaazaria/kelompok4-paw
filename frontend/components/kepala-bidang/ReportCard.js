export default function ReportCard({ report, onViewDetail }) {
  const getSkalaCederaColor = (skala) => {
    if (skala === 'Ringan') return 'bg-yellow-100 text-yellow-800';
    if (skala === 'Menengah') return 'bg-orange-100 text-orange-800';
    if (skala === 'Berat') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status) => {
    if (status === 'Menunggu Persetujuan Kepala Bidang') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Disetujui') return 'bg-green-100 text-green-800';
    if (status.includes('Ditolak')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{report.namaPekerja}</h3>
          <p className="text-sm text-gray-600">{report.nomorIndukPekerja}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm text-gray-600">Tanggal Kejadian</p>
          <p className="text-gray-900 font-medium">
            {new Date(report.tanggalKejadian).toLocaleDateString('id-ID')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Skala Cedera:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSkalaCederaColor(report.skalaCedera)}`}>
            {report.skalaCedera}
          </span>
        </div>
      </div>

      <button
        onClick={() => onViewDetail(report)}
        className="w-full px-4 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
      >
        Lihat Detail
      </button>
    </div>
  );
}
