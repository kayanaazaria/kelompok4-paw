'use client';

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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 text-center text-gray-500">Memuat data pengguna...</div>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          {searchQuery ? 'Tidak ada pengguna yang sesuai' : 'Tidak ada pengguna'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
