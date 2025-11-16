import React from "react";

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Draft":
      return "bg-gray-100 text-gray-800";
    case "Menunggu Persetujuan Kepala Bidang":
      return "bg-yellow-100 text-yellow-800";
    case "Menunggu Persetujuan Direktur SDM":
      return "bg-blue-100 text-blue-800";
    case "Disetujui":
      return "bg-green-100 text-green-800";
    case "Ditolak Kepala Bidang":
    case "Ditolak Direktur SDM":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSkalaBadgeColor = (skala) => {
  switch (skala) {
    case "Ringan":
      return "bg-green-100 text-green-800";
    case "Menengah":
      return "bg-yellow-100 text-yellow-800";
    case "Berat":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ReportTable = ({ reports, onEdit, onDelete, onView, onSubmit }) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Pekerja
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              NIP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Departemen
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Skala Cedera
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reports.map((report) => (
            <tr key={report._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(report.tanggalKejadian).toLocaleDateString("id-ID")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{report.namaPekerja}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {report.nomorIndukPekerja}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {report.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSkalaBadgeColor(report.skalaCedera)}`}>
                  {report.skalaCedera}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(report.status)}`}>
                  {report.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(report)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Detail
                  </button>
                  {report.status === "Draft" && (
                    <>
                      <button
                        onClick={() => onEdit(report)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onSubmit(report)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => onDelete(report)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
