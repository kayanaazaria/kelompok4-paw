# 🚀 QUICK START GUIDE - Dashboard Kepala Bidang & Direktur SDM

## Prerequisites
- Node.js dan npm terinstall
- MongoDB Atlas atau local MongoDB running
- Backend running di `http://localhost:5001`
- Frontend running di `http://localhost:3000`

---

## 1️⃣ Setup Backend

```bash
cd backend
npm install
npm run dev
```

Pastikan server running di port 5001 dan MongoDB connected.

---

## 2️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend akan running di `http://localhost:3000`

---

## 3️⃣ Create Test Accounts

### Test Account: Kepala Bidang
**Username:** kabid_mech  
**Email:** kabid@mechanical.com  
**Password:** password123  
**Role:** kepala_bidang  
**Department:** Mechanical Assembly

**Username:** kabid_elec  
**Email:** kabid@electrical.com  
**Password:** password123  
**Role:** kepala_bidang  
**Department:** Electronical Assembly

### Test Account: Direktur SDM
**Username:** direktur  
**Email:** direktur@solanum.com  
**Password:** password123  
**Role:** direktur_sdm

### Test Account: HSE
**Username:** hse_user  
**Email:** hse@solanum.com  
**Password:** password123  
**Role:** hse

---

## 4️⃣ Test Flow

### Step 1: Create Report (HSE)
1. Login sebagai HSE (`hse_user`)
2. Go to `/dashboard/hse/laporan` atau buat laporan baru
3. Buat laporan kecelakaan dengan:
   - Nama Pegawai: "John Doe"
   - Nomor Induk: "12345"
   - Departemen: "Mechanical Assembly"
   - Tanggal Kejadian: hari ini
   - Detail: "Kejadian saat bekerja"
   - Skala Cedera: "Menengah"
   - Upload file (optional)
4. Klik Submit

### Step 2: Approve Kepala Bidang
1. Logout dari HSE
2. Login sebagai Kepala Bidang Mechanical Assembly (`kabid_mech`)
3. Otomatis redirect ke `/dashboard/kepala-bidang`
4. Lihat laporan yang baru dibuat di tab "Menunggu Persetujuan"
5. Klik "Lihat Detail" untuk melihat detail lengkap
6. Klik "Approve" untuk approve laporan
7. Laporan akan pindah ke history "Disetujui"
8. Email notification terkirim ke HSE + Direktur

### Step 3: Approve Direktur SDM
1. Logout dari Kepala Bidang
2. Login sebagai Direktur SDM (`direktur`)
3. Otomatis redirect ke `/dashboard/direktur-sdm`
4. Lihat laporan di tab "Menunggu Persetujuan" (yang sudah diapprove Kepala Bidang)
5. Klik "Lihat Detail" - akan melihat informasi Kepala Bidang yang approve sebelumnya
6. Klik "Approve" untuk final approval
7. Email notification terkirim ke HSE
8. Laporan final approved

### Step 4: Reject at Kepala Bidang
1. Login sebagai Kepala Bidang lain atau reset laporan
2. Buat laporan baru dari HSE
3. Di Kepala Bidang dashboard, klik "Tolak"
4. Laporan berubah status ke "Ditolak Kepala Bidang"
5. Pindah ke tab "Ditolak"
6. Email notification terkirim ke HSE

---

## 🎯 Key Test Scenarios

### Scenario 1: Complete Approval Chain
HSE Create → Kabid Approve → Direktur Approve → Complete

**Expected Result:**
- Laporan status: Draft → Menunggu Kabid → Menunggu Direktur → Disetujui
- 3 email notifications terkirim (1 untuk Kabid, 2 untuk final)

### Scenario 2: Reject at Kepala Bidang
HSE Create → Kabid Reject → Complete

**Expected Result:**
- Laporan status: Draft → Menunggu Kabid → Ditolak Kabid
- 1 email notification ke HSE
- Tidak ada email ke Direktur

### Scenario 3: Reject at Direktur
HSE Create → Kabid Approve → Direktur Reject → Complete

**Expected Result:**
- Laporan status: Draft → Menunggu Kabid → Menunggu Direktur → Ditolak Direktur
- Email notifications terkirim ke Direktur dan HSE

### Scenario 4: Department Filter
Login as Kabid Mechanical → Hanya lihat laporan Mechanical Assembly

**Expected Result:**
- Dashboard hanya menampilkan laporan dari Mechanical Assembly
- Tidak ada laporan dari departemen lain

### Scenario 5: Authorization Check
Login as HSE → Try akses `/dashboard/kepala-bidang`

**Expected Result:**
- Redirect ke `/dashboard/hse` karena tidak punya akses
- Security check berfungsi

---

## 🔍 Testing Checklist

### Dashboard Kepala Bidang

#### Basic Functionality
- [ ] Login berhasil sebagai Kepala Bidang
- [ ] Dashboard memuat laporan dengan benar
- [ ] Statistik menampilkan jumlah yang benar
- [ ] Tab berfungsi (Menunggu, Disetujui, Ditolak)

#### Approval Features
- [ ] Tombol "Lihat Detail" membuka modal
- [ ] Modal menampilkan informasi lengkap
- [ ] Tombol "Approve" berhasil mengubah status
- [ ] Tombol "Tolak" berhasil mengubah status
- [ ] Loading state muncul saat proses
- [ ] Laporan hilang dari "Menunggu" setelah di-approve/tolak

#### Email Notifications
- [ ] Email terkirim saat approve (check inbox HSE + Direktur)
- [ ] Email terkirim saat tolak (check inbox HSE)
- [ ] Email berisi informasi laporan yang benar

#### Department Filter
- [ ] Hanya laporan dari departemen Kepala Bidang yang muncul
- [ ] Login sebagai Kabid lain, lihat laporan berbeda
- [ ] Switch tab tidak mengubah department filter

#### UI/UX
- [ ] Responsive di mobile (swipe tabel, stack cards)
- [ ] Responsive di tablet (2 col stats, normal table)
- [ ] Responsive di desktop (4 col stats, full table)
- [ ] Color coding status berfungsi
- [ ] Badge counter akurat

### Dashboard Direktur SDM

#### Basic Functionality
- [ ] Login berhasil sebagai Direktur SDM
- [ ] Dashboard memuat laporan dengan benar
- [ ] Statistik menampilkan jumlah yang benar
- [ ] Laporan dari SEMUA departemen tampil

#### Approval Features
- [ ] Modal menampilkan nama Kepala Bidang yang approve sebelumnya
- [ ] Tombol "Approve" hanya muncul di tab "Menunggu Persetujuan"
- [ ] Tombol "Tolak" hanya muncul di tab "Menunggu Persetujuan"
- [ ] Approve mengubah status ke "Disetujui"
- [ ] Tolak mengubah status ke "Ditolak Direktur SDM"

#### History
- [ ] Tab "Disetujui" menampilkan approved laporan
- [ ] Tab "Ditolak" menampilkan rejected laporan
- [ ] Tidak ada tombol action di history tabs

#### Email Notifications
- [ ] Email terkirim ke HSE saat approve
- [ ] Email terkirim ke HSE saat tolak

---

## 🐛 Troubleshooting

### Dashboard tidak muncul setelah login
**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Close browser dan re-login
3. Check if token expired (valid 7 hari)
4. Check browser console untuk error

### Laporan tidak tampil di Kepala Bidang dashboard
**Solution:**
1. Verify laporan sudah di-submit oleh HSE (status: "Menunggu Persetujuan Kepala Bidang")
2. Verify departemen laporan = departemen Kepala Bidang
3. Check backend logs: `GET /api/laporan/kepala-bidang/my-reports`
4. Check network tab di DevTools untuk error response

### Email tidak terkirim
**Solution:**
1. Check backend logs untuk email sending errors
2. Verify SMTP credentials di .env file
3. Check email spam folder
4. Check if email service (Gmail) allow less secure apps
5. Verify nodemailer configuration

### Approve/Tolak button tidak bekerja
**Solution:**
1. Check network tab di DevTools
2. Check if response status is 200 OK
3. Check backend logs untuk error
4. Verify authorization header (Bearer token)
5. Check if token still valid

### Permission denied error
**Solution:**
1. Logout dan login kembali
2. Verify role di database (admin → user → edit role)
3. Clear session: `sessionStorage.clear()`
4. Check JWT token payload (decode di jwt.io)

---

## 📊 Expected Behavior Summary

| Action | Expected Result | Email |
|--------|-----------------|-------|
| HSE create & submit laporan | Status: "Menunggu Kabid" | Kabid notified |
| Kabid approve | Status: "Menunggu Direktur" | HSE & Direktur notified |
| Kabid tolak | Status: "Ditolak Kabid" | HSE notified |
| Direktur approve | Status: "Disetujui" | HSE notified |
| Direktur tolak | Status: "Ditolak Direktur" | HSE notified |

---

## 🔐 Security Notes

- JWT token valid 7 hari
- Token automatically added to all API requests
- Department filter di backend (tidak bisa bypass dari frontend)
- Role-based authorization di middleware
- Password hashed dengan bcrypt
- Sensitive endpoints protected dengan roleCheck

---

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Chrome
- ✅ Mobile Safari

---

## 💡 Tips

1. **Multiple tabs testing:** Open 2 browsers with different roles untuk test concurrent approvals
2. **Network throttling:** Test dengan slow network (DevTools Network → Slow 3G)
3. **Mobile testing:** Use DevTools responsive mode atau actual mobile device
4. **Email testing:** Use temp email service seperti mailtrap.io untuk testing
5. **Database testing:** Use MongoDB Compass untuk inspect data

---

## 📝 Notes

- Dashboard automatically refresh setelah approve/tolak
- Tidak perlu manual refresh
- Token auto-include di setiap request
- Responsive design berfungsi di semua ukuran layar
- Error messages jelas dan membantu debugging

---

**Happy Testing! 🎉**

Jika ada masalah, refer ke DASHBOARD_DOCUMENTATION.md untuk info lebih detail.
