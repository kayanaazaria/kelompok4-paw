# Dokumentasi Dashboard Kepala Bidang dan Direktur SDM

## Ringkasan Fitur

Sistem ini menyediakan dashboard terpisah untuk masing-masing Kepala Bidang dan satu dashboard untuk Direktur SDM. Setiap dashboard memungkinkan pengguna untuk:

1. **Melihat laporan** yang sesuai dengan role mereka
2. **Approve atau menolak laporan** dengan notifikasi email otomatis
3. **Melihat detail laporan lengkap** dengan informasi pegawai, kejadian, dan lampiran
4. **Filter berdasarkan status** (Menunggu Persetujuan, Disetujui, Ditolak)
5. **Statistik laporan** dalam bentuk kartu ringkasan

---

## Struktur Departemen

Sistem mendukung 5 departemen sebagai berikut:
- Mechanical Assembly
- Electronical Assembly
- Software Installation
- Quality Assurance
- Warehouse

Setiap Kepala Bidang hanya dapat melihat laporan dari departemennya masing-masing.

---

## Frontend Architecture

### Halaman Dashboard

#### 1. Kepala Bidang Dashboard (`/dashboard/kepala-bidang`)
**Path:** `frontend/app/dashboard/kepala-bidang/page.js`

- Menampilkan laporan dari departemen yang ditetapkan pada akun Kepala Bidang
- Filter otomatis berdasarkan status laporan
- Tombol Approve/Tolak hanya muncul pada tab "Menunggu Persetujuan"

#### 2. Direktur SDM Dashboard (`/dashboard/direktur-sdm`)
**Path:** `frontend/app/dashboard/direktur-sdm/page.js`

- Menampilkan semua laporan yang sedang menunggu persetujuan Direktur
- Juga menampilkan history laporan yang sudah diapprove atau ditolak
- Tombol Approve/Tolak hanya muncul pada tab "Menunggu Persetujuan"

### Komponen Frontend

#### Kepala Bidang Components (`frontend/components/kepala-bidang/`)

1. **KepalaBidangDashboard.js**
   - Komponen utama yang mengelola layout dashboard
   - Menangani tab switching (Pending, Approved, Rejected)
   - Integrasi dengan modal detail laporan

2. **ReportStats.js**
   - Menampilkan statistik laporan dalam 4 kartu
   - Total Laporan, Menunggu Persetujuan, Disetujui, Ditolak

3. **ReportTable.js**
   - Tabel yang menampilkan daftar laporan
   - Kolom: Nama Pegawai, Tanggal, Skala Cedera, Status, Aksi
   - Tombol Approve/Tolak dengan loading state
   - Responsif dan mobile-friendly

4. **ReportDetailModal.js**
   - Modal untuk melihat detail laporan lengkap
   - Menampilkan: Informasi Pegawai, Kejadian, Lampiran, Status
   - Tombol Approve/Tolak dengan konfirmasi
   - Dapat ditutup dengan tombol X atau Batal

5. **ReportCard.js**
   - Kartu laporan individual (alternatif view untuk mobile)
   - Quick preview dengan button "Lihat Detail"

6. **PageHeader.js**
   - Header dashboard dengan judul dan deskripsi

### Hooks

#### `useKepalaBidangManagement.js`
Mengelola state dan logika untuk dashboard Kepala Bidang:

```javascript
const {
  reports,              // Array laporan dari departemen
  loading,              // State loading data
  error,               // State error message
  selectedReport,      // Laporan yang dipilih untuk detail
  showDetailModal,     // State tampil/sembunyikan modal
  approvalError,       // Error saat approve/reject
  approvalLoading,     // State loading saat approve/reject
  fetchReports,        // Function fetch data
  openDetailModal,     // Function buka detail modal
  closeDetailModal,    // Function tutup detail modal
  approveReport,       // Function approve laporan
  rejectReport         // Function tolak laporan
} = useKepalaBidangManagement();
```

#### `useDirekturManagement.js`
Mengelola state dan logika untuk dashboard Direktur SDM (struktur sama dengan hook kepala bidang)

### Services

#### `services/api.js`
Axios instance dengan interceptor untuk menambahkan JWT token:

```javascript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token otomatis ditambahkan di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Backend Architecture

### Routes

#### Laporan Routes (`backend/routes/laporan.js`)

**Endpoint untuk Kepala Bidang:**
```
GET    /api/laporan/kepala-bidang/my-reports
       - Ambil laporan dari departemen Kepala Bidang
       - Auth: kepala_bidang role
       - Response: Array laporan dengan department filter

PUT    /api/laporan/:id/approve-kepala
       - Approve laporan oleh Kepala Bidang
       - Auth: kepala_bidang role
       - Body: (empty)
       - Update status: "Menunggu Persetujuan Direktur SDM"
       - Send email notification

PUT    /api/laporan/:id/reject-kepala
       - Tolak laporan oleh Kepala Bidang
       - Auth: kepala_bidang role
       - Body: (empty)
       - Update status: "Ditolak Kepala Bidang"
       - Send email notification
```

**Endpoint untuk Direktur SDM:**
```
GET    /api/laporan/direktur/my-reports
       - Ambil laporan yang menunggu persetujuan Direktur
       - Auth: direktur_sdm role
       - Response: Array laporan dengan status filter

GET    /api/laporan/direktur/all-reports
       - Ambil semua laporan (pending, approved, rejected)
       - Auth: direktur_sdm role
       - Response: Array laporan

PUT    /api/laporan/:id/approve-direktur
       - Approve laporan oleh Direktur SDM
       - Auth: direktur_sdm role
       - Body: (empty)
       - Update status: "Disetujui"
       - Send email notification

PUT    /api/laporan/:id/reject-direktur
       - Tolak laporan oleh Direktur SDM
       - Auth: direktur_sdm role
       - Body: (empty)
       - Update status: "Ditolak Direktur SDM"
       - Send email notification
```

### Controllers

#### Laporan Controller (`backend/controllers/laporanController.js`)

Fungsi yang sudah ada dan digunakan:
- `approveByKepalaBidang` - Approve laporan, update status, kirim email
- `rejectByKepalaBidang` - Tolak laporan, update status, kirim email
- `approveByDirektur` - Approve laporan, update status, kirim email
- `rejectByDirektur` - Tolak laporan, update status, kirim email

### Models

#### Laporan Model (`backend/models/LaporanKecelakaan.js`)

Fields yang relevan:
```javascript
{
  tanggalKejadian: Date,
  namaPekerja: String,
  nomorIndukPekerja: String,
  detailKejadian: String,
  skalaCedera: enum ['Ringan', 'Menengah', 'Berat'],
  department: enum [5 departments],
  status: enum [
    'Draft',
    'Menunggu Persetujuan Kepala Bidang',
    'Menunggu Persetujuan Direktur SDM',
    'Disetujui',
    'Ditolak Kepala Bidang',
    'Ditolak Direktur SDM'
  ],
  createdByHSE: ObjectId,
  signedByKabid: ObjectId,
  approvedByDirektur: ObjectId,
  attachmentUrl: String
}
```

#### User Model (`backend/models/userModel.js`)

Fields untuk Kepala Bidang:
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: 'kepala_bidang',
  department: enum [5 departments]
}
```

---

## Flow Approval Laporan

```
HSE membuat laporan (Draft)
          ↓
HSE submit laporan
          ↓
Status: "Menunggu Persetujuan Kepala Bidang"
Email notifikasi ke Kepala Bidang
          ↓
┌─────────────────────────────────────────┐
│  Kepala Bidang membuka dashboard        │
│  Lihat laporan dari departemennya       │
│  Bisa Approve atau Tolak                │
└─────────────────────────────────────────┘
          ↓
    ┌─────┴─────┐
    ↓           ↓
  APPROVE     TOLAK
    │           │
    ↓           ↓
Status:       Status:
"Menunggu     "Ditolak
Persetujuan   Kepala
Direktur"     Bidang"
    │           │
    ↓           ↓
Notif Email   Notif Email
ke HSE &      ke HSE
Direktur      (selesai)
    │
    ↓
┌─────────────────────────────────────────┐
│  Direktur SDM membuka dashboard         │
│  Lihat laporan menunggu persetujuan     │
│  Bisa Approve atau Tolak                │
└─────────────────────────────────────────┘
    │
    ├─────┴─────┐
    ↓           ↓
  APPROVE     TOLAK
    │           │
    ↓           ↓
Status:       Status:
"Disetujui"   "Ditolak
              Direktur
              SDM"
    │           │
    ↓           ↓
Notif Email   Notif Email
ke HSE        ke HSE
(selesai)     (selesai)
```

---

## Authentication & Authorization

### JWT Token Payload untuk Kepala Bidang
```javascript
{
  id: ObjectId,
  role: 'kepala_bidang',
  username: String,
  email: String,
  department: String  // <-- Penting untuk filter
}
```

### Middleware Authorization
```javascript
// Hanya Kepala Bidang yang bisa akses
router.put("/:id/approve-kepala", authMiddleware, roleCheck("kepala_bidang"), approveByKepalaBidang);

// Hanya Direktur SDM yang bisa akses
router.put("/:id/approve-direktur", authMiddleware, roleCheck("direktur_sdm"), approveByDirektur);
```

---

## Email Notifications

### Laporan Disetujui Kepala Bidang
**To:** HSE (pembuat) + Direktur SDM
**Subject:** Laporan Disetujui Kepala Bidang
**Body:** Notifikasi bahwa laporan sudah disetujui Kepala Bidang, menunggu persetujuan Direktur

### Laporan Ditolak Kepala Bidang
**To:** HSE (pembuat)
**Subject:** Laporan Ditolak Kepala Bidang
**Body:** Notifikasi bahwa laporan ditolak, dapat direvisi dan diajukan kembali

### Laporan Disetujui Direktur SDM
**To:** HSE (pembuat)
**Subject:** Laporan Disetujui Direktur SDM
**Body:** Notifikasi bahwa laporan sudah final disetujui

### Laporan Ditolak Direktur SDM
**To:** HSE (pembuat)
**Subject:** Laporan Ditolak Direktur SDM
**Body:** Notifikasi bahwa laporan ditolak, dapat direvisi dan diajukan kembali

---

## UI/UX Features

### Dashboard Features
1. **Responsive Design** - Mobile, tablet, desktop
2. **Loading States** - Spinner saat fetch data dan approve/reject
3. **Error Handling** - Alert error message di bagian atas
4. **Tab Navigation** - Cepat switch antar status
5. **Color-coded Status** - 
   - Yellow: Menunggu Persetujuan
   - Green: Disetujui
   - Red: Ditolak
6. **Badge Counter** - Jumlah laporan per status di tab
7. **Modal Detail** - Full informasi dalam modal yang scrollable
8. **Quick Actions** - Button Approve/Tolak tersedia di tabel

### Accessibility
- Semantic HTML (button, table, modal)
- Keyboard navigation support
- High contrast colors
- Clear visual hierarchy

---

## Testing Checklist

### Kepala Bidang
- [ ] Login sebagai Kepala Bidang (department: Mechanical Assembly)
- [ ] Dashboard menampilkan laporan dari Mechanical Assembly only
- [ ] Tab menampilkan count yang benar
- [ ] Klik "Lihat Detail" membuka modal
- [ ] Modal menampilkan informasi lengkap
- [ ] Klik "Approve" mengubah status, modal tertutup, email terkirim
- [ ] Klik "Tolak" mengubah status, modal tertutup, email terkirim
- [ ] Filter tab "Disetujui" hanya menampilkan laporan yang disetujui
- [ ] Filter tab "Ditolak" hanya menampilkan laporan yang ditolak

### Direktur SDM
- [ ] Login sebagai Direktur SDM
- [ ] Dashboard menampilkan semua laporan menunggu persetujuan
- [ ] Tab menampilkan count yang benar
- [ ] Klik "Lihat Detail" membuka modal dengan info lengkap termasuk nama Kepala Bidang yang approve sebelumnya
- [ ] Klik "Approve" mengubah status ke "Disetujui", email terkirim
- [ ] Klik "Tolak" mengubah status ke "Ditolak Direktur SDM", email terkirim
- [ ] Filter tab "Disetujui" menampilkan history approved
- [ ] Filter tab "Ditolak" menampilkan history rejected

### Edge Cases
- [ ] Test dengan laporan yang memiliki attachment
- [ ] Test dengan laporan tanpa attachment
- [ ] Test approval notification email diterima dengan benar
- [ ] Test permission - Kepala Bidang tidak bisa approve laporan department lain
- [ ] Test permission - HSE tidak bisa akses dashboard kepala bidang
- [ ] Test token expired - logout dan re-login
- [ ] Test concurrent approvals - multiple users approve simultaneously

---

## Development Notes

### Files Created/Modified
**Frontend:**
- ✅ `frontend/app/dashboard/kepala-bidang/page.js` (NEW)
- ✅ `frontend/app/dashboard/direktur-sdm/page.js` (NEW)
- ✅ `frontend/components/kepala-bidang/` (NEW folder)
  - KepalaBidangDashboard.js
  - ReportStats.js
  - ReportTable.js
  - ReportDetailModal.js
  - ReportCard.js
  - PageHeader.js
  - index.js (exports)
- ✅ `frontend/hooks/useKepalaBidangManagement.js` (NEW)
- ✅ `frontend/hooks/useDirekturManagement.js` (NEW)
- ✅ `frontend/services/api.js` (NEW - axios instance)

**Backend:**
- ✅ `backend/routes/laporan.js` (MODIFIED - added new endpoints)

### Future Enhancements
1. Add print/export PDF functionality for approved reports
2. Add comments/notes system for approve/reject reason
3. Add activity log for each report
4. Add bulk approval for multiple reports
5. Add assignment of reports to specific Kepala Bidang
6. Add performance metrics/dashboard for statistics
7. Add reminder notifications for pending approvals
8. Add audit trail with timestamps and user actions

---

## Troubleshooting

### Dashboard not loading
- Check if user token is valid and not expired
- Verify role is correctly set in database
- Check browser console for error messages
- Verify API endpoints are accessible

### Approve/Reject button not working
- Check network request in DevTools
- Verify authorization header is sent with token
- Check backend logs for error messages
- Ensure report status is "Menunggu Persetujuan..." before clicking button

### Email notifications not sent
- Check email service configuration in .env
- Verify SMTP credentials are correct
- Check backend logs for email sending errors
- Check email spam folder

### Department filter not working
- Verify JWT token contains department field
- Check if user's department in database matches enum
- Verify endpoint `/laporan/kepala-bidang/my-reports` is returning filtered data

---

## References

- [Express.js Documentation](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB/Mongoose Documentation](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/)
