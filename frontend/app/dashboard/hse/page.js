"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Navbar, ErrorAlert, DeleteConfirmModal } from "@/components/shared";
import { PageHeader, ReportStats, ReportList } from "@/components/hse";
import useReportManagement from "@/hooks/useReportManagement";

export default function HSEDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
    if (status === "Draft") return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">Draft</span>;
    if (status === "Menunggu Persetujuan Kepala Bidang" || status === "Menunggu Persetujuan Direktur SDM") 
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Menunggu</span>;
    if (status === "Disetujui") return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Disetujui</span>;
    if (status === "Ditolak Kepala Bidang" || status === "Ditolak Direktur SDM") 
      return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Ditolak</span>;
    return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">{status}</span>;
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
        <PageHeader onCreateReport={handleCreateReport} />
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
        <ReportStats stats={stats} activeCard={activeCard} onCardClick={handleCardClick} />
      </div>

      {/* Report List Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {error && <ErrorAlert message={error} />}

        <ReportList
          filteredReports={filteredReports}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          onViewReport={handleViewReport}
          getStatusBadge={getStatusBadge}
          getTimeSince={getTimeSince}
        />

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
