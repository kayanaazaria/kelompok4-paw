# Environment Variables untuk Vercel

Buka: https://vercel.com/ega-baskaras-projects/kelompok4paw/settings/environment-variables

## Backend Environment Variables

Tambahkan semua variabel berikut untuk **Production**, **Preview**, dan **Development**:

```
PORT=5001

JWT_SECRET=8ed1aeaf9457ca112257c4fd846858957746e52ab34febff09165185d5f1584b2fd1ca39f40cb37fc5c1b957f6f75562d36aa55e1508fb252acf86f2c5c13f42

MONGO_URI=mongodb+srv://ega_db_user:ega123@kelompok4-paw.l5ejzxw.mongodb.net/production?retryWrites=true&w=majority&appName=kelompok4-paw

EMAIL_USER=solanumagrotech@gmail.com

EMAIL_PASS=ziiecwllgjpgxnzy

GOOGLE_CLIENT_ID=1010221603610-2kr44il04lktmahbcoohclhqsb3q77fl.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=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

GOOGLE_CALLBACK_URL=https://kelompok4paw.vercel.app/api/auth/google/callback

SESSION_SECRET=rahasia_session_kamu

SUPABASE_URL=https://kqotkilcwlevgxufewnc.supabase.co

SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxb3RraWxjd2xldmd4dWZld25jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ1NzI3NywiZXhwIjoyMDc5MDMzMjc3fQ.Hh8PbGYzejStyFYrykocpMpdYeHfmdcJuw9vThLh2Vc

ALLOWED_ORIGINS=https://kelompok4paw.vercel.app,http://localhost:3000
```

## Frontend Environment Variables

```
NEXT_PUBLIC_API_URL=/api

GOOGLE_CLIENT_ID=1010221603610-2kr44il04lktmahbcoohclhqsb3q77fl.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=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

NEXTAUTH_SECRET=8ed1aeaf9457ca112257c4fd846858957746e52ab34febff09165185d5f1584b2fd1ca39f40cb37fc5c1b957f6f75562d36aa55e1508fb252acf86f2c5c13f42
```

## Google Cloud Console Setup

Update **Authorized redirect URIs** di https://console.cloud.google.com/apis/credentials:

**Authorized JavaScript origins:**
- `https://kelompok4paw.vercel.app`
- `http://localhost:5001`

**Authorized redirect URIs:**
- `https://kelompok4paw.vercel.app/api/auth/google/callback`
- `http://localhost:5001/auth/google/callback`

## Setelah Update Environment Variables

Jalankan:
```bash
vercel --prod
```
