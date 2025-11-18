import React from "react";
import { AlertCircle, X } from "lucide-react";

const SubmitConfirmModal = ({
  show,
  onClose,
  onConfirm,
  loading = false,
  reportName,
  title = 'Submit untuk Persetujuan',
  message = 'Apakah Anda yakin ingin submit laporan ini untuk persetujuan?',
  note = 'Setelah di-submit, laporan tidak dapat diedit kembali.',
  confirmLabel = 'Ya, Submit',
  cancelLabel = 'Batal',
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-emerald-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-emerald-600" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 text-center mb-6">
            {message}
            {reportName && (
              <span className="block mt-2 font-medium text-gray-900">
                "{reportName}"
              </span>
            )}
            <span className="block mt-2 text-xs text-gray-500">
              {note}
            </span>
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => onConfirm && onConfirm()}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Memproses...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmModal;