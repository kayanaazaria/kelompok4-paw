"use client";

import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

export default function RejectModal({
  show,
  onClose,
  onConfirm,
  title = 'Tolak Laporan',
  placeholder = 'Masukkan alasan penolakan...',
  confirmLabel = 'Tolak',
  cancelLabel = 'Batal',
  initialReason = '',
  loading = false,
}) {
  const [reason, setReason] = useState(initialReason);

  useEffect(() => {
    if (show) setReason(initialReason || '');
  }, [show, initialReason]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-4">Silakan berikan alasan penolakan laporan ini:</p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[120px]"
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              setReason('');
              onClose();
            }}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm(reason);
            }}
            disabled={loading || !reason.trim()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
