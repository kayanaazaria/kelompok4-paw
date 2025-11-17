'use client';

import { UserPlus } from 'lucide-react';

export default function PageHeader({ onAddUser }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Kelola akun pengguna dan atur role untuk sistem</p>
          </div>
          <button
            onClick={onAddUser}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition w-full sm:w-auto"
          >
            <UserPlus size={20} />
            <span className="sm:inline">Tambah Pengguna</span>
          </button>
        </div>
      </div>
    </div>
  );
}
