import React from "react";
import { Calendar, User, Hash, Building2, Activity, FileText, Edit2, Trash2, Send } from "lucide-react";

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Draft":
      return "bg-gray-100 text-gray-800";
    case "Menunggu Persetujuan Kepala Bidang":
      return "bg-yellow-100 text-yellow-800";
    case "Menunggu Persetujuan Direktur SDM":
      return "bg-yellow-100 text-yellow-800";
    case "Disetujui":
      return "bg-green-100 text-green-800";
    case "Ditolak Kepala Bidang":
    case "Ditolak Direktur SDM":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSkalaBadgeColor = (skala) => {
  switch (skala) {
    case "Ringan":
      return "bg-green-100 text-green-800";
    case "Menengah":
      return "bg-yellow-100 text-yellow-800";
    case "Berat":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ReportCards = ({ reports, onEdit, onDelete, onView, onSubmit, submittingReportId }) => {
  return (
    <div className="lg:hidden space-y-4 p-4">
      {reports.map((report) => (
        <div key={report._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          {/* Header with Date and Status */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{new Date(report.tanggalKejadian).toLocaleDateString("id-ID")}</span>
            </div>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(report.status)}`}>
              {report.status}
            </span>
          </div>

          {/* Worker Info */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-900">{report.namaPekerja}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">{report.nomorLaporan}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">{report.department}</span>
            </div>
          </div>

          {/* Skala Cedera */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-gray-400" />
              <span className="text-xs text-gray-500">Skala Cedera</span>
            </div>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getSkalaBadgeColor(report.skalaCedera)}`}>
              {report.skalaCedera}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button
              onClick={() => onView(report)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
            >
              <FileText size={16} />
              <span>Detail</span>
            </button>
            {report.status === "Draft" && (
              <>
                <button
                  onClick={() => onEdit(report)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onSubmit(report)}
                  disabled={submittingReportId === report._id}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium disabled:opacity-60"
                >
                  <Send size={16} />
                  <span>{submittingReportId === report._id ? 'Memproses...' : 'Submit'}</span>
                </button>
                <button
                  onClick={() => onDelete(report)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportCards;
