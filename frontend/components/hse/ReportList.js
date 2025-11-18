import { useState } from "react";
import { FileText, Search, ChevronDown, Eye } from "lucide-react";

export default function ReportList({
  filteredReports,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  activeCard,
  setActiveCard,
  onViewReport,
  getStatusBadge,
  getTimeSince,
  showDraftFilter = true
}) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterOptions = [
    { value: "all", label: "Semua Status" },
    ...(showDraftFilter ? [{ value: "draft", label: "Draft" }] : []),
    { value: "menunggu", label: "Menunggu" },
    { value: "disetujui", label: "Disetujui" },
    { value: "ditolak", label: "Ditolak" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Daftar Laporan</h2>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm">{filteredReports.length} laporan ditemukan</p>
      </div>

      {/* Search and Filter */}
      <div className="p-4 sm:p-6 border-b border-gray-100 flex gap-3 sm:gap-4 flex-col sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor request, nama karyawan..."
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          {activeCard !== "all" && (
            <button
              onClick={() => {
                setActiveCard("all");
                setStatusFilter("all");
              }}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
            >
              Reset Filter
            </button>
          )}
          <div className="relative flex-1 sm:flex-initial">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 sm:min-w-[180px] justify-between text-sm sm:text-base"
            >
              <span className="text-gray-700">
                {statusFilter === "all" ? "Semua Status" : 
                 statusFilter === "draft" ? "Draft" :
                 statusFilter === "menunggu" ? "Menunggu" :
                 statusFilter === "disetujui" ? "Disetujui" : "Ditolak"}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showFilterDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setActiveCard(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                        statusFilter === option.value ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Memuat laporan...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-sm sm:text-base">Tidak ada laporan ditemukan</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Coba ubah filter atau buat laporan baru</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="hidden lg:table min-w-full divide-y divide-gray-200">
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
                {filteredReports.map((report) => (
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

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {filteredReports.map((report) => (
                <div key={report._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm mb-1">{report.namaPekerja}</p>
                      <p className="text-xs text-gray-600">{report.nomorLaporan || "INC-2025-001"}</p>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                  
                  <div className="space-y-2 pb-3 mb-3 border-b border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Departemen</span>
                      <span className="text-gray-900 font-medium">{report.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Dibuat</span>
                      <span className="text-gray-600">{getTimeSince(report.createdAt)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onViewReport(report)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Lihat Detail</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

