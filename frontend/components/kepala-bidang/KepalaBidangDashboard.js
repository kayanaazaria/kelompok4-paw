import ReportStats from './ReportStats';
import ReportTable from './ReportTable';

export default function KepalaBidangDashboard({
  reports,
  loading,
  approvalLoading,
  selectedTab,
  onTabChange,
  onViewDetail,
  onApprove,
  onReject,
  selectedReport,
  showDetailModal,
  onCloseDetail,
  currentUser
}) {
  // Filter reports berdasarkan status
  const pendingReports = reports.filter(r => r.status === 'Menunggu Persetujuan Kepala Bidang');
  const approvedReports = reports.filter(r => r.status === 'Disetujui');
  const rejectedReports = reports.filter(r => r.status.includes('Ditolak'));

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
    <div className="space-y-8">
      <ReportStats reports={reports} />

      {/* Tabs */}
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

      {/* Reports Table */}
      <ReportTable
        reports={displayReports}
        loading={loading}
        approvalLoading={approvalLoading}
        onViewDetail={onViewDetail}
        onApprove={onApprove}
        onReject={onReject}
        selectedTab={selectedTab}
        currentUser={currentUser}
      />

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={onCloseDetail}
          onApprove={() => onApprove(selectedReport._id)}
          onReject={() => onReject(selectedReport._id)}
          approvalLoading={approvalLoading}
          showActions={selectedTab === 'pending'}
        />
      )}
    </div>
  );
}
