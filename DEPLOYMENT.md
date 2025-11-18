## Deployment Instructions

### Deploy ke Vercel

Proyek ini menggunakan struktur monorepo yang menggabungkan frontend (Next.js) dan backend (Express.js) dalam satu deployment.

#### Prerequisites
- Akun Vercel
- Vercel CLI (optional): `npm i -g vercel`

#### Setup Environment Variables di Vercel

Tambahkan environment variables berikut di Vercel Dashboard:

**Backend Variables:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key untuk JWT
- `SESSION_SECRET` - Secret key untuk session
- `EMAIL_USER` - Email untuk SMTP
- `EMAIL_PASS` - Password email SMTP
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `ALLOWED_ORIGINS` - Comma-separated allowed origins (e.g., https://yourdomain.vercel.app)

**Frontend Variables:**
- `NEXT_PUBLIC_API_URL` - URL backend API (akan otomatis menggunakan /api di production)

#### Deploy Steps

##### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Login ke [Vercel Dashboard](https://vercel.com)
2. Klik "Add New Project"
3. Import repository dari GitHub
4. Vercel akan otomatis mendeteksi konfigurasi dari `vercel.json`
5. Tambahkan environment variables di Settings
6. Klik "Deploy"

##### Option 2: Deploy via CLI
```bash
# Install dependencies
npm run install-all

# Login ke Vercel
vercel login

# Deploy
vercel

# Atau deploy langsung ke production
vercel --prod
```

#### Verifikasi Deployment
- Frontend akan accessible di: `https://your-project.vercel.app`
- Backend API akan accessible di: `https://your-project.vercel.app/api`

#### Testing
```bash
# Test API endpoint
curl https://your-project.vercel.app/api/

# Expected response: "OK - API Ready"
```

#### Troubleshooting

**Build Failed:**
- Pastikan semua dependencies sudah terinstall
- Check environment variables sudah set dengan benar
- Review build logs di Vercel Dashboard

**API Not Working:**
- Verifikasi routing di `vercel.json`
- Check environment variables untuk backend
- Review function logs di Vercel Dashboard

**CORS Issues:**
- Update `ALLOWED_ORIGINS` environment variable
- Include domain Vercel Anda

#### Development
```bash
# Install semua dependencies
npm run install-all

# Run frontend development server
npm run dev

# Run backend development server (di terminal terpisah)
cd backend && npm run dev
```

#### Project Structure
```
├── backend/           # Express.js API
│   ├── index.js      # Entry point untuk Vercel
│   ├── app.js        # Express app configuration
│   └── server.js     # Local development server
├── frontend/         # Next.js app
├── vercel.json       # Vercel configuration
└── package.json      # Root package.json untuk monorepo
```
