import { useState, useCallback } from 'react';
import API from '@/services/api';

export function useDirekturManagement() {
  const [reports, setReports] = useState([]);
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
      const response = await API.get('/laporan/direktur/all-reports');
      setReports(response.data);
    } catch (err) {
      setError('Gagal mengambil laporan');
      console.error(err);
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
      await API.put(`/laporan/${reportId}/approve-direktur`);
      setReports(prev => 
        prev.map(r => 
          r._id === reportId 
            ? { ...r, status: 'Disetujui' }
            : r
        )
      );
      closeDetailModal();
      await fetchReports();
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
      await API.put(`/laporan/${reportId}/reject-direktur`);
      setReports(prev => 
        prev.map(r => 
          r._id === reportId 
            ? { ...r, status: 'Ditolak Direktur SDM' }
            : r
        )
      );
      closeDetailModal();
      await fetchReports();
    } catch (err) {
      setApprovalError('Gagal tolak laporan');
      console.error(err);
    } finally {
      setApprovalLoading(false);
    }
  }, [fetchReports]);

  return {
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
  };
}
