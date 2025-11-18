"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/services/api";
import { Navbar, ErrorAlert, SubmitConfirmModal, DeleteConfirmModal } from "@/components/shared";
import { 
  LaporanHeader, 
  LaporanInfo, 
  DetailKejadian, 
  LampiranSection, 
  ApprovalInfo, 
  ActionButtons, 
  EditLaporanForm 
} from "@/components/hse/detail";
import { ArrowLeft } from "lucide-react";

export default function DetailLaporan() {
  const router = useRouter();
  const params = useParams();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [fileName, setFileName] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/laporan/${params.id}`);
        setLaporan(response.data);
        setEditFormData({
          tanggalKejadian: response.data.tanggalKejadian?.split("T")[0] || "",
          namaPekerja: response.data.namaPekerja || "",
          nomorIndukPekerja: response.data.nomorIndukPekerja || "",
          department: response.data.department || "",
          skalaCedera: response.data.skalaCedera || "",
          detailKejadian: response.data.detailKejadian || "",
          attachment: null
        });
      } catch (err) {
        setError(err.response?.data?.message || "Gagal mengambil detail laporan");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLaporan();
    }
  }, [params.id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for nomorIndukPekerja - only allow numbers and max 18 digits
    if (name === 'nomorIndukPekerja') {
      const numbersOnly = value.replace(/\D/g, ''); // Remove non-numeric characters
      const limited = numbersOnly.slice(0, 18); // Limit to 18 digits
      setEditFormData(prev => ({ ...prev, [name]: limited }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, attachment: "Ukuran file maksimal 5MB" }));
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors(prev => ({ ...prev, attachment: "Format file harus PDF, JPG, atau PNG" }));
        return;
      }
      setEditFormData(prev => ({ ...prev, attachment: file }));
      setFileName(file.name);
      setFormErrors(prev => ({ ...prev, attachment: "" }));
    }
  };

  const handleRemoveFile = () => {
    setEditFormData(prev => ({ ...prev, attachment: null }));
    setFileName("");
  };

  const handleSaveEdit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("tanggalKejadian", editFormData.tanggalKejadian);
      formDataToSend.append("namaPekerja", editFormData.namaPekerja);
      formDataToSend.append("nomorIndukPekerja", editFormData.nomorIndukPekerja);
      formDataToSend.append("department", editFormData.department);
      formDataToSend.append("skalaCedera", editFormData.skalaCedera);
      formDataToSend.append("detailKejadian", editFormData.detailKejadian);
      if (editFormData.attachment) {
        formDataToSend.append("attachment", editFormData.attachment);
      }

      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await api.put(`/api/laporan/${params.id}`, formDataToSend, config);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengupdate laporan");
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      setActionLoading(true);
      const token = sessionStorage.getItem("token");
      await api.put(
        `/api/laporan/${laporan._id}/submit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/dashboard/hse");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal submit laporan");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReport = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await api.delete(
        `/api/laporan/${laporan._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/dashboard/hse");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus laporan");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFileName("");
    setEditFormData({
      tanggalKejadian: laporan.tanggalKejadian?.split("T")[0] || "",
      namaPekerja: laporan.namaPekerja || "",
      nomorIndukPekerja: laporan.nomorIndukPekerja || "",
      department: laporan.department || "",
      skalaCedera: laporan.skalaCedera || "",
      detailKejadian: laporan.detailKejadian || "",
      attachment: null
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !laporan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error || "Laporan tidak ditemukan"} />
          <button
            onClick={() => router.push("/dashboard/hse")}
            className="mt-4 text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/dashboard/hse")}
            className="mb-4 sm:mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>

          {/* Header Component */}
          <LaporanHeader laporan={laporan} />

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <LaporanInfo laporan={laporan} />
            <DetailKejadian detailKejadian={laporan.detailKejadian} />
            <LampiranSection lampiran={laporan.lampiran || laporan.attachmentUrl} />
            <ApprovalInfo laporan={laporan} />
          </div>

          {/* Action Buttons */}
          <ActionButtons 
            laporan={laporan}
            onEdit={() => setIsEditing(true)}
            onSubmit={() => setShowSubmitModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />

          {/* Submit Confirmation Modal */}
          <SubmitConfirmModal
            show={showSubmitModal}
            onClose={() => setShowSubmitModal(false)}
            onConfirm={handleSubmitForApproval}
            loading={actionLoading}
            reportName={laporan.namaPekerja}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            show={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteReport}
            itemName={laporan.namaPekerja}
            title="Hapus Laporan Draft"
          />
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/hse")}
          className="mb-4 sm:mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Kembali ke Dashboard</span>
        </button>

        {/* Header Component */}
        <LaporanHeader laporan={laporan} />

        {/* Edit Form Component */}
        <EditLaporanForm
          formData={editFormData}
          fileName={fileName}
          formErrors={formErrors}
          onChange={handleEditChange}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      </div>
    </div>
  );
}