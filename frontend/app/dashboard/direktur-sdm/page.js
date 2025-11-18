"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Navbar, ErrorAlert } from "@/components/shared";
import { PageHeader, ReportStats, ReportList } from "@/components/hse";

export default function DirekturSDMDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeCard, setActiveCard] = useState("all");
  
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/api/laporan`);
      console.log("Fetched reports:", response.data);
      
      // Filter only reports that need Direktur SDM action (approved by Kepala Bidang)
      const filteredReports = response.data.filter(
        (report) => 
          report.status === "Menunggu Persetujuan Direktur SDM" ||
          report.status === "Disetujui" ||
          report.status === "Ditolak Direktur SDM"
      );
      
      console.log("Filtered reports for Direktur SDM:", filteredReports);
      
      // Sort by updatedAt descending
      const sortedReports = filteredReports.sort((a, b) => 
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      );
      
      setReports(sortedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || "Gagal mengambil laporan");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report) => {
    router.push(`/dashboard/direktur-sdm/laporan/${report._id}`);
  };

  const stats = useMemo(() => {
    const menunggu = reports.filter(r => r.status === "Menunggu Persetujuan Direktur SDM").length;
    const disetujui = reports.filter(r => r.status === "Disetujui").length;
    const ditolak = reports.filter(r => r.status === "Ditolak Direktur SDM").length;
    
    return { 
      draft: 0, // Direktur SDM doesn't create drafts
      menunggu, 
      disetujui, 
      ditolak 
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    let filtered = reports;
    
    // Filter by active card or status filter
    const activeFilter = activeCard !== "all" ? activeCard : statusFilter;
    
    if (activeFilter !== "all") {
      if (activeFilter === "menunggu") {
        filtered = filtered.filter(r => r.status === "Menunggu Persetujuan Direktur SDM");
      } else if (activeFilter === "disetujui") {
        filtered = filtered.filter(r => r.status === "Disetujui");
      } else if (activeFilter === "ditolak") {
        filtered = filtered.filter(r => r.status === "Ditolak Direktur SDM");
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
      setActiveCard("all");
      setStatusFilter("all");
    } else {
      setActiveCard(filter);
      setStatusFilter(filter);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Menunggu Persetujuan Direktur SDM") 
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Menunggu</span>;
    if (status === "Disetujui") 
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Disetujui</span>;
    if (status === "Ditolak Direktur SDM") 
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <PageHeader 
          title="Dashboard Direktur SDM"
          subtitle="Kelola persetujuan laporan kecelakaan kerja"
          showCreateButton={false}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
        <ReportStats 
          stats={stats} 
          activeCard={activeCard} 
          onCardClick={handleCardClick}
          hideDraft={true}
        />
      </div>

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
          showDraftFilter={false}
        />
      </div>  
    </div>  
  );
}
