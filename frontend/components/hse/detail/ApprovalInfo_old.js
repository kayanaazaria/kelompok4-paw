import React from "react";
import { User, Clock, CheckCircle, XCircle, FileText } from "lucide-react";

const getStatusInfo = (status) => {
  if (status === "Draft") {
    return { icon: <FileText className="w-5 h-5" />, bg: "bg-gray-100", text: "text-gray-700" };
  }
  if (status === "Menunggu Persetujuan Kepala Bidang" || status === "Menunggu Persetujuan Direktur SDM") {
    return { icon: <Clock className="w-5 h-5" />, bg: "bg-yellow-100", text: "text-yellow-700" };
  }
  if (status === "Disetujui") {
    return { icon: <CheckCircle className="w-5 h-5" />, bg: "bg-green-100", text: "text-green-700" };
  }
  if (status === "Ditolak Kepala Bidang" || status === "Ditolak Direktur SDM") {
    return { icon: <XCircle className="w-5 h-5" />, bg: "bg-red-100", text: "text-red-700" };
  }
  return { icon: <FileText className="w-5 h-5" />, bg: "bg-gray-100", text: "text-gray-700" };
};

const ApprovalInfo = ({ laporan }) => {
  const statusInfo = getStatusInfo(laporan.status);

  return (
    <div className="p-4 sm:p-6 bg-gray-50">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Informasi Persetujuan</h2>
      
      <div className="space-y-3 sm:space-y-4">
        {/* Created By HSE */}
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dibuat oleh HSE</p>
            <p className="font-semibold text-gray-900">
              {laporan.createdByHSE?.username || "-"}
            </p>
            {laporan.createdByHSE?.email && (
              <p className="text-sm text-gray-600">{laporan.createdByHSE.email}</p>
            )}
          </div>
          <div className="px-3 py-1 bg-blue-50 rounded-full">
            <span className="text-xs font-medium text-blue-700">HSE</span>
          </div>
        </div>

        {/* Kepala Bidang */}
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${
          laporan.signedByKabid 
            ? "bg-white border-green-200" 
            : laporan.status === "Ditolak Kepala Bidang"
            ? "bg-white border-red-200"
            : "bg-gray-50 border-gray-200"
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            laporan.signedByKabid 
              ? "bg-green-100" 
              : laporan.status === "Ditolak Kepala Bidang"
              ? "bg-red-100"
              : "bg-gray-100"
          }`}>
            {laporan.signedByKabid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : laporan.status === "Ditolak Kepala Bidang" ? (
              <XCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Kepala Bidang</p>
            <p className={`font-semibold ${
              laporan.signedByKabid 
                ? "text-gray-900" 
                : laporan.status === "Ditolak Kepala Bidang"
                ? "text-red-700"
                : "text-gray-400"
            }`}>
              {laporan.signedByKabid?.username || 
               (laporan.status === "Ditolak Kepala Bidang" ? "Ditolak" : "Menunggu Persetujuan")}
            </p>
            {laporan.signedByKabid?.email && (
              <p className="text-sm text-gray-600">{laporan.signedByKabid.email}</p>
            )}
            {laporan.signedByKabid?.department && (
              <p className="text-sm text-gray-500">Dept. {laporan.signedByKabid.department}</p>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full ${
            laporan.signedByKabid 
              ? "bg-green-50" 
              : laporan.status === "Ditolak Kepala Bidang"
              ? "bg-red-50"
              : "bg-gray-100"
          }`}>
            <span className={`text-xs font-medium ${
              laporan.signedByKabid 
                ? "text-green-700" 
                : laporan.status === "Ditolak Kepala Bidang"
                ? "text-red-700"
                : "text-gray-600"
            }`}>
              {laporan.signedByKabid 
                ? "Disetujui" 
                : laporan.status === "Ditolak Kepala Bidang"
                ? "Ditolak"
                : "Pending"}
            </span>
          </div>
        </div>

        {/* Direktur SDM */}
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${
          laporan.approvedByDirektur 
            ? "bg-white border-green-200" 
            : laporan.status === "Ditolak Direktur SDM"
            ? "bg-white border-red-200"
            : "bg-gray-50 border-gray-200"
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            laporan.approvedByDirektur 
              ? "bg-green-100" 
              : laporan.status === "Ditolak Direktur SDM"
              ? "bg-red-100"
              : "bg-gray-100"
          }`}>
            {laporan.approvedByDirektur ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : laporan.status === "Ditolak Direktur SDM" ? (
              <XCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Direktur SDM</p>
            <p className={`font-semibold ${
              laporan.approvedByDirektur 
                ? "text-gray-900" 
                : laporan.status === "Ditolak Direktur SDM"
                ? "text-red-700"
                : "text-gray-400"
            }`}>
              {laporan.approvedByDirektur?.username || 
               (laporan.status === "Ditolak Direktur SDM" ? "Ditolak" : "Menunggu Persetujuan")}
            </p>
            {laporan.approvedByDirektur?.email && (
              <p className="text-sm text-gray-600">{laporan.approvedByDirektur.email}</p>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full ${
            laporan.approvedByDirektur 
              ? "bg-green-50" 
              : laporan.status === "Ditolak Direktur SDM"
              ? "bg-red-50"
              : "bg-gray-100"
          }`}>
            <span className={`text-xs font-medium ${
              laporan.approvedByDirektur 
                ? "text-green-700" 
                : laporan.status === "Ditolak Direktur SDM"
                ? "text-red-700"
                : "text-gray-600"
            }`}>
              {laporan.approvedByDirektur 
                ? "Disetujui" 
                : laporan.status === "Ditolak Direktur SDM"
                ? "Ditolak"
                : "Pending"}
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Timeline Status</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Draft dibuat</span> - {new Date(laporan.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>
            {laporan.status !== "Draft" && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Laporan disubmit</span>
                </p>
              </div>
            )}
            {(laporan.signedByKabid || laporan.status === "Ditolak Kepala Bidang") && (
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  laporan.status === "Ditolak Kepala Bidang" ? "bg-red-500" : "bg-green-500"
                }`}></div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">
                    {laporan.status === "Ditolak Kepala Bidang" ? "Ditolak" : "Disetujui"} oleh Kepala Bidang
                  </span>
                </p>
              </div>
            )}
            {(laporan.approvedByDirektur || laporan.status === "Ditolak Direktur SDM") && (
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  laporan.status === "Ditolak Direktur SDM" ? "bg-red-500" : "bg-green-500"
                }`}></div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">
                    {laporan.status === "Ditolak Direktur SDM" ? "Ditolak" : "Disetujui"} oleh Direktur SDM
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Current Status */}
        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusInfo.bg}`}>
              <span className={statusInfo.text}>{statusInfo.icon}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status Saat Ini</p>
              <p className={`font-bold text-lg ${statusInfo.text}`}>
                {laporan.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalInfo;
