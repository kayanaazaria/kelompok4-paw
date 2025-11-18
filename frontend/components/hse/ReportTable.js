import { Eye } from "lucide-react";

export default function ReportTable({ reports, onViewReport, getStatusBadge, getTimeSince }) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nomor Request
            </th>
            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Karyawan
            </th>
            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Departemen
            </th>
            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dibuat
            </th>
            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reports.map((report) => (
            <tr key={report._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {report.nomorLaporan || "INC-2025-001"}
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {report.namaPekerja}
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {report.department}
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                {getStatusBadge(report.status)}
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {getTimeSince(report.createdAt)}
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onViewReport(report)}
                  className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Lihat Detail"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
