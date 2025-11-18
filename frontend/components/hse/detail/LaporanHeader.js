import React from "react";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const getStatusInfo = (status) => {
  if (status === "Draft") {
    return {
      icon: <FileText className="w-5 h-5" />,
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: "Draft"
    };
  }
  if (status === "Menunggu Persetujuan Kepala Bidang" || status === "Menunggu Persetujuan Direktur SDM") {
    return {
      icon: <Clock className="w-5 h-5" />,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Menunggu Persetujuan"
    };
  }
  if (status === "Disetujui") {
    return {
      icon: <CheckCircle className="w-5 h-5" />,
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Disetujui"
    };
  }
  if (status === "Ditolak Kepala Bidang" || status === "Ditolak Direktur SDM") {
    return {
      icon: <XCircle className="w-5 h-5" />,
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Ditolak"
    };
  }
  return {
    icon: <FileText className="w-5 h-5" />,
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: status
  };
};

const LaporanHeader = ({ laporan }) => {
  const statusInfo = getStatusInfo(laporan.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">Detail Laporan Kecelakaan</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Dibuat pada {new Date(laporan.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg ${statusInfo.bg} flex-shrink-0`}>
          <span className={statusInfo.text}>{statusInfo.icon}</span>
          <span className={`font-semibold text-sm sm:text-base ${statusInfo.text}`}>{statusInfo.label}</span>
        </div>
      </div>
    </div>
  );
};

export default LaporanHeader;
