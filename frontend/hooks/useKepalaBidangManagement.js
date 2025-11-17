import { useState, useCallback } from 'react';
import API from '@/services/api';

export function useKepalaBidangManagement() {
  const [reports, setReports] = useState([]); // pending reports
  const [approvedReports, setApprovedReports] = useState([]); // approved/rejected reports
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [approvalError, setApprovalError] = useState(null);
  const [approvalLoading, setApprovalLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        API.get('/laporan/kepala-bidang/my-reports'),
        API.get('/laporan/kepala-bidang/approved-reports')
      ]);
      setReports(pendingRes.data);
      setApprovedReports(approvedRes.data);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Gagal mengambil laporan';
      setError(msg);
      console.error('Fetch kepala-bidang reports error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const openDetailModal = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedReport(null);
    setShowDetailModal(false);
  };

  const approveReport = useCallback(async (reportId) => {
    setApprovalLoading(true);
    setApprovalError(null);
    try {
      const response = await API.put(`/laporan/${reportId}/approve-kepala`);
      const updated = response?.data?.laporan || response?.data || null;
      if (updated) {
        // remove from pending and add to approved
        setReports(prev => prev.filter(r => r._id !== reportId));
        setApprovedReports(prev => [updated, ...prev]);
        // keep modal open but update selected report to reflect approval
        setSelectedReport(updated);
      }
      // refresh lists in background
      fetchReports();
    } catch (err) {
      setApprovalError('Gagal approve laporan');
      console.error(err);
    } finally {
      setApprovalLoading(false);
    }
  }, [fetchReports]);

  const rejectReport = useCallback(async (reportId) => {
    setApprovalLoading(true);
    setApprovalError(null);
    try {
      const response = await API.put(`/laporan/${reportId}/reject-kepala`);
      const updated = response?.data?.laporan || response?.data || null;
      if (updated) {
        // remove from pending and add to approved
        setReports(prev => prev.filter(r => r._id !== reportId));
        setApprovedReports(prev => [updated, ...prev]);
        setSelectedReport(updated);
      }
      fetchReports();
    } catch (err) {
      setApprovalError('Gagal tolak laporan');
      console.error(err);
    } finally {
      setApprovalLoading(false);
    }
  }, [fetchReports]);

  return {
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
  };
}
