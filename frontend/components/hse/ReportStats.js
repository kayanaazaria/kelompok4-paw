import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export default function ReportStats({ stats, activeCard, onCardClick, hideDraft = false }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${hideDraft ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-3 sm:gap-4`}>
      {!hideDraft && (
        <button
          onClick={() => onCardClick("draft")}
          className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border transition-all hover:shadow-md ${
            activeCard === "draft" ? "border-gray-400 ring-2 ring-gray-400" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 text-left">
              <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Draft</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.draft}</p>
              <p className="text-gray-500 text-xs mt-1">{stats.draft === 0 ? "Tidak ada" : `${stats.draft} laporan`}</p>
            </div>
            <div className="p-2 sm:p-3 bg-gray-100 rounded-full flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            </div>
          </div>
        </button>
      )}

      <button
        onClick={() => onCardClick("menunggu")}
        className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border transition-all hover:shadow-md ${
          activeCard === "menunggu" ? "border-yellow-400 ring-2 ring-yellow-400" : "border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 text-left">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Menunggu Persetujuan</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.menunggu}</p>
            <p className="text-gray-500 text-xs mt-1">{stats.menunggu} laporan</p>
          </div>
          <div className="p-2 sm:p-3 bg-yellow-100 rounded-full flex-shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-800" />
          </div>
        </div>
      </button>

      <button
        onClick={() => onCardClick("disetujui")}
        className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border transition-all hover:shadow-md ${
          activeCard === "disetujui" ? "border-green-400 ring-2 ring-green-400" : "border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 text-left">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Disetujui</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.disetujui}</p>
            <p className="text-gray-500 text-xs mt-1">{stats.disetujui} laporan</p>
          </div>
          <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-800" />
          </div>
        </div>
      </button>

      <button
        onClick={() => onCardClick("ditolak")}
        className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border transition-all hover:shadow-md ${
          activeCard === "ditolak" ? "border-red-400 ring-2 ring-red-400" : "border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 text-left">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Ditolak</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.ditolak}</p>
            <p className="text-gray-500 text-xs mt-1">{stats.ditolak} laporan</p>
          </div>
          <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-800" />
          </div>
        </div>
      </button>
    </div>
  );
}

