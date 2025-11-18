'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, LogOut, Key } from 'lucide-react';
import { clearSession, getCurrentUser } from '@/utils/auth';
import ChangePasswordModal from './ChangePasswordModal';
import api from '@/services/api';

const formatRole = (role) => {
  const roleMap = {
    admin: 'Admin',
    hse: 'HSE',
    kepala_bidang: 'Kepala Bidang',
    direktur_sdm: 'Direktur SDM'
  };
  return roleMap[role] || role;
};

export default function Navbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const handleChangePassword = async (formData) => {
    try {
      const response = await api.post('/api/users/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      // Success akan ditampilkan di modal
      setShowDropdown(false);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengubah password');
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/logo_dashboard.png"
                alt="Solanum Agrotech"
                width={180}
                height={50}
                className="h-10 lg:h-12 w-auto"
                priority
              />
            </div>

            {/* User Info and Dropdown */}
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs lg:text-sm text-gray-600">Role:</p>
                <p className="text-sm lg:text-base font-semibold text-gray-900">
                  {formatRole(currentUser?.role || 'admin')}
                </p>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-base lg:text-lg">
                    {(currentUser?.username || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">{currentUser?.username || 'Admin'}</p>
                  </div>
                  <ChevronDown size={18} className={`text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 lg:w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Email:</p>
                        <p className="text-sm text-gray-700 mb-3 break-all">{currentUser?.email || '-'}</p>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Username:</p>
                        <p className="text-sm text-gray-700">{currentUser?.username || 'Admin'}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowChangePasswordModal(true);
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <Key size={18} />
                        <span className="font-medium">Ganti Password</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-100 transition cursor-pointer"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={handleChangePassword}
      />
    </>
  );
}
