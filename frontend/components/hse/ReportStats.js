import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export default function ReportStats({ stats = {}, activeCard, onCardClick, hideDraftCard = false }) {
  const s = {
    draft: stats?.draft ?? 0,
    menunggu: stats?.menunggu ?? 0,
    disetujui: stats?.disetujui ?? 0,
    ditolak: stats?.ditolak ?? 0,
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {!hideDraftCard && (
        <button
          onClick={() => onCardClick("draft")}
          className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border transition-all hover:shadow-md ${
            activeCard === "draft" ? "border-gray-400 ring-2 ring-gray-400" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 text-left">
              <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Draft</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s.draft}</p>
              <p className="text-gray-500 text-xs mt-1">{s.draft === 0 ? "Tidak ada" : `${s.draft} laporan`}</p>
            </div>
            <div className="p-2 sm:p-3 bg-gray-100 rounded-full flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
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
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s.menunggu}</p>
            <p className="text-gray-500 text-xs mt-1">{s.menunggu} laporan</p>
          </div>
          <div className="p-2 sm:p-3 bg-yellow-100 rounded-full flex-shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
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
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s.disetujui}</p>
            <p className="text-gray-500 text-xs mt-1">{s.disetujui} laporan</p>
          </div>
          <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
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
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s.ditolak}</p>
            <p className="text-gray-500 text-xs mt-1">{s.ditolak} laporan</p>
          </div>
          <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
        </div>
      </button>
    </div>
  );
}

