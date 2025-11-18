# Quick Deploy Guide - Vercel

## 🚀 Deploy dalam 1 Command

### Langkah 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Langkah 2: Login ke Vercel
```bash
vercel login
```

### Langkah 3: Deploy!
```bash
# Deploy ke preview
vercel

# Atau langsung ke production
vercel --prod
```

## ✅ Checklist Sebelum Deploy

- [ ] Pastikan semua perubahan sudah di-commit dan push ke GitHub
- [ ] Set environment variables di Vercel Dashboard (lihat di bawah)
- [ ] Test local terlebih dahulu: `npm run install-all` dan `npm run dev`

## 🔑 Environment Variables di Vercel

### Cara Set Environment Variables:
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Klik "Settings" > "Environment Variables"
4. Tambahkan variables berikut:

### Variables yang Diperlukan:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT & Session
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_key_here

# Email (SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# CORS (setelah deploy pertama kali, tambahkan domain Vercel Anda)
ALLOWED_ORIGINS=https://your-project.vercel.app,http://localhost:3000
```

## 📝 Setelah Deploy Pertama Kali

1. Copy URL deployment Anda (contoh: `https://your-project.vercel.app`)
2. Tambahkan ke `ALLOWED_ORIGINS` di environment variables
3. Redeploy dengan: `vercel --prod`

## 🧪 Testing Deployment

### Test API:
```bash
curl https://your-project.vercel.app/api/
```
Expected response: `"OK - API Ready"`

### Test Frontend:
Buka browser: `https://your-project.vercel.app`

## 🔄 Deploy Update

Setiap kali push ke branch utama, Vercel akan otomatis deploy jika Anda sudah setup GitHub integration.

Atau manual:
```bash
git add .
git commit -m "update message"
git push
vercel --prod
```

## 🐛 Troubleshooting

### Build gagal?
- Check logs di Vercel Dashboard
- Pastikan semua dependencies terinstall
- Verifikasi environment variables

### API tidak bisa diakses?
- Check routing di `vercel.json`
- Pastikan environment variables backend sudah set
- Review function logs di Vercel Dashboard

### CORS error?
- Tambahkan domain Vercel ke `ALLOWED_ORIGINS`
- Format: `https://your-project.vercel.app` (tanpa trailing slash)

## 📚 Dokumentasi Lengkap

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk dokumentasi lengkap.

## 💡 Tips

- Gunakan Vercel GitHub integration untuk auto-deploy
- Set up preview deployments untuk testing
- Monitor logs di Vercel Dashboard
- Gunakan Vercel Analytics untuk monitoring
