# Proyek Pengembangan Aplikasi Web
Digitalisasi Sistem Laporan Kecelakaan Solanum Agrotech (US1)

---

## Kelompok 4

1. Sharon Nakisha Hezharu Putri (23/512030/TK/56285)
2. Ega Baskara Nugroho (23/521518/TK/57532)
3. Nicholas Shane Pangihutan Siahaan (23/520590/TK/57399)
4. Gabriele Ghea De Palma (23/512218/TK/56306)
5. Kayana Anindya Azaria (23/521475/TK/57528)

## 👥 Pembagian Kontribusi Anggota

| Nama    | Fitur                                                                                                    |
|---------|-----------------------------------------------------------------------------------------------------------------|
| **Ega** | **Role Admin**: fitur assign role, atur registrasi akun <br> **Role Kepala Bidang & Direktur SDM**: registrasi + login <br> **Role HSE**: registrasi + login <br> **Tambahan**: pengamanan API sensitif dengan authorization (akses berdasarkan role) |
| **Gaby** | **Role Kepala Bidang & Direktur SDM**: notifikasi email untuk approval, daftar pengajuan (lihat detail, approve/tolak) <br> **Role HSE**: tracking status (draft, menunggu approval, selesai) |
| **Kayana** | **Role Kepala Bidang & Direktur SDM**: history dokumen yang sudah diapprove, fitur trash (recover ≤ 30 hari), filter & search <br> **Role HSE**: trash (recover ≤ 30 hari), filter & search <br> **Tambahan**: integrasi database MongoDB |
| **Nicho** | **Role HSE**: form input laporan kecelakaan (tanggal, bagian, nama, NIP, detail kejadian, skala cedera), fitur upload attachment <br> **Tambahan**: API CRUD untuk laporan |
| **Sharon** | **Role Kepala Bidang & Direktur SDM**: generate history alur penandatanganan & QR code (link ke dokumen final) <br> **Role HSE**: lihat & export final document <br> **Tambahan**: fitur login via Google (OAuth2) |
