import { Shield } from "lucide-react";

export default function PageHeader({ 
  onCreateReport, 
  title = "Dashboard HSE",
  subtitle = "Kelola dan pantau semua laporan insiden keselamatan kerja di SOLANUM AGROTECH",
  showCreateButton = true 
}) {
  return (
    <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 text-white rounded-xl shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
                <p className="text-emerald-50 text-xs sm:text-sm mt-1">Health, Safety & Environment Management</p>
              </div>
            </div>
            <p className="text-emerald-50 text-sm sm:text-base max-w-2xl">
              {subtitle}
            </p>
          </div>
          {showCreateButton && (
            <button
              onClick={onCreateReport}
              className="bg-white text-emerald-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <span className="text-xl">+</span>
              <span className="whitespace-nowrap">Buat Laporan Baru</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
