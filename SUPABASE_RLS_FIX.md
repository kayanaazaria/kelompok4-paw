# Supabase Storage RLS Policy Error - Quick Fix Guide

## Error Identified
```
StorageApiError: new row violates row-level security policy
Status: 403
```

## Root Cause
Your Supabase `lampiran` bucket requires Row-Level Security (RLS) policies to allow file uploads. The **anon** API key you're using doesn't have permission to insert files without proper policies.

## Solution (Choose ONE)

### ✅ Option 1: Use Service Role Key (Easiest - Recommended for Development)

The **service_role** key bypasses all RLS policies and is perfect for backend server operations.

**Steps:**
1. Go to Supabase Dashboard: https://kqotkilcwlevgxufewnc.supabase.co/project/_/settings/api
2. Scroll to **Project API keys**
3. Find and copy the **`service_role`** key (⚠️ NOT the anon key)
4. Open `backend/.env` file
5. Replace the current `SUPABASE_KEY` value with the service_role key:
   ```env
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey... (your service_role key)
   ```
6. Restart your backend server

**⚠️ Security Note:** 
- Service role key has full access - never expose it in frontend code
- Only use it in backend/.env (which is in .gitignore)
- Never commit service_role key to Git

---

### Option 2: Configure RLS Policies (Recommended for Production)

Keep using the **anon** key but add proper storage policies.

**Steps:**

1. Go to Supabase Dashboard: https://kqotkilcwlevgxufewnc.supabase.co
2. Navigate to **Storage** → Click on `lampiran` bucket → **Policies** tab
3. Click **New Policy** button
4. Add the following 3 policies:

#### Policy 1: Allow Authenticated Users to Upload
```sql
Policy Name: Authenticated users can upload
Operation: INSERT
Target roles: authenticated, anon
Policy definition (USING): true
WITH CHECK expression: bucket_id = 'lampiran'
```

Click **Save policy**

#### Policy 2: Allow Anyone to Read Files
```sql
Policy Name: Anyone can read files
Operation: SELECT
Target roles: authenticated, anon
Policy definition (USING): bucket_id = 'lampiran'
```

**Note:** Dengan policy ini, siapa saja (bahkan tanpa login) bisa download file karena menggunakan anon key.

Click **Save policy**

#### Policy 3: Allow Authenticated Delete
```sql
Policy Name: Authenticated users can delete
Operation: DELETE
Target roles: authenticated, anon
Policy definition (USING): bucket_id = 'lampiran'
```

Click **Save policy**

---

### Option 3: Quick Test Mode (Not for Production)

Temporarily disable RLS for testing:

1. Go to **Storage** → `lampiran` bucket → **Policies**
2. Click **New Policy** → **For full customization**
3. Fill in:
   - Policy name: `Allow all operations`
   - Allowed operation: Check ALL boxes (SELECT, INSERT, UPDATE, DELETE)
   - Target roles: Check both `authenticated` and `anon`
   - USING expression: `true`
   - WITH CHECK: `true`
4. Click **Review** → **Save policy**

---

## After Applying the Fix

1. **Restart your backend server** if you changed the .env file
2. **Try uploading a file again**
3. **Check backend logs** - you should see:
   ```
   DEBUG uploadToSupabase - Successfully uploaded [filename] to lampiran/...
   DEBUG uploadToSupabase - All files uploaded successfully: 1
   ```

---

## Verification

### Test if it worked:
1. Create a new laporan with a file attachment
2. Check backend console for success message
3. Go to Supabase Dashboard → Storage → lampiran bucket
4. You should see your uploaded file!

### If still failing:
- Check backend console for new error messages
- Verify you're using the correct Supabase URL and key
- Make sure you restarted the backend server after env changes
- Check Supabase dashboard → Settings → API to confirm your keys

---

## Recommended Setup

**For Development:**
- Use **service_role** key in backend
- Faster, no RLS policy setup needed
- Just make sure .env is in .gitignore

**For Production:**
- Use **anon** key with proper RLS policies
- More secure, granular access control
- Policies defined in Option 2

---

## Current Status

Your code is working correctly! The only issue is the Supabase storage permissions. Once you apply one of the fixes above, file uploads will work perfectly.

**Evidence from logs:**
```
✅ File received by backend: favicon.png (100KB)
✅ Multer processed the file successfully
✅ Upload middleware attempted Supabase upload
❌ Supabase rejected due to RLS policy
```

Everything is set up correctly on your end - just need to configure Supabase permissions! 🚀
