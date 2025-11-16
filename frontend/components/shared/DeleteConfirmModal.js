'use client';

import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hapus Pengguna?
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              Anda yakin ingin menghapus pengguna{' '}
              <span className="font-semibold text-gray-900">{userName}</span>?
            </p>
            <p className="text-sm text-red-600">
              Tindakan ini tidak dapat dibatalkan!
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
