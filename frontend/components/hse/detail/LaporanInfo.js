import React from "react";
import { Calendar, User, Building2, AlertCircle, FileText } from "lucide-react";

const getSkalaBadge = (skala) => {
  if (skala === "Ringan") return "bg-green-100 text-green-700";
  if (skala === "Menengah") return "bg-yellow-100 text-yellow-700";
  if (skala === "Berat") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

const LaporanInfo = ({ laporan }) => {
  return (
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Informasi Laporan</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Tanggal Kejadian</p>
            <p className="font-semibold text-gray-900">
              {new Date(laporan.tanggalKejadian).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <User className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Nama Pegawai</p>
            <p className="font-semibold text-gray-900">{laporan.namaPekerja}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Nomor Induk Pegawai</p>
            <p className="font-semibold text-gray-900">{laporan.nomorIndukPekerja}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Building2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Departemen</p>
            <p className="font-semibold text-gray-900">{laporan.department}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:col-span-2">
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Skala Cedera</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSkalaBadge(laporan.skalaCedera)}`}>
              {laporan.skalaCedera}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanInfo;
