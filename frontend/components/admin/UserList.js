'use client';

import { Users } from 'lucide-react';
import UserTable from './UserTable';
import UserCards from './UserCards';

export default function UserList({
  loading,
  filteredUsers,
  searchQuery,
  formatRole,
  getDisplayRole,
  getRoleBadgeColor,
  openEditModal,
  handleDeleteUser,
  currentUser,
  users
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">Memuat data pengguna...</div>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Daftar Pengguna</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Total {users.length} pengguna terdaftar dalam sistem
              </p>
            </div>
          </div>
        </div>
        <div className="p-8 text-center text-gray-500">
          {searchQuery ? 'Tidak ada pengguna yang sesuai' : 'Tidak ada pengguna'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Daftar Pengguna</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Total {users.length} pengguna terdaftar dalam sistem
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <UserCards
        filteredUsers={filteredUsers}
        formatRole={formatRole}
        getDisplayRole={getDisplayRole}
        getRoleBadgeColor={getRoleBadgeColor}
        openEditModal={openEditModal}
        handleDeleteUser={handleDeleteUser}
        currentUser={currentUser}
        users={users}
      />

      {/* Desktop Table View */}
      <UserTable
        filteredUsers={filteredUsers}
        formatRole={formatRole}
        getDisplayRole={getDisplayRole}
        getRoleBadgeColor={getRoleBadgeColor}
        openEditModal={openEditModal}
        handleDeleteUser={handleDeleteUser}
        currentUser={currentUser}
        users={users}
      />
    </div>
  );
}
