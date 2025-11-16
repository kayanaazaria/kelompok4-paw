"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Navbar, ErrorAlert } from "@/components/shared";
import { DeleteConfirmModal } from "@/components/shared";
import useReportManagement from "@/hooks/useReportManagement";
import { Shield, FileText, Clock, CheckCircle, XCircle, Eye, Search, ChevronDown } from "lucide-react";

export default function HSEDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeCard, setActiveCard] = useState("all");
  
  const {
    reports,
    loading,
    error,
    editingReport,
    showModal,
    showDeleteModal,
    reportToDelete,
    isViewMode,
    formData,
    formErrors,
    openCreateModal,
    openEditModal,
    closeModal,
    handleInputChange,
    handleSubmit,
    handleSubmitReport,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteReport,
  } = useReportManagement();

  const router = useRouter();

  const handleViewReport = (report) => {
    router.push(`/dashboard/hse/laporan/${report._id}`);
  };

  const handleCreateReport = () => {
    router.push("/dashboard/hse/laporan/buat");
  };

  const stats = useMemo(() => {
    const draft = reports.filter(r => r.status === "Draft").length;
    const menunggu = reports.filter(r => 
      r.status === "Menunggu Persetujuan Kepala Bidang" || 
      r.status === "Menunggu Persetujuan Direktur SDM"
    ).length;
    const disetujui = reports.filter(r => r.status === "Disetujui").length;
    const ditolak = reports.filter(r => 
      r.status === "Ditolak Kepala Bidang" || 
      r.status === "Ditolak Direktur SDM"
    ).length;
    
    return { draft, menunggu, disetujui, ditolak };
  }, [reports]);

  const filteredReports = useMemo(() => {
    let filtered = reports;
    
    // Filter by active card or status filter
    const activeFilter = activeCard !== "all" ? activeCard : statusFilter;
    
    if (activeFilter !== "all") {
      if (activeFilter === "draft") {
        filtered = filtered.filter(r => r.status === "Draft");
      } else if (activeFilter === "menunggu") {
        filtered = filtered.filter(r => 
          r.status === "Menunggu Persetujuan Kepala Bidang" || 
          r.status === "Menunggu Persetujuan Direktur SDM"
        );
      } else if (activeFilter === "disetujui") {
        filtered = filtered.filter(r => r.status === "Disetujui");
      } else if (activeFilter === "ditolak") {
        filtered = filtered.filter(r => 
          r.status === "Ditolak Kepala Bidang" || 
          r.status === "Ditolak Direktur SDM"
        );
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.namaPekerja?.toLowerCase().includes(search) ||
          report.nomorIndukPekerja?.toLowerCase().includes(search) ||
          report.department?.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }, [reports, searchTerm, statusFilter, activeCard]);

  const handleCardClick = (filter) => {
    if (activeCard === filter) {
      // Jika card yang sama diklik lagi, reset filter
      setActiveCard("all");
      setStatusFilter("all");
    } else {
      // Jika card berbeda, set filter baru
      setActiveCard(filter);
      setStatusFilter(filter);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Draft") return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Draft</span>;
    if (status === "Menunggu Persetujuan Kepala Bidang" || status === "Menunggu Persetujuan Direktur SDM") 
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Menunggu</span>;
    if (status === "Disetujui") return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Selesai</span>;
    if (status === "Ditolak Kepala Bidang" || status === "Ditolak Direktur SDM") 
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Ditolak</span>;
    return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{status}</span>;
  };

  const getTimeSince = (date) => {
    const now = new Date();
    const created = new Date(date);
    const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Hari ini";
    if (days === 1) return "1 hari yang lalu";
    return `${days} hari yang lalu`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Container with padding for spacing from edges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 text-white rounded-xl shadow-lg">
          <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Dashboard HSE</h1>
                    <p className="text-emerald-50 text-xs sm:text-sm mt-1">Health, Safety & Environment Management</p>
                  </div>
                </div>
                <p className="text-emerald-50 text-sm sm:text-base max-w-2xl">
                  Kelola dan pantau semua laporan insiden keselamatan kerja di SOLANUM AGROTECH
                </p>
              </div>
              <button
                onClick={handleCreateReport}
                className="bg-white text-emerald-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <span className="text-xl">+</span>
                <span className="whitespace-nowrap">Buat Laporan Baru</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => handleCardClick("draft")}
              className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border transition-all hover:shadow-md ${
                activeCard === "draft" ? "border-gray-400 ring-2 ring-gray-400" : "border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-left">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Draft</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.draft}</p>
                  <p className="text-gray-500 text-xs mt-1">{stats.draft === 0 ? "Tidak ada" : `${stats.draft} laporan`}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gray-100 rounded-full flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </div>
              </div>
            </button>

            <button
              onClick={() => handleCardClick("menunggu")}
              className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border transition-all hover:shadow-md ${
                activeCard === "menunggu" ? "border-yellow-400 ring-2 ring-yellow-400" : "border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-left">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Menunggu Persetujuan</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.menunggu}</p>
                  <p className="text-gray-500 text-xs mt-1">{stats.menunggu} laporan</p>
                </div>
                <div className="p-2 sm:p-3 bg-yellow-100 rounded-full flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </button>

            <button
              onClick={() => handleCardClick("disetujui")}
              className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border transition-all hover:shadow-md ${
                activeCard === "disetujui" ? "border-green-400 ring-2 ring-green-400" : "border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-left">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Disetujui</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.disetujui}</p>
                  <p className="text-gray-500 text-xs mt-1">{stats.disetujui} laporan</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </button>

            <button
              onClick={() => handleCardClick("ditolak")}
              className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border transition-all hover:shadow-md ${
                activeCard === "ditolak" ? "border-red-400 ring-2 ring-red-400" : "border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-left">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Ditolak</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.ditolak}</p>
                  <p className="text-gray-500 text-xs mt-1">{stats.ditolak} laporan</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
            </button>
          </div>
        </div>  {/* Close stats cards container */}

        {/* Report List Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {error && <ErrorAlert message={error} />}

          {/* Report List Section */}
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
                      {[
                        { value: "all", label: "Semua Status" },
                        { value: "draft", label: "Draft" },
                        { value: "menunggu", label: "Menunggu" },
                        { value: "disetujui", label: "Disetujui" },
                        { value: "ditolak", label: "Ditolak" }
                      ].map((option) => (
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
                <table className="hidden md:table min-w-full divide-y divide-gray-200">
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
                          {report.nomorIndukPekerja || "INC-2025-001"}
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
                            onClick={() => handleViewReport(report)}
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

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <div key={report._id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm mb-1">{report.namaPekerja}</p>
                          <p className="text-xs text-gray-600">{report.nomorIndukPekerja || "INC-2025-001"}</p>
                        </div>
                        <button
                          onClick={() => handleViewReport(report)}
                          className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                          title="Lihat Detail"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Departemen:</span>
                          <span className="text-gray-900 font-medium">{report.department}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Status:</span>
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Dibuat:</span>
                          <span className="text-gray-600">{getTimeSince(report.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>  {/* Close report list section */}

        <DeleteConfirmModal
          show={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteReport}
          itemName={reportToDelete?.namaPekerja}
          title="Hapus Laporan"
        />
      </div>  
    </div>  
  );
}
