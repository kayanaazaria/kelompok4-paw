export default function ReportStats({ reports }) {
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'Menunggu Persetujuan Kepala Bidang').length;
  const approvedReports = reports.filter(r => r.status === 'Disetujui').length;
  const rejectedReports = reports.filter(r => r.status.includes('Ditolak')).length;

  const stats = [
    { label: 'Total Laporan', value: totalReports, color: 'bg-blue-500' },
    { label: 'Menunggu Persetujuan', value: pendingReports, color: 'bg-yellow-500' },
    { label: 'Disetujui', value: approvedReports, color: 'bg-green-500' },
    { label: 'Ditolak', value: rejectedReports, color: 'bg-red-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className={`${stat.color} h-12 w-12 rounded-lg mb-4`}></div>
          <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
