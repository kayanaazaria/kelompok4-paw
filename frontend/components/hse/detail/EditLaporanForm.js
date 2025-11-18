import React from "react";
import { Paperclip, X } from "lucide-react";

const DEPARTMENTS = [
  "Electronical Assembly",
  "Mechanical Assembly",
  "Software Installation",
  "Quality Assurance",
  "Warehouse"
];

const EditLaporanForm = ({ 
  formData, 
  fileName, 
  formErrors, 
  onChange, 
  onFileChange, 
  onRemoveFile, 
  onSave, 
  onCancel 
}) => {
  return (
    <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Edit Laporan</h2>
      
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Kejadian
            </label>
            <input
              type="date"
              name="tanggalKejadian"
              value={formData.tanggalKejadian}
              onChange={onChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 bg-gray-50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Pegawai
            </label>
            <input
              type="text"
              name="namaPekerja"
              value={formData.namaPekerja}
              onChange={onChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Induk Pegawai
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="nomorIndukPekerja"
              value={formData.nomorIndukPekerja}
              onChange={onChange}
              maxLength={18}
              placeholder="18 digit angka"
              className="w-full px-4 py-2.5 bg-gray-50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departemen
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={onChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
            >
              <option value="">Pilih Departemen</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skala Cedera
            </label>
            <select
              name="skalaCedera"
              value={formData.skalaCedera}
              onChange={onChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
            >
              <option value="">Pilih Skala Cedera</option>
              <option value="Ringan">Ringan</option>
              <option value="Menengah">Menengah</option>
              <option value="Berat">Berat</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detail Kejadian
          </label>
          <textarea
            name="detailKejadian"
            value={formData.detailKejadian}
            onChange={onChange}
            rows={6}
            className="w-full px-4 py-2.5 bg-gray-50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File Baru (Opsional)
          </label>
          {fileName ? (
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Paperclip className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">{fileName}</span>
              </div>
              <button
                type="button"
                onClick={onRemoveFile}
                className="p-1 hover:bg-emerald-100 rounded-full transition-colors"
                title="Hapus file"
              >
                <X className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Paperclip className="w-8 h-8 text-gray-400 mb-2" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG (Max. 5MB)</p>
              </div>
              <input
                type="file"
                onChange={onFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
            </label>
          )}
          {formErrors.attachment && (
            <p className="mt-2 text-sm text-red-600">{formErrors.attachment}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 sm:px-6 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLaporanForm;
