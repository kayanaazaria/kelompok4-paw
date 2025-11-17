# Proyek Pengembangan Aplikasi Web
Digitalisasi Sistem Laporan Kecelakaan Solanum Agrotech (US1)

---

## Kelompok 4

1. Sharon Nakisha Hezharu Putri (23/512030/TK/56285)
2. Ega Baskara Nugroho (23/521518/TK/57532)
3. Nicholas Shane Pangihutan Siahaan (23/520590/TK/57399)
4. Gabriele Ghea De Palma (23/512218/TK/56306)
5. Kayana Anindya Azaria (23/521475/TK/57528)

## Deskripsi Aplikasi
Aplikasi ini dikembangkan untuk mendigitalisasi proses pelaporan kecelakaan kerja di Solanum Agrotech. Dengan sistem ini, seluruh proses mulai dari pembuatan laporan oleh HSE, approval oleh Kepala Bidang, hingga persetujuan akhir Direktur SDM dapat dilakukan secara terintegrasi, aman, dan terdokumentasi dengan baik. Aplikasi web ini dibuat untuk menghindari kehilangan dokumen karena tercecer atau terbuang.
## Fitur utama meliputi:
- Registrasi & Login Multi-Role (Admin, HSE, Kepala Bidang, Direktur SDM).
- Pembuatan & Pengajuan Laporan Kecelakaan oleh HSE.
- Tracking status laporan (Draft, Menunggu Approval, Selesai).
- **Dashboard Kepala Bidang**: Melihat laporan dari departemen masing-masing, approve/tolak laporan, dan lihat detail laporan.
- **Dashboard Direktur SDM**: Melihat semua laporan yang menunggu persetujuan, approve/tolak laporan, dan lihat history laporan.
- Approval & Penolakan laporan oleh Kepala Bidang dan Direktur SDM.
- Notifikasi Email Otomatis untuk setiap tahap persetujuan.
- History dokumen & QR Code untuk verifikasi laporan final.
- Keamanan sistem dengan password hashing & JWT Authentication.
- Manajemen data terintegrasi dengan MongoDB.

## Struktur Folder dan File

```
kelompok4-paw/
├─ README.md
├─ .gitignore
├─ .env
└─ backend/
	├─ config/
	│  ├─ dbConnection.js       
	│  └─ passport.js           
	├─ constants/
    │  └─ enums.js
    ├─ controllers/
    │  ├─ approvalController.js
	│  ├─ authController.js
    │  ├─ finalDocumentController.js
	│  ├─ laporanController.js  
	│  ├─ notificationController.js
	│  └─ userController.js
	├─ middleware/
	│  ├─ auth.js
    │  ├─ constants.js               
	│  └─ errorHandler.js
	├─ models/
    │  ├─ approvalModel.js
    │  ├─ BlacklistedToken.js
    │  ├─ LaporanKecelakaan.js
	│  ├─ notificationModel.js   
	│  └─ userModel.js
	├─ node_modules/
	├─ routes/
    │  ├─ approvalRoutes.js
	│  ├─ authRoutes.js
    │  ├─ finalDocumentRoutes.js
    │  ├─ laporan.js
    │  ├─ notificationRoutes.js
    │  ├─ testEmail.js
	│  ├─ testRoutes.js            
	│  └─ userRoutes.js         
	├─ services/
	│  └─ finalDocument.service.js
    ├─ uploads/   
	├─ utils/
    │  ├─ emailService.js
    │  ├─ errorUtils.js
	│  ├─ jwtBlacklist.js       
	│  └─ sendEmail.js               
	├─ package-lock.json
    ├─ package.json         
	└─ server.js            
└─ frontend/
	├─ app/
	│  ├─ globals.css
	│  ├─ layout.js
	│  ├─ page.js
	│  ├─ auth/
	│  │  └─ google/callback/
	│  ├─ dashboard/
	│  │  ├─ admin/page.js
	│  │  ├─ approval-flow/page.js
	│  │  ├─ hse/page.js
	│  │  ├─ kepala-bidang/page.js (NEW)
	│  │  └─ direktur-sdm/page.js (NEW)
	│  ├─ hse/
	│  │  ├─ final-documents/page.js
	│  │  └─ laporan/
	│  ├─ login/page.js
	│  └─ verify/[id]/page.js
	├─ components/
	│  ├─ admin/
	│  ├─ auth/
	│  ├─ hse/
	│  ├─ kepala-bidang/ (NEW)
	│  │  ├─ KepalaBidangDashboard.js
	│  │  ├─ ReportStats.js
	│  │  ├─ ReportTable.js
	│  │  ├─ ReportDetailModal.js
	│  │  ├─ ReportCard.js
	│  │  └─ PageHeader.js
	│  └─ shared/
	├─ hooks/
	│  ├─ useKepalaBidangManagement.js (NEW)
	│  ├─ useDirekturManagement.js (NEW)
	│  ├─ useReportManagement.js
	│  └─ useUserManagement.js
	├─ public/
	├─ services/
	│  ├─ api.js (UPDATED)
	│  ├─ authService.js
	│  ├─ documentService.js
	│  └─ userService.js
	├─ utils/
	│  └─ auth.js
	├─ jsconfig.json
	├─ next.config.js
	├─ package.json
	├─ postcss.config.js
	└─ tailwind.config.js
```


## Teknologi yang Digunakan Selama Pengembangan
- Code Editor: VS Code
- Backend Framework: Express.js
- Database: MongoDB Atlas
- ODM: Mongoose
- Authentication: JWT (JSON Web Token)
- Password Security: bcrypt.js
- Email Notification: Nodemailer (SMTP Gmail)
- File Upload: Multer (untuk upload attachment laporan)
- Version Control: Git + GitHub
- Testing API: Postman
- Auth & Session (Login via Google OAuth2): passport-google-oauth20
- PDF Generator: PDFKit
- QR Code: qrcode
- Environment: dotenv

## URL Google Drive Laporan
Link dokumentasi & laporan akhir dapat diakses di:

https://drive.google.com/drive/folders/1Jd9orTNhqVqH9QuLWimp3WsCcNGWvOC0?usp=sharing


## 👥 Pembagian Kontribusi Anggota

| Nama    | Fitur                                                                                                    |
|---------|-----------------------------------------------------------------------------------------------------------------|
| **Ega** | **Role Admin**: fitur assign role, atur registrasi akun <br> **Role Kepala Bidang & Direktur SDM**: registrasi + login <br> **Role HSE**: registrasi + login <br> **Tambahan**: pengamanan API sensitif dengan authorization (akses berdasarkan role) |
| **Gaby** | **Role Kepala Bidang & Direktur SDM**: notifikasi email untuk approval, daftar pengajuan (lihat detail, approve/tolak), dashboard dengan statistik laporan, filter by status <br> **Role HSE**: tracking status (draft, menunggu approval, selesai) <br> **Tambahan**: password hashing untuk menyimpan password di database, API endpoint kepala-bidang/my-reports dan direktur/all-reports |
| **Kayana** | **Role Kepala Bidang & Direktur SDM**: history dokumen yang sudah diapprove, filter & search <br> **Role HSE**: history dokumen yang sudah diapprove, filter & search <br> **Tambahan**: integrasi database MongoDB |
| **Nicho** | **Role HSE**: form input laporan kecelakaan (tanggal, bagian, nama, NIP, detail kejadian, skala cedera), fitur upload attachment <br> **Tambahan**: API CRUD untuk laporan |
| **Sharon** | **Role Kepala Bidang & Direktur SDM**: generate history alur penandatanganan & QR code (link ke dokumen final) <br> **Role HSE**: lihat & export final document <br> **Tambahan**: fitur login via Google (OAuth2) |
