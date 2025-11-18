"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDecodedToken, getRoleRoute, getRoleStatus } from '@/utils/auth';
import { Navbar, SearchBar, ErrorAlert, DeleteConfirmModal } from '@/components/shared';
import { UserModal, UserList, PageHeader } from '@/components/admin';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useRoleHelpers } from '@/hooks/useRoleHelpers';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    users,
    loading,
    error,
    editingUser,
    showModal,
    showDeleteModal,
    userToDelete,
    formData,
    formErrors,
    setFormData,
    fetchUsers,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDeleteUser,
    openDeleteModal,
    closeDeleteModal
  } = useUserManagement();

  const { formatRole, getDisplayRole, getRoleBadgeColor } = useRoleHelpers();

  useEffect(() => {
    const { status: roleStatus, role } = getRoleStatus(['admin']);
    if (roleStatus === 'authorized') {
      setStatus('authorized');
      const token = getDecodedToken();
      if (token) {
        setCurrentUser({
          username: token.username || 'Admin',
          email: token.email || '',
          role: token.role || 'admin'
        });
      }
      fetchUsers();
      return;
    }
    const redirect = roleStatus === 'unauthorized' ? '/login' : getRoleRoute(role);
    router.replace(redirect);
    setStatus(roleStatus);
  }, [router, fetchUsers]);

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (user.username?.toLowerCase().includes(query) || '') ||
      (user.email?.toLowerCase().includes(query) || '') ||
      (user.role?.toLowerCase().includes(query) || '')
    );
  });

  if (status !== 'authorized') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        <div className="text-center">
          <p className="font-semibold">Memeriksa kredensial admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} formatRole={formatRole} />
      
      <PageHeader onAddUser={openCreateModal} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ErrorAlert message={error} />

        <div className="mb-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <UserList
          loading={loading}
          filteredUsers={filteredUsers}
          searchQuery={searchQuery}
          formatRole={formatRole}
          getDisplayRole={getDisplayRole}
          getRoleBadgeColor={getRoleBadgeColor}
          openEditModal={openEditModal}
          handleDeleteUser={openDeleteModal}
          currentUser={currentUser}
          users={users}
        />
      </div>

      {/* Modal Dialog */}
      <UserModal
        showModal={showModal}
        closeModal={closeModal}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        isEditMode={!!editingUser}
        handleSubmit={handleSubmit}
        formatRole={formatRole}
        getDisplayRole={getDisplayRole}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteUser(userToDelete._id || userToDelete.id)}
        userName={userToDelete?.username || userToDelete?.email || ''}
      />
    </div>
  );
}