'use client';

import { Edit2, Trash2, Calendar } from 'lucide-react';

export default function UserCards({
  filteredUsers,
  formatRole,
  getDisplayRole,
  getRoleBadgeColor,
  openEditModal,
  handleDeleteUser,
  currentUser,
  users
}) {
  // Count total admins
  const adminCount = users?.filter(u => u.role === 'admin').length || 0;
  const isCurrentUserAdmin = currentUser?.role === 'admin';
  
  // Function to get department badge color
  const getDepartmentBadgeColor = (department) => {
    const colors = {
      'Electronical Assembly': 'bg-blue-100 text-blue-700',
      'Mechanical Assembly': 'bg-purple-100 text-purple-700',
      'Quality Assurance': 'bg-orange-100 text-orange-700',
      'Warehouse': 'bg-yellow-100 text-yellow-700',
      'Software Installation': 'bg-pink-100 text-pink-700',
    };
    return colors[department] || 'bg-gray-100 text-gray-700';
  };
  
  return (
    <div className="lg:hidden space-y-4 p-4">
      {filteredUsers.map((user) => (
        <div key={user._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{user.username}</h3>
              <p className="text-xs text-gray-600 break-all">{user.email}</p>
            </div>
            <div className="ml-2 flex-shrink-0 flex flex-col gap-1 items-end">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getRoleBadgeColor(user.role)}`}>
                {formatRole(user.role)}
              </span>
              {/* Department badge for Kepala Bidang */}
              {user.role === 'kepala_bidang' && user.department && (
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getDepartmentBadgeColor(user.department)}`}>
                  {user.department}
                </span>
              )}
            </div>
          </div>
          
          {user.createdAt && (
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <Calendar size={14} />
              <span>
                Dibuat: {new Date(user.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
          
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button
              onClick={() => openEditModal(user)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition text-sm font-medium"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
            {/* Show delete button if:
                - User is NOT admin (can always delete non-admin)
                - OR user IS current user (can delete self) BUT NOT if last admin
            */}
            {(user.role !== 'admin' || 
              (currentUser?.username === user.username && !(isCurrentUserAdmin && adminCount <= 1))) && (
              <button
                onClick={() => handleDeleteUser(user)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium"
              >
                <Trash2 size={16} />
                <span>Hapus</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
