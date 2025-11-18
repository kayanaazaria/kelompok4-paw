"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, ErrorAlert } from "@/components/shared";
import { ArrowLeft, Calendar, User, Building2, AlertCircle, FileText, Paperclip, Save } from "lucide-react";
import api from "@/services/api";

const DEPARTMENTS = [
  "Electronical Assembly",
  "Mechanical Assembly",
  "Software Installation",
  "Quality Assurance",
  "Warehouse"
];

const SKALA_CEDERA = ["Ringan", "Menengah", "Berat"];

export default function BuatLaporan() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    tanggalKejadian: "",
    namaPekerja: "",
    nomorIndukPekerja: "",
    department: "",
    skalaCedera: "",
    detailKejadian: "",
    attachment: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for nomorIndukPegawai - only allow numbers and max 18 digits
    if (name === 'nomorIndukPekerja') {
      const numbersOnly = value.replace(/\D/g, ''); // Remove non-numeric characters
      const limited = numbersOnly.slice(0, 18); // Limit to 18 digits
      setFormData(prev => ({ ...prev, [name]: limited }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, attachment: "Ukuran file maksimal 5MB" }));
        return;
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors(prev => ({ ...prev, attachment: "Format file harus PDF, JPG, atau PNG" }));
        return;
      }
      setFormData(prev => ({ ...prev, attachment: file }));
      setFileName(file.name);
      setFormErrors(prev => ({ ...prev, attachment: "" }));
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, attachment: null }));
    setFileName("");
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.tanggalKejadian) errors.tanggalKejadian = "Tanggal kejadian wajib diisi";
    if (!formData.namaPekerja) errors.namaPekerja = "Nama pegawai wajib diisi";
    if (!formData.nomorIndukPekerja) {
      errors.nomorIndukPekerja = "NIP wajib diisi";
    } else if (formData.nomorIndukPekerja.length !== 18) {
      errors.nomorIndukPekerja = "NIP harus 18 digit angka";
    }
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
      setLoading(true);
      setError(null);

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

      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await api.post(`/api/laporan`, formDataToSend, config);
      router.push("/dashboard/hse");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat laporan");
      console.error("Error creating report:", err);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-emerald-100 rounded-lg flex-shrink-0">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Buat Laporan Kecelakaan Baru</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Lengkapi formulir di bawah untuk membuat laporan</p>
            </div>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Form Section */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Informasi Laporan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Tanggal Kejadian */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Tanggal Kejadian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggalKejadian"
                    value={formData.tanggalKejadian}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      formErrors.tanggalKejadian ? 'border-red-300 bg-red-50' : 'bg-gray-50 border-emerald-600'
                    }`}
                  />
                  {formErrors.tanggalKejadian && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.tanggalKejadian}</p>
                  )}
                </div>

                {/* Nama Pegawai */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Nama Pegawai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaPekerja"
                    value={formData.namaPekerja}
                    onChange={handleChange}
                    placeholder="Masukkan nama pegawai"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      formErrors.namaPekerja ? 'border-red-300 bg-red-50' : 'bg-gray-50 border-emerald-600'
                    }`}
                  />
                  {formErrors.namaPekerja && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.namaPekerja}</p>
                  )}
                </div>

                {/* Nomor Induk Pegawai */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    Nomor Induk Pegawai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="nomorIndukPekerja"
                    value={formData.nomorIndukPekerja}
                    onChange={handleChange}
                    maxLength={18}
                    placeholder="Masukkan NIP (18 digit angka)"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      formErrors.nomorIndukPekerja ? 'border-red-300 bg-red-50' : 'bg-gray-50 border-emerald-600'
                    }`}
                  />
                  {formErrors.nomorIndukPekerja && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.nomorIndukPekerja}</p>
                  )}
                </div>

                {/* Departemen */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    Departemen <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      formErrors.department ? 'border-red-300 bg-red-50' : 'bg-gray-50 border-emerald-600'
                    }`}
                  >
                    <option value="">Pilih Departemen</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
                  )}
                </div>

                {/* Skala Cedera */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                    Skala Cedera <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="skalaCedera"
                    value={formData.skalaCedera}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      formErrors.skalaCedera ? 'border-red-300 bg-red-50' : 'bg-gray-50 border-emerald-600'
                    }`}
                  >
                    <option value="">Pilih Skala Cedera</option>
                    {SKALA_CEDERA.map((skala) => (
                      <option key={skala} value={skala}>
                        {skala}
                      </option>
                    ))}
                  </select>
                  {formErrors.skalaCedera && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.skalaCedera}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Detail Kejadian */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Detail Kejadian</h2>
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Deskripsi Kejadian <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="detailKejadian"
                  value={formData.detailKejadian}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tuliskan detail lengkap mengenai kejadian kecelakaan..."
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none ${
                    formErrors.detailKejadian ? 'border-red-300 bg-red-50' : 'bg-gray-50 border-emerald-600'
                  }`}
                />
                {formErrors.detailKejadian && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.detailKejadian}</p>
                )}
              </div>
            </div>

            {/* Lampiran */}
            <div className="p-4 sm:p-6 bg-gray-50">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Lampiran (Opsional)</h2>
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  Upload File
                </label>
                <div className="mt-2">
                  {fileName ? (
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-emerald-700 truncate">{fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 hover:bg-emerald-100 rounded-full transition-colors flex-shrink-0 ml-2"
                        title="Hapus file"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-4 pb-5">
                        <Paperclip className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" />
                        <p className="mb-2 text-xs sm:text-sm text-gray-500">
                          <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG (Max. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {formErrors.attachment && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600">{formErrors.attachment}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/hse")}
              className="flex-1 px-4 sm:px-6 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>Batal</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 sm:px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Simpan Laporan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
