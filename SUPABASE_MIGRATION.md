# Supabase Storage Integration - Implementation Summary

## Overview
Successfully migrated file uploads from local filesystem (multer diskStorage) to Supabase Storage for cloud deployment compatibility.

## What Was Changed

### 1. Backend Routes (`backend/routes/laporan.js`)
**Before:**
```javascript
const multer = require('multer');
const storage = multer.diskStorage({
  destination: '../uploads',
  filename: (req, file, cb) => { /* custom naming */ }
});
const upload = multer({ storage, limits, fileFilter });
```

**After:**
```javascript
const { upload, uploadToSupabase } = require('../middleware/uploadToSupabase');
```

**Routes Updated:**
- `POST /` - Now uses `upload.single("attachment"), uploadToSupabase`
- `PUT /:id` - Now uses `upload.single("attachment"), uploadToSupabase`

### 2. Backend Controller (`backend/controllers/laporanController.js`)
**Before:**
```javascript
attachmentUrl: req.file ? `/uploads/${req.file.filename}` : null
```

**After:**
```javascript
lampiran: req.uploadedFiles || [] // Array of file objects
```

**Changes:**
- `createLaporan`: Saves `lampiran` array instead of single `attachmentUrl` string
- `updateLaporan`: Uses `req.uploadedFiles` to replace lampiran array
- `deleteLaporan`: Now cleans up Supabase files using `deleteLampiranFiles()`

### 3. Database Model (`backend/models/LaporanKecelakaan.js`)
**Before:**
```javascript
attachmentUrl: { type: String }
```

**After:**
```javascript
const LampiranSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  url: { type: String, required: true },        // Public URL from Supabase
  path: { type: String, required: true },       // Storage path for deletion
  mimetype: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

lampiran: [LampiranSchema]
```

### 4. Frontend Component (`frontend/components/hse/detail/LampiranSection.js`)
**Before:**
- Single file display
- Used `API_BASE_URL + attachmentUrl`

**After:**
- Multiple file display (maps over array)
- Uses Supabase public URL directly from `file.url`
- Shows file metadata (name, size, type)
- Backward compatible with old `attachmentUrl` format

**Props Change:**
```javascript
// Old
<LampiranSection attachmentUrl={laporan.attachmentUrl} />

// New (backward compatible)
<LampiranSection lampiran={laporan.lampiran || laporan.attachmentUrl} />
```

### 5. Utility for File Deletion (`backend/utils/supabaseDelete.js`)
**New file created** with three functions:
- `deleteFromSupabase(filePath)` - Delete single file
- `deleteMultipleFromSupabase(filePaths)` - Delete multiple files
- `deleteLampiranFiles(lampiran)` - Delete all files from a laporan

## File Structure Changes

### Files Modified:
1. ✅ `backend/routes/laporan.js` - Replaced multer diskStorage with Supabase middleware
2. ✅ `backend/controllers/laporanController.js` - Updated to use lampiran array
3. ✅ `backend/models/LaporanKecelakaan.js` - Changed schema from attachmentUrl to lampiran array
4. ✅ `frontend/components/hse/detail/LampiranSection.js` - Multi-file display with Supabase URLs
5. ✅ `frontend/app/dashboard/hse/laporan/[id]/page.js` - Updated prop name
6. ✅ `frontend/app/dashboard/kepala-bidang/laporan/[id]/page.js` - Updated prop name
7. ✅ `frontend/app/dashboard/direktur-sdm/laporan/[id]/page.js` - Updated prop name

### Files Created (Previously):
1. ✅ `backend/config/supabase.js` - Supabase client configuration
2. ✅ `backend/middleware/uploadToSupabase.js` - Multer + Supabase upload logic
3. ✅ `backend/utils/supabaseDelete.js` - File deletion utilities

## Data Migration Notes

### Backward Compatibility
The implementation is **backward compatible** with existing data:

**Old Format:**
```javascript
{
  attachmentUrl: "/uploads/123456-file.pdf"
}
```

**New Format:**
```javascript
{
  lampiran: [
    {
      originalName: "file.pdf",
      url: "https://[project].supabase.co/storage/v1/object/public/lampiran/123456-file.pdf",
      path: "lampiran/123456-file.pdf",
      mimetype: "application/pdf",
      size: 123456
    }
  ]
}
```

**Frontend Handling:**
```javascript
// Automatically handles both formats
lampiran={laporan.lampiran || laporan.attachmentUrl}
```

### Existing Data
- Old reports with `attachmentUrl` will still display correctly
- New reports will use `lampiran` array
- No manual migration required (optional: can run a script to migrate old URLs to new format)

## Testing Checklist

### Backend Testing:
- [ ] Upload a file when creating a new laporan
- [ ] Update laporan with a new file (replaces old file)
- [ ] Delete laporan with files (should clean up Supabase storage)
- [ ] Check Supabase dashboard to verify files are uploaded
- [ ] Verify file paths are correctly stored in database

### Frontend Testing:
- [ ] Create new report with file attachment
- [ ] View report detail page - lampiran should display
- [ ] Download file from Supabase URL
- [ ] Test with old reports (attachmentUrl format)
- [ ] Test with new reports (lampiran array format)
- [ ] Update report with new file attachment

### Edge Cases:
- [ ] Create report without file (lampiran should be empty array)
- [ ] Upload file larger than 5MB (should be rejected)
- [ ] Upload unsupported file type (should be rejected)
- [ ] Delete report and verify Supabase files are deleted

## Environment Variables Required

Make sure these are set in `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

## Deployment Notes

### Benefits for Cloud Deployment:
1. ✅ Works on Vercel/Netlify (no persistent filesystem needed)
2. ✅ Files stored in Supabase cloud storage (1GB free)
3. ✅ Public URLs for direct file access
4. ✅ No server restart needed for file access
5. ✅ Automatic CDN distribution

### Storage Limits:
- **Free Tier:** 1GB storage, 2GB bandwidth/month
- **File Size Limit:** 5MB (configured in middleware)
- **File Types:** PDF, JPG, JPEG, PNG (configured in middleware)

## Troubleshooting

### If files don't upload:
1. Check Supabase credentials in `.env`
2. Verify bucket name is `lampiran`
3. Check bucket policies (public read, authenticated write)
4. Look at backend console logs for errors

### If files don't display:
1. Check network tab for 404 errors
2. Verify Supabase URL is correct
3. Check bucket is set to public
4. Verify file URL format is correct

### If files don't delete:
1. Check Supabase storage dashboard
2. Verify `deleteLampiranFiles()` is called
3. Check file paths are correct in database
4. Look for deletion errors in backend logs

## Next Steps

1. **Test the implementation** with the checklist above
2. **Optional:** Migrate existing old reports from local uploads to Supabase:
   ```javascript
   // Migration script (if needed)
   const migrateOldFiles = async () => {
     const oldReports = await Laporan.find({ attachmentUrl: { $exists: true } });
     // Upload old files to Supabase and update documents
   };
   ```

3. **Deploy to production** - Now your app is ready for Vercel/Netlify!

## Summary

All Steps (1-10) from the Supabase implementation guide are now **COMPLETE**:
- ✅ Steps 1-5: Setup (already done)
- ✅ Step 6: Updated routes to use Supabase middleware
- ✅ Step 7: Updated controller to save file metadata
- ✅ Step 8: Updated model schema to lampiran array
- ✅ Step 9: Created delete utilities
- ✅ Step 10: Updated frontend to display Supabase files

Your application is now using **Supabase Storage** for all file uploads and is ready for cloud deployment! 🚀
