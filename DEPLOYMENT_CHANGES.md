# Perubahan untuk Deployment Vercel Monorepo

## 📋 Ringkasan Perubahan

Proyek Anda sekarang sudah dikonfigurasi untuk deploy frontend dan backend secara bersamaan di Vercel dengan **SATU COMMAND**.

## 🗂️ File yang Dibuat/Dimodifikasi

### File Baru:
1. **`package.json`** (root) - Package.json utama untuk monorepo
2. **`vercel.json`** - Konfigurasi Vercel untuk routing
3. **`backend/app.js`** - Express app configuration (terpisah dari server)
4. **`backend/index.js`** - Entry point untuk Vercel serverless function
5. **`.vercelignore`** - File yang diabaikan saat deployment
6. **`DEPLOYMENT.md`** - Dokumentasi lengkap deployment
7. **`QUICKSTART.md`** - Panduan cepat deployment
8. **`DEPLOYMENT_CHANGES.md`** - File ini

### File yang Dimodifikasi:
1. **`backend/server.js`** - Disederhanakan, hanya untuk local development
2. **`frontend/services/api.js`** - Update API URL untuk production
3. **`frontend/next.config.js`** - Tambah rewrites untuk production
4. **`.gitignore`** - Tambah `.vercel` folder
5. **`README.md`** - Tambah section deployment

## 🏗️ Struktur Baru

```
kelompok4-paw/
├── package.json              # [BARU] Root package untuk monorepo
├── vercel.json              # [BARU] Konfigurasi Vercel
├── .vercelignore            # [BARU] Ignore patterns
├── DEPLOYMENT.md            # [BARU] Dokumentasi lengkap
├── QUICKSTART.md            # [BARU] Quick start guide
├── backend/
│   ├── app.js               # [BARU] Express app config
│   ├── index.js             # [BARU] Vercel entry point
│   ├── server.js            # [MODIFIED] Local dev only
│   └── ... (files lainnya)
├── frontend/
│   ├── next.config.js       # [MODIFIED] Rewrites config
│   ├── services/
│   │   └── api.js           # [MODIFIED] API URL logic
│   └── ... (files lainnya)
└── README.md                # [MODIFIED] Tambah deployment info
```

## 🔄 Cara Kerja

### Development (Local)
```bash
# Install semua dependencies
npm run install-all

# Run frontend (terminal 1)
cd frontend && npm run dev

# Run backend (terminal 2)
cd backend && npm run dev
```

### Production (Vercel)
```bash
# Deploy dengan satu command
vercel --prod
```

**Routing di Production:**
- `https://your-app.vercel.app/` → Frontend (Next.js)
- `https://your-app.vercel.app/api/*` → Backend (Express.js serverless)

## 🎯 Apa yang Berubah?

### Backend
- **Sebelum**: `server.js` menghandle semua (app config + server startup)
- **Sekarang**: 
  - `app.js` - Express app configuration (shared)
  - `server.js` - Local development server
  - `index.js` - Vercel serverless entry point

### Frontend
- **Sebelum**: API URL hardcoded ke `http://localhost:5001`
- **Sekarang**: 
  - Development: `http://localhost:5001`
  - Production: `/api` (relative path, handled by Vercel)

### Routing
- **Development**: Frontend (3000) dan Backend (5001) berjalan terpisah
- **Production**: Semua di satu domain, Vercel routing handle `/api/*` ke backend

## 📦 Environment Variables di Vercel

Jangan lupa set environment variables di Vercel Dashboard:

### Backend Variables:
- `MONGO_URI`
- `JWT_SECRET`
- `SESSION_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALLOWED_ORIGINS` (tambahkan domain Vercel setelah deploy pertama)

### Frontend Variables:
- `NEXT_PUBLIC_API_URL` (optional, default: `/api`)

## ✅ Testing

### Local Testing
```bash
# Backend
cd backend
npm run dev
# Test: http://localhost:5001/api/

# Frontend
cd frontend
npm run dev
# Test: http://localhost:3000
```

### Production Testing
```bash
# Setelah deploy
curl https://your-app.vercel.app/api/
# Expected: "OK - API Ready"

# Browser
# Open: https://your-app.vercel.app
```

## 🚀 Next Steps

1. **Install Vercel CLI**: `npm install -g vercel`
2. **Login**: `vercel login`
3. **Set Environment Variables** di Vercel Dashboard
4. **Deploy**: `vercel --prod`
5. **Update ALLOWED_ORIGINS** dengan domain Vercel Anda
6. **Redeploy**: `vercel --prod`

## 📚 Dokumentasi

- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)
- **Full Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Main README**: [README.md](./README.md)

## ⚠️ Catatan Penting

1. **Jangan hapus** `backend/server.js` - masih dipakai untuk development
2. **CORS**: Setelah deploy pertama, tambahkan domain Vercel ke `ALLOWED_ORIGINS`
3. **Environment Variables**: Wajib set di Vercel sebelum deploy
4. **MongoDB**: Pastikan MongoDB Atlas allow connections from anywhere (0.0.0.0/0)
5. **Supabase**: Pastikan CORS settings di Supabase allow domain Vercel

## 🎉 Selesai!

Proyek Anda sekarang siap untuk di-deploy ke Vercel dengan satu command!
