export function useRoleHelpers() {
  const formatRole = (role) => {
    const roleMap = {
      'admin': 'Admin',
      'hse': 'HSE',
      'kepala_bidang': 'Kepala Bidang',
      'direktur_sdm': 'Direktur SDM'
    };
    return roleMap[role] || role;
  };

  const getDisplayRole = (user) => {
    if (user.role === 'kepala_bidang' && user.department) {
      return `Kepala Bidang - ${user.department}`;
    }
    return formatRole(user.role);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'direktur_sdm':
        return 'bg-red-100 text-red-800';
      case 'kepala_bidang':
        return 'bg-green-100 text-green-800';
      case 'hse':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    formatRole,
    getDisplayRole,
    getRoleBadgeColor
  };
}
