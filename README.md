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
Fitur utama meliputi:
- Registrasi & Login Multi-Role (Admin, HSE, Kepala Bidang, Direktur SDM).
- Pembuatan & Pengajuan Laporan Kecelakaan oleh HSE.
- Tracking status laporan (Draft, Menunggu Approval, Selesai).
- Approval & Penolakan laporan oleh Kepala Bidang dan Direktur SDM.
- Notifikasi Email Otomatis untuk setiap tahap persetujuan.
- History dokumen & QR Code untuk verifikasi laporan final.
- Keamanan sistem dengan password hashing & JWT Authentication.
- Manajemen data terintegrasi dengan MongoDB.

## Struktur Folder dan File

```
kelompok4-paw/
├── .gitignore
├── package-lock.json
├── README.md
├── backend/
│   ├── config/
│   │   ├── dbConnection.js 
│   │   ├── passport.js 
│   │   └── supabase.js            
│   │
│   ├── constants/
│   │   └── enums.js                
│   │
│   ├── controllers/
│   │   ├── approvalController.js   
│   │   ├── authController.js        
│   │   ├── finalDocumentController.js  
│   │   ├── laporanController.js     
│   │   ├── notificationController.js   
│   │   └── userController.js        
│   │
│   ├── fonts/
│   │   ├── Poppins-Bold.ttf
│   │   └── Poppins-Regular.ttf      
│   │
│   ├── middleware/
│   │   ├── auth.js                  
│   │   ├── constants.js
│   │   ├── errorHandler.js
│   │   └── uploadToSupabase.js          
│   │
│   ├── models/
│   │   ├── approvalModel.js         
│   │   ├── BlacklistedToken.js     
│   │   ├── LaporanKecelakaan.js     
│   │   ├── notificationModel.js     
│   │   └── userModel.js            
│   │
│   ├── node_modules/                     
│   │
│   ├── routes/
│   │   ├── approvalRoutes.js        
│   │   ├── authRoutes.js            
│   │   ├── finalDocumentRoutes.js  
│   │   ├── index.js                 
│   │   ├── laporan.js               
│   │   ├── notificationRoutes.js    
│   │   ├── testEmail.js
│   │   ├── testRoutes.js
│   │   └── userRoutes.js            
│   │
│   ├── services/
│   │   ├── finalDocument.service.js
│   │   └── notificationStream.js
│   │
│   ├── uploads/                     
│   │
│   ├── utils/
│   │   ├── emailService.js          
│   │   ├── errorUtils.js
│   │   ├── jwtBlacklist.js         
│   │   ├── sendEmail.js          
│   │   └── supabaseDelete.js
│   │
│   ├── .env                         
│   ├── .env.example
│   ├── package-lock.json
│   ├── package.json
│   └── server.js                    
│
└── frontend/
    ├── .next                     
    ├── app/
    │   ├── auth/
    │   │   └── google/
    │   │       └── callback/
    │   │           └── page.js
    │   │
    │   ├── dashboard/
    │   │   ├── admin/
    │   │   │   └── page.js   
    │   │   │
    │   │   ├── approval-flow/     
    │   │   │   ├── [id]/
    │   │   │   │   └── page.js
    │   │   │   └── page.js
    │   │   │
    │   │   ├── direktur-sdm/       
    │   │   │   ├── laporan/
    │   │   │   │   └── [id]
    │   │   │   │       └── page.js
    │   │   │   └── page.js
    │   │   │
    │   │   ├── hse/   
    │   │   │   ├── laporan/
    │   │   │   │   ├── [id]
    │   │   │   │   │   └── page.js    
    │   │   │   │   └── buat
    │   │   │   │       └── page.js    
    │   │   │   └── page.js
    │   │   │
    │   │   └── kepala-bidang/       
    │   │       └── laporan/
    │   │           └── [id]/   
    │   │
    │   ├── forgot-password/
    │   │   └── page.js     
    │   │
    │   ├── hse/
    │   │   └── final-documents/   
    │   │       └── page.js
    │   │
    │   ├── login/
    │   │   └── page.js    
    │   │
    │   ├── reset-password/
    │   │   └── [token]/
    │   │       └── page.js    
    │   │
    │   ├── verify/
    │   │   └── [id]/
    │   │       └── page.js  
    │   │
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js                
    │
    ├── components/
    │   ├── admin/
    │   │   ├── PageHeader.js
    │   │   ├── UserCards.js
    │   │   ├── UserList.js
    │   │   ├── UserModal.js
    │   │   ├── UserTable.js
    │   │   └── index.js
    │   │
    │   ├── auth/
    │   │   ├── ForgotPasswordForm.js
    │   │   ├── ForgotPasswordHeader.js
    │   │   ├── ForgotPasswordLayout.js
    │   │   ├── LoginForm.js
    │   │   ├── LoginHeader.js
    │   │   ├── LoginHero.js
    │   │   ├── LoginLayout.js
    │   │   ├── ResetPasswordForm.js
    │   │   ├── ResetPasswordHeader.js
    │   │   ├── ResetPasswordLayout.js
    │   │   └── index.js
    │   │
    │   ├── hse/
    │   │   ├── detail/
    │   │   │   ├── ActionButtons.js     
    │   │   │   ├── ApprovalInfo.js      
    │   │   │   ├── DetailKejadian.js
    │   │   │   ├── EditLaporanForm.js
    │   │   │   ├── index.js
    │   │   │   ├── LampiranSection.js
    │   │   │   ├── LaporanHeader.js
    │   │   │   └── LaporanInfo.js
    │   │   ├── PageHeader.js
    │   │   ├── ReportCards.js           
    │   │   ├── ReportList.js
    │   │   ├── ReportStats.js           
    │   │   ├── ReportTable.js
    │   │   └── index.js
    │   │
    │   └── shared/
    │       ├── ApprovalTimeline.js      
    │       ├── ChangePasswordModal.js
    │       ├── DeleteConfirmModal.js
    │       ├── ErrorAlert.js
    │       ├── index.js
    │       ├── Navbar.js
    │       ├── RejectModal.js
    │       ├── SearchBar.js
    │       ├── SubmitConfirmModal.js
    │       ├── SuccessAlert.js
    │       └── TopLoader.js
    │
    ├── hooks/
    │   ├── useReportManagement.js
    │   ├── useRoleHelpers.js
    │   └── useUserManagement.js
    │
    ├── node_modules/
    │
    ├── public/
    │
    ├── services/
    │   ├── api.js                   
    │   ├── authService.js          
    │   ├── documentService.js       
    │   └── userService.js          
    │
    ├── utils/
    │   └── auth.js                  
    │
    ├── .env                  
    ├── .env.local.example                         
    ├── .stylelintrc.json
    ├── jsconfig.json
    ├── next.config.js
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    └── tailwind.config.js           
```


## Teknologi yang Digunakan Selama Pengembangan
### Backend
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

### Frontend
- Next.js (React + App Router): Framework React untuk routing, rendering, dan optimasi performa.
- TypeScript: Menambah static typing untuk mencegah error dan meningkatkan maintainability.
- Tailwind CSS: Utility-first CSS untuk styling cepat dan mudah dikustomisasi.
- ShadCN/UI: Komponen UI siap pakai berbasis Tailwind untuk konsistensi desain.
- Axios / Fetch API: Digunakan untuk konsumsi REST API dan komunikasi backend.
- Toast Notification: Menyediakan feedback cepat untuk success/error/processing.
- Loading State: Menangani status pemrosesan API agar interaksi lebih jelas.
- Modal/Dialog Components: Menampilkan form/detail data tanpa berpindah halaman.
- Responsive Layout: Layout adaptif untuk mobile, tablet, dan desktop.

## URL Google Drive Laporan
Link dokumentasi & laporan akhir dapat diakses di:
https://drive.google.com/drive/folders/1Jd9orTNhqVqH9QuLWimp3WsCcNGWvOC0?usp=sharing

Link YouTube Video Presentasi dan Demonstrasi: https://youtu.be/R2FlEzURQLc


## 👥 Pembagian Kontribusi Anggota

| Nama    | Fitur                                                                                                    |
|---------|-----------------------------------------------------------------------------------------------------------------|
| **Ega** | **Role Admin**: fitur assign role, atur registrasi akun <br> **Role Kepala Bidang & Direktur SDM**: registrasi + login <br> **Role HSE**: registrasi + login <br> **Tambahan**: pengamanan API sensitif dengan authorization (akses berdasarkan role) |
| **Gaby** | **Role Kepala Bidang & Direktur SDM**: notifikasi email untuk approval, daftar pengajuan (lihat detail, approve/tolak) <br> **Role HSE**: tracking status (draft, menunggu approval, selesai) <br> **Tambahan**: password hashing untuk menyimpan password di database |
| **Kayana** | **Role Kepala Bidang & Direktur SDM**: history dokumen yang sudah diapprove, filter & search <br> **Role HSE**: history dokumen yang sudah diapprove, filter & search <br> **Tambahan**: integrasi database MongoDB |
| **Nicho** | **Role HSE**: form input laporan kecelakaan (tanggal, bagian, nama, NIP, detail kejadian, skala cedera), fitur upload attachment <br> **Tambahan**: API CRUD untuk laporan |
| **Sharon** | **Role Kepala Bidang & Direktur SDM**: generate history alur penandatanganan & QR code (link ke dokumen final) <br> **Role HSE**: lihat & export final document <br> **Tambahan**: fitur login via Google (OAuth2) |

## 👥 Pembagian Kontribusi Anggota (Frontend)

| Nama    | Fitur                                                                                                    |
|---------|-----------------------------------------------------------------------------------------------------------------|
| **Ega** | **Dashboard Admin**: slicing UI dan mengintegrasikan frontend dengan backend managemen pengguna oleh admin <br> **Login Page**: slicing UI login page dari desain yang sudah dibuat di Figma <br> **Lupa Password & Ganti Password**: menambahkan fitur lupa password & ganti password, mengintegrasi dengan notifikasi email, dan slicing UI untuk form lupa password |
| **Gaby** | **Dashboard Kepala Bidang**: slicing UI dan menghubungkan page Kabid dengan HSE dan Direktur <br> **Refactoring**: Refactoring struktur code menjadi lebih rapih <br> **Tambah Load Bar dan Pop Up**: Menambahkan pop up dan load bar di page awal load web HSE, Kabid, dan Direktur. |
| **Kayana** | **Desain**: Dashboard & Login Page di Figma  <br> **Dashboard Direktur SDM**: slicing UI dan integrasi frontend dengan backend <br> **Dashboard Kepala Bidang**: integrasi frontend dengan backend <br> **Service**: sentralisasi axios dengan service api.js <br> **Storage**: mengintegrasikan bucket storage Supabase untuk menampung file upload lampiran |
| **Nicho** | **Dashboard HSE**: slicing UI login page dari desain yang sudah dibuat di Figma, mengintegrasikan frontend dengan backend, dan desain di figma <br> Menambahkan auto generate nomor request laporan yang disubmit untuk display di dashboard HSE|
| **Sharon** | **Desain & Layout PDF**: membuat layout dokumen final dengan PDFKit <br> **QR Code Verification**: generate QR code yang link ke halaman verifikasi frontend <br> **Download System**: implementasi download dokumen final (view & download) <br> **UI Components**: styling dashboard, status badges, dan timeline approval |
