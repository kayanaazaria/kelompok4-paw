"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDecodedToken, getRoleRoute, getRoleStatus } from '@/utils/auth';
import { Navbar, ErrorAlert } from '@/components/shared';
import { useDirekturManagement } from '@/hooks/useDirekturManagement';

export default function DirekturSDMDashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('pending');

  const {
    reports,
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
  } = useDirekturManagement();

  useEffect(() => {
    const { status: roleStatus, role } = getRoleStatus(['direktur_sdm']);
    if (roleStatus === 'authorized') {
      setStatus('authorized');
      const token = getDecodedToken();
      if (token) {
        setCurrentUser({
          username: token.username || 'Direktur SDM',
          email: token.email || '',
          role: token.role || 'direktur_sdm'
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
          <p className="font-semibold">Memeriksa kredensial Direktur SDM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} formatRole={() => 'Direktur SDM'} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Direktur SDM</h1>
          <p className="mt-2 text-gray-600">Mengelola persetujuan laporan kecelakaan</p>
        </div>

        <ErrorAlert message={error || approvalError} />

        {/* Stats */}
        <ReportStats reports={reports} />

        {/* Tabs & Table */}
        <div className="mt-8 space-y-6">
          <TabsAndTable
            reports={reports}
            loading={loading}
            approvalLoading={approvalLoading}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            onViewDetail={openDetailModal}
            onApprove={approveReport}
            onReject={rejectReport}
          />
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedReport && (
          <DetailModal
            report={selectedReport}
            onClose={closeDetailModal}
            onApprove={() => approveReport(selectedReport._id)}
            onReject={() => rejectReport(selectedReport._id)}
            approvalLoading={approvalLoading}
            showActions={selectedTab === 'pending'}
          />
        )}
      </div>
    </div>
  );
}

// Stats Component
function ReportStats({ reports }) {
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'Menunggu Persetujuan Direktur SDM').length;
  const approvedReports = reports.filter(r => r.status === 'Disetujui').length;
  const rejectedReports = reports.filter(r => r.status === 'Ditolak Direktur SDM').length;

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

// Tabs and Table Component
function TabsAndTable({
  reports,
  loading,
  approvalLoading,
  selectedTab,
  onTabChange,
  onViewDetail,
  onApprove,
  onReject
}) {
  const pendingReports = reports.filter(r => r.status === 'Menunggu Persetujuan Direktur SDM');
  const approvedReports = reports.filter(r => r.status === 'Disetujui');
  const rejectedReports = reports.filter(r => r.status === 'Ditolak Direktur SDM');

  const tabs = [
    { id: 'pending', label: 'Menunggu Persetujuan', count: pendingReports.length },
    { id: 'approved', label: 'Disetujui', count: approvedReports.length },
    { id: 'rejected', label: 'Ditolak', count: rejectedReports.length }
  ];

  const displayReports = 
    selectedTab === 'pending' ? pendingReports :
    selectedTab === 'approved' ? approvedReports :
    rejectedReports;

  return (
    <>
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-y-px bg-blue-600 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <ReportTableDirektur
        reports={displayReports}
        loading={loading}
        approvalLoading={approvalLoading}
        onViewDetail={onViewDetail}
        onApprove={onApprove}
        onReject={onReject}
        selectedTab={selectedTab}
      />
    </>
  );
}

// Report Table for Direktur
function ReportTableDirektur({
  reports,
  loading,
  approvalLoading,
  onViewDetail,
  onApprove,
  onReject,
  selectedTab
}) {
  const getStatusBadgeColor = (status) => {
    if (status === 'Menunggu Persetujuan Direktur SDM') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Disetujui') return 'bg-green-100 text-green-800';
    if (status === 'Ditolak Direktur SDM') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getSkalaCederaColor = (skala) => {
    if (skala === 'Ringan') return 'bg-yellow-100 text-yellow-800';
    if (skala === 'Menengah') return 'bg-orange-100 text-orange-800';
    if (skala === 'Berat') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Memuat laporan...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Tidak ada laporan untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Pegawai
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Departemen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tanggal Kejadian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Skala Cedera
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.namaPekerja}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {report.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(report.tanggalKejadian).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSkalaCederaColor(report.skalaCedera)}`}>
                    {report.skalaCedera}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => onViewDetail(report)}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    Lihat Detail
                  </button>
                  
                  {selectedTab === 'pending' && (
                    <>
                      <button
                        onClick={() => onApprove(report._id)}
                        disabled={approvalLoading}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {approvalLoading ? 'Memproses...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => onReject(report._id)}
                        disabled={approvalLoading}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {approvalLoading ? 'Memproses...' : 'Tolak'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Detail Modal
function DetailModal({
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
                <p className="text-sm text-gray-600">Nama Pegawai</p>
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

          {/* Status & Approval Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Persetujuan</h3>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Status Saat Ini</p>
                <p className="text-lg font-medium text-gray-900">{report.status}</p>
              </div>
              {report.signedByKabid && (
                <div>
                  <p className="text-sm text-gray-600">Disetujui oleh Kepala Bidang</p>
                  <p className="text-lg font-medium text-gray-900">
                    {report.signedByKabid.username}
                  </p>
                </div>
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
