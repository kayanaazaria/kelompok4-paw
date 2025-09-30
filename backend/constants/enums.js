// Enum untuk role user
exports.USER_ROLES = {
    ADMIN: 'admin',
    HSE: 'hse',
    KEPALA_BIDANG: 'kepala_bidang',
    DIREKTUR_SDM: 'direktur_sdm'
};

// Enum untuk status laporan
exports.LAPORAN_STATUS = {
    DRAFT: 'Draft',
    MENUNGGU_KABID: 'Menunggu Persetujuan Kepala Bidang',
    MENUNGGU_DIREKTUR: 'Menunggu Persetujuan Direktur SDM',
    DISETUJUI: 'Disetujui',
    DITOLAK_KABID: 'Ditolak Kepala Bidang',
    DITOLAK_DIREKTUR: 'Ditolak Direktur SDM'
};

// Enum untuk skala cedera
exports.SKALA_CEDERA = {
    RINGAN: 'Ringan',
    MENENGAH: 'Menengah',
    BERAT: 'Berat'
};

// Enum untuk status approval
exports.APPROVAL_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

// Daftar department
exports.DEPARTMENTS = [
    'Mechanical Assembly',
    'Electronical Assembly',
    'Software Installation',
    'Quality Assurance',
    'Warehouse'
];