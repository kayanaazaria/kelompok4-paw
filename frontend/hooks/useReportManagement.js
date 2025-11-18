import { useState, useEffect } from "react";
import api from "@/services/api";

const useReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [formData, setFormData] = useState({
    tanggalKejadian: "",
    namaPekerja: "",
    nomorIndukPekerja: "",
    department: "",
    skalaCedera: "",
    detailKejadian: "",
    attachment: null,
    attachmentUrl: "",
    status: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [submittingReportId, setSubmittingReportId] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/laporan');
      // Sort reports by updatedAt in descending order (newest first)
      const sortedReports = response.data.sort((a, b) => 
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      );
      setReports(sortedReports);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil laporan");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resetForm = () => {
    setFormData({
      tanggalKejadian: "",
      namaPekerja: "",
      nomorIndukPekerja: "",
      department: "",
      skalaCedera: "",
      detailKejadian: "",
      attachment: null,
      attachmentUrl: "",
      status: ""
    });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setEditingReport(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const openEditModal = (report) => {
    setFormData({
      tanggalKejadian: report.tanggalKejadian?.split("T")[0] || "",
      namaPekerja: report.namaPekerja || "",
      nomorIndukPekerja: report.nomorIndukPekerja || "",
      department: report.department || "",
      skalaCedera: report.skalaCedera || "",
      detailKejadian: report.detailKejadian || "",
      attachment: null,
      attachmentUrl: report.attachmentUrl || "",
      status: report.status || ""
    });
    setEditingReport(report);
    setIsViewMode(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReport(null);
    setIsViewMode(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.tanggalKejadian) errors.tanggalKejadian = "Tanggal kejadian wajib diisi";
    if (!formData.namaPekerja) errors.namaPekerja = "Nama pegawai wajib diisi";
    if (!formData.nomorIndukPekerja) errors.nomorIndukPekerja = "NIP wajib diisi";
    if (!formData.department) errors.department = "Departemen wajib diisi";
    if (!formData.skalaCedera) errors.skalaCedera = "Skala cedera wajib diisi";
    if (!formData.detailKejadian) errors.detailKejadian = "Detail kejadian wajib diisi";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("tanggalKejadian", formData.tanggalKejadian);
      formDataToSend.append("namaPekerja", formData.namaPekerja);
      formDataToSend.append("nomorIndukPekerja", formData.nomorIndukPekerja);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("skalaCedera", formData.skalaCedera);
      formDataToSend.append("detailKejadian", formData.detailKejadian);
      if (formData.attachment) {
        formDataToSend.append("attachment", formData.attachment);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingReport) {
        await api.put(`/api/laporan/${editingReport._id}`, formDataToSend, config);
      } else {
        await api.post('/api/laporan', formDataToSend, config);
      }

      await fetchReports();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan laporan");
      console.error("Error saving report:", err);
    }
  };

  const handleSubmitReport = async (report) => {
    if (!window.confirm(`Submit laporan "${report.namaPekerja}" untuk persetujuan?`)) return;

    try {
      setSubmittingReportId(report._id);
      await api.put(`/api/laporan/${report._id}/submit`);
      await fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal submit laporan");
      console.error("Error submitting report:", err);
    } finally {
      setSubmittingReportId(null);
    }
  };

  const openDeleteModal = (report) => {
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setReportToDelete(null);
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      await api.delete(`/api/laporan/${reportToDelete._id}`);
      await fetchReports();
      closeDeleteModal();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus laporan");
      console.error("Error deleting report:", err);
    }
  };

  return {
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
    fetchReports,
    openCreateModal,
    openEditModal,
    closeModal,
    handleInputChange,
    handleSubmit,
    handleSubmitReport,
    submittingReportId,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteReport,
  };
};

export default useReportManagement;
