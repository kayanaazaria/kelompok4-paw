# Environment Variables untuk Vercel Backend

Tambahkan environment variables berikut di Vercel Dashboard:
https://vercel.com/[your-username]/kelompok4-paw/settings/environment-variables

## Required Variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://kelompok4-paw.vercel.app/auth/google/callback
FRONTEND_URL=https://kelompok4-paw.netlify.app
SUPABASE_URL=https://kqotkilcwlevgxufewnc.supabase.co
SUPABASE_KEY=your-service-role-key-here
```

## Notes:
- Gunakan SUPABASE service_role key (bukan anon key) untuk backend
- GOOGLE_CALLBACK_URL harus sesuai dengan yang di Google Console
- Pastikan FRONTEND_URL sesuai dengan domain Netlify Anda
- SESSION_SECRET TIDAK DIPERLUKAN lagi (sudah dihapus untuk serverless)

## After Setting Environment Variables:
1. Redeploy di Vercel
2. Test endpoints:
   - GET https://kelompok4-paw.vercel.app/ (should return "OK - Backend running on Vercel")
   - GET https://kelompok4-paw.vercel.app/auth/google (should redirect to Google)
