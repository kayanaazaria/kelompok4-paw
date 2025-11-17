"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDecodedToken, getRoleRoute, getRoleStatus } from '@/utils/auth';
import { Navbar, ErrorAlert } from '@/components/shared';
import { PageHeader, ReportList, ReportTable, ReportStats } from '@/components/hse';
import { useKepalaBidangManagement } from '@/hooks/useKepalaBidangManagement';
import ReportDetailModal from '@/components/kepala-bidang/ReportDetailModal';

export default function KepalaBidangDashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [currentUser, setCurrentUser] = useState(null);

  const {
    reports,
    approvedReports,
    loading,
    error,
    selectedReport,
    showDetailModal,
    approvalError,
    approvalLoading,
    fetchReports,
    openDetailModal,
    closeDetailModal,
    approveReport,
    rejectReport
  } = useKepalaBidangManagement();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCard, setActiveCard] = useState('menunggu');

  // separate reports by their current approval status
  const pendingReports = reports; // Menunggu Persetujuan Kepala Bidang
  const forwardedReports = approvedReports.filter(r => r.status === 'Menunggu Persetujuan Direktur SDM'); // Approved by kepala, sent to direktur
  const rejectedReports = approvedReports.filter(r => r.status === 'Ditolak Kepala Bidang'); // Rejected by kepala

  const getTimeSince = (iso) => {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s yang lalu`;
    if (diff < 3600) return `${Math.floor(diff/60)}m yang lalu`;
    if (diff < 86400) return `${Math.floor(diff/3600)}j yang lalu`;
    return d.toLocaleDateString('id-ID');
  };

  const getStatusBadge = (status) => {
    if (status === 'Menunggu Persetujuan Kepala Bidang') {
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-50 text-yellow-800">Menunggu</span>;
    }
    if (status === 'Menunggu Persetujuan Direktur SDM') {
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-800">Disetujui Kepala</span>;
    }
    if (status === 'Disetujui') {
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-800">Disetujui</span>;
    }
    if (status.includes('Ditolak')) {
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-50 text-red-800">Ditolak</span>;
    }
    return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-50 text-gray-700">{status}</span>;
  };

  // compute stats object expected by ReportStats
  const stats = {
    draft: 0,
    menunggu: pendingReports.length || 0,
    disetujui: forwardedReports.length || 0,
    ditolak: rejectedReports.length || 0,
  };

  // determine which reports to display based on active card
  let displayedReports = [];
  if (activeCard === 'menunggu') {
    displayedReports = pendingReports;
  } else if (activeCard === 'disetujui') {
    displayedReports = forwardedReports;
  } else if (activeCard === 'ditolak') {
    displayedReports = rejectedReports;
  }

  // filter by search term
  const filteredReports = displayedReports.filter(r => {
    if (currentUser?.department && r.department !== currentUser.department) return false;
    const search = searchTerm.toLowerCase();
    return (
      r.namaPekerja.toLowerCase().includes(search) ||
      r.nomorIndukPekerja.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    const { status: roleStatus, role } = getRoleStatus(['kepala_bidang']);
    if (roleStatus === 'authorized') {
      setStatus('authorized');
      const token = getDecodedToken();
      if (token) {
        setCurrentUser({
          username: token.username || 'Kepala Bidang',
          email: token.email || '',
          role: token.role || 'kepala_bidang',
          department: token.department || ''
        });
      }
      fetchReports();
      return;
    }
    const redirect = roleStatus === 'unauthorized' ? '/login' : getRoleRoute(role);
    router.replace(redirect);
    setStatus(roleStatus);
  }, [router, fetchReports]);

  if (status !== 'authorized') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        <div className="text-center">
          <p className="font-semibold">Memeriksa kredensial Kepala Bidang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} formatRole={() => 'Kepala Bidang'} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <PageHeader
          title={`Dashboard Kepala Bidang ${currentUser?.department || ''}`}
          subtitle={currentUser?.department || 'Kepala Bidang'}
          description={`Tinjau dan setujui laporan insiden untuk departemen ${currentUser?.department || ''}`}
          showCreate={false}
        />

        <ErrorAlert message={error || approvalError} />

        <div className="space-y-6">
          {/* Three Category Cards */}
          <ReportStats 
            stats={stats} 
            activeCard={activeCard} 
            onCardClick={setActiveCard}
            hideDraftCard={true} 
          />

          {/* Report List and Table for selected category */}
          <ReportList
            filteredReports={filteredReports}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={activeCard}
            setStatusFilter={setActiveCard}
            activeCard={activeCard}
            setActiveCard={setActiveCard}
            onViewReport={(r) => openDetailModal(r)}
            getStatusBadge={getStatusBadge}
            getTimeSince={getTimeSince}
            hideDraftOption={true}
            showDesktopTable={false}
          />

          {/* Desktop table */}
          <ReportTable
            reports={filteredReports}
            onViewReport={(r) => openDetailModal(r)}
            getStatusBadge={getStatusBadge}
            getTimeSince={getTimeSince}
          />
        </div>

        {showDetailModal && selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            onClose={closeDetailModal}
            onApprove={() => approveReport(selectedReport._id)}
            onReject={() => rejectReport(selectedReport._id)}
            approvalLoading={approvalLoading}
            // show actions only when this report is awaiting kepala_bidang approval
            showActions={currentUser?.role === 'kepala_bidang' && selectedReport?.status === 'Menunggu Persetujuan Kepala Bidang'}
          />
        )}
      </div>
    </div>
  );
}
